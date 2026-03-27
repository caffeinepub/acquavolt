import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useUserProfile } from "./hooks/useQueries";
import AuthScreen from "./pages/AuthScreen";
import MainApp from "./pages/MainApp";
import WelcomeScreen from "./pages/WelcomeScreen";

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const [view, setView] = useState<"welcome" | "app">("welcome");
  const { data: profile, isLoading: profileLoading } = useUserProfile();

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Authenticated + profile loaded
  if (identity && !profileLoading) {
    if (profile || view === "app") {
      return (
        <AppShell>
          <MainApp />
          <Toaster position="top-center" richColors />
        </AppShell>
      );
    }
    // Identity but no profile — complete setup (arrived directly, not via welcome)
    return (
      <AppShell>
        <AuthScreen onComplete={() => setView("app")} />
        <Toaster position="top-center" richColors />
      </AppShell>
    );
  }

  // Not authenticated — show welcome with inline auth dialog
  return (
    <AppShell>
      <WelcomeScreen onComplete={() => setView("app")} />
      <Toaster position="top-center" richColors />
    </AppShell>
  );
}

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex items-start justify-center">
      <div className="w-full max-w-[430px] min-h-screen relative bg-background shadow-xl">
        {children}
      </div>
    </div>
  );
}
