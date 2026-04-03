import React from "react";
import { Star, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  if (!product) return null;

  const imageUrl = product?.images?.[0]?.url;
  const price = Number(product?.price || 0);
  const ratings = Number(product?.ratings || 0);
  const reviewCount = Number(product?.review_count || 0);
  const stock = Number(product?.stock || 0);
  const isOutOfStock = stock <= 0;

  return (
    <div className="glass-card p-4 hover:glow-on-hover animate-smooth">
      <Link to={`/product/${product.id}`}>
        <div className="h-52 rounded-lg overflow-hidden bg-secondary">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full" />
          )}
        </div>
      </Link>

      <div className="mt-3">
        <Link
          to={`/product/${product.id}`}
          className="font-semibold text-foreground hover:text-primary transition-colors block truncate"
        >
          {product.name}
        </Link>
        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
          <Star className="w-4 h-4 text-primary" />
          <span>
            {ratings.toFixed(1)} ({reviewCount})
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="font-bold text-foreground">${price.toFixed(2)}</div>

          <button
            type="button"
            className="p-2 rounded-lg gradient-primary text-primary-foreground hover:glow-on-hover transition-all"
            disabled={isOutOfStock}
            aria-label="Add to cart"
            onClick={() => dispatch(addToCart({ product, quantity: 1 }))}
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
        {isOutOfStock && (
          <div className="mt-2 text-xs text-muted-foreground">
            Out of stock
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
