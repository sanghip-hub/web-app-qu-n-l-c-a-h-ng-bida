import { getAllVenuesWithSession } from "@/lib/actions/sessions";
import VenueCard from "@/components/venue/VenueCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const venues = await getAllVenuesWithSession();

  const billiardVenues = venues.filter((v) => v.type === "BILLIARD");
  const courtVenues = venues.filter((v) => v.type === "COURT");

  const occupiedCount = venues.filter((v) => v.status === "OCCUPIED").length;
  const totalCount = venues.length;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sơ đồ bàn & sân</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {occupiedCount}/{totalCount} đang sử dụng
          </p>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span>Trống</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <span>Đang dùng</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-gray-300" />
            <span>Bảo trì</span>
          </div>
        </div>
      </div>

      {/* Billiard section */}
      {billiardVenues.length > 0 && (
        <section className="mb-8">
          <h2 className="text-base font-semibold text-gray-700 mb-3">🎱 Bàn bida</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {billiardVenues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        </section>
      )}

      {/* Court section */}
      {courtVenues.length > 0 && (
        <section>
          <h2 className="text-base font-semibold text-gray-700 mb-3">⚽ Sân thể thao</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {courtVenues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        </section>
      )}

      {venues.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">Chưa có bàn/sân nào</p>
          <p className="text-sm mt-1">Vào Cài đặt để thêm bàn/sân</p>
        </div>
      )}
    </div>
  );
}
