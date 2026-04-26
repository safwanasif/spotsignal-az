import { useEffect, useMemo, useState } from "react";
import {
  Bot,
  CheckCircle2,
  HeartPulse,
  LifeBuoy,
  ShieldCheck,
  Sparkles,
  Wind,
  X
} from "lucide-react";

interface CalmConnectOverlayProps {
  onClose: () => void;
}

const breathPhases = [
  { label: "Breathe in", seconds: 4 },
  { label: "Hold gently", seconds: 2 },
  { label: "Breathe out", seconds: 6 }
];

const groundingSteps = [
  "Name one neutral thing you can see near you.",
  "Drop your shoulders and let your jaw rest.",
  "Read the uncertainty before deciding what the signal means.",
  "Choose one next step, not five."
];

const calmingPrompts = [
  "Look at the ring and let your breathing set the pace.",
  "A signal is information. It is not a verdict.",
  "The strongest public health action here is careful review.",
  "You can pause. The app will still be here."
];

export function CalmConnectOverlay({ onClose }: CalmConnectOverlayProps) {
  const [elapsed, setElapsed] = useState(0);
  const cycleLength = useMemo(
    () => breathPhases.reduce((total, phase) => total + phase.seconds, 0),
    []
  );
  const cycleSecond = elapsed % cycleLength;
  let phaseOffset = 0;
  const activePhase =
    breathPhases.find((phase) => {
      const isActive = cycleSecond >= phaseOffset && cycleSecond < phaseOffset + phase.seconds;
      phaseOffset += phase.seconds;
      return isActive;
    }) ?? breathPhases[0];
  const resetProgress = Math.min(Math.round((elapsed / 60) * 100), 100);
  const groundingStep = groundingSteps[Math.min(Math.floor(elapsed / 15), groundingSteps.length - 1)];
  const calmingPrompt =
    calmingPrompts[Math.min(Math.floor(elapsed / 15), calmingPrompts.length - 1)];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setElapsed((current) => (current >= 60 ? 60 : current + 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="calm-overlay" role="dialog" aria-modal="true" aria-labelledby="calm-title">
      <div className="calm-panel">
        <button className="calm-close" type="button" onClick={onClose} aria-label="Close CalmConnect">
          <X size={18} />
        </button>

        <div className="calm-layout">
          <div className="calm-visual">
            <div className="calm-orbit" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div className="breath-ring" aria-label={`Breathing prompt: ${activePhase.label}`}>
              <Wind size={34} />
              <span>{activePhase.label}</span>
            </div>
            <div className="calm-progress" aria-label={`Calm reset ${resetProgress}% complete`}>
              <span style={{ width: `${resetProgress}%` }} />
            </div>
            <strong>{elapsed >= 60 ? "Reset complete" : "60-second reset"}</strong>
            <p>
              Follow the ring. The goal is not to ignore the signal; it is to respond from a steadier
              place.
            </p>
            <span className="calm-interaction-hint">{calmingPrompt}</span>
          </div>

          <div className="calm-copy">
            <span className="eyebrow">CalmConnect</span>
            <h2 id="calm-title">Pause before the signal becomes a story in your head.</h2>
            <p>
              SpotSignal is an early-warning context layer. It can flag patterns for review, but it
              does not diagnose you, blame a place, or declare an outbreak.
            </p>

            <div className="calm-bot-card">
              <div className="calm-bot-card__avatar">
                <Bot size={24} />
              </div>
              <div>
                <span>CalmConnect guide</span>
                <p>{calmingPrompt}</p>
              </div>
            </div>

            <div className="calm-meaning-box">
              <article>
                <CheckCircle2 size={18} />
                <span>This means</span>
                <p>Your report shares features with a pattern that may deserve careful review.</p>
              </article>
              <article>
                <X size={18} />
                <span>This does not mean</span>
                <p>You have a specific disease, or that the place you visited caused illness.</p>
              </article>
            </div>

            <div className="calm-reassurance-strip">
              <span>Most reports are watch notes, not emergencies.</span>
              <span>Reviewers see uncertainty before any action.</span>
              <span>You can change how much location detail you share.</span>
            </div>
          </div>
        </div>

        <div className="calm-guidance-grid">
          <article>
            <Sparkles size={18} />
            <span>Grounding check</span>
            <p>{groundingStep}</p>
          </article>
          <article>
            <ShieldCheck size={18} />
            <span>You stay in control</span>
            <p>You choose exact, approximate, county-only, or no location sharing.</p>
          </article>
          <article>
            <HeartPulse size={18} />
            <span>Next careful step</span>
            <p>Review factors and uncertainty. Contact care or emergency help if symptoms feel urgent.</p>
          </article>
          <article>
            <LifeBuoy size={18} />
            <span>Public health promise</span>
            <p>AI only flags weak signals. Human reviewers decide whether action is needed.</p>
          </article>
        </div>

        <small className="calm-credit">
          CalmConnect gives steady prompts only. It does not replace medical or emergency care.
        </small>
      </div>
    </div>
  );
}
