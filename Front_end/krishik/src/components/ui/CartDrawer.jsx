import React from "react";
import { useCart } from "../../contexts/CartContext";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { formatPrice, DELIVERY_FEE, calculatePlatformFee } from "../../utils/helpers";

const CartDrawer = ({ isOpen, onClose }) => {
  const { items, updateQuantity, removeFromCart, subtotal, itemCount } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Content */}
      <div className="absolute inset-y-0 right-0 w-full max-w-md bg-background shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            Your Cart <span className="text-sm font-normal text-muted-foreground">({itemCount} items)</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="bg-muted p-6 rounded-full text-muted-foreground">
                <X className="h-12 w-12" />
              </div>
              <p className="text-foreground font-medium">Your cart is empty</p>
              <Link
                to="/products"
                onClick={onClose}
                className="text-primary text-sm font-semibold hover:underline"
              >
                Start shopping
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product_id} className="flex gap-4 p-3 rounded-lg border border-border bg-card">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="h-20 w-20 object-cover rounded-md bg-muted"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-semibold text-foreground truncate">{item.name}</h3>
                    <button
                      onClick={() => removeFromCart(item.product_id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{formatPrice(item.price)} / unit</p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 rounded-md border border-border px-2 py-1 bg-background">
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-xs font-medium w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        className="p-0.5 text-muted-foreground hover:text-foreground"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-border bg-stone-50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted-foreground font-medium">Subtotal</span>
              <span className="text-xl font-bold text-foreground">{formatPrice(subtotal)}</span>
            </div>
            <Link
              to="/checkout"
              onClick={onClose}
              className="block w-full text-center bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-lg"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
