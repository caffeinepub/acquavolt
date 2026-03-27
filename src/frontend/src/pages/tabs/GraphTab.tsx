import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Droplets, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useGoals, useLogsForMonth } from "../../hooks/useQueries";

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function GraphTab() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1); // 1-indexed

  const { data: logs, isLoading } = useLogsForMonth(year, month);
  const { data: goals } = useGoals();

  const dailyWaterLimit = goals ? goals.monthlyWaterFlow / 30 : 0;
  const dailyElecLimit = goals ? goals.monthlyElectricityUsage / 30 : 0;

  const prevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  };

  const chartData =
    logs
      ?.map((log) => ({
        day: Number.parseInt(log.date.split("-")[2]),
        water: log.waterUsed,
        electricity: log.electricityUsed,
      }))
      .sort((a, b) => a.day - b.day) ?? [];

  return (
    <div className="px-5 py-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold text-foreground">Usage Graph</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Monthly usage overview
        </p>
      </motion.div>

      {/* Month selector */}
      <motion.div
        className="flex items-center justify-between bg-card rounded-xl px-4 py-3 border border-border shadow-xs"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={prevMonth}
          className="w-8 h-8 rounded-lg"
          data-ocid="graph.pagination_prev"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="font-semibold text-foreground">
          {MONTH_NAMES[month - 1]} {year}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={nextMonth}
          className="w-8 h-8 rounded-lg"
          data-ocid="graph.pagination_next"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </motion.div>

      {isLoading ? (
        <>
          <Skeleton className="h-52 w-full rounded-xl" />
          <Skeleton className="h-52 w-full rounded-xl" />
        </>
      ) : chartData.length === 0 ? (
        <motion.div
          className="flex flex-col items-center justify-center py-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          data-ocid="graph.empty_state"
        >
          <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mb-4">
            <BarChart className="w-8 h-8 text-primary" />
          </div>
          <p className="font-semibold text-foreground">No data yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Log your usage to see your monthly graph
          </p>
        </motion.div>
      ) : (
        <>
          {/* Water chart */}
          <motion.div
            className="bg-card rounded-xl p-4 border border-border shadow-xs"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
                <Droplets className="w-3.5 h-3.5 text-primary" />
              </div>
              <p className="font-semibold text-sm text-foreground">
                Water (Liters)
              </p>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart
                data={chartData}
                margin={{ top: 4, right: 4, left: -24, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.91 0.01 240)"
                />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(v: number) => [`${v.toFixed(1)} L`, "Water"]}
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                />
                {dailyWaterLimit > 0 && (
                  <ReferenceLine
                    y={dailyWaterLimit}
                    stroke="oklch(0.58 0.22 27)"
                    strokeDasharray="4 4"
                    label={{
                      value: "Limit",
                      position: "insideTopRight",
                      fontSize: 9,
                    }}
                  />
                )}
                <Bar
                  dataKey="water"
                  fill="oklch(0.67 0.12 185)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Electricity chart */}
          <motion.div
            className="bg-card rounded-xl p-4 border border-border shadow-xs"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-yellow-50 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-warning" />
              </div>
              <p className="font-semibold text-sm text-foreground">
                Electricity (kWh)
              </p>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart
                data={chartData}
                margin={{ top: 4, right: 4, left: -24, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.91 0.01 240)"
                />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(v: number) => [
                    `${v.toFixed(2)} kWh`,
                    "Electricity",
                  ]}
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                />
                {dailyElecLimit > 0 && (
                  <ReferenceLine
                    y={dailyElecLimit}
                    stroke="oklch(0.58 0.22 27)"
                    strokeDasharray="4 4"
                    label={{
                      value: "Limit",
                      position: "insideTopRight",
                      fontSize: 9,
                    }}
                  />
                )}
                <Bar
                  dataKey="electricity"
                  fill="oklch(0.75 0.17 62)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </>
      )}
    </div>
  );
}
