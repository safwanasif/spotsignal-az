import type { SignalLevel } from "../../types/domain";
import { signalLabels } from "../../lib/signal";

interface SignalBadgeProps {
  level: SignalLevel;
}

export function SignalBadge({ level }: SignalBadgeProps) {
  return <span className={`signal-badge signal-${level}`}>{signalLabels[level]}</span>;
}
