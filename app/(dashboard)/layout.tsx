import Link from "next/link";
import { LayoutGrid, Package, Wrench, ClipboardList, BarChart2, Settings } from "lucide-react";

const navItems = [
  { href: "/", icon: LayoutGrid, label: "Sơ đồ" },
  { href: "/products", icon: Package, label: "Sản phẩm" },
  { href: "/equipment", icon: Wrench, label: "Dụng cụ" },
  { href: "/orders", icon: ClipboardList, label: "Đơn hàng" },
  { href: "/reports", icon: BarChart2, label: "Báo cáo" },
  { href: "/settings", icon: Settings, label: "Cài đặt" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-16 bg-gray-900 flex flex-col items-center py-4 gap-1">
        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mb-4 text-xl">
          🎱
        </div>
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            title={label}
            className="w-12 h-12 flex flex-col items-center justify-center gap-0.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <Icon size={20} />
            <span className="text-[9px] leading-none">{label}</span>
          </Link>
        ))}
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
