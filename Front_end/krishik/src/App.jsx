import "./App.css";
import { Home_page } from "./pages/home_page";
import LoginPage from "./pages/login_page";
import RegisterPage from "./pages/register_page";
import { BrowserRouter as Router, Routes, Route } from "react-router"; // ✅ correct import
import NavBar from "./components/header";
import User_profile from "./components/header/user_profile";
import ProductPage from "./pages/product_page";

function App() {
  return (
    <Router>
      <div className="bg-white min-h-screen flex flex-col">
        {/* Navbar outside Routes so it shows on all pages */}
        <NavBar />

        {/* Page content */}
        <Routes>
          <Route path="/" element={<Home_page />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<User_profile />} />
          <Route path="/products" element={<ProductPage></ProductPage>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
