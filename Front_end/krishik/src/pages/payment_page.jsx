import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { createOrder } from "../api/order.api";
import OrderSummary from "../components/order/OrderSummary";
import Button from "../components/ui/Button";
import { DELIVERY_FEE, calculateOrderTotals } from "../utils/helpers";
import { processPayment, PAYMENT_METHODS } from "../services/payment.service";
import toast from "react-hot-toast";
import { CreditCard, Banknote, Loader2, Smartphone } from "lucide-react";

const METHOD_ICONS = {
  esewa: Smartphone,
  khalti: CreditCard,
  cod: Banknote,
};

const PaymentPage = () => {
  const navigate = useNavigate();
  const { items, subtotal, groupedBySeller, clearCart } = useCart();
  const [method, setMethod] = useState("khalti");
  const [loading, setLoading] = useState(false);
  const [checkoutData, setCheckoutData] = useState(null);
  const [ready, setReady] = useState(false);

  const { platformFee, total } = calculateOrderTotals(subtotal, DELIVERY_FEE);

  useEffect(() => {
    const stored = JSON.parse(sessionStorage.getItem("krishik_checkout") || "{}");
    if (items.length === 0 || !stored.delivery_address) {
      navigate("/cart", { replace: true });
      return;
    }
    setCheckoutData(stored);
    setReady(true);
  }, [items.length, navigate]);

  const placeOrder = async (paymentStatus, transactionId = "") => {
    const orderPayload = {
      items: items.map((item) => ({
        product_id: item.product_id,
        seller_id: item.seller_id,
        name: item.name,
        image_url: item.image_url,
        price: item.price,
        quantity: item.quantity,
        unit: item.unit,
      })),
      delivery_address: checkoutData.delivery_address,
      subtotal,
      delivery_fee: DELIVERY_FEE,
      platform_fee: platformFee,
      total,
      payment_method: method,
      payment_status: paymentStatus,
      transaction_id: transactionId,
    };

    return createOrder(orderPayload);
  };

  const handlePay = async () => {
    setLoading(true);
    try {
      const result = await processPayment(method, {
        amount: total,
        orderName: `Krishik Bazar (${items.length} items)`,
      });

      if (!result.success) {
        toast.error("Payment failed. Please try again.");
        return;
      }

      const order = await placeOrder(result.payment_status, result.transaction_id);
      clearCart();
      sessionStorage.removeItem("krishik_checkout");

      if (result.payment_status === "paid") {
        toast.success("Payment successful!");
      } else {
        toast.success("Order placed! Pay on delivery.");
      }

      navigate(`/orders/confirmation/${order._id}`, { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not complete order");
    } finally {
      setLoading(false);
    }
  };

  if (!ready || !checkoutData) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const selectedMethod = PAYMENT_METHODS[method];
  const isOnlinePayment = selectedMethod?.paidOnSubmit;

  return (
    <div className="mx-auto px-4 py-10 sm:px-6 lg:px-8 bg-background min-h-screen">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Payment</h1>
        <p className="mt-1 text-muted-foreground font-body">Choose how you&apos;d like to pay</p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-display text-lg font-bold text-foreground mb-6">Payment Method</h2>

            <div className="space-y-3">
              {Object.values(PAYMENT_METHODS).map((option) => {
                const Icon = METHOD_ICONS[option.id];
                const isSelected = method === option.id;

                return (
                  <label
                    key={option.id}
                    className={`flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-all duration-200 ${
                      isSelected
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border hover:border-primary/50 bg-background"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={option.id}
                      checked={isSelected}
                      onChange={() => setMethod(option.id)}
                      className="accent-primary w-4 h-4"
                    />
                    <Icon className="h-6 w-6 shrink-0" style={{ color: option.color }} />
                    <div className="flex flex-col">
                      <p className="font-semibold text-foreground">{option.label}</p>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                  </label>
                );
              })}
            </div>

            {isOnlinePayment && (
              <div className="mt-6 rounded-xl bg-secondary/10 p-4 text-sm text-secondary-foreground border border-secondary/20">
                <strong className="font-medium">Sandbox mode:</strong> This simulates a {selectedMethod.label} payment.
                Wire up real credentials in{" "}
                <code className="rounded bg-white px-1 border border-border">src/services/payment.service.js</code> when
                ready.
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button onClick={handlePay} disabled={loading} className="w-full sm:w-auto px-10 py-4 rounded-xl shadow-md">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : isOnlinePayment ? (
                `Pay with ${selectedMethod.label}`
              ) : (
                "Place Order"
              )}
            </Button>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 h-fit">
          <OrderSummary
            items={items}
            subtotal={subtotal}
            deliveryFee={DELIVERY_FEE}
            platformFee={platformFee}
            showGrouped
            groupedBySeller={groupedBySeller}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
