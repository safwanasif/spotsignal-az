# SpotSignal AZ

AI-powered GeoExposure Risk Radar for Arizona.

SpotSignal AZ is a privacy-preserving AI context layer prototype for the Participatory Surveillance Risk Challenge. It does not replace Arizona's planned statewide self-reporting intake system; the prototype intake form simulates the kind of self-reported data that system would send into SpotSignal. SpotSignal combines symptoms, optional image context, recent places visited, weather/vector context, community trends, and human review into explainable personal and community risk signals.

## Core Demo Flow

1. Demo intake simulates an incoming self-report packet with symptoms, start date, recent place, privacy level, and optional image.
2. AI classifies the optional image into broad, non-diagnostic categories.
3. Risk engine enriches the report packet with exposure context, weather, Arizona contact context, and mock community trends.
4. Personal result explains the signal calmly and clearly.
5. GeoSignal Map highlights zone-level trends across Pima County.
6. Public health dashboard summarizes aggregate patterns.
7. Human review queue flags clusters that deserve review.
8. Model card documents purpose, limitations, privacy, bias, and review thresholds.

## Folder Structure

```txt
spotsignal-az/
  docs/
    architecture.md
    demo-script.md
    design-system.md
    model-card.md
  public/
    data/
    images/
  src/
    app/
    components/
      charts/
      layout/
      ui/
    data/
    features/
      calm-connect/
      geosignal-map/
      human-review/
      model-card/
      personal-result/
      public-health-dashboard/
      report/
    lib/
    services/
      ai/
      places/
      risk/
      weather/
    styles/
    types/
  tests/
```

## Build Priorities

1. Make the Sabino Canyon bite-cluster storyline work end to end.
2. Make clear that SpotSignal is the intelligence layer around incoming reports, not the statewide intake system.
3. Keep language non-diagnostic and uncertainty-aware.
4. Use calm colors and calm interaction patterns.
5. Show privacy controls as a core product feature.
6. Make AI explainability visible in both user and reviewer views.

## API Setup

The prototype now includes live adapters with mock fallback:

- Gemini API for optional image categorization and calm risk explanations.
- Gemma model audit pass for threshold reason, uncertainty, missing data, and reviewer next step when configured.
- NOAA/National Weather Service API for forecast context by Arizona place coordinates.
- Epydemix GitHub data for Arizona demographic structure and contact matrices by setting.

Create a local `.env.local` file and add a Google AI Studio key:

```txt
VITE_GEMINI_API_KEY=your_key_here
VITE_GEMINI_MODEL=gemini-3-flash-preview
VITE_GEMMA_MODEL=gemma-4-31b-it
```

NOAA/NWS does not require an API key. If Gemini, Gemma, or NOAA is unavailable, SpotSignal falls back to local mock services so the demo keeps working.

Epydemix data is fetched from the public `epistorm/epydemix-data` GitHub repository. SpotSignal currently uses `United_States_Arizona` `mistry_2021` contact matrices for home, work, school, community, and all-setting contact context. If the fetch fails, the app uses a local contact-pattern fallback.

For production, Gemini calls should move behind a server-side API route so the API key is not exposed in the browser. This client-side key is intended for local hackathon prototyping only.

## Data Sources Used

- Self-reported synthetic symptom reports for the hackathon demo.
- Mock Pima County community trend data.
- NOAA/National Weather Service forecast context.
- Epydemix Arizona demographic and contact-matrix data.
- Gemini-generated explanations and optional image context when configured.
