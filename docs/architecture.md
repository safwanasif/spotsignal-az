# Technical Architecture

## Prototype Shape

SpotSignal AZ is scoped as the AI context and risk-profile layer around incoming participatory self-reports. It is not a replacement for Arizona's planned statewide self-reporting intake system. The frontend form in the prototype is a demo adapter that simulates the report packet SpotSignal would receive from that system.

## Main Modules

- `src/features/report`: demo incoming-report adapter with symptoms, image upload, privacy controls, language choice.
- `src/features/personal-result`: personal risk signal, explanation, contributing factors, calm next steps.
- `src/features/geosignal-map`: Pima County zone visualization and zone detail panels.
- `src/features/public-health-dashboard`: aggregate trends, cluster summaries, time-series cards.
- `src/features/human-review`: reviewer queue, alert reasons, confidence, action states.
- `src/features/model-card`: model purpose, inputs, outputs, limitations, bias, privacy, oversight.
- `src/features/calm-connect`: non-alarming guidance, care escalation language, optional support prompts.

## Service Adapters

- `src/services/ai`: Gemini-powered image category classification and explanation generation with mock fallback.
- `src/services/weather`: NOAA/National Weather Service context for temperature, humidity, rain/showers, heat risk, and vector suitability with mock fallback.
- `src/services/epydemix`: Epydemix Arizona demographic and contact-matrix data for setting-specific contact context with local fallback.
- `src/services/places`: place lookup or local dropdown-to-exposure mapping.
- `src/services/risk`: deterministic scoring and clustering logic for the demo.

## Data Strategy

The hackathon MVP should use synthetic reports and mock Pima County zones. Real APIs can be added as context providers without requiring private health data or replacing the planned intake system.

Current external context providers:

- NOAA/NWS for weather.
- Epydemix for Arizona demographic and contact-pattern context.
- Gemini for AI explanation and optional image categorization when a local key is configured.

## Human Oversight

The system should never declare an outbreak. It should produce signals, explanations, uncertainty labels, and review recommendations for human public health reviewers.
