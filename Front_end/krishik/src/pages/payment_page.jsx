import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { createOrder } from "../api/order.api";
import OrderSummary from "../components/order/OrderSummary";
import Button from "../components/ui/Button";
import { DELIVERY_FEE } from "../utils/helpers";
import toast from "react-hot-toast";
import { CreditCard, Banknote, Loader2 } from "lucide-react";

/**
 * Khalti payment integration (sandbox/mock).
 * Replace initiateKhaltiPayment() with real Khalti checkout when credentials are ready:
 * - KHALTI_PUBLIC_KEY from env
 * - POST to https://a.khalti.com/api/v2/epayment/initiate/
 * - Redirect to payment_url, handle return via /payment/verify
 */
const initiateKhaltiPayment = async ({ amount, orderName }) => {
  await new Promise((r) => setTimeout(r, 1500));
  return {
    success: true,
    transaction_id: `KHALTI-MOCK-${Date.now()}`,
    message: `Sandbox payment of Rs. ${amount} for ${orderName}`,
  };
};

const PaymentPage = () => {
  const navigate = useNavigate();
  const { items, subtotal, groupedBySeller, clearCart } = useCart();
  const [method, setMethod] = useState("khalti");
  const [loading, setLoading] = useState(false);

  const checkoutData = JSON.parse(sessionStorage.getItem("krishik_checkout") || "{}");
  const total = subtotal + DELIVERY_FEE;

  if (items.length === 0 || !checkoutData.delivery_address) {
    navigate("/cart");
    return null;
  }

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
      if (method === "khalti") {
        const result = await initiateKhaltiPayment({
          amount: total,
          orderName: `Krishik Bazar (${items.length} items)`,
        });

        if (!result.success) {
          toast.error("Payment failed. Please try again.");
          return;
        }

        const order = await placeOrder("paid", result.transaction_id);
        clearCart();
        sessionStorage.removeItem("krishik_checkout");
        toast.success("Payment successful!");
        navigate(`/orders/confirmation/${order._id}`, { replace: true });
      } else {
        const order = await placeOrder("pending");
        clearCart();
        sessionStorage.removeItem("krishik_checkout");
        toast.success("Order placed! Pay on delivery.");
        navigate(`/orders/confirmation/${order._id}`, { replace: true });
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not complete order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-bark">Payment</h1>
      <p className="mt-1 text-mist">Choose how you&apos;d like to pay</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl border border-soil-200 bg-white p-6">
            <h2 className="font-display text-lg font-bold text-bark">Payment Method</h2>

            <div className="mt-4 space-y-3">
              <label
                className={`flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition ${
                  method === "khalti"
                    ? "border-leaf-500 bg-leaf-50"
                    : "border-soil-200 hover:border-soil-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="khalti"
                  checked={method === "khalti"}
                  onChange={() => setMethod("khalti")}
                  className="accent-leaf-600"
                />
                <CreditCard className="h-6 w-6 text-[#5C2D91]" />
                <div>
                  <p className="font-semibold text-bark">Khalti</p>
                  <p className="text-sm text-mist">Pay securely via Khalti wallet (sandbox mode)</p>
                </div>
              </label>

              <label
                className={`flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition ${
                  method === "cod"
                    ? "border-leaf-500 bg-leaf-50"
                    : "border-soil-200 hover:border-soil-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={method === "cod"}
                  onChange={() => setMethod("cod")}
                  className="accent-leaf-600"
                />
                <Banknote className="h-6 w-6 text-harvest-600" />
                <div>
                  <p className="font-semibold text-bark">Cash on Delivery</p>
                  <p className="text-sm text-mist">Pay when your order arrives</p>
                </div>
              </label>
            </div>

            {method === "khalti" && (
              <div className="mt-4 rounded-xl bg-harvest-50 p-4 text-sm text-harvest-800">
                <strong>Sandbox mode:</strong> This simulates a Khalti payment. Wire up real credentials in{" "}
                <code className="rounded bg-white px-1">payment_page.jsx</code> when ready.
              </div>
            )}
          </div>

          <Button onClick={handlePay} disabled={loading} className="w-full sm:w-auto">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : method === "khalti" ? (
              "Pay with Khalti"
            ) : (
              "Place Order"
            )}
          </Button>
        </div>

        <OrderSummary
          items={items}
          subtotal={subtotal}
          deliveryFee={DELIVERY_FEE}
          showGrouped
          groupedBySeller={groupedBySeller}
        />
      </div>
    </div>
  );
};

export default PaymentPage;
