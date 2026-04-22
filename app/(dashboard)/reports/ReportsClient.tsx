"use client";

import { formatVND } from "@/lib/utils/format";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

type Session = {
  id: string;
  endedAt: Date | null;
  venue: { name: string; type: string };
  order: { totalAmount: number } | null;
};

interface Props {
  data: {
    totalRevenue: number;
    totalSessions: number;
    timeRevenue: number;
    productRevenue: number;
    equipmentRevenue: number;
    topProducts: Array<{ name: string; qty: number; amount: number }>;
    sessions: Session[];
  };
  defaultFrom: Date;
  defaultTo: Date;
}

export default function ReportsClient({ data }: Props) {
  const { totalRevenue, totalSessions, timeRevenue, productRevenue, equipmentRevenue, topProducts } = data;

  const chartData = [
    { name: "Tiền giờ", value: timeRevenue },
    { name: "Bán hàng", value: productRevenue },
    { name: "Dụng cụ", value: equipmentRevenue },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Báo cáo doanh thu</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-xl p-4">
          <p className="text-sm text-gray-500">Tổng doanh thu</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{formatVND(totalRevenue)}</p>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <p className="text-sm text-gray-500">Số phiên</p>
          <p className="text-2xl font-bold mt-1">{totalSessions}</p>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <p className="text-sm text-gray-500">Tiền giờ</p>
          <p className="text-2xl font-bold mt-1">{formatVND(timeRevenue)}</p>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <p className="text-sm text-gray-500">Bán hàng + dụng cụ</p>
          <p className="text-2xl font-bold mt-1">{formatVND(productRevenue + equipmentRevenue)}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white border rounded-xl p-6">
        <h2 className="text-base font-semibold mb-4">Phân bổ doanh thu</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
            <Tooltip formatter={(v: number) => formatVND(v)} />
            <Bar dataKey="value" fill="#16a34a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top products */}
      {topProducts.length > 0 && (
        <div className="bg-white border rounded-xl p-6">
          <h2 className="text-base font-semibold mb-4">Top sản phẩm</h2>
          <div className="space-y-2">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center justify-between text-sm">
                <span className="text-gray-500 w-6">{i + 1}.</span>
                <span className="flex-1">{p.name}</span>
                <span className="text-gray-400 mx-4">×{p.qty}</span>
                <span className="font-medium">{formatVND(p.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
