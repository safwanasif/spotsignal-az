import { useState } from "react";
import {
  AlertTriangle,
  Bell,
  Building2,
  CheckCircle2,
  CircleHelp,
  Clock,
  Eye,
  FileSearch,
  Megaphone,
  ShieldAlert,
  Stethoscope,
  XCircle
} from "lucide-react";
import { LocalContactPanel } from "../../components/ui/LocalContactPanel";
import { SignalBadge } from "../../components/ui/SignalBadge";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { getContactsForContext } from "../../data/arizonaContacts";
import type { ReviewActionId, ReviewAlert, ReviewStatus, UserReport } from "../../types/domain";

interface HumanReviewQueueProps {
  alerts: ReviewAlert[];
  report: UserReport;
}

function statusForAction(actionId: ReviewActionId): ReviewStatus {
  if (actionId === "mark-false-alarm") return "False alarm";
  if (actionId === "notify-campus-health" || actionId === "notify-local-health") {
    return "Escalated";
  }
  if (actionId === "escalate-if-continues") return "Monitoring";
  if (actionId === "monitor-only" || actionId === "request-more-reports") return "Monitoring";
  return "Reviewed";
}

function iconForAction(actionId: ReviewActionId) {
  switch (actionId) {
    case "monitor-only":
      return <Eye size={16} />;
    case "request-more-reports":
      return <Megaphone size={16} />;
    case "notify-campus-health":
      return <Building2 size={16} />;
    case "notify-local-health":
      return <Bell size={16} />;
    case "compare-clinic-data":
      return <Stethoscope size={16} />;
    case "escalate-if-continues":
      return <AlertTriangle size={16} />;
    case "mark-false-alarm":
      return <XCircle size={16} />;
    default:
      return <CircleHelp size={16} />;
  }
}

function receiptForAction(actionId: ReviewActionId) {
  switch (actionId) {
    case "monitor-only":
      return {
        summary: "Signal stays visible in the queue with no public alert.",
        nextCheck: "Recheck in 24 hours or after 3 matching reports.",
        guardrail: "No user contact, public message, or location claim generated."
      };
    case "request-more-reports":
      return {
        summary: "Prepare a voluntary prompt for nearby reporters or relevant sub-segments.",
        nextCheck: "Review new reports in 12 to 24 hours.",
        guardrail: "Prompt should ask for onset timing and context without requesting exact pins."
      };
    case "notify-campus-health":
      return {
        summary: "Aggregate summary is ready for campus health review.",
        nextCheck: "Compare against student health visits within 24 hours.",
        guardrail: "No student identity, room, or dorm-level detail is included."
      };
    case "notify-local-health":
      return {
        summary: "Aggregate summary is ready for local public health review.",
        nextCheck: "Compare against clinic, vector, food safety, or partner feeds.",
        guardrail: "Zone-level summary only; AI does not declare an outbreak."
      };
    case "compare-clinic-data":
      return {
        summary: "Hold escalation while reviewer compares against clinic or urgent-care trends.",
        nextCheck: "Update status when comparison confirms, weakens, or contradicts the signal.",
        guardrail: "Self-reports remain early context, not clinical confirmation."
      };
    case "escalate-if-continues":
      return {
        summary: "Escalation condition set if trend keeps rising.",
        nextCheck: "Escalate after 24 to 48 hours of continued increase.",
        guardrail: "No escalation happens from the current report alone."
      };
    case "mark-false-alarm":
      return {
        summary: "Signal is closed as a likely false alarm.",
        nextCheck: "Reopen only if a fresh independent pattern appears.",
        guardrail: "Closed signals remain auditable for model evaluation."
      };
    default:
      return {
        summary: "Reviewer action recorded.",
        nextCheck: "Review again when new information arrives.",
        guardrail: "Human review remains required before public health action."
      };
  }
}

export function HumanReviewQueue({ alerts, report }: HumanReviewQueueProps) {
  const [reviewState, setReviewState] = useState<
    Record<string, { status: ReviewStatus; actionId?: ReviewActionId; actionLabel?: string; selectedAt?: string }>
  >({});

  return (
    <section className="page-section">
      <SectionHeader
        eyebrow="Human in the loop"
        title="Review and escalation queue"
        description="AI flags weak signals. Human reviewers decide whether to monitor, request more data, compare clinic feeds, escalate, or close as a false alarm."
      />

      <div className="review-list">
        {alerts.map((alert, index) => (
          <details className="review-card" key={alert.id} open={index === 0}>
            <summary className="review-card__summary">
              <div className="review-card__top">
              <div className="review-icon">
                {index === 0 ? <ShieldAlert size={22} /> : <Clock size={22} />}
              </div>
              <div>
                <span className="eyebrow">{alert.zoneName}</span>
                <h3>{alert.title}</h3>
              </div>
              <SignalBadge level={alert.signalLevel} />
            </div>
            </summary>

            <div className="review-card__body">
            {alert.notEnoughData ? (
              <div className="not-enough-data">
                <FileSearch size={18} />
                <span>Not enough data yet. Keep visible, but avoid escalation until the pattern repeats.</span>
              </div>
            ) : null}

            <p>{alert.reason}</p>
            <div className="review-meta">
              <span>Confidence: {alert.confidence}</span>
              <span>Status: {reviewState[alert.id]?.status ?? alert.status}</span>
              <span>Latest image: {report.imageCategory}</span>
              <span>Privacy: {alert.privacyStatus}</span>
            </div>

            <section className="review-subsection">
              <h4>Early lead time estimate</h4>
              <div className="review-lead-time">
                <div className="review-lead-time__score">
                  <Clock size={18} />
                  <strong>{alert.leadTime.daysGained} days</strong>
                  <span>estimated head start</span>
                </div>
                <div className="review-lead-time__copy">
                  <p>{alert.leadTime.selfReportSignal}</p>
                  <p>{alert.leadTime.traditionalVisibility}</p>
                  <small>{alert.leadTime.reviewerUse}</small>
                </div>
              </div>
              <div className="mini-timeline mini-timeline--compact">
                {alert.leadTime.timeline.map((point) => (
                  <div className="mini-timeline__point" key={point.label}>
                    <span>{point.label}</span>
                    <p>{point.detail}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="review-subsection">
              <h4>Why now?</h4>
              <div className="why-now-grid">
                <article>
                  <span>Flagged today</span>
                  <p>{alert.whyNow.flaggedToday}</p>
                </article>
                <article>
                  <span>Changed in 48h</span>
                  <p>{alert.whyNow.changed48h}</p>
                </article>
                <article>
                  <span>Threshold factor</span>
                  <p>{alert.whyNow.thresholdFactor}</p>
                </article>
                <article>
                  <span>Weak or uncertain</span>
                  <ul>
                    {alert.whyNow.uncertainty.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              </div>
            </section>

            <section className="review-subsection">
              <h4>Data quality and trust</h4>
              <div className="quality-grid">
                {alert.dataQuality.map((check) => (
                  <article className={`quality-card quality-card--${check.status}`} key={check.label}>
                    <span>{check.label}</span>
                    <strong>{check.status}</strong>
                    <p>{check.detail}</p>
                  </article>
                ))}
              </div>
              <div className="review-meta">
                <span>Duplicate check: {alert.duplicateStatus}</span>
                <span>Clinic comparison: {alert.clinicComparison}</span>
              </div>
            </section>

            <div className="review-action">
              <CheckCircle2 size={18} />
              <span>{alert.suggestedAction}</span>
            </div>

            <section className="review-subsection">
              <h4>Escalation workflow</h4>
              <div className="review-action-dropdown">
                <label htmlFor={`review-action-${alert.id}`}>Reviewer action</label>
                <select
                  id={`review-action-${alert.id}`}
                  value={reviewState[alert.id]?.actionId ?? ""}
                  onChange={(event) => {
                    const action = alert.escalationActions.find(
                      (item) => item.id === event.target.value
                    );

                    if (!action) return;

                    setReviewState((current) => ({
                      ...current,
                      [alert.id]: {
                        status: statusForAction(action.id),
                        actionId: action.id,
                        actionLabel: action.label,
                        selectedAt: new Date().toLocaleTimeString([], {
                          hour: "numeric",
                          minute: "2-digit"
                        })
                      }
                    }));
                  }}
                >
                  <option value="">Choose action...</option>
                  {alert.escalationActions.map((action) => (
                    <option key={action.id} value={action.id}>
                      {action.label}
                    </option>
                  ))}
                </select>
                {(() => {
                  const selectedActionId = reviewState[alert.id]?.actionId;
                  const selectedAction = alert.escalationActions.find(
                    (action) => action.id === selectedActionId
                  );

                  if (!selectedActionId || !selectedAction) {
                    return (
                      <p className="review-action-help">
                        Pick an action to log the reviewer decision and show the guardrails.
                      </p>
                    );
                  }

                  return (
                    <div className="review-action-preview">
                      {iconForAction(selectedActionId)}
                      <p>{selectedAction.detail}</p>
                    </div>
                  );
                })()}
              </div>
              {reviewState[alert.id]?.actionLabel ? (
                <div className="review-decision-receipt" role="status">
                  {(() => {
                    const state = reviewState[alert.id];
                    const receipt = receiptForAction(state.actionId ?? "monitor-only");

                    return (
                      <>
                        <div className="review-decision-receipt__top">
                          <CheckCircle2 size={18} />
                          <div>
                            <span>Action logged at {state.selectedAt}</span>
                            <strong>
                              {state.actionLabel}. Status set to {state.status}.
                            </strong>
                          </div>
                        </div>
                        <div className="review-decision-grid">
                          <article>
                            <span>What happens now</span>
                            <p>{receipt.summary}</p>
                          </article>
                          <article>
                            <span>Next checkpoint</span>
                            <p>{receipt.nextCheck}</p>
                          </article>
                          <article>
                            <span>Safety guardrail</span>
                            <p>{receipt.guardrail}</p>
                          </article>
                        </div>
                      </>
                    );
                  })()}
                </div>
              ) : null}
            </section>

            <LocalContactPanel
              contacts={getContactsForContext(alert.zoneId, alert.exposureTypes)}
              title="Relevant Arizona contacts for reviewer follow-up"
            />
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
