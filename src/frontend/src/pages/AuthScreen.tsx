import { Button } from "@/components/ui/button";
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

export default function AuthScreen({ onComplete }: Props) {
  const { login, isLoggingIn, identity } = useInternetIdentity();
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const saveProfile = useSaveProfile();
  const [name, setName] = useState("");

  const handleSaveName = async () => {
    if (!name.trim()) return;
    try {
      await saveProfile.mutateAsync({ name: name.trim() });
      toast.success(`Welcome, ${name.trim()}!`);
      onComplete();
    } catch {
      toast.error("Failed to save profile. Please try again.");
    }
  };

  // If identity but no profile yet, show name setup
  const showNameSetup = identity && !profileLoading && !profile;

  return (
    <div className="flex flex-col h-screen overflow-y-auto px-6 pt-16 pb-12 bg-background">
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Logo */}
        <div className="w-20 h-20 rounded-2xl bg-accent flex items-center justify-center shadow-card mb-6">
          <div className="flex items-center gap-1">
            <Droplets className="w-7 h-7 text-primary" />
            <Zap className="w-5 h-5 text-warning" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-2">
          {showNameSetup ? "Almost there!" : "Welcome back"}
        </h1>
        <p className="text-muted-foreground text-sm text-center mb-8">
          {showNameSetup
            ? "Set your display name to get started."
            : "Sign in to continue to AquaVolt."}
        </p>
      </motion.div>

      {showNameSetup ? (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-semibold">
              Your Name
            </Label>
            <Input
              id="username"
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
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
              </>
            ) : (
              "Continue to App"
            )}
          </Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-card rounded-2xl p-6 border border-border shadow-card mb-4">
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
          </div>
        </motion.div>
      )}
    </div>
  );
}
