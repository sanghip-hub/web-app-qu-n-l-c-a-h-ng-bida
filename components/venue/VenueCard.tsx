"use client";

import { useState } from "react";
import Link from "next/link";
import TimerDisplay from "@/components/shared/TimerDisplay";
import StartSessionModal from "@/components/venue/StartSessionModal";

type VenueSession = {
  id: string;
  startedAt: Date;
  order: { totalAmount: number } | null;
};

type VenueWithSession = {
  id: string;
  name: string;
  type: string;
  status: string;
  hourlyRate: number;
  sessions: VenueSession[];
};

interface Props {
  venue: VenueWithSession;
}

export default function VenueCard({ venue }: Props) {
  const [showModal, setShowModal] = useState(false);
  const activeSession = venue.sessions[0];
  const isOccupied = venue.status === "OCCUPIED";
  const isMaintenance = venue.status === "MAINTENANCE";

  const borderClass = isOccupied
    ? "bg-red-50 border-red-200 hover:border-red-300"
    : isMaintenance
    ? "bg-gray-50 border-gray-200 cursor-default"
    : "bg-green-50 border-green-200 hover:border-green-300";

  const dotColor = isOccupied ? "bg-red-400" : isMaintenance ? "bg-gray-300" : "bg-green-400";

  const cardContent = (
    <div className={`p-4 rounded-xl border-2 transition-colors ${borderClass}`}>
      <div className="flex items-start justify-between mb-1">
        <h3 className="font-semibold text-gray-800 text-sm leading-tight">{venue.name}</h3>
        <div className={`w-2.5 h-2.5 rounded-full mt-0.5 flex-shrink-0 ${dotColor}`} />
      </div>
      <p className="text-xs text-gray-400 mb-3">
        {venue.type === "BILLIARD" ? "🎱 Bida" : "⚽ Sân"}
      </p>

      {isOccupied && activeSession ? (
        <TimerDisplay
          startedAt={activeSession.startedAt}
          hourlyRate={venue.hourlyRate}
          showAmount
          className="text-center"
        />
      ) : isMaintenance ? (
        <p className="text-xs text-gray-400 text-center py-3">Bảo trì</p>
      ) : (
        <p className="text-xs text-green-600 text-center py-3 font-medium">Nhấn để mở</p>
      )}
    </div>
  );

  if (isOccupied && activeSession) {
    return (
      <Link href={`/session/${activeSession.id}`} className="block cursor-pointer">
        {cardContent}
      </Link>
    );
  }

  if (venue.status === "AVAILABLE") {
    return (
      <>
        <div onClick={() => setShowModal(true)} className="cursor-pointer">
          {cardContent}
        </div>
        {showModal && (
          <StartSessionModal
            venue={venue}
            open={showModal}
            onClose={() => setShowModal(false)}
          />
        )}
      </>
    );
  }

  return cardContent;
}
