"use client";

import { useEffect, useState } from "react";
import { formatDuration, formatVND, calcTimeAmount } from "@/lib/utils/format";

interface Props {
  startedAt: Date | string;
  hourlyRate: number;
  showAmount?: boolean;
  className?: string;
}

export default function TimerDisplay({ startedAt, hourlyRate, showAmount, className }: Props) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = new Date(startedAt).getTime();
    const tick = () => setElapsed(Date.now() - start);
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startedAt]);

  const amount = calcTimeAmount(new Date(startedAt), new Date(), hourlyRate);

  return (
    <div className={className}>
      <div className="text-3xl font-mono font-bold tabular-nums tracking-wider">
        {formatDuration(elapsed)}
      </div>
      {showAmount && (
        <div className="text-xl font-semibold text-green-600 mt-1">
          {formatVND(amount)}
        </div>
      )}
    </div>
  );
}
