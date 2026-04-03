import React from "react";
import { useSelector } from "react-redux";

const TopSellingProducts = () => {
  const { topSellingProducts } = useSelector((state) => state.admin || {});

  if (!topSellingProducts || topSellingProducts.length === 0) {
    return (
      <div className="bg-card p-4 rounded-xl shadow-md">
        <h3 className="font-semibold text-card-foreground mb-2">Top Products</h3>
        <p className="text-sm text-muted-foreground">No top products yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-card p-4 rounded-xl shadow-md">
      <h3 className="font-semibold text-card-foreground mb-2">Top Selling Products Table</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Category</th>
              <th className="px-3 py-2 text-left">Total Sold</th>
            </tr>
          </thead>
          <tbody>
            {topSellingProducts.map((product, index) => (
              <tr key={`${product.name}-${index}`} className="border-b border-gray-100">
                <td className="px-3 py-2">{product.name}</td>
                <td className="px-3 py-2">{product.category || "-"}</td>
                <td className="px-3 py-2">{product.total_sold}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopSellingProducts;
