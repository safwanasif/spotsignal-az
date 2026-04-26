import { Languages, MapPinned, ShieldCheck, Smartphone, UsersRound } from "lucide-react";

const engagementSegments = [
  {
    label: "Trail and outdoor users",
    strategy: "QR prompts at parks, trailheads, and recreation pages",
    reason: "Makes outdoor/vector reports easy right after exposure",
    icon: MapPinned
  },
  {
    label: "Campus and shared housing",
    strategy: "Dorm, student health, and campus organization reporting links",
    reason: "Captures close-contact patterns before clinic demand spikes",
    icon: UsersRound
  },
  {
    label: "Spanish-first access",
    strategy: "English/Spanish reporting and explanation flow",
    reason: "Improves trust and reduces reporting friction across Arizona communities",
    icon: Languages
  },
  {
    label: "Privacy-sensitive users",
    strategy: "Exact, approximate, county-only, or no-location choices",
    reason: "Lets people contribute without feeling tracked",
    icon: ShieldCheck
  }
];

export function EngagementStrategyPanel() {
  return (
    <section className="engagement-panel">
      <div className="engagement-panel__header">
        <div>
          <span className="eyebrow">Arizona engagement strategy</span>
          <h3>People keep reporting when the app feels useful, calm, and voluntary.</h3>
          <p>
            SpotSignal is designed for repeat participation through low-friction reporting,
            privacy choice, bilingual feedback, and visible community benefit after each report.
          </p>
        </div>
        <div className="engagement-retention">
          <Smartphone size={18} />
          <span>Retention loop</span>
          <strong>Report to calm result to community signal to optional follow-up</strong>
        </div>
      </div>

      <div className="engagement-grid">
        {engagementSegments.map((segment) => {
          const Icon = segment.icon;

          return (
            <article className="engagement-card" key={segment.label}>
              <Icon size={19} />
              <span>{segment.label}</span>
              <strong>{segment.strategy}</strong>
              <p>{segment.reason}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
