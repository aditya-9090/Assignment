// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router";
import { useAuth } from "../Context/AuthContext";

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { user, loading } = useAuth();

  
  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/" replace />;

  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    return <div className="text-center mt-10">Access Denied ❌</div>;
  }

  return children;
};

export default ProtectedRoute;
