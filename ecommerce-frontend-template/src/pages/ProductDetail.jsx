import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Star,
  ShoppingCart,
  Share2,
  Loader,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import ReviewsContainer from "../components/Products/ReviewsContainer";
import { addToCart } from "../store/slices/cartSlice";
import { fetchSingleProduct } from "../store/slices/productSlice";

const ProductDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { productDetails, loading } = useSelector((state) => state.product);

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id) return;
    dispatch(fetchSingleProduct(id));
    setQuantity(1);
  }, [dispatch, id]);

  const product = productDetails || {};
  const imageUrl = product?.images?.[0]?.url;

  const price = Number(product?.price || 0);
  const ratings = Number(product?.ratings || 0);
  const stock = Number(product?.stock || 0);
  const isOutOfStock = stock <= 0;

  const add = () => {
    if (!product?.id || isOutOfStock) return;
    dispatch(addToCart({ product, quantity }));
    navigate("/cart");
  };

  const share = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
    } catch {
      // ignore clipboard failures
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-10">
        <div className="mb-6">
          <Link
            to="/products"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Back to products
          </Link>
        </div>

        {loading ? (
          <div className="glass-panel flex items-center gap-3 text-muted-foreground">
            <Loader className="w-5 h-5 animate-spin text-primary" />
            Loading product...
          </div>
        ) : !product?.id ? (
          <div className="glass-panel text-muted-foreground">
            Product not found.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <div className="glass-panel overflow-hidden">
                <div className="bg-secondary h-[420px] rounded-xl overflow-hidden">
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
              </div>
            </div>

            <div>
              <div className="glass-panel p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-4xl font-bold text-foreground">
                      {product.name}
                    </h1>
                    <div className="flex items-center gap-2 mt-3 text-muted-foreground">
                      <Star className="w-5 h-5 text-primary" />
                      <span className="font-semibold">
                        {ratings.toFixed(1)}
                      </span>
                      <span>•</span>
                      <span>
                        {Array.isArray(product.reviews)
                          ? product.reviews.length
                          : 0}{" "}
                        reviews
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="p-2 glass-card rounded-lg"
                    onClick={share}
                    aria-label="Share product link"
                  >
                    <Share2 className="w-5 h-5 text-primary" />
                  </button>
                </div>

                <div className="mt-6">
                  <div className="text-3xl font-bold text-foreground">
                    ${price.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {isOutOfStock ? "Out of stock" : `${stock} available`}
                  </div>
                </div>

                <div className="mt-6">
                  <div className="text-sm font-semibold text-muted-foreground mb-2">
                    Quantity
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="p-2 glass-card rounded-lg"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={isOutOfStock}
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-semibold text-foreground">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      className="p-2 glass-card rounded-lg"
                      onClick={() => setQuantity((q) => q + 1)}
                      disabled={isOutOfStock}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={add}
                    disabled={isOutOfStock}
                    className="w-full px-6 py-4 gradient-primary text-primary-foreground rounded-lg font-semibold hover:glow-on-hover transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to cart
                  </button>
                </div>

                <div className="mt-6 text-muted-foreground leading-relaxed">
                  {product.description}
                </div>
              </div>

              <ReviewsContainer
                product={product}
                productReviews={product.reviews}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
