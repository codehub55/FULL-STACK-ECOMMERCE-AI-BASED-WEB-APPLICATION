import React, { useState, useEffect } from "react";
import {
  X,
  Home,
  Package,
  Info,
  HelpCircle,
  ShoppingCart,
  Phone,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { categories } from "../../data/products";
import { closeAllPopups } from "../../store/slices/popupSlice";

const Sidebar = () => {
  const dispatch = useDispatch();
  const { isSidebarOpen } = useSelector((state) => state.popup);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  if (isFullscreen) return null;

  return (
    <aside
      className={`
        fixed top-[72px] left-0 z-40 h-[calc(100vh-72px)] w-72
        glass border-r border-[hsla(var(--glass-border))]
        transform transition-transform duration-300
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        sm:translate-x-0 sm:static lg:hidden
      `}
    >
      <div className="h-full flex flex-col">
        <div className="p-4 flex items-center justify-between">
          <div className="font-bold text-primary">Browse</div>
          <button
            type="button"
            className="p-2 glass-card rounded-lg sm:hidden"
            onClick={() => dispatch(closeAllPopups())}
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 text-primary" />
          </button>
        </div>

        <nav className="px-4 pb-6 space-y-6 overflow-y-auto scrollbar-hide">
          <div className="space-y-2">
            <Link
              to="/"
              onClick={() => dispatch(closeAllPopups())}
              className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link
              to="/products"
              onClick={() => dispatch(closeAllPopups())}
              className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
            >
              <Package className="w-4 h-4" />
              Products
            </Link>
            <Link
              to="/orders"
              onClick={() => dispatch(closeAllPopups())}
              className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              Orders
            </Link>
            <Link
              to="/cart"
              onClick={() => dispatch(closeAllPopups())}
              className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              Cart
            </Link>
            <Link
              to="/about"
              onClick={() => dispatch(closeAllPopups())}
              className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
            >
              <Info className="w-4 h-4" />
              About
            </Link>
            <Link
              to="/faq"
              onClick={() => dispatch(closeAllPopups())}
              className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              FAQ
            </Link>
            <Link
              to="/contact"
              onClick={() => dispatch(closeAllPopups())}
              className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
            >
              <Phone className="w-4 h-4" />
              Contact
            </Link>
          </div>

          <div>
            <div className="text-sm font-semibold text-muted-foreground mb-3">
              Categories
            </div>
            <div className="space-y-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${encodeURIComponent(
                    category.name
                  )}`}
                  onClick={() => dispatch(closeAllPopups())}
                  className="block text-muted-foreground hover:text-primary transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="p-4 pt-0 text-xs text-muted-foreground">
          Tip: use the search icon to quickly find products.
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
