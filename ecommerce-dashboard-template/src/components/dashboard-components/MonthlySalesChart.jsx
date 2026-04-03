import { useSelector } from "react-redux";
import {
  XAxis,
  YAxis,
  LineChart,
  Line,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const MonthlySalesChart = () => {
  const { monthlySales } = useSelector((state) => state.admin || {});

  const data = (monthlySales || []).map((item) => ({
    month: item.month,
    sales: Number(item.totalsales || 0),
  }));

  if (!data.length) {
    return (
      <div className="bg-card p-4 rounded-xl shadow-md">
        <h3 className="font-semibold text-card-foreground mb-2">Monthly Sales</h3>
        <p className="text-sm text-muted-foreground">No sales data yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-card p-4 rounded-xl shadow-md">
      <h3 className="font-semibold text-card-foreground mb-2">Monthly Sales</h3>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
          <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlySalesChart;
