import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { GoSearch } from "react-icons/go";
import { ShoppingCart, Menu, X, ChevronDown, Package, LogOut } from "lucide-react";
import { AuthContext } from "../footer./authcontext";
import { useCart } from "../../contexts/CartContext";

const NavBar = ({ searchQuery = "", onSearchChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const { itemCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate("/products");
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Marketplace" },
    ...(user?.user_type === "seller"
      ? [{ to: "/my-products", label: "My Products" }]
      : []),
    ...(user?.user_type === "buyer"
      ? [{ to: "/orders", label: "My Orders" }]
      : []),
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-stone-200 bg-stone-50/90 backdrop-blur-md">
      <div className="mx-auto flex items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="shrink-0">
          <span className="font-serif text-xl font-bold text-emerald-800 sm:text-2xl">
            Krishik Bazar
          </span>
        </Link>

        <ul className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`text-sm font-medium transition ${
                  location.pathname === link.to
                    ? "text-emerald-800"
                    : "text-stone-500 hover:text-stone-900"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <form
          onSubmit={handleSearchSubmit}
          className="hidden flex-1 max-w-xs items-center gap-2 rounded-md border border-stone-200 bg-white px-3 py-2 lg:flex lg:max-w-sm"
        >
          <input
            type="text"
            placeholder="Search produce..."
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full bg-transparent text-sm outline-none text-stone-900 placeholder:text-stone-400"
          />
          <button type="submit" className="text-stone-500 hover:text-emerald-700">
            <GoSearch size={18} />
          </button>
        </form>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/cart"
            className="relative rounded-md p-2.5 text-stone-500 transition hover:bg-stone-100 hover:text-emerald-800"
            aria-label="Cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-[10px] font-bold text-white">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 rounded-md border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-900 transition hover:border-emerald-600"
              >
                {user.first_name}
                <ChevronDown className="h-4 w-4 text-stone-500" />
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 z-50 mt-2 w-48 rounded-md border border-stone-200 bg-white py-1 shadow-sm">
                    <Link
                      to="/profile"
                      state={{ backgroundLocation: location }}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-stone-900 hover:bg-stone-100"
                    >
                      Profile
                    </Link>
                    {user.user_type === "buyer" && (
                      <Link
                        to="/orders"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-stone-900 hover:bg-stone-100"
                      >
                        <Package className="h-4 w-4" />
                        My Orders
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden rounded-md bg-stone-900 px-4 py-2.5 text-sm font-semibold text-amber-50 transition hover:bg-emerald-800 md:block"
            >
              Sign In
            </Link>
          )}

          <button
            type="button"
            className="rounded-md p-2.5 text-stone-900 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-stone-200 bg-white px-4 py-4 md:hidden">
          <form onSubmit={handleSearchSubmit} className="mb-4 flex items-center gap-2 rounded-md border border-stone-200 px-3 py-2">
            <input
              type="text"
              placeholder="Search produce..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full text-sm outline-none text-stone-900"
            />
            <GoSearch size={18} className="text-stone-500" />
          </form>
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-md px-3 py-2.5 text-sm font-medium text-stone-900 hover:bg-stone-100"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {user ? (
              <>
                <li>
                  <Link
                    to="/profile"
                    state={{ backgroundLocation: location }}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-md px-3 py-2.5 text-sm text-stone-900 hover:bg-stone-100"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                    className="w-full rounded-md px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-md bg-stone-900 px-3 py-2.5 text-center text-sm font-semibold text-amber-50"
                >
                  Sign In
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
