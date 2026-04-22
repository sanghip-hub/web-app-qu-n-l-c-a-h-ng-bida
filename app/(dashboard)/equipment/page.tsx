import { getAllEquipment } from "@/lib/actions/equipment";
import EquipmentClient from "./EquipmentClient";

export const dynamic = "force-dynamic";

export default async function EquipmentPage() {
  const equipment = await getAllEquipment();
  return <EquipmentClient equipment={equipment} />;
}
