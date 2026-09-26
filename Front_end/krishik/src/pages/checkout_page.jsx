import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { AuthContext } from "../components/footer/authcontext.jsx";
import OrderSummary from "../components/order/OrderSummary";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { DELIVERY_FEE } from "../utils/helpers";
import toast from "react-hot-toast";
import { Loader2, MapPin } from "lucide-react";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { items, subtotal, groupedBySeller } = useCart();

  const [form, setForm] = useState({
    full_name: `${user?.first_name || ""} ${user?.last_name || ""}`.trim(),
    phone: "",
    street: "",
    city: user?.location?.split(",")[0]?.trim() || "",
    district: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart", { replace: true });
    }
  }, [items.length, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const next = {};
    if (!form.full_name.trim()) next.full_name = "Full name is required";
    if (!form.phone.trim() || form.phone.length < 10) next.phone = "Valid phone number required";
    if (!form.street.trim()) next.street = "Street address is required";
    if (!form.city.trim()) next.city = "City is required";
    if (!form.district.trim()) next.district = "District is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the form errors");
      return;
    }
    sessionStorage.setItem("krishik_checkout", JSON.stringify({ delivery_address: form }));
    navigate("/checkout/payment");
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-10 sm:px-6 lg:px-8 bg-background min-h-screen">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Checkout</h1>
        <p className="mt-1 text-muted-foreground font-body">Where should we deliver your order?</p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg font-bold text-foreground">Delivery Address</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input
                  label="Full Name"
                  id="full_name"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  error={errors.full_name}
                  required
                />
              </div>
              <Input
                label="Phone"
                id="phone"
                name="phone"
                type="tel"
                placeholder="98XXXXXXXX"
                value={form.phone}
                onChange={handleChange}
                error={errors.phone}
                required
              />
              <Input
                label="City"
                id="city"
                name="city"
                value={form.city}
                onChange={handleChange}
                error={errors.city}
                required
              />
              <div className="sm:col-span-2">
                <Input
                  label="Street Address"
                  id="street"
                  name="street"
                  placeholder="Ward no., Tole, Street"
                  value={form.street}
                  onChange={handleChange}
                  error={errors.street}
                  required
                />
              </div>
              <Input
                label="District"
                id="district"
                name="district"
                placeholder="e.g. Kathmandu"
                value={form.district}
                onChange={handleChange}
                error={errors.district}
                required
              />
              <div className="sm:col-span-2">
                <Input
                  label="Delivery Notes (optional)"
                  id="notes"
                  name="notes"
                  placeholder="Landmark, gate code, etc."
                  value={form.notes}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" className="w-full sm:w-auto px-8 py-4 rounded-xl shadow-md">
              Continue to Payment
            </Button>
          </div>
        </form>

        <div className="lg:sticky lg:top-24 h-fit">
          <OrderSummary
            items={items}
            subtotal={subtotal}
            deliveryFee={DELIVERY_FEE}
            showGrouped
            groupedBySeller={groupedBySeller}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
