import { getRevenueReport } from "@/lib/actions/reports";
import ReportsClient from "./ReportsClient";
import { startOfMonth, endOfMonth } from "date-fns";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const now = new Date();
  const from = startOfMonth(now);
  const to = endOfMonth(now);

  const data = await getRevenueReport(from, to);

  return <ReportsClient data={data} defaultFrom={from} defaultTo={to} />;
}
