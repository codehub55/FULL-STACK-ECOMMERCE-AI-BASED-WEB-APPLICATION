import React from "react";
import { useSelector } from "react-redux";

const OrdersTable = () => {
  const { orders, loading } = useSelector((state) => state.admin || {});

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading orders...</p>;
  }

  if (!orders || orders.length === 0) {
    return <p className="text-sm text-muted-foreground">No orders found.</p>;
  }

  return (
    <div className="bg-card p-4 rounded-xl shadow-md mt-4">
      <h3 className="text-lg font-semibold mb-3">Orders</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left">Order ID</th>
              <th className="px-3 py-2 text-left">User</th>
              <th className="px-3 py-2 text-left">Total</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Created</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id || order._id} className="border-b border-gray-100">
                <td className="px-3 py-2">{order.id || order._id || "-"}</td>
                <td className="px-3 py-2">{order.user_id || order.user?.name || "-"}</td>
                <td className="px-3 py-2">${order.total_price?.toFixed?.(2) || order.total_price || "0.00"}</td>
                <td className="px-3 py-2">{order.order_status || order.status || "-"}</td>
                <td className="px-3 py-2">
                  {order.created_at
                    ? new Date(order.created_at).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;
