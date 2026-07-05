import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const CartContext = createContext(null);

const CART_KEY = "krishik_cart";

const loadCart = () => {
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveCart = (items) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    saveCart(items);
  }, [items]);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const addToCart = (product, quantity = 1) => {
    const stock = Number(product.stock || 0);
    if (stock <= 0) {
      toast.error("This product is out of stock");
      return false;
    }

    const seller = product.seller_id;
    const sellerId = typeof seller === "object" ? seller._id : seller;
    const sellerName =
      typeof seller === "object"
        ? `${seller.first_name || ""} ${seller.last_name || ""}`.trim()
        : "Farmer";
    const sellerLocation = typeof seller === "object" ? seller.location : "";

    setItems((current) => {
      const existing = current.find((item) => item.product_id === product._id);
      const newQty = (existing?.quantity || 0) + quantity;

      if (newQty > stock) {
        toast.error(`Only ${stock} available in stock`);
        return current;
      }

      if (existing) {
        toast.success(`Updated ${product.name} quantity`);
        return current.map((item) =>
          item.product_id === product._id ? { ...item, quantity: newQty } : item
        );
      }

      toast.success(`${product.name} added to cart`);
      return [
        ...current,
        {
          product_id: product._id,
          seller_id: sellerId,
          seller_name: sellerName,
          seller_location: sellerLocation,
          name: product.name,
          image_url: product.image_url,
          price: Number(product.price),
          unit: product.unit || "kg",
          stock,
          quantity,
        },
      ];
    });
    return true;
  };

  const updateQuantity = (productId, quantity) => {
    setItems((current) => {
      const item = current.find((i) => i.product_id === productId);
      if (!item) return current;

      if (quantity <= 0) {
        toast.success("Item removed from cart");
        return current.filter((i) => i.product_id !== productId);
      }

      if (quantity > item.stock) {
        toast.error(`Only ${item.stock} available`);
        return current;
      }

      return current.map((i) =>
        i.product_id === productId ? { ...i, quantity } : i
      );
    });
  };

  const removeFromCart = (productId) => {
    setItems((current) => current.filter((i) => i.product_id !== productId));
    toast.success("Item removed from cart");
  };

  const clearCart = () => setItems([]);

  const groupedBySeller = useMemo(() => {
    return items.reduce((groups, item) => {
      const key = item.seller_id;
      if (!groups[key]) {
        groups[key] = {
          seller_id: key,
          seller_name: item.seller_name,
          seller_location: item.seller_location,
          items: [],
        };
      }
      groups[key].items.push(item);
      return groups;
    }, {});
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        groupedBySeller,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export default CartContext;
