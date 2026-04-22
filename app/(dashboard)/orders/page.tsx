import { getRecentOrders } from "@/lib/actions/orders";
import { formatVND } from "@/lib/utils/format";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const orders = await getRecentOrders(100);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Lịch sử đơn hàng</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p>Chưa có đơn hàng nào</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Bàn/Sân</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Thời gian</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Thanh toán</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Tổng tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{order.session.venue.name}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {order.paidAt
                      ? format(new Date(order.paidAt), "dd/MM/yyyy HH:mm", { locale: vi })
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      order.paymentMethod === "CASH"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}>
                      {order.paymentMethod === "CASH" ? "Tiền mặt" : "Chuyển khoản"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-green-600">
                    {formatVND(order.totalAmount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
