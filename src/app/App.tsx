import { useMemo, useState } from "react";
import { AppShell, type AppView } from "../components/layout/AppShell";
import { demoReportValues } from "../data/demoReport";
import { pimaZones, reviewAlerts } from "../data/mockTrends";
import { DataSourcesView } from "../features/data-sources/DataSourcesView";
import { GeoSignalMap } from "../features/geosignal-map/GeoSignalMap";
import { HomeView } from "../features/home/HomeView";
import { HumanReviewQueue } from "../features/human-review/HumanReviewQueue";
import { ModelCardView } from "../features/model-card/ModelCardView";
import { PersonalResult } from "../features/personal-result/PersonalResult";
import { PublicHealthDashboard } from "../features/public-health-dashboard/PublicHealthDashboard";
import { ReportForm } from "../features/report/ReportForm";
import {
  applyReportToZones,
  buildRiskAssessment,
  calculatePersonalRisk,
  createReport
} from "../services/risk/riskEngine";
import type { PersonalRiskResult, ReportFormValues, UserReport } from "../types/domain";

const initialReport = createReport(demoReportValues);
const initialRisk = calculatePersonalRisk(initialReport);

export function App() {
  const [activeView, setActiveView] = useState<AppView>("home");
  const [latestReport, setLatestReport] = useState<UserReport>(initialReport);
  const [riskResult, setRiskResult] = useState<PersonalRiskResult>(initialRisk);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>();
  const [showCalmConnect, setShowCalmConnect] = useState(false);

  const zones = useMemo(
    () => applyReportToZones(pimaZones, latestReport),
    [latestReport]
  );
  const prioritizedReviewAlerts = useMemo(
    () =>
      [...reviewAlerts].sort((a, b) => {
        if (a.zoneId === latestReport.zoneId) return -1;
        if (b.zoneId === latestReport.zoneId) return 1;
        const levelRank = { review: 4, watch: 3, mild: 2, low: 1 };
        return levelRank[b.signalLevel] - levelRank[a.signalLevel];
      }),
    [latestReport.zoneId]
  );

  async function handleSubmit(values: ReportFormValues) {
    setIsSubmitting(true);
    setSubmitError(undefined);

    try {
      const assessment = await buildRiskAssessment(values);
      setLatestReport(assessment.report);
      setRiskResult(assessment.risk);
      setActiveView("result");
    } catch (error) {
      console.error(error);
      const report = createReport(values);
      setLatestReport(report);
      setRiskResult(calculatePersonalRisk(report));
      setSubmitError(
        "The live APIs were unavailable, so SpotSignal generated a local demo signal."
      );
      setActiveView("result");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AppShell
      activeView={activeView}
      showCalmConnect={showCalmConnect}
      onCloseCalmConnect={() => setShowCalmConnect(false)}
      onOpenCalmConnect={() => setShowCalmConnect(true)}
      onViewChange={setActiveView}
    >
      {activeView === "home" ? <HomeView onNavigate={setActiveView} /> : null}

      {activeView === "report" ? (
        <ReportForm
          initialValues={demoReportValues}
          isSubmitting={isSubmitting}
          submitError={submitError}
          onSubmit={handleSubmit}
        />
      ) : null}

      {activeView === "result" ? (
        <PersonalResult
          report={latestReport}
          result={riskResult}
          onOpenCalmConnect={() => setShowCalmConnect(true)}
        />
      ) : null}

      {activeView === "map" ? <GeoSignalMap zones={zones} report={latestReport} /> : null}

      {activeView === "dashboard" ? (
        <PublicHealthDashboard zones={zones} report={latestReport} risk={riskResult} />
      ) : null}

      {activeView === "review" ? (
        <HumanReviewQueue alerts={prioritizedReviewAlerts} report={latestReport} />
      ) : null}

      {activeView === "data-sources" ? <DataSourcesView /> : null}

      {activeView === "model-card" ? <ModelCardView /> : null}
    </AppShell>
  );
}
