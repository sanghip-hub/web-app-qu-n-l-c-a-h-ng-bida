import { getRecentOrders } from "@/lib/actions/orders";
import { getPeriodRange } from "@/lib/utils/period";
import OrdersClient from "./OrdersClient";

export const dynamic = "force-dynamic";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const { period = "today" } = await searchParams;
  const { from, to } = getPeriodRange(period);
  const orders = await getRecentOrders(200, from, to);

  return <OrdersClient orders={orders as any} period={period} />;
}
