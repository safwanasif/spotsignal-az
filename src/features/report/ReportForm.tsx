import { BrainCircuit, Camera, Check, DatabaseZap, GitBranch, Loader2, Plus, Send, Shield, X } from "lucide-react";
import { useState } from "react";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { getPlaceById, placeOptions } from "../../data/places";
import type { LanguagePreference, PrivacyLevel, ReportFormValues } from "../../types/domain";

const symptomOptions = [
  "Fever",
  "Chills",
  "Headache",
  "Fatigue",
  "Body aches",
  "Bite marks",
  "Rash",
  "Swelling/redness",
  "Cough",
  "Sore throat",
  "Shortness of breath",
  "Runny nose",
  "Loss of smell/taste",
  "Chest tightness",
  "Nausea",
  "Vomiting",
  "Diarrhea",
  "Stomach pain",
  "Dehydration",
  "Dizziness",
  "Confusion",
  "Heat exhaustion symptoms",
  "Fainting",
  "Eye irritation",
  "Skin sore/lesion",
  "Joint pain",
  "Neck stiffness",
  "Severe allergic reaction"
];

const privacyOptions: PrivacyLevel[] = [
  "Approximate neighborhood",
  "Exact place",
  "County only",
  "No location"
];

const languageOptions: LanguagePreference[] = [
  "English",
  "Spanish",
  "Navajo",
  "Tohono O'odham",
  "Hopi",
  "Arabic",
  "Chinese",
  "Vietnamese",
  "French",
  "ASL-friendly summary"
];

const personalContextOptions = [
  "Recent outdoor exposure",
  "Shared housing/dorm",
  "Animal exposure",
  "Recent travel",
  "Food service or healthcare work",
  "Farm/ranch work",
  "Childcare or school setting",
  "Healthcare waiting room",
  "Immunocompromised",
  "Pregnant",
  "Smoking/vaping",
  "Limited transportation"
];

const ageRangeOptions = [
  "Prefer not to say",
  "0-5",
  "6-12",
  "13-17",
  "18-34",
  "35-49",
  "50-64",
  "65+"
];

interface ReportFormProps {
  initialValues: ReportFormValues;
  isSubmitting: boolean;
  submitError?: string;
  onSubmit: (values: ReportFormValues) => void | Promise<void>;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function ReportForm({
  initialValues,
  isSubmitting,
  submitError,
  onSubmit
}: ReportFormProps) {
  const [values, setValues] = useState<ReportFormValues>(initialValues);

  function toggleSymptom(symptom: string) {
    setValues((current) => ({
      ...current,
      symptoms: current.symptoms.includes(symptom)
        ? current.symptoms.filter((item) => item !== symptom)
        : [...current.symptoms, symptom]
    }));
  }

  function addSymptom(symptom: string) {
    if (!symptom) return;
    setValues((current) => ({
      ...current,
      symptoms: current.symptoms.includes(symptom)
        ? current.symptoms
        : [...current.symptoms, symptom]
    }));
  }

  function toggleContext(context: string) {
    setValues((current) => ({
      ...current,
      personalContext: current.personalContext.includes(context)
        ? current.personalContext.filter((item) => item !== context)
        : [...current.personalContext, context]
    }));
  }

  function updatePlace(placeId: string) {
    const place = getPlaceById(placeId);
    setValues((current) => ({
      ...current,
      placeId,
      exposureTypes: place.exposureCategories
    }));
  }

  return (
    <section className="page-section">
      <SectionHeader
        eyebrow="Demo intake adapter"
        title="Simulate an incoming Arizona self-report"
        description="This form creates a realistic report packet for the prototype. In deployment, SpotSignal would receive this kind of data from Arizona's planned self-reporting system."
      />

      <div className="intake-boundary" aria-label="Prototype boundary">
        <article>
          <DatabaseZap size={18} />
          <span>Input source</span>
          <p>Demo packet that stands in for incoming statewide self-reports.</p>
        </article>
        <article>
          <GitBranch size={18} />
          <span>SpotSignal role</span>
          <p>Route the packet to weather, place, contact, trend, and image context.</p>
        </article>
        <article>
          <BrainCircuit size={18} />
          <span>Output</span>
          <p>Generate individual/community risk profiles and reviewer explanations.</p>
        </article>
      </div>

      <div className="flow-meter" aria-label="Report processing flow">
        <span>1. Incoming packet</span>
        <span>2. Context enrichment</span>
        <span>3. Risk profile</span>
        <span>4. Human review</span>
      </div>

      <form
        className="report-grid"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(values);
        }}
      >
        <div className="form-panel">
          <label className="field-label" htmlFor="start-date">
            Symptom start date
          </label>
          <input
            id="start-date"
            type="date"
            value={values.symptomStartDate}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                symptomStartDate: event.target.value
              }))
            }
          />

          <div className="field-group">
            <span className="field-label">Symptoms</span>
            <div className="symptom-picker">
              <select
                aria-label="Add a symptom"
                value=""
                onChange={(event) => addSymptom(event.target.value)}
              >
                <option value="">Add a symptom...</option>
                {symptomOptions.map((symptom) => (
                  <option key={symptom} value={symptom}>
                    {symptom}
                  </option>
                ))}
              </select>
              <Plus size={17} />
            </div>
            <div className="selected-chip-list" aria-label="Selected symptoms">
              {values.symptoms.length === 0 ? (
                <span className="empty-selection">No symptoms selected yet</span>
              ) : (
                values.symptoms.map((symptom) => (
                  <button
                    className="selected-chip"
                    key={symptom}
                    type="button"
                    onClick={() => toggleSymptom(symptom)}
                  >
                    {symptom}
                    <X size={14} />
                  </button>
                ))
              )}
            </div>
          </div>

          <label className="field-label" htmlFor="place">
            Recent place visited
          </label>
          <select
            id="place"
            value={values.placeId}
            onChange={(event) => updatePlace(event.target.value)}
          >
            {placeOptions.map((place) => (
              <option key={place.id} value={place.id}>
                {place.label} - {place.type}
              </option>
            ))}
          </select>

          <div className="exposure-list" aria-label="Exposure context">
            {values.exposureTypes.map((exposure) => (
              <span key={exposure}>{exposure}</span>
            ))}
          </div>
        </div>

        <div className="form-panel">
          <label className="upload-box" htmlFor="image-upload">
            <Camera size={22} />
            <strong>Optional image context</strong>
            <span>{values.imageName ?? "Upload a visible mark, rash, or bite image"}</span>
          </label>
          <input
            className="sr-only"
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={async (event) => {
              const file = event.target.files?.[0];

              if (!file) return;

              const imageDataUrl = await readFileAsDataUrl(file);
              setValues((current) => ({
                ...current,
                imageName: file.name,
                imageMimeType: file.type,
                imageDataUrl
              }));
            }}
          />

          <label className="field-label" htmlFor="privacy">
            Location privacy level
          </label>
          <select
            id="privacy"
            value={values.privacyLevel}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                privacyLevel: event.target.value as PrivacyLevel
              }))
            }
          >
            {privacyOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>

          <label className="field-label" htmlFor="language">
            Explanation language
          </label>
          <select
            id="language"
            value={values.language}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                language: event.target.value as ReportFormValues["language"]
              }))
            }
          >
            {languageOptions.map((language) => (
              <option key={language}>{language}</option>
            ))}
          </select>

          <label className="field-label" htmlFor="age-range">
            Age range <span className="optional-label">optional</span>
          </label>
          <select
            id="age-range"
            value={values.ageRange ?? "Prefer not to say"}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                ageRange:
                  event.target.value === "Prefer not to say" ? undefined : event.target.value
              }))
            }
          >
            {ageRangeOptions.map((range) => (
              <option key={range}>{range}</option>
            ))}
          </select>

          <div className="privacy-note">
            <Shield size={18} />
            <p>More detail can improve matching, but aggregated dashboards never show individual pins.</p>
          </div>
        </div>

        <div className="form-panel form-panel--wide">
          <span className="field-label">Optional personal context</span>
          <div className="chip-grid chip-grid--wide">
            {personalContextOptions.map((context) => (
              <button
                key={context}
                className={
                  values.personalContext.includes(context) ? "chip chip--selected" : "chip"
                }
                type="button"
                onClick={() => toggleContext(context)}
              >
                {values.personalContext.includes(context) ? <Check size={15} /> : null}
                {context}
              </button>
            ))}
          </div>
          <button className="primary-action" type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="spin" size={18} /> : <Send size={18} />}
            {isSubmitting ? "Running context layer" : "Run context layer"}
          </button>
          {submitError ? <p className="form-status">{submitError}</p> : null}
        </div>
      </form>
    </section>
  );
}
