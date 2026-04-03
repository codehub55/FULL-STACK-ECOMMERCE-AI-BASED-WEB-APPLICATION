import React from "react";
import { useSelector } from "react-redux";

const ProductsTable = () => {
  const { products, loading } = useSelector((state) => state.admin || {});

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading products...</p>;
  }

  if (!products || products.length === 0) {
    return <p className="text-sm text-muted-foreground">No products found.</p>;
  }

  return (
    <div className="bg-card p-4 rounded-xl shadow-md mt-4">
      <h3 className="text-lg font-semibold text-card-foreground mb-3">Products</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Price</th>
              <th className="px-3 py-2 text-left">Stock</th>
              <th className="px-3 py-2 text-left">Created</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id || product._id} className="border-b border-gray-100">
                <td className="px-3 py-2">{product.name || "-"}</td>
                <td className="px-3 py-2">${product.price?.toFixed?.(2) || product.price || "0.00"}</td>
                <td className="px-3 py-2">{product.stock ?? "-"}</td>
                <td className="px-3 py-2">
                  {product.created_at
                    ? new Date(product.created_at).toLocaleDateString()
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

export default ProductsTable;
