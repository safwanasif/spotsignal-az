import { AlertTriangle, DatabaseZap, GitBranch, ShieldCheck, UsersRound } from "lucide-react";

interface SignalIntegrityPanelProps {
  compact?: boolean;
}

const integrityChecks = [
  {
    label: "Minimum signal gate",
    value: "No single report escalates",
    detail:
      "Signals need repeated similarity across time, zone, symptom pattern, or exposure context before entering review.",
    icon: UsersRound
  },
  {
    label: "Duplicate handling",
    value: "Downweight suspicious repeats",
    detail:
      "Matching wording, timing, and privacy bucket patterns are flagged so reviewers see possible duplicates.",
    icon: ShieldCheck
  },
  {
    label: "Source status",
    value: "Live, mocked, or planned",
    detail:
      "The interface labels which evidence is live API context and which evidence is synthetic demo data.",
    icon: DatabaseZap
  },
  {
    label: "Human review gate",
    value: "AI cannot declare outbreak",
    detail:
      "SpotSignal can recommend monitoring or comparison, but public health action stays with human reviewers.",
    icon: AlertTriangle
  }
];

export function SignalIntegrityPanel({ compact = false }: SignalIntegrityPanelProps) {
  return (
    <section className={compact ? "signal-integrity signal-integrity--compact" : "signal-integrity"}>
      <div className="signal-integrity__header">
        <div>
          <span className="eyebrow">Signal integrity</span>
          <h3>Built for noisy reports, not perfect data.</h3>
          <p>
            SpotSignal is feasible because it treats participatory data as an early signal layer,
            then adds thresholds, source labels, privacy aggregation, and human review.
          </p>
        </div>
        <div className="signal-integrity__scale">
          <GitBranch size={18} />
          <span>Pima zones now</span>
          <strong>Arizona counties later</strong>
        </div>
      </div>

      <div className="integrity-grid">
        {integrityChecks.map((check) => {
          const Icon = check.icon;

          return (
            <article className="integrity-card" key={check.label}>
              <Icon size={19} />
              <span>{check.label}</span>
              <strong>{check.value}</strong>
              {!compact ? <p>{check.detail}</p> : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
