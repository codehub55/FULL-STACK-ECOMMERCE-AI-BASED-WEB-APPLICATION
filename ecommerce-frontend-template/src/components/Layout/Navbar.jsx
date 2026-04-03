import { ShoppingCart, Search, Sun, Moon, User, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { toggleSearchBar, toggleCart, toggleSidebar, toggleAuthPopup, closeAllPopups } from "../../store/slices/popupSlice";
import { logoutUser } from "../../store/slices/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();

  const cartCount = useSelector((state) =>
    state.cart.cart.reduce((sum, item) => sum + (item.quantity || 0), 0)
  );
  const authUser = useSelector((state) => state.auth.authUser);

  const openSearch = () => {
    dispatch(closeAllPopups());
    dispatch(toggleSearchBar());
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="glass border-b border-[hsla(var(--glass-border))]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="sm:hidden p-2 glass-card rounded-lg"
              onClick={() => dispatch(toggleSidebar())}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 text-primary" />
            </button>

            <Link
              to="/"
              className="font-bold text-xl gradient-primary bg-clip-text text-transparent"
            >
              ShopMate
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <Link
              to="/products"
              className="hover:text-primary transition-colors"
            >
              Products
            </Link>
            <Link to="/orders" className="hover:text-primary transition-colors">
              Orders
            </Link>
            <Link to="/cart" className="hover:text-primary transition-colors">
              Cart
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-2 glass-card rounded-lg"
              onClick={openSearch}
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-primary" />
            </button>

            <button
              type="button"
              className="p-2 glass-card rounded-lg relative"
              onClick={() => {
                dispatch(closeAllPopups());
                dispatch(toggleCart());
              }}
              aria-label="Open cart"
            >
              <ShoppingCart className="w-5 h-5 text-primary" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center font-semibold">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              type="button"
              className="p-2 glass-card rounded-lg"
              onClick={() => dispatch(toggleAuthPopup())}
              aria-label="Profile"
            >
              <User className="w-5 h-5 text-primary" />
            </button>

            {!authUser && (
              <Link
                to="/register"
                className="ml-2 hidden sm:inline-flex px-4 py-2 rounded-lg glass-card text-sm font-semibold hover:bg-secondary/50"
              >
                Sign Up
              </Link>
            )}

            <button
              type="button"
              className="p-2 glass-card rounded-lg"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-primary" />
              ) : (
                <Moon className="w-5 h-5 text-primary" />
              )}
            </button>

            {authUser && (
              <button
                type="button"
                className="hidden sm:inline-flex ml-2 px-4 py-2 rounded-lg glass-card hover:glow-on-hover transition-all font-semibold text-sm"
                onClick={() => dispatch(logoutUser())}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
