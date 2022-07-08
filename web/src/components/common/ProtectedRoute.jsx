import { Navigate, Outlet, useLocation } from "react-router-dom";
import { LOGIN_URL } from "../../common/constants";
import { useAuth } from "../../hooks/useAuth";

const ProtectedRoute = () => {
  const { user } = useAuth();
  const location = useLocation();
  return user ? (
    <Outlet />
  ) : (
    <Navigate to={LOGIN_URL} replace state={{ from: location.pathname }} />
  );
};

export default ProtectedRoute;
