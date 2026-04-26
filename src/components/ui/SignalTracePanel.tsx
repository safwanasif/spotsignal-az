import {
  BrainCircuit,
  CalendarClock,
  Image,
  MapPinned,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { getPlaceById } from "../../data/places";
import type { PersonalRiskResult, UserReport } from "../../types/domain";

interface SignalTracePanelProps {
  report: UserReport;
  risk: PersonalRiskResult;
  zoneName: string;
  compact?: boolean;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric"
  });
}

export function SignalTracePanel({
  report,
  risk,
  zoneName,
  compact = false
}: SignalTracePanelProps) {
  const place = getPlaceById(report.placeId);
  const topFactors = [...risk.factors].sort((a, b) => b.weight - a.weight).slice(0, 3);
  const contextSources = [
    risk.weather.source,
    risk.epydemix.source,
    report.imageSource,
    risk.explanationSource
  ];
  const uniqueSources = Array.from(new Set(contextSources));

  return (
    <section className={compact ? "signal-trace signal-trace--compact" : "signal-trace"}>
      <div className="signal-trace__header">
        <div>
          <span className="eyebrow">Signal trace</span>
          <h3>How the intelligence layer reached this profile</h3>
          {!compact ? (
            <p>
              This is the audit-friendly chain from incoming report packet to risk profile. It
              keeps geography, timing, promoted context, and uncertainty visible.
            </p>
          ) : null}
        </div>
        <div className="signal-trace__score">
          <BrainCircuit size={18} />
          <span>{risk.score}/100</span>
        </div>
      </div>

      <div className="signal-trace-grid">
        <article>
          <CalendarClock size={18} />
          <span>Same time window</span>
          <strong>{formatDate(report.symptomStartDate)} to now</strong>
          <p>Compared against recent synthetic 24-48 hour and 7-day zone trends.</p>
        </article>
        <article>
          <MapPinned size={18} />
          <span>Same geography</span>
          <strong>{zoneName}</strong>
          <p>
            Matched from {place.label} using {report.privacyLevel.toLowerCase()} instead of
            public individual pins.
          </p>
        </article>
        <article>
          <Sparkles size={18} />
          <span>Promoted evidence</span>
          <strong>{topFactors.map((factor) => factor.label).join(", ")}</strong>
          <p>Highest weighted factors drive the signal explanation and reviewer summary.</p>
        </article>
        <article>
          <Image size={18} />
          <span>AI context</span>
          <strong>{report.imageCategory}</strong>
          <p>
            Broad image category only, {report.imageConfidence} confidence, source:{" "}
            {report.imageSource}.
          </p>
        </article>
        <article>
          <ShieldCheck size={18} />
          <span>Guardrail</span>
          <strong>Human review before action</strong>
          <p>No diagnosis, no causation claim, and no outbreak declaration from AI alone.</p>
        </article>
      </div>

      {!compact ? (
        <div className="signal-trace-sources" aria-label="Signal trace sources">
          {uniqueSources.map((source) => (
            <span key={source}>{source}</span>
          ))}
        </div>
      ) : null}
    </section>
  );
}
