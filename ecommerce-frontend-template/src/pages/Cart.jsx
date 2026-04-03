import { Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
} from "../store/slices/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);

  const subtotal = cart.reduce((sum, item) => {
    const price = Number(item?.product?.price || 0);
    return sum + price * (item.quantity || 0);
  }, 0);

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between gap-4 flex-col sm:flex-row">
          <h1 className="text-4xl font-bold text-foreground">Cart</h1>
          <Link
            to="/products"
            className="text-primary hover:underline font-semibold"
          >
            Continue shopping
          </Link>
        </div>

        {cart.length === 0 ? (
          <div className="mt-10 glass-panel text-muted-foreground">
            Your cart is empty.
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => {
                const product = item.product || {};
                const imageUrl = product.images?.[0]?.url;
                const price = Number(product.price || 0);
                return (
                  <div key={product.id} className="glass-panel p-4">
                    <div className="flex gap-4 items-start">
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-24 h-24 rounded-xl object-cover bg-secondary"
                      />
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${product.id}`}
                          className="font-semibold text-foreground hover:text-primary transition-colors block truncate"
                        >
                          {product.name}
                        </Link>
                        <div className="text-sm text-muted-foreground mt-1">
                          ${price.toFixed(2)}
                        </div>

                        <div className="mt-4 flex items-center gap-3">
                          <button
                            type="button"
                            className="p-2 glass-card rounded-lg"
                            onClick={() =>
                              dispatch(decrementQuantity(product.id))
                            }
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4 text-primary" />
                          </button>
                          <span className="w-10 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            className="p-2 glass-card rounded-lg"
                            onClick={() =>
                              dispatch(incrementQuantity(product.id))
                            }
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4 text-primary" />
                          </button>

                          <button
                            type="button"
                            className="ml-auto p-2 glass-card rounded-lg"
                            onClick={() => dispatch(removeFromCart(product.id))}
                            aria-label="Remove from cart"
                          >
                            <Trash2 className="w-4 h-4 text-primary" />
                          </button>
                        </div>
                      </div>
                      <div className="text-right font-bold text-foreground">
                        ${(price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-4">
              <div className="glass-panel">
                <h2 className="text-xl font-bold text-foreground mb-3">
                  Summary
                </h2>
                <div className="flex items-center justify-between text-muted-foreground mb-2">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground mb-2">
                  <span>Tax + shipping</span>
                  <span className="text-foreground font-semibold">
                    Calculated at checkout
                  </span>
                </div>
              </div>

              <Link
                to="/payment"
                className="block w-full px-6 py-4 gradient-primary text-primary-foreground rounded-lg font-semibold hover:glow-on-hover transition-all text-center flex items-center justify-center gap-2"
              >
                Proceed to payment
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
