import { useRef } from "react";
import { ChevronLeft, ChevronRight, Star, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { addToCart } from "../../store/slices/cartSlice";
import { useDispatch } from "react-redux";

const ProductSlider = ({ title, products }) => {
  const dispatch = useDispatch();
  const scrollerRef = useRef(null);

  const scroll = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 520, behavior: "smooth" });
  };

  if (!products || products.length === 0) return null;

  return (
    <section className="py-10">
      <div className="flex items-center justify-between gap-4 mb-5">
        <h2 className="text-3xl font-bold text-foreground">{title}</h2>
        <div className="hidden sm:flex items-center gap-2">
          <button
            type="button"
            className="p-2 glass-card rounded-lg"
            onClick={() => scroll(-1)}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 text-primary" />
          </button>
          <button
            type="button"
            className="p-2 glass-card rounded-lg"
            onClick={() => scroll(1)}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-primary" />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="flex gap-5 overflow-x-auto scrollbar-hide pb-2"
      >
        {products.map((product) => {
          const imageUrl = product?.images?.[0]?.url;
          const price = Number(product?.price || 0);
          const ratings = Number(product?.ratings || 0);
          const reviewCount = Number(product?.review_count || 0);

          return (
            <div
              key={product.id}
              className="min-w-[260px] max-w-[260px] glass-card hover:glow-on-hover animate-smooth"
            >
              <Link to={`/product/${product.id}`}>
                <div className="h-40 rounded-lg overflow-hidden bg-secondary">
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
                <div className="font-semibold text-foreground truncate">
                  {product.name}
                </div>
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <Star className="w-4 h-4 text-primary" />
                  <span>
                    {ratings.toFixed(1)} ({reviewCount})
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="font-bold text-foreground">
                    ${price.toFixed(2)}
                  </div>
                  <button
                    type="button"
                    className="p-2 rounded-lg gradient-primary text-primary-foreground hover:glow-on-hover transition-all"
                    onClick={() =>
                      dispatch(addToCart({ product, quantity: 1 }))
                    }
                    disabled={Number(product?.stock || 0) <= 0}
                    aria-label="Add to cart"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ProductSlider;
