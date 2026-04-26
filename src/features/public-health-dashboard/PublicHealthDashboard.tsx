import { Activity, Clock, Image, MapPinned, Network, TrendingUp } from "lucide-react";
import { ContextRoutingPanel } from "../../components/ui/ContextRoutingPanel";
import { DataSourcesPanel } from "../../components/ui/DataSourcesPanel";
import { MetricCard } from "../../components/ui/MetricCard";
import { SignalBadge } from "../../components/ui/SignalBadge";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { SignalIntegrityPanel } from "../../components/ui/SignalIntegrityPanel";
import { SignalTracePanel } from "../../components/ui/SignalTracePanel";
import { communityTrends } from "../../data/mockTrends";
import { getPlaceById } from "../../data/places";
import { formatPercent } from "../../lib/signal";
import type {
  CommunityTrend,
  GeoZone,
  LeadTimeEstimate,
  PersonalRiskResult,
  UserReport
} from "../../types/domain";

interface PublicHealthDashboardProps {
  zones: GeoZone[];
  report: UserReport;
  risk: PersonalRiskResult;
}

function buildFallbackLeadTime(report: UserReport, zoneName: string): LeadTimeEstimate {
  const closeContact = report.exposureTypes.includes("Close-contact");
  const travel = report.exposureTypes.includes("Travel-associated");
  const outdoor = report.exposureTypes.includes("Outdoor/vector");
  const daysGained = closeContact ? 2 : travel || outdoor ? 1 : 1;

  return {
    daysGained,
    selfReportSignal: `A new ${zoneName} report is visible before partner confirmation feeds are connected.`,
    traditionalVisibility:
      "Clinic, lab, travel, vector, animal, or partner data may appear later if the pattern continues.",
    baseline: "This zone has limited matching demo trend history, so SpotSignal keeps the signal conservative.",
    acceleration: "The latest report adds context, but repeated independent reports are needed before escalation.",
    trigger: `${report.symptoms.join(", ") || "Submitted symptoms"} plus ${report.exposureTypes.join(
      ", "
    )} context created a watchable signal.`,
    confidence: "low",
    limitation: "Estimated from one latest report and synthetic baseline data; not enough for escalation alone.",
    reviewerUse:
      "Use this as a monitoring note, then request more reports or compare partner data only if the pattern repeats.",
    timeline: [
      {
        label: "Now",
        detail: "Latest self-report adds time, symptom, exposure, and privacy-controlled place context."
      },
      {
        label: "+24h",
        detail: "SpotSignal watches for repeated independent reports in the same zone or context."
      },
      {
        label: "+48h",
        detail: "Human reviewers decide whether external comparison or escalation is justified."
      }
    ]
  };
}

function buildFallbackTrend(report: UserReport, zone: GeoZone | undefined): CommunityTrend {
  const zoneName = zone?.name ?? "Selected Arizona zone";
  const imageIncrease =
    report.imageCategory === "unknown / needs review" ? 0 : report.imageConfidence === "high" ? 12 : 8;

  return {
    zoneId: report.zoneId,
    symptomIncreasePercent: Math.min(6 + report.symptoms.length * 3, 18),
    imageIncreasePercent: imageIncrease,
    similarReports7d: zone?.reportCount7d ?? 1,
    strongestPattern: `${report.symptoms.join(", ") || "Submitted symptoms"} with ${
      report.exposureTypes.join(", ") || "unknown"
    } context`,
    leadTime: buildFallbackLeadTime(report, zoneName)
  };
}

function buildDashboardSummary(
  report: UserReport,
  zoneName: string,
  trend: CommunityTrend
) {
  const place = getPlaceById(report.placeId);
  const symptoms = report.symptoms.join(", ") || "submitted symptoms";
  const exposures = report.exposureTypes.join(", ");

  if (report.exposureTypes.includes("Outdoor/vector")) {
    return {
      title: `${zoneName} outdoor/vector-like reports are being watched.`,
      body: `${place.label} is a ${place.type.toLowerCase()} context. The latest report includes ${symptoms}, ${report.imageCategory}, and ${exposures}. Weather/vector context is promoted, while contact matrices remain supporting reference evidence. The strongest current pattern is ${trend.strongestPattern}.`
    };
  }

  if (report.exposureTypes.includes("Close-contact")) {
    return {
      title: `${zoneName} close-contact reports are being compared against shared-setting context.`,
      body: `${place.label} is a ${place.type.toLowerCase()} context. The latest report includes ${symptoms} and ${exposures}. Epydemix contact context is promoted because shared spaces can amplify similar symptoms. Human reviewers should compare trend timing before requesting more reports.`
    };
  }

  if (report.exposureTypes.includes("Foodborne")) {
    return {
      title: `${zoneName} foodborne-like reports are being held for repeat evidence.`,
      body: `${place.label} is a ${place.type.toLowerCase()} context. The latest report includes ${symptoms} and ${exposures}. The signal is useful for monitoring, but escalation should wait for repeated onset timing or clinic/inspection comparison.`
    };
  }

  if (report.exposureTypes.includes("Travel-associated")) {
    return {
      title: `${zoneName} travel-associated reports are being routed to travel context.`,
      body: `${place.label} is a ${place.type.toLowerCase()} context. The latest report includes ${symptoms} and ${exposures}. CDC travel notices and future airline route context are relevant, while the app avoids claiming a travel pathway without human review.`
    };
  }

  if (report.exposureTypes.includes("Animal/zoonotic")) {
    return {
      title: `${zoneName} animal/environment context is being monitored conservatively.`,
      body: `${place.label} is a ${place.type.toLowerCase()} context. The latest report includes ${symptoms} and ${exposures}. Future One Health partner feeds would strengthen this signal, but the current prototype keeps it as a watch note unless reports repeat.`
    };
  }

  return {
    title: `${zoneName} has a new report available for pattern comparison.`,
    body: `The latest report includes ${symptoms}. SpotSignal keeps the signal conservative until repeated reports or stronger external context appear.`
  };
}

export function PublicHealthDashboard({ zones, report, risk }: PublicHealthDashboardProps) {
  const watchZones = zones.filter(
    (zone) => zone.signalLevel === "watch" || zone.signalLevel === "review"
  );
  const totalReports = zones.reduce((total, zone) => total + zone.reportCount7d, 0);
  const activeZone = zones.find((zone) => zone.id === report.zoneId);
  const activeTrend =
    communityTrends.find((item) => item.zoneId === report.zoneId) ??
    buildFallbackTrend(report, activeZone);
  const leadTime = activeTrend.leadTime;
  const zoneName = activeZone?.name ?? "Selected Arizona zone";
  const summary = buildDashboardSummary(report, zoneName, activeTrend);
  const visibleZones = [...zones].sort((a, b) => {
    if (a.id === report.zoneId) return -1;
    if (b.id === report.zoneId) return 1;
    return b.reportCount7d - a.reportCount7d;
  });

  return (
    <section className="page-section">
      <SectionHeader
        eyebrow="Public health dashboard"
        title="Aggregate community patterns"
        description="Reviewer-facing summaries use zone-level trends and uncertainty labels."
      />

      <div className="metrics-grid">
        <MetricCard
          label="Reports in 7 days"
          value={String(totalReports)}
          detail="Synthetic demo reports across Pima County zones"
          icon={<Activity size={18} />}
        />
        <MetricCard
          label="Watch zones"
          value={String(watchZones.length)}
          detail="Zones with enough signal to monitor closely"
          icon={<MapPinned size={18} />}
        />
        <MetricCard
          label={`${report.imageCategory} trend`}
          value={formatPercent(activeTrend.imageIncreasePercent)}
          detail={`${zoneName} image category context`}
          icon={<Image size={18} />}
        />
        <MetricCard
          label="Symptom trend"
          value={formatPercent(activeTrend.symptomIncreasePercent)}
          detail={`${activeTrend.strongestPattern} compared with baseline`}
          icon={<TrendingUp size={18} />}
        />
        <MetricCard
          label="Estimated early warning"
          value={`${leadTime.daysGained} days`}
          detail="Before traditional clinic, lab, or vector visibility"
          icon={<Clock size={18} />}
        />
        <MetricCard
          label="Contact context"
          value={risk.epydemix.relevance === "primary" ? risk.epydemix.strongestLayer.layer : "Support"}
          detail={
            risk.epydemix.relevance === "primary"
              ? `${risk.epydemix.source} for ${risk.epydemix.setting}`
              : `Checked as supporting context for ${risk.epydemix.setting}`
          }
          icon={<Network size={18} />}
        />
      </div>

      <ContextRoutingPanel report={report} risk={risk} compact />

      <SignalTracePanel report={report} risk={risk} zoneName={zoneName} compact />

      <SignalIntegrityPanel />

      <div className="dashboard-layout">
        <div className="dashboard-stack">
          <article className="summary-panel">
            <span className="eyebrow">AI-generated reviewer summary</span>
            <h3>{summary.title}</h3>
            <p>{summary.body}</p>
            <div className="tag-list">
              <span>{zoneName}</span>
              <span>{report.imageCategory}</span>
              {report.exposureTypes.map((exposure) => (
                <span key={exposure}>{exposure}</span>
              ))}
              {report.symptoms.map((symptom) => (
                <span key={symptom}>{symptom}</span>
              ))}
            </div>
          </article>

          <article className="lead-time-panel" aria-label="Estimated lead time gained">
            <div className="lead-time-panel__header">
              <div>
                <span className="eyebrow">Early warning estimate</span>
                <h3>{leadTime.daysGained} days gained before traditional visibility</h3>
              </div>
              <strong>{leadTime.confidence}</strong>
            </div>
            <p>{leadTime.selfReportSignal}</p>
            <div className="lead-time-stat-grid">
              <span>
                <small>Baseline</small>
                {leadTime.baseline}
              </span>
              <span>
                <small>Trigger</small>
                {leadTime.trigger}
              </span>
            </div>
            <div className="mini-timeline">
              {leadTime.timeline.map((point) => (
                <div className="mini-timeline__point" key={point.label}>
                  <span>{point.label}</span>
                  <p>{point.detail}</p>
                </div>
              ))}
            </div>
            <p className="lead-time-note">{leadTime.limitation}</p>
          </article>
        </div>

        <div className="trend-list">
          {visibleZones.slice(0, 5).map((zone) => (
            <article className="trend-row" key={zone.id}>
              <div>
                <h3>{zone.name}</h3>
                <p>{zone.trend}</p>
              </div>
              <SignalBadge level={zone.signalLevel} />
            </article>
          ))}
        </div>
      </div>

      <DataSourcesPanel compact />
    </section>
  );
}
