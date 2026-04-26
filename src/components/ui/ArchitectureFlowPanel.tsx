import {
  BrainCircuit,
  ClipboardList,
  DatabaseZap,
  GitBranch,
  MapPinned,
  ShieldCheck
} from "lucide-react";

const architectureSteps = [
  {
    label: "1. Incoming report packet",
    title: "Simulated self-report input",
    detail:
      "The prototype form stands in for the minimum useful data Arizona's planned self-reporting system would provide.",
    icon: ClipboardList
  },
  {
    label: "2. Context router",
    title: "Only relevant sources are promoted",
    detail:
      "Outdoor reports prioritize weather/vector context; dorm reports prioritize contact context; travel reports prioritize CDC/travel context.",
    icon: GitBranch
  },
  {
    label: "3. Risk engine",
    title: "Factors become explainable signals",
    detail:
      "The model combines symptoms, image category, trend, place type, weather, and contact context into a non-diagnostic score.",
    icon: BrainCircuit
  },
  {
    label: "4. GeoSignal aggregation",
    title: "Zone-level community patterns",
    detail:
      "Reports update aggregate zones, not individual public pins, so reviewers can see geography and time-window patterns.",
    icon: MapPinned
  },
  {
    label: "5. Human review",
    title: "AI flags, humans decide",
    detail:
      "Reviewers see why-now, uncertainty, data quality, local contacts, and decision receipts before action.",
    icon: ShieldCheck
  }
];

const deploymentBoundaries = [
  "Frontend demo: React/Vite prototype with a simulated incoming-report adapter",
  "Not in scope: replacing Arizona's planned statewide self-reporting intake system",
  "Live context: NOAA/NWS weather and public Epydemix Arizona contact data",
  "AI layer: Gemini when configured, mock AI fallback when unavailable",
  "Future feeds: clinic aggregates, EpiCore-style verification, vector, animal, and travel-pathway data"
];

export function ArchitectureFlowPanel() {
  return (
    <section className="architecture-panel">
      <div className="architecture-panel__header">
        <div>
          <span className="eyebrow">Technical architecture</span>
          <h3>From self-report to human-reviewed signal</h3>
          <p>
            SpotSignal is scoped as the AI context and risk-profile layer around participatory
            reporting, not as a replacement for Arizona's planned intake system.
          </p>
        </div>
        <div className="architecture-panel__badge">
          <DatabaseZap size={18} />
          <span>Functional prototype pipeline</span>
        </div>
      </div>

      <div className="architecture-flow">
        {architectureSteps.map((step) => {
          const Icon = step.icon;

          return (
            <article className="architecture-step" key={step.label}>
              <Icon size={20} />
              <span>{step.label}</span>
              <h4>{step.title}</h4>
              <p>{step.detail}</p>
            </article>
          );
        })}
      </div>

      <div className="deployment-boundary">
        <span>Deployment boundary</span>
        <div>
          {deploymentBoundaries.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
