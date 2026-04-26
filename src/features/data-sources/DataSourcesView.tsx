import { useEffect, useState } from "react";
import { ArchitectureFlowPanel } from "../../components/ui/ArchitectureFlowPanel";
import { DataSourcesPanel } from "../../components/ui/DataSourcesPanel";
import { SectionHeader } from "../../components/ui/SectionHeader";
import {
  fetchCdcTravelNotices,
  type CdcTravelNotice
} from "../../services/cdc/cdcTravelNotices";

export function DataSourcesView() {
  const [notices, setNotices] = useState<CdcTravelNotice[]>([]);
  const [cdcStatus, setCdcStatus] = useState<"Loading" | "Live" | "Unavailable">("Loading");

  useEffect(() => {
    let active = true;

    fetchCdcTravelNotices()
      .then((items) => {
        if (!active) return;
        setNotices(items);
        setCdcStatus("Live");
      })
      .catch((error) => {
        console.warn("CDC travel notices unavailable:", error);
        if (active) setCdcStatus("Unavailable");
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="page-section">
      <SectionHeader
        eyebrow="Technical overview"
        title="Data sources and resource plan"
        description="This page maps each challenge-suggested resource to how SpotSignal uses it today or would connect it in a full deployment."
      />

      <div className={cdcStatus === "Live" ? "api-live-alert" : "api-fallback-alert"} role="status">
        <strong>CDC travel notice status: {cdcStatus}</strong>
        <span>
          {cdcStatus === "Live"
            ? "Current CDC Travelers' Health notices loaded from the public RSS feed."
            : "If the RSS fetch is blocked, the app still links reviewers to the official CDC source."}
        </span>
      </div>

      <ArchitectureFlowPanel />

      <DataSourcesPanel notices={notices} />
    </section>
  );
}
