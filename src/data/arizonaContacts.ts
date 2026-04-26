import type { ExposureCategory } from "../types/domain";

export interface ArizonaContact {
  id: string;
  label: string;
  organization: string;
  relevance: string;
  phone?: string;
  url?: string;
  scope: "statewide" | "county" | "campus" | "emergency" | "support";
  zoneIds?: string[];
  exposureTypes?: ExposureCategory[];
}

export const arizonaContacts: ArizonaContact[] = [
  {
    id: "pima-public-health",
    label: "Pima County public health",
    organization: "Pima County Health Department",
    relevance:
      "Best fit for aggregate Pima County cluster review, local outbreak questions, and community health follow-up.",
    phone: "520-724-7770",
    url: "https://www.pima.gov/2030/Health",
    scope: "county",
    zoneIds: [
      "sabino-catalina",
      "university",
      "downtown",
      "south-tucson",
      "marana",
      "oro-valley",
      "vail",
      "sahuarita"
    ]
  },
  {
    id: "pima-epidemiology",
    label: "Pima epidemiology",
    organization: "Pima County Health Department Epidemiology",
    relevance:
      "Most relevant for reviewer-level infectious disease follow-up when a cluster may need local epidemiology review.",
    phone: "520-724-7797",
    url: "https://www.pima.gov/2031/Health",
    scope: "county",
    zoneIds: [
      "sabino-catalina",
      "university",
      "downtown",
      "south-tucson",
      "marana",
      "oro-valley",
      "vail",
      "sahuarita"
    ]
  },
  {
    id: "pima-food-safety",
    label: "Food safety",
    organization: "Pima County Consumer Health and Food Safety",
    relevance:
      "Most relevant when reports suggest a possible restaurant or foodborne illness pattern.",
    phone: "520-724-7908",
    url: "https://www.pima.gov/2031/Health",
    scope: "county",
    zoneIds: ["downtown", "south-tucson", "university"],
    exposureTypes: ["Foodborne"]
  },
  {
    id: "azdhs",
    label: "Arizona state public health",
    organization: "Arizona Department of Health Services",
    relevance:
      "State-level public health reference for Arizona disease surveillance and reporting pathways.",
    url: "https://www.azdhs.gov/",
    scope: "statewide"
  },
  {
    id: "ua-campus-health",
    label: "Campus health",
    organization: "University of Arizona Campus Health",
    relevance:
      "Best fit when reports involve dorms, shared student housing, or campus respiratory patterns.",
    phone: "520-621-9202",
    url: "https://health.arizona.edu/",
    scope: "campus",
    zoneIds: ["university"],
    exposureTypes: ["Close-contact"]
  },
  {
    id: "banner-urgent",
    label: "Nearby care guidance",
    organization: "Banner - University Medicine Tucson",
    relevance:
      "Useful for non-emergency medical care questions when symptoms are worsening or users want clinician guidance.",
    url: "https://www.bannerhealth.com/locations/tucson/banner-university-medical-center-tucson",
    scope: "support",
    zoneIds: ["university", "downtown", "south-tucson", "sabino-catalina"]
  },
  {
    id: "poison-center",
    label: "Poison and exposure help",
    organization: "Arizona Poison and Drug Information Center",
    relevance:
      "Useful for suspected bites, stings, poisoning, or exposure concerns when immediate expert advice is needed.",
    phone: "1-800-222-1222",
    url: "https://azpoison.com/",
    scope: "support",
    exposureTypes: ["Outdoor/vector", "Animal/zoonotic", "Water/environmental"]
  },
  {
    id: "emergency-911",
    label: "Emergency care",
    organization: "911",
    relevance:
      "Use for severe symptoms, trouble breathing, chest pain, confusion, severe allergic reaction, or other urgent danger.",
    phone: "911",
    scope: "emergency"
  }
];

export function getContactsForContext(
  zoneId: string,
  exposureTypes: ExposureCategory[]
): ArizonaContact[] {
  const matched = arizonaContacts.filter((contact) => {
    const zoneMatch = !contact.zoneIds || contact.zoneIds.includes(zoneId);
    const exposureMatch =
      !contact.exposureTypes ||
      contact.exposureTypes.some((exposure) => exposureTypes.includes(exposure));

    return zoneMatch && exposureMatch;
  });

  const priority = new Map<ArizonaContact["scope"], number>([
    ["county", 0],
    ["campus", 1],
    ["support", 2],
    ["statewide", 3],
    ["emergency", 4]
  ]);

  return matched
    .sort((a, b) => (priority.get(a.scope) ?? 99) - (priority.get(b.scope) ?? 99))
    .slice(0, 4);
}
