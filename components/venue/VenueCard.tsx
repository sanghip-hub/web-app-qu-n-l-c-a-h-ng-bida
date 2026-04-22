"use client";

import { useState } from "react";
import Link from "next/link";
import { formatVND } from "@/lib/utils/format";
import TimerDisplay from "@/components/shared/TimerDisplay";
import StartSessionModal from "./StartSessionModal";

type Venue = {
  id: string;
  name: string;
  type: string;
  hourlyRate: number;
  status: string;
  sessions: Array<{
    id: string;
    startedAt: Date;
    order: { totalAmount: number; items: unknown[] } | null;
  }>;
};

export default function VenueCard({ venue }: { venue: Venue }) {
  const [showStart, setShowStart] = useState(false);
  const activeSession = venue.sessions[0];

  const statusColor =
    venue.status === "AVAILABLE"
      ? "bg-green-50 border-green-200"
      : venue.status === "OCCUPIED"
      ? "bg-red-50 border-red-200"
      : "bg-gray-50 border-gray-200";

  const dotColor =
    venue.status === "AVAILABLE"
      ? "bg-green-400"
      : venue.status === "OCCUPIED"
      ? "bg-red-400"
      : "bg-gray-300";

  return (
    <>
      <div
        className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${statusColor}`}
        onClick={() => {
          if (venue.status === "AVAILABLE") setShowStart(true);
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-gray-800 text-sm">{venue.name}</span>
          <div className={`w-2.5 h-2.5 rounded-full ${dotColor}`} />
        </div>

        {activeSession ? (
          <Link
            href={`/session/${activeSession.id}`}
            onClick={(e) => e.stopPropagation()}
            className="block"
          >
            <TimerDisplay
              startedAt={activeSession.startedAt}
              hourlyRate={venue.hourlyRate}
              showAmount
              className="text-center"
            />
          </Link>
        ) : (
          <div className="text-center py-2">
            <p className="text-xs text-gray-400">
              {venue.status === "AVAILABLE" ? "Nhấn để mở" : "Bảo trì"}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{formatVND(venue.hourlyRate)}/giờ</p>
          </div>
        )}
      </div>

      {showStart && (
        <StartSessionModal
          venue={venue}
          open={showStart}
          onClose={() => setShowStart(false)}
        />
      )}
    </>
  );
}
