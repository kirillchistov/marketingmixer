export type BusinessCategoryKey =
  | "fmcg"
  | "retail"
  | "finance"
  | "tech"
  | "travel"
  | "auto"
  | "realEstate";

export type AudienceType = "mass" | "niche";

export type RiskLevel = "low" | "medium" | "high" | "veryHigh";

export type TimeHorizon = "short" | "medium" | "long";

export type ChannelType =
  | "traditional"
  | "digital"
  | "marketplace"
  | "retailMedia"
  | "owned";

export type ChannelKey =
  | "tv"
  | "bvod"
  | "radio"
  | "ooh"
  | "contextual"
  | "social"
  | "email"
  | "retailMedia"
  | "wbSearch"
  | "ozonSearch"
  | "yandexMarket"
  | "ownSite";

export type ScenarioName = "pessimistic" | "realistic" | "optimistic";

export interface ChannelBenchmark {
  key: ChannelKey;
  name: string;
  type: ChannelType;
  roiRange: [number, number];
  commission: number;
}

export interface CategoryBenchmark {
  key: BusinessCategoryKey;
  name: string;
  optimalShares: Partial<Record<ChannelKey, number>>;
  elasticity: number;
}

export interface MediaMixInput {
  category: BusinessCategoryKey;
  brandRevenue: number;
  budget: number;
  periodMonths: number;
  onlineShare: number;
  audienceType: AudienceType;
  riskLevel: RiskLevel;
  timeHorizon: TimeHorizon;
  currentMix: Partial<Record<ChannelKey, number>>;
  dataCompleteness: number;
  hasRetroData: boolean;
  factors: {
    distribution: number;
    margin: number;
    promoPressure: number;
    seasonality: number;
    salesOps: number;
  };
}

export interface ChannelResult {
  key: ChannelKey;
  name: string;
  type: ChannelType;
  budget: number;
  share: number;
  roi: number;
  attributedRevenue: number;
  commission: number;
}

export interface ScenarioResult {
  name: ScenarioName;
  attributedRevenue: number;
  romi: number;
  netEffect: number;
  confidenceScore: number;
}

export interface MediaMixResult {
  attributedRevenue: number;
  budget: number;
  romi: number;
  netEffect: number;
  confidenceScore: number;
  range: {
    low: number;
    high: number;
  };
  channels: ChannelResult[];
  scenarios: ScenarioResult[];
  dataQuality: string[];
  sourceNotes: string[];
  sanityWarnings: string[];
}
