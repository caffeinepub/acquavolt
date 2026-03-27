import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Droplets, Loader2, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useGoals, useSetGoals } from "../../hooks/useQueries";

export default function GoalsTab() {
  const { data: goals, isLoading } = useGoals();
  const setGoals = useSetGoals();

  const [waterGoal, setWaterGoal] = useState("");
  const [elecGoal, setElecGoal] = useState("");

  useEffect(() => {
    if (goals) {
      if (goals.monthlyWaterFlow > 0)
        setWaterGoal(String(goals.monthlyWaterFlow));
      if (goals.monthlyElectricityUsage > 0)
        setElecGoal(String(goals.monthlyElectricityUsage));
    }
  }, [goals]);

  const dailyWater = waterGoal
    ? (Number.parseFloat(waterGoal) / 30).toFixed(1)
    : "—";
  const dailyElec = elecGoal
    ? (Number.parseFloat(elecGoal) / 30).toFixed(2)
    : "—";

  const handleSave = async () => {
    const monthlyWaterFlow = Number.parseFloat(waterGoal) || 0;
    const monthlyElectricityUsage = Number.parseFloat(elecGoal) || 0;
    try {
      await setGoals.mutateAsync({ monthlyWaterFlow, monthlyElectricityUsage });
      toast.success("Goals saved successfully!");
    } catch {
      toast.error("Failed to save goals. Please try again.");
    }
  };

  return (
    <div className="px-5 py-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold text-foreground">Monthly Goals</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Set your target usage for the month
        </p>
      </motion.div>

      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {/* Water goal */}
        <div className="bg-card rounded-xl p-4 border border-border shadow-xs space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <Droplets className="w-4 h-4 text-primary" />
            </div>
            <Label
              htmlFor="water-goal"
              className="text-sm font-semibold text-foreground"
            >
              Monthly Water Goal
            </Label>
          </div>
          <Input
            id="water-goal"
            type="number"
            min="0"
            step="1"
            placeholder="e.g. 3000"
            value={waterGoal}
            onChange={(e) => setWaterGoal(e.target.value)}
            disabled={isLoading}
            className="h-12 rounded-xl text-base"
            data-ocid="goals.input"
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Liters per month</p>
            <p className="text-xs font-semibold text-primary">
              Daily: {dailyWater} L
            </p>
          </div>
        </div>

        {/* Electricity goal */}
        <div className="bg-card rounded-xl p-4 border border-border shadow-xs space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center">
              <Zap className="w-4 h-4 text-warning" />
            </div>
            <Label
              htmlFor="elec-goal"
              className="text-sm font-semibold text-foreground"
            >
              Monthly Electricity Goal
            </Label>
          </div>
          <Input
            id="elec-goal"
            type="number"
            min="0"
            step="0.1"
            placeholder="e.g. 150"
            value={elecGoal}
            onChange={(e) => setElecGoal(e.target.value)}
            disabled={isLoading}
            className="h-12 rounded-xl text-base"
            data-ocid="goals.textarea"
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">kWh per month</p>
            <p className="text-xs font-semibold text-warning">
              Daily: {dailyElec} kWh
            </p>
          </div>
        </div>

        <Button
          className="w-full h-12 text-base font-semibold rounded-full"
          onClick={handleSave}
          disabled={setGoals.isPending || isLoading}
          data-ocid="goals.submit_button"
        >
          {setGoals.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
            </>
          ) : (
            "Save Goals"
          )}
        </Button>

        {setGoals.isSuccess && (
          <div
            className="text-center text-sm text-success font-medium"
            data-ocid="goals.success_state"
          >
            Goals saved!
          </div>
        )}
      </motion.div>
    </div>
  );
}
