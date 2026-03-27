import { Skeleton } from "@/components/ui/skeleton";
import { Droplets, Target, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useGoals, useUserProfile } from "../../hooks/useQueries";

const waterTips = [
  {
    tip: "Turn off the tap while brushing your teeth.",
    saving: "Saves ~8 L per minute",
  },
  {
    tip: "Fix leaky faucets promptly — a small drip wastes thousands of liters a year.",
    saving: "Saves up to 20,000 L/year",
  },
  {
    tip: "Take shorter showers instead of baths.",
    saving: "Saves ~50 L per shower",
  },
  {
    tip: "Run the dishwasher only when it's full.",
    saving: "Saves ~20 L per load",
  },
  {
    tip: "Water plants in the early morning to reduce evaporation.",
    saving: "Saves ~30% water",
  },
  {
    tip: "Use a bucket instead of a hose to wash your car.",
    saving: "Saves ~150 L per wash",
  },
];

const electricityTips = [
  {
    tip: "Unplug chargers and devices when not in use — standby mode still draws power.",
    saving: "Saves up to 10% on bills",
  },
  {
    tip: "Switch to LED bulbs — they use 75% less energy than incandescent lights.",
    saving: "Saves ~75% lighting cost",
  },
  {
    tip: "Set your AC or heater 1–2°C closer to the outside temperature.",
    saving: "Saves ~6% per degree",
  },
  {
    tip: "Use a power strip to cut power to multiple devices at once.",
    saving: "Eliminates phantom loads",
  },
  {
    tip: "Wash clothes in cold water — heating water accounts for 90% of washing machine energy.",
    saving: "Saves ~90% per wash",
  },
  {
    tip: "Open curtains during the day for natural light instead of turning on lights.",
    saving: "Saves lighting energy",
  },
];

export default function DashboardTab() {
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const { data: goals, isLoading: goalsLoading } = useGoals();

  const isLoading = profileLoading || goalsLoading;

  const hasGoals =
    !!goals &&
    (Number(goals.monthlyWaterFlow) > 0 ||
      Number(goals.monthlyElectricityUsage) > 0);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="px-5 py-6 space-y-6">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-sm text-muted-foreground">{today}</p>
        {profileLoading ? (
          <Skeleton className="h-8 w-40 mt-1" />
        ) : (
          <h2 className="text-2xl font-bold text-foreground mt-0.5">
            Hi, {profile?.name ?? "there"} 👋
          </h2>
        )}
      </motion.div>

      {/* No goals prompt */}
      {!isLoading && !hasGoals && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-accent rounded-xl p-4 border border-border flex items-center gap-3"
          data-ocid="dashboard.empty_state"
        >
          <Target className="w-8 h-8 text-primary flex-shrink-0" />
          <div>
            <p className="font-semibold text-sm text-foreground">
              Set your monthly goals
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Go to the Goals tab to configure your limits.
            </p>
          </div>
        </motion.div>
      )}

      {/* Water saving tips */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="space-y-3"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
            <Droplets className="w-4 h-4 text-primary" />
          </div>
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
            Tips to Save Water
          </h3>
        </div>
        <div className="space-y-2">
          {waterTips.map((item, i) => (
            <motion.div
              key={item.tip}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="bg-card rounded-xl p-4 border border-border shadow-xs"
            >
              <p className="text-sm text-foreground leading-snug">{item.tip}</p>
              <p className="text-xs text-primary font-medium mt-1">
                {item.saving}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Electricity saving tips */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-yellow-50 flex items-center justify-center">
            <Zap className="w-4 h-4 text-warning" />
          </div>
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
            Tips to Save Electricity
          </h3>
        </div>
        <div className="space-y-2">
          {electricityTips.map((item, i) => (
            <motion.div
              key={item.tip}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.05 }}
              className="bg-card rounded-xl p-4 border border-border shadow-xs"
            >
              <p className="text-sm text-foreground leading-snug">{item.tip}</p>
              <p className="text-xs text-warning font-medium mt-1">
                {item.saving}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
