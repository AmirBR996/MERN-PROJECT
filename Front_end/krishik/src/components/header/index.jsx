import React, { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { GoSearch } from "react-icons/go";
import { AuthContext } from "../footer./authcontext";

const NavBar = ({ onCartOpen, onSearchChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearchChange) onSearchChange(query);
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
    { to: "/about", label: "About Us" },
    { to: "/profile", label: "Profile" },
  ];

  return (
    <nav className="w-full sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm px-6 py-4">
      <div className="flex items-center justify-between">

        {/* Logo */}
        <div className="text-2xl font-bold italic tracking-widest text-green-600">
          Krishik Bazar
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8 font-medium text-gray-700">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`hover:text-green-600 ${
                  location.pathname === link.to ? "text-green-600 font-semibold" : ""
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Search Bar */}
        <div className="hidden md:flex items-center w-72 border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full bg-transparent outline-none text-sm text-gray-700"
          />
          <button className="text-gray-500 hover:text-green-600">
            <GoSearch size={18} />
          </button>
        </div>

        {/* Auth / Cart */}
        <div className="flex items-center gap-4">
          {/* Placeholder Cart Button */}
          {onCartOpen && (
            <button
              onClick={onCartOpen}
              className="px-3 py-2 rounded-md bg-green-100 text-green-700 text-sm hover:bg-green-200"
            >
              Cart
            </button>
          )}

          {user ? (
            <>
              <span className="text-sm text-gray-700">
                Hello, <span className="font-semibold">{user.first_name} {user.last_name}</span>
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md bg-red-500 text-white text-sm hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login">
              <button className="px-4 py-2 rounded-md bg-green-600 text-white text-sm hover:bg-green-700">
                Login
              </button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden px-3 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? "Close" : "Menu"}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 border-t border-gray-200 pt-2">
          <ul className="flex flex-col gap-2 font-medium text-gray-700">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2 rounded-md hover:bg-gray-100 ${
                    location.pathname === link.to ? "text-green-600 font-semibold" : ""
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
