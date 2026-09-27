import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./components/footer/authcontext.jsx";
import { CartProvider } from "./contexts/CartContext.jsx";
import { ToastProvider } from "./components/ui/toast/ToastProvider";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <CartProvider>
      <ToastProvider>
        <StrictMode>
          <App />
        </StrictMode>
      </ToastProvider>
    </CartProvider>
  </AuthProvider>
);
