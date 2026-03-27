import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Droplets, Target, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useGoals, useTodayLog, useUserProfile } from "../../hooks/useQueries";

export default function DashboardTab() {
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const { data: goals, isLoading: goalsLoading } = useGoals();
  const { data: todayLog, isLoading: logLoading } = useTodayLog();

  const isLoading = profileLoading || goalsLoading || logLoading;

  const dailyWaterLimit = goals ? goals.monthlyWaterFlow / 30 : 0;
  const dailyElecLimit = goals ? goals.monthlyElectricityUsage / 30 : 0;

  const waterUsed = todayLog?.waterUsed ?? 0;
  const elecUsed = todayLog?.electricityUsed ?? 0;

  const hasGoals =
    goals && (goals.monthlyWaterFlow > 0 || goals.monthlyElectricityUsage > 0);
  const hasLog = !!todayLog;

  const waterExceeds =
    hasGoals && dailyWaterLimit > 0 && waterUsed > dailyWaterLimit;
  const elecExceeds =
    hasGoals && dailyElecLimit > 0 && elecUsed > dailyElecLimit;
  const anyExceeds = waterExceeds || elecExceeds;

  const waterPct =
    dailyWaterLimit > 0
      ? Math.min((waterUsed / dailyWaterLimit) * 100, 100)
      : 0;
  const elecPct =
    dailyElecLimit > 0 ? Math.min((elecUsed / dailyElecLimit) * 100, 100) : 0;

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="px-5 py-6 space-y-5">
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

      {/* Notification banner */}
      {!isLoading && hasGoals && hasLog && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className={`rounded-xl px-4 py-3 flex items-center gap-3 ${
            anyExceeds
              ? "bg-orange-50 border border-orange-200"
              : "bg-green-50 border border-green-200"
          }`}
          data-ocid="dashboard.card"
        >
          <span className="text-xl">{anyExceeds ? "⚠️" : "✅"}</span>
          <div>
            <p
              className={`text-sm font-semibold ${
                anyExceeds ? "text-orange-700" : "text-green-700"
              }`}
            >
              {anyExceeds
                ? "You're exceeding your daily limit!"
                : "Great job! You're within your limits."}
            </p>
            <p
              className={`text-xs mt-0.5 ${
                anyExceeds ? "text-orange-600" : "text-green-600"
              }`}
            >
              {anyExceeds
                ? `Exceeded: ${waterExceeds ? "Water" : ""} ${
                    waterExceeds && elecExceeds ? "& " : ""
                  }${elecExceeds ? "Electricity" : ""}`
                : "You are maintaining your limit. Keep it up!"}
            </p>
          </div>
        </motion.div>
      )}

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

      {/* Today's summary cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Today's Usage
        </h3>

        {isLoading ? (
          <>
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-28 w-full rounded-xl" />
          </>
        ) : (
          <>
            {/* Water card */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-card rounded-xl p-4 border border-border shadow-xs"
              data-ocid="dashboard.water.card"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                    <Droplets className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Water
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Daily limit:{" "}
                      {dailyWaterLimit > 0
                        ? `${dailyWaterLimit.toFixed(1)} L`
                        : "Not set"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-foreground">
                    {waterUsed.toFixed(1)}
                  </p>
                  <p className="text-xs text-muted-foreground">Liters</p>
                </div>
              </div>
              {hasGoals && dailyWaterLimit > 0 && (
                <div className="space-y-1">
                  <Progress value={waterPct} className="h-2" />
                  <p className="text-xs text-right text-muted-foreground">
                    {waterPct.toFixed(0)}% of daily limit
                  </p>
                </div>
              )}
            </motion.div>

            {/* Electricity card */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-xl p-4 border border-border shadow-xs"
              data-ocid="dashboard.electricity.card"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Electricity
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Daily limit:{" "}
                      {dailyElecLimit > 0
                        ? `${dailyElecLimit.toFixed(2)} kWh`
                        : "Not set"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-foreground">
                    {elecUsed.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">kWh</p>
                </div>
              </div>
              {hasGoals && dailyElecLimit > 0 && (
                <div className="space-y-1">
                  <Progress
                    value={elecPct}
                    className="h-2 [&>div]:bg-warning"
                  />
                  <p className="text-xs text-right text-muted-foreground">
                    {elecPct.toFixed(0)}% of daily limit
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
