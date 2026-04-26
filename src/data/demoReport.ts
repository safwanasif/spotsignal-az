import type { ReportFormValues } from "../types/domain";

export const demoReportValues: ReportFormValues = {
  symptoms: ["Fever", "Headache", "Fatigue", "Bite marks"],
  symptomStartDate: "2026-04-23",
  placeId: "sabino-canyon",
  exposureTypes: ["Outdoor/vector"],
  privacyLevel: "Approximate neighborhood",
  language: "English",
  imageName: "visible-mark-demo.jpg",
  ageRange: "18-34",
  personalContext: ["Recent outdoor exposure"]
};
