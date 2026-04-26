import type { SignalLevel } from "../types/domain";

export const signalLabels: Record<SignalLevel, string> = {
  low: "Low signal",
  mild: "Mild increase",
  watch: "Cluster watch",
  review: "Human review recommended"
};

export const signalDescriptions: Record<SignalLevel, string> = {
  low: "Reports are close to expected baseline.",
  mild: "A small increase is visible, but the pattern remains limited.",
  watch: "Similar reports are rising enough to monitor closely.",
  review: "The pattern should be reviewed by a human public health reviewer."
};

export function scoreToSignal(score: number): SignalLevel {
  if (score >= 78) return "review";
  if (score >= 55) return "watch";
  if (score >= 32) return "mild";
  return "low";
}

export function formatPercent(value: number): string {
  return `${value > 0 ? "+" : ""}${value}%`;
}
