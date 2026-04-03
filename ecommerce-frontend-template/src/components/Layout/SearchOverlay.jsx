import { useState } from "react";
import { X, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  closeAllPopups,
  toggleAIModal,
  toggleAuthPopup,
  toggleSearchBar,
} from "../../store/slices/popupSlice";

const SearchOverlay = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isSearchBarOpen } = useSelector((state) => state.popup);
  const authUser = useSelector((state) => state.auth.authUser);

  const [query, setQuery] = useState("");

  if (!isSearchBarOpen) return null;

  const submit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    const params = trimmed ? `?search=${encodeURIComponent(trimmed)}` : "";
    dispatch(closeAllPopups());
    navigate(`/products${params}`);
  };

  return (
    <div className="fixed inset-0 z-[60]">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={() => dispatch(toggleSearchBar())}
      />
      <div className="relative h-full flex items-start justify-center pt-24 px-4">
        <div className="w-full max-w-2xl glass-panel">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-bold text-foreground">Search</h3>
            </div>
            <button
              type="button"
              onClick={() => dispatch(toggleSearchBar())}
              className="p-2 glass-card rounded-lg"
              aria-label="Close search"
            >
              <X className="w-5 h-5 text-primary" />
            </button>
          </div>

          <form onSubmit={submit} className="flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, description, or category"
              className="flex-1 px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            />
            <button
              type="submit"
              className="px-6 py-3 gradient-primary text-primary-foreground rounded-lg font-semibold hover:glow-on-hover"
            >
              Search
            </button>
          </form>

          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground gap-3">
            <span>
              Tip: try “wireless”, “headphones”, or “gaming”.
            </span>
            <button
              type="button"
              className="text-primary hover:underline"
              onClick={() => {
                if (!authUser) {
                  dispatch(closeAllPopups());
                  dispatch(toggleAuthPopup());
                  return;
                }
                dispatch(toggleAIModal());
              }}
            >
              <span className="font-semibold">AI Search</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
