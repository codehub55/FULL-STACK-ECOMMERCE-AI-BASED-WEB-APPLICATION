import React from "react";
import { useSelector } from "react-redux";

const Stats = () => {
  const {
    revenueGrowth,
    orderStatusCounts,
    totalUsersCount,
    lowStockProducts,
  } = useSelector((state) => state.admin || {});

  return (
    <div className="bg-card p-4 rounded-xl shadow-md">
      <h3 className="font-semibold text-card-foreground mb-3">Key Metrics</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="border border-border rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Revenue Growth</p>
          <p className="text-xl font-bold text-green-600">{revenueGrowth || "0%"}</p>
        </div>
        <div className="border border-border rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Pending Orders</p>
          <p className="text-xl font-bold text-card-foreground">{orderStatusCounts?.Processing || 0}</p>
        </div>
        <div className="border border-gray-100 rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Delivered Orders</p>
          <p className="text-xl font-bold text-card-foreground">{orderStatusCounts?.Delivered || 0}</p>
        </div>
        <div className="border border-border rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Low Stock Items</p>
          <p className="text-xl font-bold text-card-foreground">{lowStockProducts || 0}</p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-3">
        Total users: {totalUsersCount || 0}.
      </p>
    </div>
  );
};

export default Stats;
