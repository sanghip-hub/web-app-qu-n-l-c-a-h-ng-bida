import { getRevenueReport } from "@/lib/actions/reports";
import { getPeriodRange } from "@/lib/utils/period";
import ReportsClient from "./ReportsClient";

export const dynamic = "force-dynamic";

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const { period = "thisMonth" } = await searchParams;
  const { from, to } = getPeriodRange(period);
  const data = await getRevenueReport(from, to);

  return <ReportsClient data={data} period={period} />;
}
