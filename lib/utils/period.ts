import { startOfDay, endOfDay, subDays, startOfMonth, endOfMonth, subMonths } from "date-fns";

export type Period = "today" | "yesterday" | "7days" | "thisMonth" | "lastMonth";

export const PERIODS: { key: Period; label: string }[] = [
  { key: "today", label: "Hôm nay" },
  { key: "yesterday", label: "Hôm qua" },
  { key: "7days", label: "7 ngày qua" },
  { key: "thisMonth", label: "Tháng này" },
  { key: "lastMonth", label: "Tháng trước" },
];

export function getPeriodRange(period: string): { from: Date; to: Date } {
  const now = new Date();
  switch (period) {
    case "today":
      return { from: startOfDay(now), to: endOfDay(now) };
    case "yesterday": {
      const y = subDays(now, 1);
      return { from: startOfDay(y), to: endOfDay(y) };
    }
    case "7days":
      return { from: startOfDay(subDays(now, 6)), to: endOfDay(now) };
    case "lastMonth": {
      const lm = subMonths(now, 1);
      return { from: startOfMonth(lm), to: endOfMonth(lm) };
    }
    case "thisMonth":
    default:
      return { from: startOfMonth(now), to: endOfMonth(now) };
  }
}
