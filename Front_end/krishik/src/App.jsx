import "./App.css";
import { Home_page } from "./pages/home_page";
import LoginPage from "./pages/login_page";
import RegisterPage from "./pages/register_page";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
import NavBar from "./components/header";
import User_profile from "./components/header/user_profile";
import ProductPage from "./pages/product_page";
import { Add_product } from "./pages/add_product";

function AppContent() {
  const location = useLocation();
  const state = location.state;
  const backgroundLocation = state?.backgroundLocation;
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<Home_page searchQuery={searchQuery} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/products" element={<ProductPage searchQuery={searchQuery} />} />
        <Route path="/my-products" element={<Add_product />} />
        <Route path="/add-product" element={<Add_product />} />
      </Routes>

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
