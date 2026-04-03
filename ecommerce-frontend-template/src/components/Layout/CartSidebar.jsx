import { X, Plus, Minus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  closeAllPopups,
  toggleCart,
} from "../../store/slices/popupSlice";
import {
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
} from "../../store/slices/cartSlice";

const CartSidebar = () => {
  const dispatch = useDispatch();
  const { isCartOpen } = useSelector((state) => state.popup);
  const cart = useSelector((state) => state.cart.cart);

  const subtotal = cart.reduce((sum, item) => {
    const price = Number(item?.product?.price || 0);
    return sum + price * (item.quantity || 0);
  }, 0);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[55]">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={() => dispatch(toggleCart())}
      />
      <div className="relative h-full w-full max-w-md ml-auto">
        <div className="h-full glass border-l border-[hsla(var(--glass-border))] p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-foreground">Your Cart</h3>
            <button
              type="button"
              className="p-2 glass-card rounded-lg"
              onClick={() => dispatch(toggleCart())}
              aria-label="Close cart"
            >
              <X className="w-5 h-5 text-primary" />
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col justify-center items-center text-muted-foreground">
              <div className="glass-card p-6">
                <p className="font-semibold text-foreground mb-2">
                  Cart is empty
                </p>
                <p className="text-sm">
                  Browse products and add items to checkout.
                </p>
              </div>
              <Link
                to="/products"
                onClick={() => dispatch(closeAllPopups())}
                className="mt-4 px-6 py-3 gradient-primary text-primary-foreground rounded-lg font-semibold hover:glow-on-hover"
              >
                Shop now
              </Link>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-hide">
                {cart.map((item) => {
                  const product = item.product || {};
                  const imageUrl = product.images?.[0]?.url;
                  return (
                    <div
                      key={product.id}
                      className="glass-card p-3 flex gap-3 items-center"
                    >
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-16 h-16 rounded-lg object-cover bg-secondary"
                      />
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${product.id}`}
                          onClick={() => dispatch(closeAllPopups())}
                          className="font-semibold text-foreground hover:text-primary transition-colors block truncate"
                        >
                          {product.name}
                        </Link>
                        <div className="text-sm text-muted-foreground">
                          ${Number(product.price || 0).toFixed(2)}
                        </div>

                        <div className="mt-2 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className="p-1 glass-card rounded-lg"
                              onClick={() => dispatch(decrementQuantity(product.id))}
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-4 h-4 text-primary" />
                            </button>
                            <span className="w-8 text-center font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              className="p-1 glass-card rounded-lg"
                              onClick={() => dispatch(incrementQuantity(product.id))}
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-4 h-4 text-primary" />
                            </button>
                          </div>

                          <button
                            type="button"
                            className="p-1 glass-card rounded-lg"
                            onClick={() => dispatch(removeFromCart(product.id))}
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4 text-primary" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-[hsla(var(--glass-border))]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-muted-foreground font-semibold">
                    Subtotal
                  </span>
                  <span className="font-bold text-foreground">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                <Link
                  to="/payment"
                  onClick={() => dispatch(closeAllPopups())}
                  className="block text-center px-6 py-3 gradient-primary text-primary-foreground rounded-lg font-semibold hover:glow-on-hover"
                >
                  Checkout
                </Link>

                <Link
                  to="/cart"
                  onClick={() => dispatch(closeAllPopups())}
                  className="block text-center mt-2 px-6 py-3 bg-secondary border border-border rounded-lg text-foreground font-semibold hover:bg-secondary/80 transition-colors"
                >
                  View cart
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;
