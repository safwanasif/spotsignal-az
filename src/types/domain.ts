export type SignalLevel = "low" | "mild" | "watch" | "review";

export type LanguagePreference =
  | "English"
  | "Spanish"
  | "Navajo"
  | "Tohono O'odham"
  | "Hopi"
  | "Arabic"
  | "Chinese"
  | "Vietnamese"
  | "French"
  | "ASL-friendly summary";

export type PrivacyLevel =
  | "Exact place"
  | "Approximate neighborhood"
  | "County only"
  | "No location";

export type ImageCategory =
  | "bite-like mark"
  | "rash-like mark"
  | "bruise-like mark"
  | "sore/lesion-like mark"
  | "swelling/redness"
  | "unknown / needs review";

export type ExposureCategory =
  | "Outdoor/vector"
  | "Close-contact"
  | "Foodborne"
  | "Travel-associated"
  | "Animal/zoonotic"
  | "Water/environmental"
  | "Unknown";

export interface PlaceOption {
  id: string;
  label: string;
  zoneId: string;
  type: string;
  latitude: number;
  longitude: number;
  exposureCategories: ExposureCategory[];
}

export interface WeatherContext {
  zoneId: string;
  temperatureF: number;
  humidityPercent: number;
  recentRain: boolean;
  heatRisk: "low" | "moderate" | "high";
  vectorSuitability: "low" | "moderate" | "elevated";
  summary: string;
  source: "NOAA/NWS API" | "Mock weather";
}

export interface EpydemixLayerSummary {
  layer: "home" | "work" | "school" | "community" | "all";
  averageContacts: number;
  relativeToAll: number;
}

export interface EpydemixContext {
  location: "United_States_Arizona";
  contactSource: "mistry_2021" | "fallback";
  source: "Epydemix GitHub data" | "Local fallback";
  sourceUrl: string;
  setting: string;
  relevance: "primary" | "background";
  relevantLayers: EpydemixLayerSummary[];
  strongestLayer: EpydemixLayerSummary;
  populationTotal: number;
  summary: string;
}

export interface CommunityTrend {
  zoneId: string;
  symptomIncreasePercent: number;
  imageIncreasePercent: number;
  similarReports7d: number;
  strongestPattern: string;
  leadTime: LeadTimeEstimate;
}

export interface LeadTimePoint {
  label: string;
  detail: string;
}

export interface LeadTimeEstimate {
  daysGained: number;
  selfReportSignal: string;
  traditionalVisibility: string;
  baseline: string;
  acceleration: string;
  trigger: string;
  confidence: "low" | "medium" | "high";
  limitation: string;
  reviewerUse: string;
  timeline: LeadTimePoint[];
}

export interface ReportFormValues {
  symptoms: string[];
  symptomStartDate: string;
  placeId: string;
  exposureTypes: ExposureCategory[];
  privacyLevel: PrivacyLevel;
  language: LanguagePreference;
  imageName?: string;
  imageDataUrl?: string;
  imageMimeType?: string;
  ageRange?: string;
  personalContext: string[];
}

export interface UserReport extends ReportFormValues {
  id: string;
  submittedAt: string;
  zoneId: string;
  imageCategory: ImageCategory;
  imageConfidence: "low" | "medium" | "high";
  imageSource: "Gemini API" | "Mock AI";
}

export interface RiskFactor {
  label: string;
  weight: number;
  explanation: string;
}

export interface SignalAudit {
  source: "Gemma API" | "Mock AI";
  thresholdReason: string;
  uncertainty: string;
  missingData: string;
  reviewerNextStep: string;
}

export interface PersonalRiskResult {
  signalLevel: SignalLevel;
  score: number;
  explanation: string;
  factors: RiskFactor[];
  nextSteps: string[];
  weather: WeatherContext;
  epydemix: EpydemixContext;
  aiAudit: SignalAudit;
  explanationSource: "Gemini API" | "Mock AI";
}

export interface GeoZone {
  id: string;
  name: string;
  signalLevel: SignalLevel;
  reportCount7d: number;
  trend: string;
  factors: string[];
  description: string;
}

export type ReviewStatus = "New" | "Monitoring" | "Reviewed" | "Escalated" | "False alarm";

export type ReviewActionId =
  | "monitor-only"
  | "request-more-reports"
  | "notify-campus-health"
  | "notify-local-health"
  | "compare-clinic-data"
  | "escalate-if-continues"
  | "mark-false-alarm";

export interface ReviewAction {
  id: ReviewActionId;
  label: string;
  detail: string;
}

export interface DataQualityCheck {
  label: string;
  status: "clear" | "caution" | "weak" | "unknown";
  detail: string;
}

export interface WhyNowSignal {
  flaggedToday: string;
  changed48h: string;
  thresholdFactor: string;
  uncertainty: string[];
}

export interface ReviewAlert {
  id: string;
  title: string;
  zoneId: string;
  zoneName: string;
  exposureTypes: ExposureCategory[];
  signalLevel: SignalLevel;
  confidence: "low" | "medium" | "high";
  reason: string;
  suggestedAction: string;
  status: ReviewStatus;
  whyNow: WhyNowSignal;
  dataQuality: DataQualityCheck[];
  escalationActions: ReviewAction[];
  privacyStatus: string;
  duplicateStatus: string;
  clinicComparison: string;
  notEnoughData: boolean;
  leadTime: LeadTimeEstimate;
}
