import { ExternalLink } from "lucide-react";
import { surveillanceResources } from "../../data/surveillanceResources";
import type { CdcTravelNotice } from "../../services/cdc/cdcTravelNotices";

interface DataSourcesPanelProps {
  notices?: CdcTravelNotice[];
  compact?: boolean;
}

export function DataSourcesPanel({ notices = [], compact = false }: DataSourcesPanelProps) {
  return (
    <section className={compact ? "data-source-panel data-source-panel--compact" : "data-source-panel"}>
      <div className="data-source-panel__header">
        <span className="eyebrow">Data and resources</span>
        <h3>External context coverage</h3>
        <p>
          SpotSignal separates true live sources from API-ready and planned integrations so reviewers
          know what evidence is actually driving a signal.
        </p>
      </div>

      <div className="resource-grid">
        {surveillanceResources.map((resource) => {
          const Icon = resource.icon;

          return (
            <article className="resource-card" key={resource.id}>
              <div className="resource-card__top">
                <Icon size={20} />
                <span className={`resource-status resource-status--${resource.status.toLowerCase().replace("-", "")}`}>
                  {resource.status}
                </span>
              </div>
              <h4>{resource.name}</h4>
              <strong>{resource.role}</strong>
              <p>{resource.currentUse}</p>
              {!compact ? <p>{resource.whyItMatters}</p> : null}
              {resource.sourceUrl.startsWith("http") ? (
                <a href={resource.sourceUrl} target="_blank" rel="noreferrer">
                  <ExternalLink size={14} />
                  Source
                </a>
              ) : (
                <span className="resource-placeholder">{resource.sourceUrl}</span>
              )}
            </article>
          );
        })}
      </div>

      {notices.length > 0 ? (
        <div className="cdc-notice-list">
          <h4>Latest CDC travel notices</h4>
          {notices.map((notice) => (
            <a key={notice.link} href={notice.link} target="_blank" rel="noreferrer">
              <span>{notice.title}</span>
              <small>{notice.publishedAt}</small>
            </a>
          ))}
        </div>
      ) : null}
    </section>
  );
}
