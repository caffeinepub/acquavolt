import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface DailyLog {
    date: string;
    waterUsed: number;
    electricityUsed: number;
}
export interface UserProfile {
    name: string;
}
export interface UsageGoals {
    monthlyWaterFlow: number;
    monthlyElectricityUsage: number;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addOrUpdateDailyLog(date: string, waterUsed: number, electricityUsed: number): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getGoals(): Promise<UsageGoals>;
    getLogsForMonth(year: bigint, month: bigint): Promise<Array<DailyLog>>;
    getTodayLog(): Promise<DailyLog | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setGoals(goals: UsageGoals): Promise<void>;
}
