import "./App.css";
import { Home_page } from "./pages/home_page";
import LoginPage from "./pages/login_page";
import RegisterPage from "./pages/register_page";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
import NavBar from "./components/header";
import Footer from "./components/footer./footer";
import User_profile from "./components/header/user_profile";
import ProductPage from "./pages/product_page";
import ProductDetailPage from "./pages/product_detail_page";
import SellerProfilePage from "./pages/seller_profile_page";
import CartPage from "./pages/cart_page";
import CheckoutPage from "./pages/checkout_page";
import PaymentPage from "./pages/payment_page";
import OrderConfirmationPage from "./pages/order_confirmation_page";
import OrdersPage from "./pages/orders_page";
import OrderDetailPage from "./pages/order_detail_page";
import ProtectedRoute from "./components/ProtectedRoute";
import { Add_product } from "./pages/add_product";

function AppContent() {
  const location = useLocation();
  const state = location.state;
  const backgroundLocation = state?.backgroundLocation;
  const [searchQuery, setSearchQuery] = useState("");

  const hideNavSearch = ["/login", "/register"].includes(location.pathname);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <NavBar
        searchQuery={searchQuery}
        onSearchChange={hideNavSearch ? undefined : setSearchQuery}
      />

      <main className="w-full min-w-0 flex-1">
        <Routes location={backgroundLocation || location}>
          <Route path="/" element={<Home_page searchQuery={searchQuery} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/products" element={<ProductPage searchQuery={searchQuery} />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/farmers/:id" element={<SellerProfilePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute role="buyer">
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout/payment"
            element={
              <ProtectedRoute role="buyer">
                <PaymentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute role="buyer">
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/confirmation/:id"
            element={
              <ProtectedRoute role="buyer">
                <OrderConfirmationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute role="buyer">
                <OrderDetailPage />
              </ProtectedRoute>
            }
          />
          <Route path="/my-products" element={<Add_product />} />
          <Route path="/add-product" element={<Add_product />} />
        </Routes>
      </main>

      <Footer />

      <Routes>
        <Route path="/profile" element={<User_profile />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
