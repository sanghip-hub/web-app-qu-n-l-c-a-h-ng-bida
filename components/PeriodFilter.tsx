"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { PERIODS } from "@/lib/utils/period";

interface Props {
  current: string;
  fromParam?: string;
  toParam?: string;
}

export default function PeriodFilter({ current, fromParam, toParam }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [from, setFrom] = useState(fromParam ?? "");
  const [to, setTo] = useState(toParam ?? "");

  function applyCustomRange() {
    if (!from || !to) return;
    router.push(`${pathname}?period=custom&from=${from}&to=${to}`);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 flex-wrap">
        {PERIODS.map((p) => (
          <button
            key={p.key}
            onClick={() => router.push(`${pathname}?period=${p.key}`)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              current === p.key
                ? "bg-green-600 text-white"
                : "bg-white border text-gray-600 hover:bg-gray-50"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2 items-center flex-wrap">
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="border rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <span className="text-gray-400 text-sm">đến</span>
        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="border rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={applyCustomRange}
          disabled={!from || !to}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
            current === "custom"
              ? "bg-green-600 text-white border-green-600"
              : "bg-white text-gray-600 hover:bg-gray-50"
          } disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          Xem
        </button>
      </div>
    </div>
  );
}
