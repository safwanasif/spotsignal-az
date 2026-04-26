import { FileText, ShieldCheck } from "lucide-react";
import { EngagementStrategyPanel } from "../../components/ui/EngagementStrategyPanel";
import { EvaluationRoadmapPanel } from "../../components/ui/EvaluationRoadmapPanel";
import { SectionHeader } from "../../components/ui/SectionHeader";

const modelSections = [
  {
    title: "Purpose",
    body:
      "Generate non-diagnostic personal and community risk signals from reports, image categories, location exposure, weather context, and aggregate trends."
  },
  {
    title: "Inputs",
    body:
      "Symptoms, symptom start date, optional image category, recent place category, privacy level, optional personal context, language, weather context, Epydemix Arizona contact context, CDC travel notices, and community trend data."
  },
  {
    title: "Outputs",
    body:
      "Signal level, score, contributing factors, plain-language explanation, reviewer summary, and human review recommendation."
  },
  {
    title: "What it does not do",
    body:
      "It does not diagnose, perform emergency triage, prove causation, declare outbreaks, or show individual location pins on dashboards."
  },
  {
    title: "Human review threshold",
    body:
      "A cluster watch can be shown automatically, but human review is required before public health action or public messaging."
  },
  {
    title: "Bias and limitations",
    body:
      "Crowdsourced reporting may underrepresent low-connectivity communities. Image categories can vary by skin tone, lighting, camera quality, and upload quality."
  },
  {
    title: "Privacy",
    body:
      "Users can choose exact place, approximate neighborhood, county only, or no location. Community views aggregate by zones."
  },
  {
    title: "Engagement strategy",
    body:
      "Designed for Arizona sub-segments including outdoor users, campus/shared housing, Spanish-first users, privacy-sensitive reporters, and rural or One Health exposure contexts. The retention loop is report, calm result, community signal, and optional follow-up."
  },
  {
    title: "Future improvements",
    body:
      "Calibrate thresholds with public health experts, test multilingual accessibility, validate image category fairness, add current airline timetable feeds, and connect vetted public health feeds when available."
  },
  {
    title: "EpiCore note",
    body:
      "No EpiCore API is expected for this hackathon. SpotSignal uses EpiCore as a human-verification design reference, not as a live data feed."
  }
];

export function ModelCardView() {
  return (
    <section className="page-section">
      <SectionHeader
        eyebrow="Required deliverable"
        title="Model card"
        description="A concise transparency layer for judges, users, and public health reviewers."
      />

      <div className="model-card-grid">
        {modelSections.map((section, index) => (
          <article className="model-card-section" key={section.title}>
            <div className="model-card-section__icon">
              {index === 0 ? <FileText size={20} /> : <ShieldCheck size={20} />}
            </div>
            <h3>{section.title}</h3>
            <p>{section.body}</p>
          </article>
        ))}
      </div>

      <EvaluationRoadmapPanel />

      <EngagementStrategyPanel />
    </section>
  );
}
