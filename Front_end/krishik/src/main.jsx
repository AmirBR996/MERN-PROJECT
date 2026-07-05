import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./components/footer./authcontext.jsx";
import { CartProvider } from "./contexts/CartContext.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <CartProvider>
      <StrictMode>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: "DM Sans, sans-serif",
              borderRadius: "12px",
            },
            success: { iconTheme: { primary: "#4f9436", secondary: "#fff" } },
            error: { iconTheme: { primary: "#dc2626", secondary: "#fff" } },
          }}
        />
      </StrictMode>
    </CartProvider>
  </AuthProvider>
);
