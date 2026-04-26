import { BarChart3, Clock3, GitBranch, Languages, ShieldCheck, Target } from "lucide-react";

const evaluationMetrics = [
  {
    label: "Lead time gained",
    target: "Detect watch signals 24-72 hours earlier",
    detail: "Compare first SpotSignal alert against clinic, lab, vector, or public health visibility.",
    icon: Clock3
  },
  {
    label: "False alarm review rate",
    target: "Track closed alerts by reason",
    detail: "Measure how often reviewer decisions mark signals as unrelated, duplicate, or too weak.",
    icon: Target
  },
  {
    label: "Privacy adoption",
    target: "Monitor exact vs approximate vs county-only reporting",
    detail: "Evaluate whether privacy controls increase participation without destroying signal quality.",
    icon: ShieldCheck
  },
  {
    label: "Equity and access",
    target: "Compare reporting across language and community segments",
    detail: "Watch for gaps in Spanish-first, rural, low-connectivity, campus, and outdoor-user reporting.",
    icon: Languages
  }
];

const roadmapSteps = [
  {
    phase: "Hackathon MVP",
    scope: "Synthetic Pima County reports",
    detail: "Demonstrate report flow, map, AI explanation, context routing, privacy preview, and human review."
  },
  {
    phase: "Pima pilot",
    scope: "County-level participatory reporting",
    detail: "Tune thresholds with public health reviewers and validate false alarms, lead time, and user trust."
  },
  {
    phase: "Arizona scale",
    scope: "County zones and One Health partners",
    detail: "Connect vetted feeds for CDC travel, weather/vector, clinic aggregates, animal/environment signals, and EpiCore-style verification."
  }
];

export function EvaluationRoadmapPanel() {
  return (
    <section className="evaluation-roadmap">
      <div className="evaluation-roadmap__header">
        <div>
          <span className="eyebrow">Evaluation and roadmap</span>
          <h3>How SpotSignal would prove impact after the demo</h3>
          <p>
            The prototype is intentionally scoped, but the success metrics are deployment-oriented:
            earlier review, fewer blind spots, privacy-preserving participation, and accountable
            human decisions.
          </p>
        </div>
        <div className="evaluation-roadmap__badge">
          <BarChart3 size={18} />
          <span>Model card performance layer</span>
        </div>
      </div>

      <div className="evaluation-grid">
        {evaluationMetrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <article className="evaluation-card" key={metric.label}>
              <Icon size={19} />
              <span>{metric.label}</span>
              <strong>{metric.target}</strong>
              <p>{metric.detail}</p>
            </article>
          );
        })}
      </div>

      <div className="roadmap-strip">
        {roadmapSteps.map((step, index) => (
          <article className="roadmap-step" key={step.phase}>
            <div className="roadmap-step__number">
              <GitBranch size={16} />
              <span>{index + 1}</span>
            </div>
            <div>
              <span>{step.phase}</span>
              <h4>{step.scope}</h4>
              <p>{step.detail}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
