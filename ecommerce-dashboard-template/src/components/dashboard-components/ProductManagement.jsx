import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  createProductAdmin,
  fetchAllProducts,
  updateProductAdmin,
  deleteProductAdmin,
  clearAdminMessages,
} from "../../store/slices/adminSlice";

const ProductManagement = () => {
  const dispatch = useDispatch();
  const { products, totalProducts, loading, error, successMessage } = useSelector(
    (state) => state.admin || {}
  );

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [images, setImages] = useState([]);
  const [submitError, setSubmitError] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);
  const [page, setPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchAllProducts(page));
  }, [dispatch, page]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAdminMessages());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearAdminMessages());
    }
  }, [error, successMessage, dispatch]);

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setCategory("");
    setStock("");
    setImages([]);
    setEditingProductId(null);
    setSubmitError(null);
  };

  const submitProduct = async (e) => {
    e.preventDefault();

    if (!name || !description || !price || !category || !stock) {
      setSubmitError("Please fill in all required fields.");
      return;
    }

    setSubmitError(null);

    const payload = {
      name,
      description,
      price,
      category,
      stock,
      images,
    };

    const action = editingProductId
      ? updateProductAdmin({ productId: editingProductId, ...payload })
      : createProductAdmin(payload);

    dispatch(action)
      .unwrap()
      .then(() => {
        toast.success(editingProductId ? "Product updated" : "Product created");
        resetForm();
        dispatch(fetchAllProducts(page));
      })
      .catch((submitError) => {
        setSubmitError(submitError || "Operation failed.");
      });
  };

  const startEdit = (product) => {
    setEditingProductId(product.id || product._id);
    setName(product.name || "");
    setDescription(product.description || "");
    setPrice(product.price || "");
    setCategory(product.category || "");
    setStock(product.stock || "");
    setImages([]);
    setSubmitError(null);
  };

  const requestDelete = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!productToDelete) return;

    dispatch(deleteProductAdmin(productToDelete.id || productToDelete._id))
      .unwrap()
      .then(() => {
        toast.success("Product deleted.");
        setShowDeleteModal(false);
        setProductToDelete(null);
        dispatch(fetchAllProducts(page));
      })
      .catch((deleteError) => {
        toast.error(deleteError || "Delete failed");
      });
  };

  const pages = Math.ceil((totalProducts || 0) / 10) || 1;

  return (
    <div className="glass-panel">
      <h3 className="text-2xl font-semibold mb-4">Product Management</h3>

      <form onSubmit={submitProduct} className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-1">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
            placeholder="Product name"
            required
          />
        </div>

        <div className="lg:col-span-1">
          <label className="block text-sm font-medium mb-1">Category</label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
            placeholder="Category"
            required
          />
        </div>

        <div className="lg:col-span-1">
          <label className="block text-sm font-medium mb-1">Price</label>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            min="0"
            step="0.01"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
            placeholder="Price"
            required
          />
        </div>

        <div className="lg:col-span-2">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
            placeholder="Product description"
            rows={3}
            required
          />
        </div>

        <div className="lg:col-span-1">
          <label className="block text-sm font-medium mb-1">Stock</label>
          <input
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            type="number"
            min="0"
            className="w-full rounded-lg border border-white/20 bg-black/20 px-3 py-2 text-white"
            placeholder="Stock"
            required
          />
        </div>

        <div className="lg:col-span-2">
          <label className="block text-sm font-medium mb-1">Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setImages(Array.from(e.target.files || []))}
            className="w-full text-white"
          />
          <p className="text-xs text-sky-200 mt-1">You can upload multiple images for a product.</p>
        </div>

        <div className="lg:col-span-3 flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="button-primary"
          >
            {editingProductId ? "Save Changes" : "Create Product"}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10"
          >
            Reset
          </button>
        </div>
      </form>

      {submitError && <p className="text-red-300 mb-4">{submitError}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Price</th>
              <th className="px-3 py-2">Stock</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id || product._id} className="border-b border-white/10">
                <td className="px-3 py-2">{product.name}</td>
                <td className="px-3 py-2">{product.category}</td>
                <td className="px-3 py-2">${Number(product.price || 0).toFixed(2)}</td>
                <td className="px-3 py-2">{product.stock}</td>
                <td className="px-3 py-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(product)}
                    className="px-2 py-1 bg-sky-600 text-white rounded-lg"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => requestDelete(product)}
                    className="px-2 py-1 bg-red-600 text-white rounded-lg"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <p className="text-xs text-sky-200">Page {page} of {pages} (Total Products: {totalProducts})</p>
        <div className="space-x-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 rounded-lg border border-white/20 text-white disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={page >= pages}
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            className="px-3 py-1 rounded-lg border border-white/20 text-white disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-card p-6 rounded-xl shadow-2xl w-11/12 max-w-md">
            <h4 className="text-lg font-semibold text-card-foreground mb-3">Confirm Delete</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Delete {productToDelete?.name} ? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 rounded-lg border border-white/20 text-white"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-red-600 text-white"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;

