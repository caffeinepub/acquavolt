import { cn } from "@/lib/utils";
import { BarChart2, Droplets, Home, LogOut, Target } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import DashboardTab from "./tabs/DashboardTab";
import GoalsTab from "./tabs/GoalsTab";
import GraphTab from "./tabs/GraphTab";
import LogUsageTab from "./tabs/LogUsageTab";

type Tab = "dashboard" | "log" | "goals" | "graph";

const tabs = [
  { id: "dashboard" as Tab, label: "Home", icon: Home },
  { id: "log" as Tab, label: "Log", icon: Droplets },
  { id: "goals" as Tab, label: "Goals", icon: Target },
  { id: "graph" as Tab, label: "Graph", icon: BarChart2 },
];

export default function MainApp() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const { clear } = useInternetIdentity();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card border-b border-border px-5 py-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <Droplets className="w-4 h-4 text-primary" />
          </div>
          <span className="font-bold text-foreground text-base">AquaVolt</span>
        </div>
        <button
          type="button"
          onClick={clear}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors px-2 py-1 rounded-lg hover:bg-muted"
          data-ocid="nav.secondary_button"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign out
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-24">
        {activeTab === "dashboard" && <DashboardTab />}
        {activeTab === "log" && <LogUsageTab />}
        {activeTab === "goals" && <GoalsTab />}
        {activeTab === "graph" && <GraphTab />}
      </main>

      {/* Bottom tab navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-card border-t border-border flex items-stretch z-10 shadow-card">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1 py-3 px-1 transition-colors",
              activeTab === tab.id
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
            data-ocid={`nav.${tab.id}.tab`}
          >
            <tab.icon
              className={cn(
                "w-5 h-5 transition-all",
                activeTab === tab.id ? "scale-110" : "",
              )}
            />
            <span className="text-[10px] font-semibold">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
