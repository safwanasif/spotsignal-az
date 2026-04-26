import {
  CloudSun,
  Footprints,
  Globe2,
  Plane,
  RadioTower,
  UsersRound
} from "lucide-react";
import { getRoutedContextLayers, type ContextFit } from "../../lib/contextRouting";
import type { PersonalRiskResult, UserReport } from "../../types/domain";

interface ContextRoutingPanelProps {
  report: UserReport;
  risk: PersonalRiskResult;
  compact?: boolean;
}

const iconById = {
  "weather-vector": CloudSun,
  "epydemix-contact": UsersRound,
  "cdc-travel": Globe2,
  "airline-routes": Plane,
  "one-health-feeds": Footprints
};

const fitLabels: Record<ContextFit, string> = {
  primary: "Primary",
  supporting: "Supporting",
  background: "Reference",
  planned: "Planned"
};

export function ContextRoutingPanel({ report, risk, compact = false }: ContextRoutingPanelProps) {
  const layers = getRoutedContextLayers(report, risk);
  const activeLayers = compact
    ? layers.filter((layer) => layer.fit === "primary" || layer.fit === "supporting" || layer.fit === "planned")
    : layers;

  return (
    <section className={compact ? "context-routing context-routing--compact" : "context-routing"}>
      <div className="context-routing__header">
        <div>
          <span className="eyebrow">Context router</span>
          <h3>Only the relevant evidence gets promoted.</h3>
          {!compact ? (
            <p>
              SpotSignal routes each report to the context layers that actually fit the place and
              exposure type, so the AI explanation does not sound generic.
            </p>
          ) : null}
        </div>
        <div className="context-routing__rule">
          <RadioTower size={17} />
          <span>Report type controls source priority</span>
        </div>
      </div>

      <div className="context-layer-grid">
        {activeLayers.map((layer) => {
          const Icon = iconById[layer.id as keyof typeof iconById] ?? RadioTower;

          return (
            <article className={`context-layer context-layer--${layer.fit}`} key={layer.id}>
              <div className="context-layer__top">
                <Icon size={19} />
                <span>{fitLabels[layer.fit]}</span>
              </div>
              <h4>{layer.name}</h4>
              <strong>{layer.sourceStatus}</strong>
              <p>{layer.reason}</p>
              {!compact ? <small>{layer.reviewerUse}</small> : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
