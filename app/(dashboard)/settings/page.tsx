import { getVenues } from "@/lib/actions/venues";
import SettingsClient from "./SettingsClient";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const venues = await getVenues();
  return <SettingsClient venues={venues} />;
}
