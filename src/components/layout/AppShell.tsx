import {
  Activity,
  BarChart3,
  ClipboardList,
  DatabaseZap,
  FileText,
  HeartPulse,
  Home,
  Map,
  ShieldCheck
} from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { CalmConnectOverlay } from "../ui/CalmConnectOverlay";

export type AppView =
  | "home"
  | "report"
  | "result"
  | "map"
  | "dashboard"
  | "review"
  | "data-sources"
  | "model-card";

interface NavItem {
  id: AppView;
  label: string;
  icon: ReactNode;
  audience: "all" | "reviewer";
}

const navItems: NavItem[] = [
  { id: "home", label: "Home", icon: <Home size={18} />, audience: "all" },
  { id: "report", label: "Demo Intake", icon: <ClipboardList size={18} />, audience: "all" },
  { id: "result", label: "Personal Signal", icon: <HeartPulse size={18} />, audience: "all" },
  { id: "map", label: "GeoSignal Map", icon: <Map size={18} />, audience: "all" },
  { id: "dashboard", label: "Dashboard", icon: <BarChart3 size={18} />, audience: "reviewer" },
  { id: "review", label: "Review Queue", icon: <ShieldCheck size={18} />, audience: "reviewer" },
  { id: "data-sources", label: "Data Sources", icon: <DatabaseZap size={18} />, audience: "reviewer" },
  { id: "model-card", label: "Model Card", icon: <FileText size={18} />, audience: "reviewer" }
];

interface AppShellProps {
  activeView: AppView;
  onViewChange: (view: AppView) => void;
  showCalmConnect: boolean;
  onOpenCalmConnect: () => void;
  onCloseCalmConnect: () => void;
  children: ReactNode;
}

export function AppShell({
  activeView,
  onViewChange,
  showCalmConnect,
  onOpenCalmConnect,
  onCloseCalmConnect,
  children
}: AppShellProps) {
  const [audienceMode, setAudienceMode] = useState<"resident" | "reviewer">("resident");
  const visibleNavItems =
    audienceMode === "resident"
      ? navItems.filter((item) => item.audience === "all")
      : navItems;

  function changeAudienceMode(mode: "resident" | "reviewer") {
    setAudienceMode(mode);
    if (mode === "resident" && navItems.find((item) => item.id === activeView)?.audience === "reviewer") {
      onViewChange("home");
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Main navigation">
        <div className="brand">
          <div className="brand__mark">
            <Activity size={24} />
          </div>
          <div>
            <h1>SpotSignal AZ</h1>
            <p>GeoExposure Risk Radar</p>
          </div>
        </div>

        <div className="sidebar-kicker">
          <span>Arizona prototype</span>
          <strong>AI context layer, not the intake system.</strong>
        </div>

        <div className="mode-toggle" aria-label="Audience mode">
          <button
            className={audienceMode === "resident" ? "mode-toggle__button mode-toggle__button--active" : "mode-toggle__button"}
            type="button"
            onClick={() => changeAudienceMode("resident")}
          >
            Resident
          </button>
          <button
            className={audienceMode === "reviewer" ? "mode-toggle__button mode-toggle__button--active" : "mode-toggle__button"}
            type="button"
            onClick={() => changeAudienceMode("reviewer")}
          >
            Reviewer
          </button>
        </div>

        <nav className="nav-list">
          {visibleNavItems.map((item) => (
            <button
              key={item.id}
              className={item.id === activeView ? "nav-item nav-item--active" : "nav-item"}
              type="button"
              aria-current={item.id === activeView ? "page" : undefined}
              onClick={() => onViewChange(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <button
          className="sidebar-note sidebar-note--button"
          type="button"
          onClick={onOpenCalmConnect}
        >
          <strong>
            <HeartPulse size={16} />
            CalmConnect
          </strong>
          <p>Feeling anxious? Use this 60-second reset before reading a signal.</p>
        </button>
      </aside>

      <main className="main-content">
        <div className="mission-strip">
          <div className="mission-strip__copy">
            <span>Participatory surveillance</span>
            <strong>Enhance incoming self-reports with context.</strong>
          </div>
          <div className="mission-strip__signals" aria-label="Product guardrails">
            <span>
              <ShieldCheck size={16} />
              Human reviewed
            </span>
            <span>
              <Map size={16} />
              Aggregated zones
            </span>
            <span>
              <Activity size={16} />
              Not a diagnosis
            </span>
          </div>
        </div>
        {children}
      </main>

      {showCalmConnect ? (
        <CalmConnectOverlay onClose={onCloseCalmConnect} />
      ) : null}
    </div>
  );
}
