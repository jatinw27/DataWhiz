import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { loading, isAuthenticated } = useAuth();

  if (loading) return null; // or loader

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
