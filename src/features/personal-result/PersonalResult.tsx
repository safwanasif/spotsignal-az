import {
  CircleAlert,
  CloudSun,
  HeartPulse,
  Info,
  Languages,
  Network,
  Sparkles,
  Wind
} from "lucide-react";
import { ContextRoutingPanel } from "../../components/ui/ContextRoutingPanel";
import { LocalContactPanel } from "../../components/ui/LocalContactPanel";
import { PrivacyPreviewPanel } from "../../components/ui/PrivacyPreviewPanel";
import { SignalBadge } from "../../components/ui/SignalBadge";
import { SignalTracePanel } from "../../components/ui/SignalTracePanel";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { getContactsForContext } from "../../data/arizonaContacts";
import { pimaZones } from "../../data/mockTrends";
import { signalDescriptions } from "../../lib/signal";
import type { PersonalRiskResult, UserReport } from "../../types/domain";

interface PersonalResultProps {
  report: UserReport;
  result: PersonalRiskResult;
  onOpenCalmConnect?: () => void;
}

export function PersonalResult({ report, result, onOpenCalmConnect }: PersonalResultProps) {
  const contacts = getContactsForContext(report.zoneId, report.exposureTypes);
  const zoneName =
    pimaZones.find((zone) => zone.id === report.zoneId)?.name ?? "Selected Arizona zone";
  const epydemixRole = result.epydemix.relevance === "primary" ? "promoted" : "checked only";
  const fallbackItems = [
    result.explanationSource === "Mock AI" ? "Gemini explanation API failed or is not configured." : undefined,
    report.imageSource === "Mock AI" ? "Gemini image API failed, is not configured, or no image bytes were uploaded." : undefined,
    result.weather.source === "Mock weather" ? "NOAA/NWS weather API failed, so mock weather is being used." : undefined,
    result.epydemix.source === "Local fallback" ? "Epydemix data fetch failed, so local contact context is being used." : undefined
  ].filter(Boolean);

  return (
    <section className="page-section">
      <SectionHeader
        eyebrow="Personal result"
        title="Your report signal"
        description="This signal explains pattern similarity. It is not a medical diagnosis."
      />

      <section className="calm-alert-card" role="status">
        <div className="calm-alert-card__icon">
          <CircleAlert size={20} />
        </div>
        <div>
          <span>Signal anxiety check</span>
          <h3>Moderate or watch signals can feel scary. Start with the meaning, not the fear.</h3>
          <p>
            This result only says your report shares context with a pattern. It does not diagnose
            you or say the place you visited caused illness.
          </p>
        </div>
        <button className="secondary-action" type="button" onClick={onOpenCalmConnect}>
          <Wind size={17} />
          Use CalmConnect
        </button>
      </section>

      <div className="result-layout">
        <article className="signal-panel">
          <div className="signal-panel__header">
            <HeartPulse size={28} />
            <SignalBadge level={result.signalLevel} />
          </div>
          <strong className="score">{result.score}</strong>
          <p>{signalDescriptions[result.signalLevel]}</p>
          <div className="progress-track" aria-label={`Signal score ${result.score} out of 100`}>
            <span style={{ width: `${result.score}%` }} />
          </div>
        </article>

        <article className="explanation-panel">
          {fallbackItems.length > 0 ? (
            <div className="api-fallback-alert" role="status">
              <strong>API fallback active</strong>
              {fallbackItems.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          ) : (
            <div className="api-live-alert" role="status">
              <strong>Live APIs connected</strong>
              <span>Gemini, NOAA/NWS, and Epydemix context were checked for this result.</span>
            </div>
          )}

          <div className="language-row">
            <Languages size={18} />
            <span>{report.language}</span>
          </div>
          <p>{result.explanation}</p>
          <div className="disclaimer">
            <Info size={18} />
            <span>The image category is broad context only and should not be treated as diagnosis.</span>
          </div>
          <div className="source-grid">
            <span>
              <Sparkles size={16} />
              AI source: {result.explanationSource}
            </span>
            <span>
              <Info size={16} />
              Image source: {report.imageSource}
            </span>
            <span>
              <CloudSun size={16} />
              Weather source: {result.weather.source}
            </span>
            <span>
              <Network size={16} />
              Contact source: {result.epydemix.source} ({epydemixRole})
            </span>
          </div>
        </article>
      </div>

      <PrivacyPreviewPanel report={report} />

      <SignalTracePanel report={report} risk={result} zoneName={zoneName} />

      <ContextRoutingPanel report={report} risk={result} />

      <div className="factor-grid">
        {result.factors.map((factor) => (
          <article className="factor-card" key={factor.label}>
            <span>{factor.weight} pts</span>
            <h3>{factor.label}</h3>
            <p>{factor.explanation}</p>
          </article>
        ))}
      </div>

      <section className="calm-next-steps">
        <h3>Calm next steps</h3>
        <div className="step-list">
          {result.nextSteps.map((step) => (
            <p key={step}>{step}</p>
          ))}
        </div>
      </section>

      <LocalContactPanel contacts={contacts} title="Contacts near this report context" />

      <section className="calm-next-steps">
        <h3>External context used</h3>
        <div className="step-list">
          <p>{result.weather.summary}</p>
          <p>{result.epydemix.summary}</p>
        </div>
      </section>
    </section>
  );
}
