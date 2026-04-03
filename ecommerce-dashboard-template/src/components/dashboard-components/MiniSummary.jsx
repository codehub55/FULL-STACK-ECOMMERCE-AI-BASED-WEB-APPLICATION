import React from "react";
import {
  Wallet,
  PackageCheck,
  TrendingUp,
  AlertTriangle,
  BarChart4,
  UserPlus,
} from "lucide-react";
import { useSelector } from "react-redux";
import { formatNumber } from "../../lib/helper";

const MiniSummary = () => {
  const {
    currentMonthSales,
    todayRevenue,
    yesterdayRevenue,
    newUsersThisMonth,
  } = useSelector((state) => state.admin || {});

  const cards = [
    {
      title: "Today Revenue",
      value: `$${todayRevenue.toLocaleString()}`,
      icon: <Wallet className="w-5 h-5" />,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Yesterday Revenue",
      value: `$${yesterdayRevenue.toLocaleString()}`,
      icon: <PackageCheck className="w-5 h-5" />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "New Users",
      value: newUsersThisMonth,
      icon: <UserPlus className="w-5 h-5" />,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Monthly Sales",
      value: `$${formatNumber(currentMonthSales)}`,
      icon: <TrendingUp className="w-5 h-5" />,
      color: "bg-yellow-100 text-yellow-600",
    },
  ];

  return (
    <div className="bg-card p-4 rounded-xl shadow-md">
      <h3 className="font-semibold text-card-foreground mb-3">Mini Summary</h3>
      <div className="grid grid-cols-2 gap-3">
        {cards.map((card) => (
          <div
            key={card.title}
            className="border border-border rounded-lg p-3 flex items-center gap-3"
          >
            <div className={`p-2 rounded-md ${card.color}`}>{card.icon}</div>
            <div>
              <p className="text-sm text-muted-foreground">{card.title}</p>
              <p className="text-lg font-bold text-card-foreground">{card.value}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-3">
        Total revenue today and yesterday, plus user growth detail.
      </p>
    </div>
  );
};

export default MiniSummary;
