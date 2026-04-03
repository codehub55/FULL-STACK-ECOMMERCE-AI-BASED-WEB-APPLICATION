import React, { useState } from "react";
import { X, Sparkles, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleAIModal, toggleAuthPopup, closeAllPopups } from "../../store/slices/popupSlice";
import { fetchAIFilteredProducts } from "../../store/slices/productSlice";

const AISearchModal = () => {
  const dispatch = useDispatch();
  const { isAIPopupOpen } = useSelector((state) => state.popup);
  const { aiSearching } = useSelector((state) => state.product);
  const authUser = useSelector((state) => state.auth.authUser);

  const [userPrompt, setUserPrompt] = useState("");

  if (!isAIPopupOpen) return null;

  const submit = async (e) => {
    e.preventDefault();
    if (!authUser) {
      dispatch(closeAllPopups());
      dispatch(toggleAuthPopup());
      return;
    }
    const trimmed = userPrompt.trim();
    if (!trimmed) return;
    await dispatch(fetchAIFilteredProducts(trimmed)).unwrap();
    dispatch(toggleAIModal());
  };

  return (
    <div className="fixed inset-0 z-[65]">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={() => dispatch(toggleAIModal())}
      />
      <div className="relative h-full flex items-start justify-center pt-24 px-4">
        <div className="w-full max-w-lg glass-panel">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-bold text-foreground">AI Search</h3>
            </div>
            <button
              type="button"
              className="p-2 glass-card rounded-lg"
              onClick={() => dispatch(toggleAIModal())}
              aria-label="Close AI search"
            >
              <X className="w-5 h-5 text-primary" />
            </button>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Describe what you want and we’ll filter matching products.
          </p>

          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="text-sm font-semibold text-muted-foreground">
                Your prompt
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  placeholder="e.g., wireless headphones under $200"
                  className="mt-1 w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 gradient-primary text-primary-foreground rounded-lg font-semibold hover:glow-on-hover transition-all disabled:opacity-60"
              disabled={aiSearching}
            >
              {aiSearching ? "Searching..." : "Search"}
            </button>

            {!authUser && (
              <p className="text-sm text-muted-foreground">
                Please log in to use AI search.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AISearchModal;
