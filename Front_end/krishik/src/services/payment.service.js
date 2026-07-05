/**
 * Mock payment processing — swap real eSewa/Khalti SDK calls in here later.
 */
const MOCK_DELAY_MS = 1500;

export const PAYMENT_METHODS = {
  esewa: {
    id: "esewa",
    label: "eSewa",
    description: "Pay securely via eSewa wallet (sandbox mode)",
    color: "#60BB46",
    paidOnSubmit: true,
  },
  khalti: {
    id: "khalti",
    label: "Khalti",
    description: "Pay securely via Khalti wallet (sandbox mode)",
    color: "#5C2D91",
    paidOnSubmit: true,
  },
  cod: {
    id: "cod",
    label: "Cash on Delivery",
    description: "Pay when your order arrives",
    color: "#e5851a",
    paidOnSubmit: false,
  },
};

export async function processPayment(method, { amount, orderName }) {
  if (method === "cod") {
    return { success: true, transaction_id: "", payment_status: "pending" };
  }

  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

  const prefix = method === "esewa" ? "ESEWA" : "KHALTI";
  return {
    success: true,
    transaction_id: `${prefix}-MOCK-${Date.now()}`,
    payment_status: "paid",
    message: `Sandbox payment of Rs. ${amount} for ${orderName}`,
  };
}
