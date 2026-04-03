import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { CreditCard, Lock } from "lucide-react";

const PaymentForm = ({ clientSecret, totalPrice, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setProcessing(true);
    setError("");

    const card = elements.getElement(CardElement);
    if (!card) {
      setProcessing(false);
      setError("Card input is not ready.");
      return;
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card },
    });

    if (result.error) {
      setError(result.error.message || "Payment failed.");
      setProcessing(false);
      return;
    }

    setProcessing(false);
    onSuccess?.(result.paymentIntent);
  };

  return (
    <div className="glass-panel">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center">
          <Lock className="w-6 h-6 text-primary-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-bold text-foreground">Payment</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Charge: <span className="text-foreground font-semibold">${Number(totalPrice || 0).toFixed(2)}</span>
          </p>
        </div>
      </div>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <CreditCard className="w-4 h-4 text-primary" />
            <span>Card details</span>
          </div>
          <div className="p-2 bg-background rounded-lg border border-border">
            <CardElement />
          </div>
        </div>

        {error && <p className="text-sm text-destructive font-semibold">{error}</p>}

        <button
          type="submit"
          disabled={processing || !stripe}
          className="w-full px-6 py-4 gradient-primary text-primary-foreground rounded-lg font-semibold hover:glow-on-hover transition-all disabled:opacity-60"
        >
          {processing ? "Processing..." : "Pay now"}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
