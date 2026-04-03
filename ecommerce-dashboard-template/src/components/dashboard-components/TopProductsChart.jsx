import { useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const TopProductsChart = () => {
  const { topSellingProducts } = useSelector((state) => state.admin || {});

  if (!topSellingProducts || topSellingProducts.length === 0) {
    return (
      <div className="bg-card p-4 rounded-xl shadow-md">
        <h3 className="font-semibold text-card-foreground mb-2">Top Selling Products</h3>
        <p className="text-sm text-muted-foreground">No product sales data found yet.</p>
      </div>
    );
  }

  const chartData = topSellingProducts.map((product) => ({
    name: product.name,
    units: Number(product.total_sold || 0),
  }));

  return (
    <div className="bg-card p-4 rounded-xl shadow-md">
      <h3 className="font-semibold text-card-foreground mb-2">Top Selling Products</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={chartData} layout="vertical">
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" width={130} />
          <Tooltip />
          <Bar dataKey="units" radius={[6, 6, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopProductsChart;
