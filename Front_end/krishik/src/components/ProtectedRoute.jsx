import { Navigate, useLocation, Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../components/footer./authcontext.jsx";
import Button from "./ui/Button";

const ProtectedRoute = ({ children, role }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  const userRole = String(user.user_type || "").toLowerCase();
  const requiredRole = role ? String(role).toLowerCase() : null;

  if (requiredRole && userRole !== requiredRole) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="font-serif text-2xl font-bold text-stone-900">Access restricted</h1>
        <p className="mt-3 text-stone-500">
          This page is for <strong>{requiredRole}</strong> accounts. You&apos;re signed in as a{" "}
          <strong>{userRole}</strong>.
        </p>
        {requiredRole === "buyer" && userRole === "seller" && (
          <p className="mt-2 text-sm text-stone-500">
            Farmer accounts can list products but cannot place orders. Sign in with a buyer account
            to checkout.
          </p>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button as={Link} to="/cart" variant="outline">
            Back to cart
          </Button>
          <Button as={Link} to="/products">
            Browse marketplace
          </Button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
