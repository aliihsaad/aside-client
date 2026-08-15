import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../lib/useAuthContext";

export default function ProtectedRoute() {
  const { user, loading } = useAuthContext();

  if (loading) return <p className="muted container">Loading…</p>;

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}