import assert from "node:assert/strict";
import { DEFAULT_INPUT, calculateMediaMix, normalizeMix } from "../lib/calculators/mediamix";
import type { MediaMixInput } from "../lib/calculators/mediamix";

const baseInput: MediaMixInput = {
  ...DEFAULT_INPUT,
  currentMix: { ...DEFAULT_INPUT.currentMix },
  factors: { ...DEFAULT_INPUT.factors },
};

const result = calculateMediaMix(baseInput);

assert.ok(result.budget >= 0, "budget must not be negative");
assert.ok(Number.isFinite(result.romi), "ROMI must be finite");
assert.ok(Number.isFinite(result.attributedRevenue), "revenue must be finite");
assert.ok(result.confidenceScore >= 0 && result.confidenceScore <= 100, "confidence score must be in range");
assert.ok(result.range.low <= result.attributedRevenue, "low range must not exceed revenue");
assert.ok(result.range.high >= result.attributedRevenue, "high range must not be below revenue");

const totalShare = result.channels.reduce((sum, channel) => sum + channel.share, 0);
assert.ok(Math.abs(totalShare - 100) < 0.0001, "channel shares must normalize to 100");

const scenarioMap = Object.fromEntries(result.scenarios.map((scenario) => [scenario.name, scenario]));
assert.ok(
  scenarioMap.pessimistic.attributedRevenue < scenarioMap.realistic.attributedRevenue &&
    scenarioMap.realistic.attributedRevenue < scenarioMap.optimistic.attributedRevenue,
  "scenarios must be ordered",
);

const zeroBudget = calculateMediaMix({ ...baseInput, budget: 0 });
assert.equal(zeroBudget.romi, 0, "zero budget ROMI must be zero");
assert.ok(zeroBudget.sanityWarnings.length > 0, "zero budget must produce a sanity warning");

const lowData = calculateMediaMix({ ...baseInput, dataCompleteness: 5, hasRetroData: false });
const highData = calculateMediaMix({ ...baseInput, dataCompleteness: 95, hasRetroData: true });
assert.ok(lowData.confidenceScore < highData.confidenceScore, "retro data and completeness must increase confidence");

const normalized = normalizeMix({ tv: 30, social: 30, contextual: 60 });
const normalizedTotal = Object.values(normalized).reduce((sum, value) => sum + (value ?? 0), 0);
assert.ok(Math.abs(normalizedTotal - 100) < 0.0001, "normalizeMix must normalize to 100");

console.log("mediamix tests passed");
