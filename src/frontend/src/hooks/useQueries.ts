import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { DailyLog, UsageGoals, UserProfile } from "../backend";
import { useActor } from "./useActor";

export function useUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGoals() {
  const { actor, isFetching } = useActor();
  return useQuery<UsageGoals>({
    queryKey: ["goals"],
    queryFn: async () => {
      if (!actor) return { monthlyWaterFlow: 0, monthlyElectricityUsage: 0 };
      return actor.getGoals();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useTodayLog() {
  const { actor, isFetching } = useActor();
  return useQuery<DailyLog | null>({
    queryKey: ["todayLog"],
    queryFn: async () => {
      if (!actor) return null;
      const today = new Date().toISOString().split("T")[0];
      // Pass today's date to ensure correct log is fetched
      return (actor as any).getTodayLog(today);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLogsForMonth(year: number, month: number) {
  const { actor, isFetching } = useActor();
  return useQuery<DailyLog[]>({
    queryKey: ["logsForMonth", year, month],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLogsForMonth(BigInt(year), BigInt(month));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not connected");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

export function useSetGoals() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (goals: UsageGoals) => {
      if (!actor) throw new Error("Not connected");
      return actor.setGoals(goals);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });
}

export function useAddLog() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      date,
      waterUsed,
      electricityUsed,
    }: {
      date: string;
      waterUsed: number;
      electricityUsed: number;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addOrUpdateDailyLog(date, waterUsed, electricityUsed);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todayLog"] });
      queryClient.invalidateQueries({ queryKey: ["logsForMonth"] });
    },
  });
}
