import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useUserProfile } from "./hooks/useQueries";
import AuthScreen from "./pages/AuthScreen";
import MainApp from "./pages/MainApp";
import WelcomeScreen from "./pages/WelcomeScreen";

type AppView = "welcome" | "auth" | "app";

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const [view, setView] = useState<AppView>("welcome");
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

  // If authenticated and profile loaded, show main app
  if (identity && !profileLoading) {
    // If no profile, auth screen will handle name setup, then go to app
    if (profile || view === "app") {
      return (
        <AppShell>
          <MainApp />
          <Toaster position="top-center" richColors />
        </AppShell>
      );
    }
    // Identity but no profile — show auth to complete setup
    return (
      <AppShell>
        <AuthScreen onComplete={() => setView("app")} />
        <Toaster position="top-center" richColors />
      </AppShell>
    );
  }

  if (view === "welcome") {
    return (
      <AppShell>
        <WelcomeScreen
          onSignUp={() => setView("auth")}
          onLogin={() => setView("auth")}
        />
        <Toaster position="top-center" richColors />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <AuthScreen onComplete={() => setView("app")} />
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
