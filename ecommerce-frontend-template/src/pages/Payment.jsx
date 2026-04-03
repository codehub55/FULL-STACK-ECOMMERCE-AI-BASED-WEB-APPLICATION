import { useState, useEffect } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "../components/PaymentForm";
import { loadStripe } from "@stripe/stripe-js";
import { placeOrder, fetchMyOrders, resetOrder } from "../store/slices/orderSlice";
import { clearCart } from "../store/slices/cartSlice";
import { toggleAuthPopup, closeAllPopups } from "../store/slices/popupSlice";

const Payment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cart } = useSelector((state) => state.cart);
  const authUser = useSelector((state) => state.auth.authUser);
  const { placingOrder, paymentIntent, finalPrice, orderStep } = useSelector(
    (state) => state.order
  );

  const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY || "";
  const stripePromise = loadStripe(stripePublicKey);

  const [shipping, setShipping] = useState({
    full_name: "",
    state: "",
    city: "",
    country: "United States",
    address: "",
    pincode: "",
    phone: "",
  });

  useEffect(() => {
    dispatch(resetOrder());
  }, [dispatch]);

  const canPay = cart.length > 0;

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!authUser) {
      dispatch(closeAllPopups());
      dispatch(toggleAuthPopup());
      return;
    }
    if (!canPay) {
      navigate("/products");
      return;
    }

    const orderedItems = cart.map((item) => ({
      product: item.product,
      quantity: item.quantity,
    }));

    dispatch(placeOrder({ ...shipping, orderedItems }));
  };

  const handlePaymentSuccess = async () => {
    // Webhook updates the DB; try fetching orders shortly after.
    setTimeout(async () => {
      await dispatch(fetchMyOrders());
      dispatch(clearCart());
      navigate("/orders");
    }, 1200);
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-10">
        <div className="mb-6 flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="p-2 glass-card rounded-lg"
            aria-label="Back to cart"
          >
            <ArrowLeft className="w-5 h-5 text-primary" />
          </button>
          <h1 className="text-4xl font-bold text-foreground">Checkout</h1>
        </div>

        {!authUser ? (
          <div className="glass-panel text-muted-foreground p-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Login required
            </h2>
            <p>
              Orders and payment require authentication. Use the profile icon in
              the navbar to log in.
            </p>
          </div>
        ) : !canPay ? (
          <div className="glass-panel text-muted-foreground p-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Your cart is empty
            </h2>
            <Link
              to="/products"
              className="mt-4 inline-flex items-center px-6 py-3 gradient-primary text-primary-foreground rounded-lg font-semibold hover:glow-on-hover"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div>
              {orderStep === 1 && (
                <form onSubmit={handlePlaceOrder} className="glass-panel">
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    Shipping details
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="text-sm font-semibold text-muted-foreground">
                        Full name
                      </label>
                      <input
                        value={shipping.full_name}
                        onChange={(e) =>
                          setShipping((s) => ({ ...s, full_name: e.target.value }))
                        }
                        required
                        className="mt-1 w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-muted-foreground">
                        State
                      </label>
                      <input
                        value={shipping.state}
                        onChange={(e) =>
                          setShipping((s) => ({ ...s, state: e.target.value }))
                        }
                        required
                        className="mt-1 w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-muted-foreground">
                        City
                      </label>
                      <input
                        value={shipping.city}
                        onChange={(e) =>
                          setShipping((s) => ({ ...s, city: e.target.value }))
                        }
                        required
                        className="mt-1 w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-muted-foreground">
                        Country
                      </label>
                      <input
                        value={shipping.country}
                        onChange={(e) =>
                          setShipping((s) => ({ ...s, country: e.target.value }))
                        }
                        required
                        className="mt-1 w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-muted-foreground">
                        Pincode
                      </label>
                      <input
                        value={shipping.pincode}
                        onChange={(e) =>
                          setShipping((s) => ({ ...s, pincode: e.target.value }))
                        }
                        required
                        className="mt-1 w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-sm font-semibold text-muted-foreground">
                        Address
                      </label>
                      <textarea
                        value={shipping.address}
                        onChange={(e) =>
                          setShipping((s) => ({ ...s, address: e.target.value }))
                        }
                        required
                        rows={3}
                        className="mt-1 w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground resize-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-sm font-semibold text-muted-foreground">
                        Phone
                      </label>
                      <input
                        value={shipping.phone}
                        onChange={(e) =>
                          setShipping((s) => ({ ...s, phone: e.target.value }))
                        }
                        required
                        className="mt-1 w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={placingOrder}
                    className="mt-6 w-full px-6 py-4 gradient-primary text-primary-foreground rounded-lg font-semibold hover:glow-on-hover transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {placingOrder ? "Placing order..." : "Place order"}
                    {placingOrder ? null : <Check className="w-5 h-5" />}
                  </button>
                </form>
              )}

              {orderStep === 2 && (
                <>
                  {!stripePublicKey ? (
                    <div className="glass-panel text-muted-foreground p-8">
                      <h2 className="text-2xl font-bold text-foreground mb-2">
                        Stripe is not configured
                      </h2>
                      <p className="mb-4">
                        Set `VITE_STRIPE_PUBLIC_KEY` in your environment to
                        enable card payments.
                      </p>
                      <p className="text-sm">
                        PaymentIntent was created with the backend, but the
                        card payment can’t be confirmed from the browser.
                      </p>
                    </div>
                  ) : (
                    <Elements stripe={stripePromise}>
                      <PaymentForm
                        clientSecret={paymentIntent}
                        totalPrice={finalPrice}
                        onSuccess={handlePaymentSuccess}
                      />
                    </Elements>
                  )}
                </>
              )}
            </div>

            <div className="space-y-4">
              <div className="glass-panel p-6">
                <h2 className="text-2xl font-bold text-foreground mb-3">
                  Order summary
                </h2>
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex gap-3 items-center">
                      <img
                        src={item.product.images?.[0]?.url}
                        alt={item.product.name}
                        className="w-16 h-16 rounded-lg object-cover bg-secondary"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-foreground truncate">
                          {item.product.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Qty: {item.quantity} • ${Number(item.product.price || 0).toFixed(2)}
                        </div>
                      </div>
                      <div className="font-bold text-foreground">
                        ${(Number(item.product.price || 0) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-panel p-6 text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Tip</span>
                  <span className="text-foreground font-semibold">
                    Payment succeeds via Stripe + webhook
                  </span>
                </div>
                <div className="mt-3 text-sm">
                  After you confirm card payment, the backend webhook marks the
                  order as paid and you can view it in the Orders page.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
