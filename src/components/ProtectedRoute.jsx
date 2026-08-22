import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../lib/useAuthContext";
import "./ProtectedRoute.css";

export default function ProtectedRoute() {
  const { user, loading } = useAuthContext();

  if (loading) return <p className="muted container route-loading">Loading…</p>;

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}