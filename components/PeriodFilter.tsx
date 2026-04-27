"use client";

import { useRouter, usePathname } from "next/navigation";
import { PERIODS, type Period } from "@/lib/utils/period";

export default function PeriodFilter({ current }: { current: string }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
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
  );
}
