import { BarChart3, ClipboardList, Clock, FileSearch, Map, ShieldCheck } from "lucide-react";
import type { AppView } from "../../components/layout/AppShell";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { communityTrends } from "../../data/mockTrends";

interface HomeViewProps {
  onNavigate: (view: AppView) => void;
}

const quickActions: Array<{
  title: string;
  detail: string;
  view: AppView;
  icon: typeof ClipboardList;
}> = [
  {
    title: "Run demo intake",
    detail: "Simulate an incoming self-report packet for the AI context layer.",
    view: "report",
    icon: ClipboardList
  },
  {
    title: "View GeoSignal Map",
    detail: "See aggregated Pima County signal zones on a physical map.",
    view: "map",
    icon: Map
  },
  {
    title: "Open dashboard",
    detail: "Review community trends, data sources, and rising patterns.",
    view: "dashboard",
    icon: BarChart3
  },
  {
    title: "Review queue",
    detail: "Inspect why-now alerts, data quality, and escalation actions.",
    view: "review",
    icon: ShieldCheck
  }
];

export function HomeView({ onNavigate }: HomeViewProps) {
  const leadTime = communityTrends[0].leadTime;

  return (
    <section className="page-section">
      <SectionHeader
        eyebrow="Home"
        title="SpotSignal intelligence layer"
        description="A calm starting point for enriching incoming Arizona self-reports with context, risk profiles, and human review."
      />

      <div className="home-hero-panel">
        <div>
          <span className="eyebrow">Mission</span>
          <h3>Turn scattered reports into explainable early warnings.</h3>
          <p>
            SpotSignal is not the statewide intake system. It is the AI layer that adds
            weather, place, community trend, contact-pattern, and uncertainty context to
            self-reported data.
          </p>
        </div>
        <button className="primary-action" type="button" onClick={() => onNavigate("report")}>
          <ClipboardList size={18} />
          Run demo intake
        </button>
      </div>

      <div className="home-intelligence-strip" aria-label="SpotSignal layer boundary">
        <article>
          <span>Input</span>
          <strong>Self-report packet</strong>
          <p>Symptoms, onset, broad place context, privacy level, optional image.</p>
        </article>
        <article>
          <span>Enrichment</span>
          <strong>Context router</strong>
          <p>Promotes the right external sources for the same geography and time window.</p>
        </article>
        <article>
          <span>Output</span>
          <strong>Risk profiles</strong>
          <p>Personal and community signals with factors, confidence, and uncertainty.</p>
        </article>
        <article>
          <span>Boundary</span>
          <strong>Human decision</strong>
          <p>AI flags weak signals; verified reviewers decide whether action is justified.</p>
        </article>
      </div>

      <div className="home-lead-panel">
        <div className="home-lead-panel__icon">
          <Clock size={22} />
        </div>
        <div>
          <span className="eyebrow">Early warning proof</span>
          <h3>{leadTime.daysGained} days of estimated lead time</h3>
          <p>{leadTime.trigger}</p>
        </div>
        <button className="secondary-action" type="button" onClick={() => onNavigate("review")}>
          Review why now
        </button>
      </div>

      <div className="home-action-grid">
        {quickActions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              className="home-action-card"
              key={action.title}
              type="button"
              onClick={() => onNavigate(action.view)}
            >
              <Icon size={22} />
              <span>{action.title}</span>
              <p>{action.detail}</p>
            </button>
          );
        })}
      </div>

      <div className="home-safety-strip">
        <FileSearch size={20} />
        <p>
          Every signal should be interpreted with uncertainty labels, privacy controls, and human
          review before public health action.
        </p>
      </div>
    </section>
  );
}
