import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { GoSearch } from "react-icons/go";
import { ShoppingCart, Menu, X, ChevronDown, Package, LogOut } from "lucide-react";
import { AuthContext } from "../footer/authcontext.jsx";
import { useCart } from "../../contexts/CartContext";
import Button from "../ui/Button";
import CartDrawer from "../ui/CartDrawer";

const NavBar = ({ searchQuery = "", onSearchChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const { itemCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

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
    { to: "/vegetables", label: "Vegetable Rates" },
    ...(user?.user_type === "seller"
      ? [{ to: "/my-products", label: "My Products" }]
      : []),
    ...(user?.user_type === "buyer"
      ? [{ to: "/orders", label: "My Orders" }]
      : []),
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="shrink-0">
            <span className="font-display text-xl font-bold text-primary sm:text-2xl">
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
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <form
            onSubmit={handleSearchSubmit}
            className="hidden flex-1 max-w-xs items-center gap-2 rounded-lg border border-border bg-input-background px-3 py-2 lg:flex lg:max-w-sm"
          >
            <input
              type="text"
              placeholder="Search produce..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
            />
            <button type="submit" className="text-muted-foreground hover:text-primary">
              <GoSearch size={18} />
            </button>
          </form>

          <div className="flex items-center gap-2 sm:gap-3">
            {user && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative rounded-lg p-2.5 text-muted-foreground transition hover:bg-muted hover:text-primary"
                aria-label="Cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-secondary-foreground">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </button>
            )}

            {user ? (
              <div className="relative hidden md:block">
                <button
                  type="button"
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 rounded-lg border border-border bg-input-background px-3 py-2 text-sm font-medium text-foreground transition hover:border-primary"
                >
                  {user.first_name}
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg border border-border bg-card py-1 shadow-sm">
                      <Link
                        to="/profile"
                        state={{ backgroundLocation: location }}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted"
                      >
                        Profile
                      </Link>
                      {user.user_type === "buyer" && (
                        <Link
                          to="/orders"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted"
                        >
                          <Package className="h-4 w-4" />
                          My Orders
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10"
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
                className="hidden rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 md:block"
              >
                Sign In
              </Link>
            )}

            <button
              type="button"
              className="rounded-lg p-2.5 text-foreground md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-border bg-card px-4 py-4 md:hidden">
            <form onSubmit={handleSearchSubmit} className="mb-4 flex items-center gap-2 rounded-lg border border-border px-3 py-2">
              <input
                type="text"
                placeholder="Search produce..."
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="w-full text-sm outline-none text-foreground"
              />
              <GoSearch size={18} className="text-muted-foreground" />
            </form>
            <ul className="space-y-1">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
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
                      className="block rounded-lg px-3 py-2.5 text-sm text-foreground hover:bg-muted"
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => { handleLogout(); setMobileOpen(false); }}
                      className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-destructive hover:bg-destructive/10"
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
                    className="block rounded-lg bg-primary px-3 py-2.5 text-center text-sm font-semibold text-primary-foreground"
                  >
                    Sign In
                  </Link>
                </li>
              )}
            </ul>
          </div>
        )}
      </nav>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default NavBar;
