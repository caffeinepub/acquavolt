import { Button } from "@/components/ui/button";
import { Droplets, Zap } from "lucide-react";
import { motion } from "motion/react";

interface Props {
  onSignUp: () => void;
  onLogin: () => void;
}

export default function WelcomeScreen({ onSignUp, onLogin }: Props) {
  return (
    <div className="flex flex-col min-h-screen px-6 pt-16 pb-12 bg-background">
      {/* Hero section */}
      <motion.div
        className="flex flex-col items-center text-center flex-1"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo icons */}
        <div className="relative flex items-center justify-center mb-8">
          <div className="w-24 h-24 rounded-3xl bg-accent flex items-center justify-center shadow-card">
            <div className="relative flex items-center gap-1">
              <Droplets className="w-9 h-9 text-primary" />
              <Zap className="w-7 h-7 text-warning" />
            </div>
          </div>
        </div>

        {/* App name */}
        <h1 className="text-4xl font-bold text-foreground tracking-tight mb-3">
          AquaVolt
        </h1>
        <h2 className="text-2xl font-semibold text-primary mb-4">Tracker</h2>
        <p className="text-muted-foreground text-base leading-relaxed max-w-xs">
          Monitor your daily water and electricity usage. Set goals, track
          progress, and build sustainable habits.
        </p>

        {/* Feature highlights */}
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

      {/* CTA buttons */}
      <motion.div
        className="space-y-3 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Button
          className="w-full h-13 text-base font-semibold rounded-full"
          onClick={onSignUp}
          data-ocid="welcome.primary_button"
        >
          Get Started
        </Button>
        <Button
          variant="outline"
          className="w-full h-13 text-base font-semibold rounded-full border-2"
          onClick={onLogin}
          data-ocid="welcome.secondary_button"
        >
          Sign In
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
    </div>
  );
}
