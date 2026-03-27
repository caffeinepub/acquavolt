import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Droplets, Loader2, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useSaveProfile, useUserProfile } from "../hooks/useQueries";

interface Props {
  onComplete: () => void;
}

type AuthMode = "signin" | "signup";

export default function WelcomeScreen({ onComplete }: Props) {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("signup");
  const { login, isLoggingIn, identity } = useInternetIdentity();
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const saveProfile = useSaveProfile();
  const [name, setName] = useState("");

  const showNameSetup =
    identity && !profileLoading && !profile && authMode === "signup";
  const identityHasNoProfile = identity && !profileLoading && !profile;
  const identityHasProfile = identity && !profileLoading && profile;

  const openDialog = (mode: AuthMode) => {
    setAuthMode(mode);
    setShowAuthDialog(true);
  };

  const handleSaveName = async () => {
    if (!name.trim()) return;
    try {
      await saveProfile.mutateAsync({ name: name.trim() });
      toast.success(`Welcome, ${name.trim()}!`);
      setShowAuthDialog(false);
      onComplete();
    } catch {
      toast.error("Failed to save profile. Please try again.");
    }
  };

  if (showAuthDialog && authMode === "signin" && identityHasProfile) {
    onComplete();
  }

  const showNoAccountWarning =
    showAuthDialog && authMode === "signin" && identityHasNoProfile;

  return (
    <div className="flex flex-col min-h-screen px-6 pt-16 pb-12 bg-background">
      <motion.div
        className="flex flex-col items-center text-center flex-1"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative flex items-center justify-center mb-8">
          <div className="w-24 h-24 rounded-3xl bg-accent flex items-center justify-center shadow-card">
            <div className="relative flex items-center gap-1">
              <Droplets className="w-9 h-9 text-primary" />
              <Zap className="w-7 h-7 text-warning" />
            </div>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-foreground tracking-tight mb-4">
          AquaVolt
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed max-w-xs">
          Monitor your daily water and electricity usage. Set goals, track
          progress, and build sustainable habits.
        </p>
        <div className="mt-10 w-full space-y-3">
          {[
            {
              icon: Droplets,
              color: "text-primary",
              bg: "bg-accent",
              label: "Track water consumption",
              sub: "Set daily & monthly targets",
            },
            {
              icon: Zap,
              color: "text-warning",
              bg: "bg-yellow-50",
              label: "Monitor electricity usage",
              sub: "Stay under your limits",
            },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              className="flex items-center gap-4 bg-card rounded-xl p-4 shadow-xs border border-border"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <div
                className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center flex-shrink-0`}
              >
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm text-foreground">
                  {item.label}
                </p>
                <p className="text-xs text-muted-foreground">{item.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="space-y-3 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Button
          className="w-full h-13 text-base font-semibold rounded-full"
          onClick={() => openDialog("signup")}
          data-ocid="welcome.primary_button"
        >
          Create Account
        </Button>
        <Button
          variant="outline"
          className="w-full h-13 text-base font-semibold rounded-full border-2"
          onClick={() => openDialog("signin")}
          data-ocid="welcome.secondary_button"
        >
          I already have an account
        </Button>
      </motion.div>

      <p className="text-center text-xs text-muted-foreground mt-6">
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          className="text-primary hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          caffeine.ai
        </a>
      </p>

      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="max-w-sm mx-auto rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center shadow-card mb-2 mx-auto">
              <div className="flex items-center gap-1">
                <Droplets className="w-6 h-6 text-primary" />
                <Zap className="w-4 h-4 text-warning" />
              </div>
            </div>
            <DialogTitle className="text-xl font-bold">
              {authMode === "signup"
                ? showNameSetup
                  ? "One last step!"
                  : "Create your account"
                : "Welcome back"}
            </DialogTitle>
            <p className="text-muted-foreground text-sm">
              {authMode === "signup"
                ? showNameSetup
                  ? "What should we call you?"
                  : "Set up your AquaVolt account."
                : "Sign in to your AquaVolt account."}
            </p>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            {authMode === "signup" ? (
              showNameSetup ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="dialog-username"
                      className="text-sm font-semibold"
                    >
                      Your Name
                    </Label>
                    <Input
                      id="dialog-username"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                      className="h-12 rounded-xl text-base"
                      data-ocid="auth.input"
                    />
                  </div>
                  <Button
                    className="w-full h-12 text-base font-semibold rounded-full"
                    onClick={handleSaveName}
                    disabled={!name.trim() || saveProfile.isPending}
                    data-ocid="auth.submit_button"
                  >
                    {saveProfile.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                        Saving...
                      </>
                    ) : (
                      "Get Started"
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Button
                    className="w-full h-12 text-base font-semibold rounded-full"
                    onClick={login}
                    disabled={isLoggingIn}
                    data-ocid="auth.primary_button"
                  >
                    {isLoggingIn ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                        Connecting...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    Already have an account?{" "}
                    <button
                      type="button"
                      className="text-primary font-semibold hover:underline"
                      onClick={() => setAuthMode("signin")}
                    >
                      Sign In
                    </button>
                  </p>
                </div>
              )
            ) : (
              <div className="space-y-3">
                {showNoAccountWarning && (
                  <div className="bg-destructive/10 border border-destructive/30 rounded-xl px-4 py-3">
                    <p className="text-sm text-destructive font-medium">
                      No account found. Please create one instead.
                    </p>
                  </div>
                )}
                <Button
                  className="w-full h-12 text-base font-semibold rounded-full"
                  onClick={login}
                  disabled={isLoggingIn}
                  data-ocid="auth.primary_button"
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing
                      in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    className="text-primary font-semibold hover:underline"
                    onClick={() => setAuthMode("signup")}
                  >
                    Create one
                  </button>
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
