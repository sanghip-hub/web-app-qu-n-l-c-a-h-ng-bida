import { notFound, redirect } from "next/navigation";
import { getSessionWithOrder } from "@/lib/actions/orders";
import { getProducts } from "@/lib/actions/products";
import { getEquipment } from "@/lib/actions/equipment";
import SessionClient from "./SessionClient";

export const dynamic = "force-dynamic";

export default async function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [session, products, equipment] = await Promise.all([
    getSessionWithOrder(id),
    getProducts(),
    getEquipment(),
  ]);

  if (!session) notFound();
  if (session.endedAt) redirect("/");

  return (
    <SessionClient
      session={session}
      products={products}
      equipment={equipment}
    />
  );
}
