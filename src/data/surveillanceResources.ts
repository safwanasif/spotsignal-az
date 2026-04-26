import {
  CloudSun,
  DatabaseZap,
  Globe2,
  type LucideIcon,
  Plane,
  RadioTower,
  UsersRound
} from "lucide-react";

export type ResourceStatus = "Live" | "Reference" | "Mocked" | "Planned";

export interface SurveillanceResource {
  id: string;
  name: string;
  status: ResourceStatus;
  icon: LucideIcon;
  role: string;
  currentUse: string;
  whyItMatters: string;
  sourceUrl: string;
}

export const surveillanceResources: SurveillanceResource[] = [
  {
    id: "user-reports",
    name: "Self-reported symptoms",
    status: "Mocked",
    icon: RadioTower,
    role: "Primary surveillance signal",
    currentUse:
      "Synthetic reports simulate symptoms, onset timing, privacy level, recent places, and optional images.",
    whyItMatters:
      "This is the earliest weak signal layer. People may report symptoms before clinic, lab, or hospital data is visible.",
    sourceUrl: "local-demo-data"
  },
  {
    id: "weather-vector",
    name: "NOAA/NWS weather context",
    status: "Live",
    icon: CloudSun,
    role: "Outdoor/vector enrichment",
    currentUse:
      "Fetches forecast context by Arizona place coordinates and derives heat/vector suitability signals.",
    whyItMatters:
      "Weather can make mosquito/vector or heat-related exposure patterns more plausible, especially for outdoor Arizona reports.",
    sourceUrl: "https://api.weather.gov/"
  },
  {
    id: "epydemix",
    name: "Epydemix Arizona contact matrices",
    status: "Live",
    icon: UsersRound,
    role: "Close-contact setting context",
    currentUse:
      "Uses United_States_Arizona contact matrices for home, school, work, community, and all-setting context.",
    whyItMatters:
      "Helps reviewers understand whether dorm, school, work, restaurant, or travel-hub reports could plausibly amplify person-to-person spread.",
    sourceUrl: "https://github.com/epistorm/epydemix-data"
  },
  {
    id: "cdc-travel",
    name: "CDC Travel Health Notices",
    status: "Live",
    icon: Globe2,
    role: "Travel-associated illness context",
    currentUse:
      "Reads CDC Travelers' Health notice RSS when available and summarizes current travel risk notices.",
    whyItMatters:
      "If a user reports recent travel, public health reviewers can compare symptoms and locations against current CDC travel advisories.",
    sourceUrl: "https://wwwnc.cdc.gov/travel/rss/notices.xml"
  },
  {
    id: "epicore",
    name: "EpiCore",
    status: "Reference",
    icon: DatabaseZap,
    role: "Human verification reference",
    currentUse:
      "No API is expected for the hackathon, so SpotSignal uses EpiCore as a design reference for human verification workflows.",
    whyItMatters:
      "EpiCore-style verification reinforces the product principle that AI should flag weak signals for trained human review rather than declaring outbreaks.",
    sourceUrl: "https://endingpandemics.org/"
  },
  {
    id: "airline-routes",
    name: "Airline routes and timetables",
    status: "Planned",
    icon: Plane,
    role: "Travel pathway context",
    currentUse:
      "Prototype treats airport/travel reports as a context category; live timetable integration is planned.",
    whyItMatters:
      "For travel-associated signals, route/timetable context can show whether similar symptoms may be connected by recent travel pathways.",
    sourceUrl: "pending-route-api"
  }
];
