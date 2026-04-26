# Model Card

## Model Purpose

SpotSignal AZ generates non-diagnostic risk signals from self-reported health data, optional image categories, place/exposure context, weather context, and aggregate community trends.

## Intended Use

- Help individuals understand why a report may match nearby patterns.
- Help public health reviewers identify clusters that may deserve human review.
- Support explainable, privacy-preserving participatory surveillance in Arizona.

## Not Intended For

- Medical diagnosis
- Emergency triage
- Declaring outbreaks
- Proving that a place caused illness
- Individual tracking or enforcement

## Inputs

- Symptoms
- Symptom start date
- Optional image of visible mark
- Recent places or place categories
- Exposure context
- Optional personal context
- Privacy level
- Language preference
- Weather/environmental context
- Aggregate community trends
- Epydemix demographic and contact-pattern context

## Outputs

- Personal signal level
- Community signal level
- Contributing factors
- Plain-language explanation
- Reviewer summary
- Human review recommendation

## Human Review

The AI can flag suspicious patterns, but a human reviewer must interpret, confirm, and decide any public health response.

## Privacy

Users can choose exact place, approximate neighborhood, county only, or no location. Dashboards should use aggregated zones, not individual pins.

## Bias and Limitations

- Crowdsourced reports may overrepresent users with better internet access.
- Image categories may be less reliable across skin tones, lighting, and camera quality.
- Location correlation does not prove causation.
- Synthetic hackathon data does not represent real outbreak conditions.
- Low reporting volume can hide real signals.
- Epydemix Arizona contact matrices describe broad population interaction patterns, not individual behavior or real-time case counts.

## Future Improvements

- Calibrate risk thresholds with public health experts.
- Evaluate image categorization across diverse skin tones and lighting.
- Add multilingual community testing.
- Integrate vetted public health and environmental data feeds.
- Improve rural and low-connectivity reporting options.
