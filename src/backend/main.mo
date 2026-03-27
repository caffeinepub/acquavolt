import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Float "mo:core/Float";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import List "mo:core/List";
import Int "mo:core/Int";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type DailyLog = {
    date : Text;
    waterUsed : Float;
    electricityUsed : Float;
  };

  module DailyLog {
    public func compare(log1 : DailyLog, log2 : DailyLog) : Order.Order {
      Text.compare(log1.date, log2.date);
    };
  };

  type UsageGoals = {
    monthlyWaterFlow : Float;
    monthlyElectricityUsage : Float;
  };

  type YearMonth = {
    year : Nat;
    month : Nat;
  };

  module YearMonth {
    public func compare(a : YearMonth, b : YearMonth) : Order.Order {
      switch (Nat.compare(a.year, b.year)) {
        case (#equal) { Nat.compare(a.month, b.month) };
        case (order) { order };
      };
    };
  };

  let userGoals = Map.empty<Principal, UsageGoals>();
  let userLogs = Map.empty<Principal, Map.Map<YearMonth, Map.Map<Nat, DailyLog>>>();

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get their profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func setGoals(goals : UsageGoals) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can set goals");
    };
    userGoals.add(caller, goals);
  };

  public query ({ caller }) func getGoals() : async UsageGoals {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view goals");
    };
    switch (userGoals.get(caller)) {
      case (?goals) { goals };
      case (null) {
        {
          monthlyWaterFlow = 0.0;
          monthlyElectricityUsage = 0.0;
        };
      };
    };
  };

  public shared ({ caller }) func addOrUpdateDailyLog(date : Text, waterUsed : Float, electricityUsed : Float) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can log usage");
    };
    let (year, month, day) = parseDate(date);
    let log : DailyLog = {
      date;
      waterUsed;
      electricityUsed;
    };

    let monthKey = { year; month };

    let userLog = switch (userLogs.get(caller)) {
      case (?existing) { existing };
      case (null) { Map.empty<YearMonth, Map.Map<Nat, DailyLog>>() };
    };

    let monthLog = switch (userLog.get(monthKey)) {
      case (?existing) {
        existing.add(day, log);
        existing;
      };
      case (null) {
        let newDayMap = Map.empty<Nat, DailyLog>();
        newDayMap.add(day, log);
        userLog.add(monthKey, newDayMap);
        newDayMap;
      };
    };

    userLogs.add(caller, userLog);
  };

  public query ({ caller }) func getLogsForMonth(year : Nat, month : Nat) : async [DailyLog] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view logs");
    };
    switch (userLogs.get(caller)) {
      case (?userLog) {
        switch (userLog.get({ year; month })) {
          case (?monthLog) {
            monthLog.values().toArray().sort();
          };
          case (null) { [] };
        };
      };
      case (null) { [] };
    };
  };

  public query ({ caller }) func getTodayLog() : async ?DailyLog {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view logs");
    };
    let today = getCurrentDate();
    let (year, month, day) = parseDate(today);
    let monthKey = { year; month };

    switch (userLogs.get(caller)) {
      case (?userLog) {
        switch (userLog.get(monthKey)) {
          case (?monthLog) { monthLog.get(day) };
          case (null) { null };
        };
      };
      case (null) { null };
    };
  };

  func toTextPadded(number : Nat) : Text {
    let text = number.toText();
    if (text.size() == 2) {
      text;
    } else {
      "0" # text;
    };
  };

  func getCurrentDate() : Text {
    let now = Time.now();
    let daysSinceEpoch = Int.abs(now / 86_400_000_000_000);
    let currentYear = 2000 + Int.abs(daysSinceEpoch / 365);
    let dayOfYear = daysSinceEpoch % 365;
    let currentMonth = 1 + Int.abs(dayOfYear / 30);
    let currentDay = 1 + Int.abs(dayOfYear % 30);

    currentYear.toNat().toText() # "-" # toTextPadded(currentMonth.toNat()) # "-" # toTextPadded(currentDay.toNat());
  };

  func parseDate(date : Text) : (Nat, Nat, Nat) {
    let parts = date.split(#char '-').toArray();
    if (parts.size() != 3) return (0, 1, 1);

    let year = switch (parts[0].toNat()) {
      case (?v) { v };
      case (null) { 0 };
    };
    let month = switch (parts[1].toNat()) {
      case (?v) { v };
      case (null) { 1 };
    };
    let day = switch (parts[2].toNat()) {
      case (?v) { v };
      case (null) { 1 };
    };
    (year, month, day);
  };
};
