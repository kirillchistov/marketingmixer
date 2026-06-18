import { CATEGORIES, CHANNELS, HORIZON_MULTIPLIERS, RISK_MULTIPLIERS } from "./data";
import type {
  ChannelKey,
  ChannelResult,
  MediaMixInput,
  MediaMixResult,
  ScenarioName,
  ScenarioResult,
} from "./types";

const SCENARIO_MULTIPLIERS: Record<ScenarioName, number> = {
  pessimistic: 0.82,
  realistic: 1,
  optimistic: 1.18,
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const finiteOrZero = (value: number) => (Number.isFinite(value) ? value : 0);

const average = ([low, high]: [number, number]) => (low + high) / 2;

export function normalizeMix(mix: Partial<Record<ChannelKey, number>>): Partial<Record<ChannelKey, number>> {
  const entries = Object.entries(mix).filter(([, value]) => Number(value) > 0) as [ChannelKey, number][];
  const total = entries.reduce((sum, [, value]) => sum + value, 0);

  if (total <= 0) {
    return {};
  }

  return Object.fromEntries(entries.map(([key, value]) => [key, (value / total) * 100]));
}

export function calculateMediaMix(input: MediaMixInput): MediaMixResult {
  const category = CATEGORIES.find((item) => item.key === input.category) ?? CATEGORIES[0];
  const risk = RISK_MULTIPLIERS[input.riskLevel];
  const horizon = HORIZON_MULTIPLIERS[input.timeHorizon];
  const budget = Math.max(0, finiteOrZero(input.budget));
  const brandRevenue = Math.max(0, finiteOrZero(input.brandRevenue));
  const normalizedMix = normalizeMix(input.currentMix);
  const shares = Object.keys(normalizedMix).length > 0 ? normalizedMix : category.optimalShares;
  const sanityWarnings: string[] = [];

  if (budget <= 0) {
    sanityWarnings.push("Бюджет равен нулю: ROMI рассчитан как 0, чтобы избежать деления на ноль.");
  }

  const factorMultiplier = calculateExternalFactorMultiplier(input);
  const channelResults: ChannelResult[] = [];
  let attributedRevenue = 0;
  let totalCommissions = 0;

  for (const channel of CHANNELS) {
    const share = shares[channel.key] ?? 0;
    if (share <= 0) {
      continue;
    }

    const channelBudget = budget * (share / 100);
    const typeMultiplier = getTypeMultiplier(channel.type, input.onlineShare);
    const audienceMultiplier = input.audienceType === "niche" && channel.type !== "traditional" ? 1.12 : 1;
    const diminishingFactor = clamp(1 - (share / 100) * 0.26, 0.68, 1);
    const roi =
      average(channel.roiRange) *
      risk.roi *
      horizon.roi *
      horizon.digitalBoost *
      typeMultiplier *
      audienceMultiplier *
      factorMultiplier *
      diminishingFactor;
    const channelRevenue = channelBudget * roi;
    const commission = channelRevenue * channel.commission;

    attributedRevenue += channelRevenue;
    totalCommissions += commission;

    channelResults.push({
      key: channel.key,
      name: channel.name,
      type: channel.type,
      budget: channelBudget,
      share,
      roi,
      attributedRevenue: channelRevenue,
      commission,
    });
  }

  const synergyBonus = calculateSynergyBonus(channelResults);
  attributedRevenue *= synergyBonus;

  const netEffect = attributedRevenue - budget - totalCommissions;
  const romi = budget > 0 ? (netEffect / budget) * 100 : 0;
  const confidenceScore = calculateConfidenceScore(input, channelResults.length, sanityWarnings.length);
  const uncertainty = clamp((100 - confidenceScore) / 100, 0.12, 0.48);
  const range = {
    low: attributedRevenue * (1 - uncertainty),
    high: attributedRevenue * (1 + uncertainty),
  };

  if (brandRevenue > 0 && attributedRevenue > brandRevenue * 1.2) {
    sanityWarnings.push("Прогноз выше 120% выручки за период: проверьте бюджет, период и коэффициенты.");
  }

  return {
    attributedRevenue,
    budget,
    romi,
    netEffect,
    confidenceScore,
    range,
    channels: channelResults.sort((a, b) => b.budget - a.budget),
    scenarios: buildScenarios(attributedRevenue, budget, totalCommissions, confidenceScore),
    dataQuality: buildDataQualityNotes(input),
    sourceNotes: [
      "Коэффициенты демо являются гипотезами на базе прототипов, экспертных наблюдений и открытых рыночных источников.",
      "Если несколько источников влияют на показатель, демо допускает усреднение и должно показывать это в source trace.",
      "Production-версия должна хранить источник и версию рядом с каждым коэффициентом.",
    ],
    sanityWarnings,
  };
}

function calculateExternalFactorMultiplier(input: MediaMixInput) {
  const distribution = 0.78 + clamp(input.factors.distribution, 0, 100) / 100 * 0.44;
  const margin = 0.86 + clamp(input.factors.margin, 0, 100) / 100 * 0.28;
  const promo = 0.9 + clamp(input.factors.promoPressure, 0, 100) / 100 * 0.2;
  const seasonality = 0.84 + clamp(input.factors.seasonality, 0, 100) / 100 * 0.32;
  const salesOps = 0.84 + clamp(input.factors.salesOps, 0, 100) / 100 * 0.32;

  return distribution * margin * promo * seasonality * salesOps;
}

function getTypeMultiplier(type: ChannelResult["type"], onlineShare: number) {
  const online = clamp(onlineShare, 0, 100) / 100;

  if (type === "marketplace" || type === "retailMedia") {
    return 0.96 + online * 0.28;
  }

  if (type === "digital" || type === "owned") {
    return 0.98 + online * 0.18;
  }

  return 1.08 - online * 0.12;
}

function calculateSynergyBonus(channels: ChannelResult[]) {
  const hasMarketplace = channels.some((channel) => channel.type === "marketplace");
  const hasRetailMedia = channels.some((channel) => channel.type === "retailMedia");
  const hasTraditional = channels.some((channel) => channel.type === "traditional");
  const hasOwned = channels.some((channel) => channel.type === "owned");
  let bonus = 1;

  if (hasMarketplace && hasRetailMedia) {
    bonus *= 1.08;
  }

  if ((hasMarketplace || hasRetailMedia) && hasTraditional) {
    bonus *= 1.07;
  }

  if (hasOwned && (hasMarketplace || hasRetailMedia)) {
    bonus *= 1.06;
  }

  return bonus;
}

function calculateConfidenceScore(input: MediaMixInput, channelCount: number, warningsCount: number) {
  const completeness = clamp(input.dataCompleteness, 0, 100) * 0.45;
  const retroData = input.hasRetroData ? 24 : 8;
  const calibratedInputs = channelCount >= 4 ? 14 : 6;
  const riskPenalty = RISK_MULTIPLIERS[input.riskLevel].confidence;
  const warningsPenalty = warningsCount * 8;

  return Math.round(clamp(completeness + retroData + calibratedInputs + riskPenalty - warningsPenalty, 8, 94));
}

function buildScenarios(
  attributedRevenue: number,
  budget: number,
  totalCommissions: number,
  confidenceScore: number,
): ScenarioResult[] {
  return (Object.keys(SCENARIO_MULTIPLIERS) as ScenarioName[]).map((name) => {
    const scenarioRevenue = attributedRevenue * SCENARIO_MULTIPLIERS[name];
    const netEffect = scenarioRevenue - budget - totalCommissions;

    return {
      name,
      attributedRevenue: scenarioRevenue,
      romi: budget > 0 ? (netEffect / budget) * 100 : 0,
      netEffect,
      confidenceScore: name === "realistic" ? confidenceScore : Math.max(5, confidenceScore - 8),
    };
  });
}

function buildDataQualityNotes(input: MediaMixInput) {
  const notes: string[] = [];

  notes.push(input.hasRetroData ? "Ретро-данные заявлены: модель можно калибровать точнее." : "Ретро-данных нет: прогноз сильнее опирается на бенчмарки.");
  notes.push(`Заполненность данных: ${clamp(input.dataCompleteness, 0, 100)}%.`);

  if (Object.keys(input.currentMix).length < 4) {
    notes.push("Текущий микс заполнен неполно: распределение бюджета частично заменено отраслевыми долями.");
  }

  if (input.factors.distribution < 60) {
    notes.push("Дистрибуция выглядит слабым местом: медиа может не конвертироваться в продажи.");
  }

  if (input.factors.margin < 50) {
    notes.push("Низкая маржинальность снижает полезность агрессивного media spend.");
  }

  return notes;
}
