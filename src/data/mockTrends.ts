import type {
  CommunityTrend,
  GeoZone,
  LeadTimeEstimate,
  ReviewAction,
  ReviewAlert
} from "../types/domain";

const vectorActions: ReviewAction[] = [
  {
    id: "monitor-only",
    label: "Monitor only",
    detail: "Keep the cluster on watch while more reports arrive."
  },
  {
    id: "request-more-reports",
    label: "Request more reports",
    detail: "Prompt nearby users for symptom updates without collecting exact pins."
  },
  {
    id: "notify-local-health",
    label: "Notify local public health",
    detail: "Send an aggregate summary for human review if the pattern keeps rising."
  },
  {
    id: "escalate-if-continues",
    label: "Escalate if trend continues",
    detail: "Escalate after 24 to 48 hours of continued increase."
  },
  {
    id: "mark-false-alarm",
    label: "Mark false alarm",
    detail: "Close if reviewers determine reports are unrelated or explainable."
  }
];

const campusActions: ReviewAction[] = [
  {
    id: "monitor-only",
    label: "Monitor only",
    detail: "Keep watching if the rise stays mild."
  },
  {
    id: "request-more-reports",
    label: "Request more reports",
    detail: "Ask campus users for symptom onset dates and shared-space context."
  },
  {
    id: "notify-campus-health",
    label: "Notify campus health",
    detail: "Share aggregate respiratory trend details with campus health reviewers."
  },
  {
    id: "compare-clinic-data",
    label: "Compare clinic data",
    detail: "Check whether student health visits show a matching increase."
  },
  {
    id: "escalate-if-continues",
    label: "Escalate if trend continues",
    detail: "Escalate if reports rise again over the next 24 hours."
  },
  {
    id: "mark-false-alarm",
    label: "Mark false alarm",
    detail: "Close if duplicate reports or unrelated illness explain the pattern."
  }
];

const foodborneActions: ReviewAction[] = [
  {
    id: "monitor-only",
    label: "Monitor only",
    detail: "Hold for more signal because the current volume is low."
  },
  {
    id: "request-more-reports",
    label: "Request more reports",
    detail: "Ask for onset timing and shared food setting details."
  },
  {
    id: "compare-clinic-data",
    label: "Compare clinic data",
    detail: "Look for matching stomach symptom reports from clinics or urgent care."
  },
  {
    id: "notify-local-health",
    label: "Notify local public health",
    detail: "Notify only if similar reports continue or name the same setting."
  },
  {
    id: "mark-false-alarm",
    label: "Mark false alarm",
    detail: "Close if the pattern does not repeat or lacks a shared time window."
  }
];

const travelActions: ReviewAction[] = [
  {
    id: "monitor-only",
    label: "Monitor only",
    detail: "Keep watching until similar travel-associated reports repeat."
  },
  {
    id: "request-more-reports",
    label: "Request more reports",
    detail: "Ask for symptom onset timing and broad travel context without collecting itineraries."
  },
  {
    id: "compare-clinic-data",
    label: "Compare clinic data",
    detail: "Check whether nearby clinics or urgent care show a matching symptom pattern."
  },
  {
    id: "notify-local-health",
    label: "Notify local public health",
    detail: "Share aggregate travel-associated context if reports continue."
  },
  {
    id: "mark-false-alarm",
    label: "Mark false alarm",
    detail: "Close if reports do not share timing, symptoms, or travel context."
  }
];

const animalActions: ReviewAction[] = [
  {
    id: "monitor-only",
    label: "Monitor only",
    detail: "Keep animal/environment context visible while avoiding premature escalation."
  },
  {
    id: "request-more-reports",
    label: "Request more reports",
    detail: "Ask for broad animal/contact context and onset timing."
  },
  {
    id: "notify-local-health",
    label: "Notify local public health",
    detail: "Share aggregate summary if similar animal or environmental reports repeat."
  },
  {
    id: "escalate-if-continues",
    label: "Escalate if trend continues",
    detail: "Escalate after repeated independent reports or partner-feed comparison."
  },
  {
    id: "mark-false-alarm",
    label: "Mark false alarm",
    detail: "Close if reports are unrelated or lack a shared exposure window."
  }
];

const sabinoLeadTime: LeadTimeEstimate = {
  daysGained: 3,
  selfReportSignal: "Self-reports showed a repeat pattern by day 2.",
  traditionalVisibility: "Clinic, lab, or vector confirmation would likely appear around day 5.",
  baseline: "Expected 2 to 3 similar outdoor/vector reports; observed 9 in the active 48-hour window.",
  acceleration: "Similar reports rose from 4 to 9 while bite-like image categories rose 34%.",
  trigger: "Fever/headache plus bite-like image context crossed the watch threshold before confirmation data was available.",
  confidence: "medium",
  limitation: "Estimated from synthetic demo reports and contextual data; it still needs human and clinical confirmation.",
  reviewerUse:
    "Use this as a reason to review earlier, request more reports, or compare against mosquito/vector surveillance without declaring an outbreak.",
  timeline: [
    {
      label: "Day 1",
      detail: "First similar fever/headache and bite-like reports appear near the same outdoor zone."
    },
    {
      label: "Day 2",
      detail: "Pattern repeats across independent reports; SpotSignal moves the zone to cluster watch."
    },
    {
      label: "Day 5",
      detail: "Traditional clinic, lab, or vector evidence may start becoming visible if the pattern is real."
    }
  ]
};

const universityLeadTime: LeadTimeEstimate = {
  daysGained: 2,
  selfReportSignal: "Shared-housing respiratory reports became visible by day 2.",
  traditionalVisibility: "Campus clinic comparison would usually lag until day 4.",
  baseline: "Expected 3 to 4 similar shared-housing reports; observed 7 in the active 48-hour window.",
  acceleration: "Cough/fatigue reports increased as more users selected shared housing context.",
  trigger: "Close-contact setting plus symptom similarity moved the cluster above the mild baseline.",
  confidence: "medium",
  limitation: "Mild respiratory symptoms are common, and campus clinic data is not connected in the prototype.",
  reviewerUse:
    "Use this to decide whether to request more voluntary reports or compare against campus clinic visit trends.",
  timeline: [
    {
      label: "Day 1",
      detail: "A few cough/fatigue reports appear from the university area."
    },
    {
      label: "Day 2",
      detail: "More reports mention shared housing and similar onset timing."
    },
    {
      label: "Day 4",
      detail: "Campus clinic trend comparison may begin to show the same pattern."
    }
  ]
};

const downtownLeadTime: LeadTimeEstimate = {
  daysGained: 1,
  selfReportSignal: "Food-setting stomach symptom reports became visible in the last day.",
  traditionalVisibility: "Clinic or inspection confirmation may appear after another 24 to 48 hours.",
  baseline: "Expected 1 to 2 similar downtown food-setting reports; observed 3 with incomplete detail.",
  acceleration: "Report volume is slightly above baseline, but timing and shared exposure details are weak.",
  trigger: "Shared food-setting language placed the signal in the queue, below escalation threshold.",
  confidence: "low",
  limitation: "Too few reports to estimate lead time reliably; this should remain monitor-only for now.",
  reviewerUse:
    "Use this only as a watch note unless reports repeat with clearer onset timing or clinic comparison.",
  timeline: [
    {
      label: "Now",
      detail: "Small number of stomach symptom reports mention downtown food settings."
    },
    {
      label: "+24h",
      detail: "SpotSignal needs repeated reports or clearer timing before escalation."
    },
    {
      label: "+48h",
      detail: "Traditional confirmation may become useful if the pattern persists."
    }
  ]
};

const travelLeadTime: LeadTimeEstimate = {
  daysGained: 1,
  selfReportSignal: "Travel-associated symptom reports became visible before clinic comparison.",
  traditionalVisibility: "Clinic or travel-pathway confirmation may lag another 24 to 48 hours.",
  baseline: "Expected 1 to 2 travel-context reports; observed 5 across a short timing window.",
  acceleration: "Similar fatigue/fever reports mention airport or transit settings more often than baseline.",
  trigger: "Travel context plus symptom similarity moved the signal into monitor-only review.",
  confidence: "low",
  limitation: "No airline timetable, itinerary, or lab confirmation is connected in the prototype.",
  reviewerUse:
    "Use CDC travel notices and clinic comparison as context; do not infer a travel pathway from self-reports alone.",
  timeline: [
    {
      label: "Now",
      detail: "Travel-associated reports enter monitor-only review."
    },
    {
      label: "+24h",
      detail: "Reviewer checks whether more independent reports share timing or symptoms."
    },
    {
      label: "+48h",
      detail: "Clinic or travel context comparison may strengthen or weaken the signal."
    }
  ]
};

const animalLeadTime: LeadTimeEstimate = {
  daysGained: 2,
  selfReportSignal: "Animal/environment exposure reports appeared before partner-feed confirmation.",
  traditionalVisibility: "Animal, environmental, or clinic partner signals may appear several days later.",
  baseline: "Expected sparse animal-context reports; observed 4 similar reports in the current window.",
  acceleration: "Reports mention fever/fatigue plus ranch, animal event, or outdoor contact contexts.",
  trigger: "Animal/zoonotic context plus repeated symptoms placed the signal into watch monitoring.",
  confidence: "medium",
  limitation: "One Health partner feeds are future integrations and are not live in the prototype.",
  reviewerUse:
    "Use as a One Health watch note and compare against animal/environment partner data if the pattern repeats.",
  timeline: [
    {
      label: "Day 1",
      detail: "First animal/environment context reports appear."
    },
    {
      label: "Day 2",
      detail: "Reports repeat with similar timing and symptoms."
    },
    {
      label: "Day 4",
      detail: "Partner-feed or clinic comparison may become useful if connected."
    }
  ]
};

export const communityTrends: CommunityTrend[] = [
  {
    zoneId: "sabino-catalina",
    symptomIncreasePercent: 18,
    imageIncreasePercent: 34,
    similarReports7d: 23,
    strongestPattern: "Fever, headache, fatigue, and bite-like image categories",
    leadTime: sabinoLeadTime
  },
  {
    zoneId: "university",
    symptomIncreasePercent: 11,
    imageIncreasePercent: 2,
    similarReports7d: 17,
    strongestPattern: "Cough, fatigue, shared housing context",
    leadTime: universityLeadTime
  },
  {
    zoneId: "downtown",
    symptomIncreasePercent: 7,
    imageIncreasePercent: 0,
    similarReports7d: 9,
    strongestPattern: "Stomach symptoms after crowded food settings",
    leadTime: downtownLeadTime
  },
  {
    zoneId: "south-tucson",
    symptomIncreasePercent: 9,
    imageIncreasePercent: 0,
    similarReports7d: 12,
    strongestPattern: "Fatigue, fever, and travel-associated shared-space context",
    leadTime: travelLeadTime
  },
  {
    zoneId: "marana",
    symptomIncreasePercent: 10,
    imageIncreasePercent: 6,
    similarReports7d: 8,
    strongestPattern: "Fever/fatigue reports with animal or ranch exposure context",
    leadTime: animalLeadTime
  },
  {
    zoneId: "oro-valley",
    symptomIncreasePercent: 6,
    imageIncreasePercent: 4,
    similarReports7d: 6,
    strongestPattern: "Mixed outdoor reports near parks and indoor close-contact settings",
    leadTime: sabinoLeadTime
  },
  {
    zoneId: "vail",
    symptomIncreasePercent: 5,
    imageIncreasePercent: 0,
    similarReports7d: 3,
    strongestPattern: "School and childcare close-contact reports near baseline",
    leadTime: universityLeadTime
  },
  {
    zoneId: "sahuarita",
    symptomIncreasePercent: 4,
    imageIncreasePercent: 2,
    similarReports7d: 4,
    strongestPattern: "Water/outdoor reports remain sparse and below watch threshold",
    leadTime: downtownLeadTime
  }
];

export const pimaZones: GeoZone[] = [
  {
    id: "university",
    name: "University Area",
    signalLevel: "mild",
    reportCount7d: 17,
    trend: "Respiratory reports mildly above baseline",
    factors: ["shared housing", "cough/fatigue", "close-contact setting"],
    description: "Student housing and campus-adjacent reports show a mild rise."
  },
  {
    id: "sabino-catalina",
    name: "Sabino Canyon / Catalina Foothills",
    signalLevel: "watch",
    reportCount7d: 23,
    trend: "Bite-like reports and fever/headache reports increasing",
    factors: ["bite-like images", "fever/headache", "outdoor exposure", "recent rain"],
    description: "Outdoor/vector-like reports are concentrated in the same time window."
  },
  {
    id: "downtown",
    name: "Downtown Tucson",
    signalLevel: "mild",
    reportCount7d: 9,
    trend: "Small increase in stomach symptom reports",
    factors: ["food settings", "nausea", "short time window"],
    description: "Foodborne-like reports are elevated but still limited."
  },
  {
    id: "south-tucson",
    name: "South Tucson",
    signalLevel: "low",
    reportCount7d: 5,
    trend: "Reports near baseline",
    factors: ["mixed symptoms", "low similarity"],
    description: "No strong shared pattern in recent reports."
  },
  {
    id: "marana",
    name: "Marana",
    signalLevel: "low",
    reportCount7d: 4,
    trend: "Sparse reports",
    factors: ["animal context", "low volume"],
    description: "Low report volume limits signal confidence."
  },
  {
    id: "oro-valley",
    name: "Oro Valley",
    signalLevel: "low",
    reportCount7d: 6,
    trend: "Reports near baseline",
    factors: ["outdoor activity", "mixed symptoms"],
    description: "No clear cluster pattern in the current window."
  },
  {
    id: "vail",
    name: "Vail",
    signalLevel: "low",
    reportCount7d: 3,
    trend: "Reports near baseline",
    factors: ["school context", "low volume"],
    description: "Close-contact reports are not currently elevated."
  },
  {
    id: "sahuarita",
    name: "Sahuarita",
    signalLevel: "low",
    reportCount7d: 4,
    trend: "Reports near baseline",
    factors: ["water exposure", "low similarity"],
    description: "Water-related reports remain near baseline."
  }
];

export const reviewAlerts: ReviewAlert[] = [
  {
    id: "alert-sabino-vector",
    title: "Possible vector-related cluster watch",
    zoneId: "sabino-catalina",
    zoneName: "Sabino Canyon / Catalina Foothills",
    exposureTypes: ["Outdoor/vector", "Water/environmental"],
    signalLevel: "watch",
    confidence: "medium",
    reason:
      "Bite-like image categories, fever/headache symptoms, outdoor trail exposure, and recent weather context overlap within the same 5-day window.",
    suggestedAction:
      "Monitor for 24 to 48 hours, compare against mosquito/vector data, and review aggregate reports before any public communication.",
    status: "New",
    whyNow: {
      flaggedToday:
        "The Sabino/Catalina zone crossed the cluster-watch threshold after a new report matched the existing bite-like fever/headache pattern.",
      changed48h:
        "Bite-like image categories increased faster than baseline and the newest report shares the same outdoor exposure window.",
      thresholdFactor:
        "Nearby community trend plus symptom similarity pushed the signal over the watch threshold.",
      uncertainty: [
        "Weather does not prove vector exposure.",
        "Image categories are broad context, not medical findings.",
        "Exact exposure timing is approximate because users can choose privacy-preserving location levels."
      ]
    },
    dataQuality: [
      {
        label: "Duplicate/suspicious reports",
        status: "clear",
        detail: "No repeated identical report fingerprints in the same privacy bucket."
      },
      {
        label: "Confidence level",
        status: "caution",
        detail: "Medium confidence because reports are similar, but no lab or clinic confirmation is connected."
      },
      {
        label: "Missing data",
        status: "caution",
        detail: "Vector surveillance and clinician-confirmed diagnoses are not connected in this prototype."
      },
      {
        label: "Privacy status",
        status: "clear",
        detail: "Reports are aggregated by zone; no individual pins are shown."
      }
    ],
    escalationActions: vectorActions,
    privacyStatus: "Approximate area only; no individual pins shown.",
    duplicateStatus: "Low duplicate risk after synthetic fingerprint check.",
    clinicComparison: "Not connected yet; reviewer should compare against clinic or vector surveillance feeds.",
    notEnoughData: false,
    leadTime: sabinoLeadTime
  },
  {
    id: "alert-university-respiratory",
    title: "Dorm respiratory pattern",
    zoneId: "university",
    zoneName: "University Area",
    exposureTypes: ["Close-contact"],
    signalLevel: "mild",
    confidence: "medium",
    reason:
      "Cough and fatigue reports are mildly above baseline among shared housing reports.",
    suggestedAction:
      "Watch the trend and request more detail only if reports continue rising.",
    status: "Monitoring",
    whyNow: {
      flaggedToday:
        "Dorm respiratory reports rose above the mild baseline and now align with Arizona Epydemix shared-housing contact context.",
      changed48h:
        "More reports mention shared housing and similar onset timing within the last two days.",
      thresholdFactor:
        "Close-contact setting plus symptom similarity is the main driver, not any single individual report.",
      uncertainty: [
        "Mild respiratory symptoms are common and may reflect unrelated illness.",
        "The prototype does not yet compare against campus clinic visit trends.",
        "Some reports may come from the same social group."
      ]
    },
    dataQuality: [
      {
        label: "Duplicate/suspicious reports",
        status: "caution",
        detail: "Two reports share similar wording; count is retained but downweighted for reviewer awareness."
      },
      {
        label: "Confidence level",
        status: "caution",
        detail: "Medium confidence because contact context and symptoms align, but the signal is still mild."
      },
      {
        label: "Missing data",
        status: "weak",
        detail: "Campus clinic trend comparison is not connected yet."
      },
      {
        label: "Privacy status",
        status: "clear",
        detail: "Shared housing is shown as an aggregate setting, not a specific room or dorm resident."
      }
    ],
    escalationActions: campusActions,
    privacyStatus: "Shared housing context only; no resident-level location shown.",
    duplicateStatus: "Possible wording similarity detected; reports are downweighted, not removed.",
    clinicComparison: "Pending campus health comparison.",
    notEnoughData: false,
    leadTime: universityLeadTime
  },
  {
    id: "alert-downtown-food",
    title: "Foodborne symptom watch",
    zoneId: "downtown",
    zoneName: "Downtown Tucson",
    exposureTypes: ["Foodborne", "Close-contact"],
    signalLevel: "mild",
    confidence: "low",
    reason:
      "Several stomach symptom reports mention crowded food settings, but report volume is still small.",
    suggestedAction:
      "Keep in queue and review only if similar reports continue in the next day.",
    status: "Monitoring",
    whyNow: {
      flaggedToday:
        "The cluster is visible because several stomach symptom reports now share a downtown food-setting context.",
      changed48h:
        "Report volume increased slightly, but the time window and location details remain incomplete.",
      thresholdFactor:
        "Shared exposure context is the main reason this appears in the queue; volume is below escalation threshold.",
      uncertainty: [
        "Not enough reports to identify a stable pattern.",
        "Food setting descriptions are broad and may refer to different places.",
        "No clinic or inspection data is connected in the prototype."
      ]
    },
    dataQuality: [
      {
        label: "Duplicate/suspicious reports",
        status: "unknown",
        detail: "Low volume makes duplicate detection less reliable."
      },
      {
        label: "Confidence level",
        status: "weak",
        detail: "Low confidence because there are too few similar reports."
      },
      {
        label: "Missing data",
        status: "weak",
        detail: "Specific meal timing and clinic comparison are missing."
      },
      {
        label: "Privacy status",
        status: "clear",
        detail: "The dashboard uses downtown zone aggregation only."
      }
    ],
    escalationActions: foodborneActions,
    privacyStatus: "Zone-level aggregation only.",
    duplicateStatus: "Unknown duplicate risk because the sample is small.",
    clinicComparison: "Not enough data yet; compare only if reports continue.",
    notEnoughData: true,
    leadTime: downtownLeadTime
  },
  {
    id: "alert-travel-south-tucson",
    title: "Travel-associated symptom pattern",
    zoneId: "south-tucson",
    zoneName: "South Tucson / Travel Corridor",
    exposureTypes: ["Travel-associated", "Close-contact"],
    signalLevel: "mild",
    confidence: "low",
    reason:
      "Several reports mention travel or transit settings with overlapping fever/fatigue symptoms, but the pattern is not strong enough for escalation.",
    suggestedAction:
      "Monitor only, compare against CDC travel notices and clinic data, and request more reports only if timing repeats.",
    status: "New",
    whyNow: {
      flaggedToday:
        "A new travel-associated report matched the existing mild travel/shared-space symptom pattern.",
      changed48h:
        "Travel context appeared more often in reports, but report volume remains limited.",
      thresholdFactor:
        "Travel-associated context and symptom similarity placed the signal in review, below escalation threshold.",
      uncertainty: [
        "Self-reports do not prove travel transmission.",
        "Airline route/timetable data is planned, not live.",
        "Symptoms may reflect unrelated community illness."
      ]
    },
    dataQuality: [
      {
        label: "Duplicate/suspicious reports",
        status: "caution",
        detail: "Some reports share broad travel wording; reviewer should check onset timing."
      },
      {
        label: "Confidence level",
        status: "weak",
        detail: "Low confidence because clinic/travel-pathway comparison is not connected."
      },
      {
        label: "Missing data",
        status: "weak",
        detail: "Airline routes and timetables are future integrations."
      },
      {
        label: "Privacy status",
        status: "clear",
        detail: "No itinerary or exact travel path is collected."
      }
    ],
    escalationActions: travelActions,
    privacyStatus: "Travel context only; no itinerary or exact path shown.",
    duplicateStatus: "Possible broad wording overlap; reports are treated cautiously.",
    clinicComparison: "Not connected yet; compare if trend repeats.",
    notEnoughData: true,
    leadTime: travelLeadTime
  },
  {
    id: "alert-marana-animal",
    title: "Animal/environment exposure watch",
    zoneId: "marana",
    zoneName: "Marana / Ranch and Animal Context",
    exposureTypes: ["Animal/zoonotic", "Outdoor/vector"],
    signalLevel: "watch",
    confidence: "medium",
    reason:
      "Fever/fatigue reports with animal or ranch exposure context are repeating enough to keep in One Health watch status.",
    suggestedAction:
      "Monitor for 24 to 48 hours and compare against animal/environment partner feeds in a real deployment.",
    status: "New",
    whyNow: {
      flaggedToday:
        "Animal/environment context repeated with similar symptom timing in the current watch window.",
      changed48h:
        "More reports selected animal or ranch exposure context while symptoms stayed similar.",
      thresholdFactor:
        "Repeated animal/zoonotic context plus symptom similarity pushed this into watch status.",
      uncertainty: [
        "Partner animal/environment data is not live in the prototype.",
        "Outdoor and animal exposures may be unrelated.",
        "Human review is required before any One Health follow-up."
      ]
    },
    dataQuality: [
      {
        label: "Duplicate/suspicious reports",
        status: "clear",
        detail: "Reports are spread across separate synthetic privacy buckets."
      },
      {
        label: "Confidence level",
        status: "caution",
        detail: "Medium confidence from repeated context, but no partner-feed confirmation."
      },
      {
        label: "Missing data",
        status: "weak",
        detail: "Animal health and environmental feeds are future integrations."
      },
      {
        label: "Privacy status",
        status: "clear",
        detail: "Reports are aggregated by zone and broad exposure context."
      }
    ],
    escalationActions: animalActions,
    privacyStatus: "Zone-level animal/environment context only.",
    duplicateStatus: "Low duplicate risk after synthetic fingerprint check.",
    clinicComparison: "Compare against clinic and One Health partner feeds in deployment.",
    notEnoughData: false,
    leadTime: animalLeadTime
  }
];
