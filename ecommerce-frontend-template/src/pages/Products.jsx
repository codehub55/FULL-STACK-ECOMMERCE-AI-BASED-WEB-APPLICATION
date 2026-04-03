import { Search, Sparkles, Star, Filter } from "lucide-react";
import { categories } from "../data/products";
import ProductCard from "../components/Products/ProductCard";
import Pagination from "../components/Products/Pagination";
import AISearchModal from "../components/Products/AISearchModal";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { fetchAllProducts } from "../store/slices/productSlice";
import { toggleAIModal } from "../store/slices/popupSlice";

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    products,
    totalProducts,
    loading,
    aiSearching,
    topRatedProducts,
    newProducts,
  } = useSelector((state) => state.product);

  const queryParams = useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location.search]);

  const page = Number(queryParams.get("page") || 1);
  const category = queryParams.get("category") || "";
  const search = queryParams.get("search") || "";
  const availability = queryParams.get("availability") || "";
  const price = queryParams.get("price") || "";
  const ratings = queryParams.get("ratings") || "";

  const totalPages = Math.max(1, Math.ceil(Number(totalProducts || 0) / 10));

  const [localSearch, setLocalSearch] = useState(search);
  const [localCategory, setLocalCategory] = useState(category);

  useEffect(() => {
    setLocalSearch(search);
    setLocalCategory(category);
  }, [search, category]);

  useEffect(() => {
    const params = {
      page,
      ...(availability ? { availability } : {}),
      ...(price ? { price } : {}),
      ...(ratings ? { ratings } : {}),
      ...(category ? { category } : {}),
      ...(search ? { search } : {}),
    };
    dispatch(fetchAllProducts(params));
  }, [dispatch, page, availability, price, ratings, category, search]);

  const applyFilters = (e) => {
    e.preventDefault();
    const sp = new URLSearchParams();
    sp.set("page", "1");
    if (localCategory) sp.set("category", localCategory);
    if (localSearch.trim()) sp.set("search", localSearch.trim());
    navigate(`/products?${sp.toString()}`);
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-start justify-between gap-6 flex-col md:flex-row">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Products</h1>
            <p className="text-muted-foreground mt-2">
              Browse and add to cart. Checkout and orders are available after
              login.
            </p>
          </div>

          <div className="w-full md:max-w-xl">
            <form onSubmit={applyFilters} className="glass-panel">
              <div className="flex items-center justify-between mb-4 gap-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Filter className="w-4 h-4" />
                  <span className="font-semibold">Filters</span>
                </div>

                <button
                  type="button"
                  className="inline-flex items-center gap-2 text-primary hover:underline font-semibold"
                  onClick={() => dispatch(toggleAIModal())}
                  disabled={aiSearching}
                >
                  <Sparkles className="w-4 h-4" />
                  AI
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">
                    Search
                  </label>
                  <div className="relative mt-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      value={localSearch}
                      onChange={(e) => setLocalSearch(e.target.value)}
                      placeholder="e.g., headphones"
                      className="w-full pl-10 pr-3 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-muted-foreground">
                    Category
                  </label>
                  <select
                    value={localCategory}
                    onChange={(e) => setLocalCategory(e.target.value)}
                    className="w-full mt-1 px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  >
                    <option value="">All</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between mt-5 gap-3">
                <button
                  type="submit"
                  className="px-6 py-3 gradient-primary text-primary-foreground rounded-lg font-semibold hover:glow-on-hover transition-all"
                >
                  Apply
                </button>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="w-4 h-4 text-primary" />
                  <span>
                    {products.length} showing
                  </span>
                </div>
              </div>
            </form>
          </div>
        </div>

        <AISearchModal />

        {loading ? (
          <div className="mt-10 glass-panel text-muted-foreground">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="mt-10 glass-panel text-muted-foreground">
            No products found. Try a different search or category.
          </div>
        ) : (
          <>
            <div className="mt-10 flex items-center justify-between gap-4">
              <div className="text-muted-foreground">
                Total results:{" "}
                <span className="text-foreground font-semibold">
                  {totalProducts}
                </span>
              </div>
              {(topRatedProducts?.length > 0 || newProducts?.length > 0) && (
                <div className="text-sm text-muted-foreground hidden lg:block">
                  New and top-rated products are also shown on the home page.
                </div>
              )}
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(newPage) => {
                const sp = new URLSearchParams(location.search);
                sp.set("page", String(newPage));
                navigate(`/products?${sp.toString()}`);
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
