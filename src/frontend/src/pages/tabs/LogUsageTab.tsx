import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Droplets, Loader2, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAddLog, useGoals, useTodayLog } from "../../hooks/useQueries";

export default function LogUsageTab() {
  const { data: goals } = useGoals();
  const { data: todayLog } = useTodayLog();
  const addLog = useAddLog();

  const [water, setWater] = useState("");
  const [electricity, setElectricity] = useState("");

  useEffect(() => {
    if (todayLog) {
      setWater(String(todayLog.waterUsed));
      setElectricity(String(todayLog.electricityUsed));
    }
  }, [todayLog]);

  const dailyWaterLimit = goals ? goals.monthlyWaterFlow / 30 : 0;
  const dailyElecLimit = goals ? goals.monthlyElectricityUsage / 30 : 0;

  const handleSubmit = async () => {
    const waterVal = Number.parseFloat(water) || 0;
    const elecVal = Number.parseFloat(electricity) || 0;

    const today = new Date().toISOString().split("T")[0];

    try {
      await addLog.mutateAsync({
        date: today,
        waterUsed: waterVal,
        electricityUsed: elecVal,
      });

      const waterExceeds = dailyWaterLimit > 0 && waterVal > dailyWaterLimit;
      const elecExceeds = dailyElecLimit > 0 && elecVal > dailyElecLimit;

      if (waterExceeds || elecExceeds) {
        const exceeded = [waterExceeds && "water", elecExceeds && "electricity"]
          .filter(Boolean)
          .join(" & ");
        toast.warning(`⚠️ You're over your daily limit for ${exceeded}!`);
      } else {
        toast.success("✅ You're maintaining your limit. Keep it up!");
      }
    } catch {
      toast.error("Failed to log usage. Please try again.");
    }
  };

  return (
    <div className="px-5 py-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold text-foreground">Log Usage</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Record your usage for today
        </p>
      </motion.div>

      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {/* Water input */}
        <div className="bg-card rounded-xl p-4 border border-border shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <Droplets className="w-4 h-4 text-primary" />
            </div>
            <Label
              htmlFor="water"
              className="text-sm font-semibold text-foreground"
            >
              Water Used
            </Label>
          </div>
          <Input
            id="water"
            type="number"
            min="0"
            step="0.1"
            placeholder="0.0"
            value={water}
            onChange={(e) => setWater(e.target.value)}
            className="h-12 rounded-xl text-base"
            data-ocid="log.input"
          />
          <p className="text-xs text-muted-foreground">
            Liters · Daily limit:{" "}
            <span className="font-semibold text-foreground">
              {dailyWaterLimit > 0
                ? `${dailyWaterLimit.toFixed(1)} L`
                : "Not set"}
            </span>
          </p>
        </div>

        {/* Electricity input */}
        <div className="bg-card rounded-xl p-4 border border-border shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center">
              <Zap className="w-4 h-4 text-warning" />
            </div>
            <Label
              htmlFor="electricity"
              className="text-sm font-semibold text-foreground"
            >
              Electricity Used
            </Label>
          </div>
          <Input
            id="electricity"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={electricity}
            onChange={(e) => setElectricity(e.target.value)}
            className="h-12 rounded-xl text-base"
            data-ocid="log.textarea"
          />
          <p className="text-xs text-muted-foreground">
            kWh · Daily limit:{" "}
            <span className="font-semibold text-foreground">
              {dailyElecLimit > 0
                ? `${dailyElecLimit.toFixed(2)} kWh`
                : "Not set"}
            </span>
          </p>
        </div>

        <Button
          className="w-full h-12 text-base font-semibold rounded-full"
          onClick={handleSubmit}
          disabled={addLog.isPending}
          data-ocid="log.submit_button"
        >
          {addLog.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
            </>
          ) : (
            "Save Today's Usage"
          )}
        </Button>

        {addLog.isSuccess && (
          <div
            className="text-center text-sm text-success font-medium"
            data-ocid="log.success_state"
          >
            Usage logged successfully!
          </div>
        )}
      </motion.div>
    </div>
  );
}
