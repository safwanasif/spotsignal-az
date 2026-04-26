import { CalendarDays, Eye, EyeOff, LockKeyhole, MapPinned, ShieldCheck } from "lucide-react";
import { pimaZones } from "../../data/mockTrends";
import { getPlaceById } from "../../data/places";
import type { PrivacyLevel, UserReport } from "../../types/domain";

interface PrivacyPreviewPanelProps {
  report: UserReport;
}

const privacyCopy: Record<
  PrivacyLevel,
  {
    reviewerLocation: string;
    mapUse: string;
    protection: string;
  }
> = {
  "Exact place": {
    reviewerLocation: "Selected place and aggregate zone",
    mapUse: "Contributes to the zone trend, never as an individual public pin",
    protection: "Exact place is used for reviewer context, not public blame or diagnosis"
  },
  "Approximate neighborhood": {
    reviewerLocation: "Approximate zone only",
    mapUse: "Contributes to the aggregated zone trend",
    protection: "The selected place is generalized before reviewer display"
  },
  "County only": {
    reviewerLocation: "County-level context only",
    mapUse: "Contributes to county-level trend context, not a neighborhood cluster",
    protection: "Neighborhood and selected place are hidden from reviewer views"
  },
  "No location": {
    reviewerLocation: "No location context",
    mapUse: "Does not update location-based clusters",
    protection: "Only symptom, timing, and optional exposure context are retained"
  }
};

export function PrivacyPreviewPanel({ report }: PrivacyPreviewPanelProps) {
  const place = getPlaceById(report.placeId);
  const zone = pimaZones.find((item) => item.id === report.zoneId);
  const copy = privacyCopy[report.privacyLevel];
  const symptomSummary =
    report.symptoms.length > 0 ? report.symptoms.join(", ") : "Symptom category only";
  const reviewerPlace =
    report.privacyLevel === "Exact place"
      ? place.label
      : report.privacyLevel === "Approximate neighborhood"
        ? zone?.name ?? "Approximate Arizona zone"
        : report.privacyLevel === "County only"
          ? "Pima County"
          : "Hidden";

  return (
    <section className="privacy-preview">
      <div className="privacy-preview__header">
        <div>
          <span className="eyebrow">Privacy preview</span>
          <h3>What reviewers see from this report</h3>
          <p>
            Your selected privacy level is <strong>{report.privacyLevel}</strong>. More location
            detail can improve signal quality, but SpotSignal is designed to still work with less.
          </p>
        </div>
        <div className="privacy-preview__badge">
          <LockKeyhole size={17} />
          <span>{copy.reviewerLocation}</span>
        </div>
      </div>

      <div className="privacy-grid">
        <article className="privacy-card privacy-card--visible">
          <Eye size={19} />
          <span>Reviewers see</span>
          <ul>
            <li>{reviewerPlace}</li>
            <li>{symptomSummary}</li>
            <li>Onset window: {report.symptomStartDate}</li>
            <li>Exposure context: {report.exposureTypes.join(", ")}</li>
          </ul>
        </article>

        <article className="privacy-card privacy-card--hidden">
          <EyeOff size={19} />
          <span>Reviewers do not see</span>
          <ul>
            <li>Name, identity, or account profile</li>
            <li>Individual public map pin</li>
            <li>Medical diagnosis claim</li>
            <li>Exact place if you chose approximate, county-only, or no location</li>
          </ul>
        </article>

        <article className="privacy-card">
          <MapPinned size={19} />
          <span>Map behavior</span>
          <p>{copy.mapUse}</p>
        </article>

        <article className="privacy-card">
          <ShieldCheck size={19} />
          <span>Protection</span>
          <p>{copy.protection}</p>
        </article>

        <article className="privacy-card privacy-card--wide">
          <CalendarDays size={19} />
          <span>Why this helps</span>
          <p>
            Reviewers get enough time, symptom, exposure, and geography context to compare patterns
            without turning a single report into a diagnosis or a public location claim.
          </p>
        </article>
      </div>
    </section>
  );
}
