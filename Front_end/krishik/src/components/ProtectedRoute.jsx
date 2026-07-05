import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../components/footer./authcontext.jsx";

const ProtectedRoute = ({ children, role }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (role && user.user_type !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
