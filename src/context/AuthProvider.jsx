import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { AuthContext } from "./AuthContext";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadCurrentUser = async () => {
    const { data } = await api.get("/users/me");
    setUser(data);
    return data;
  };

  const signup = async (body) => {
    try {
      setLoading(true);
      const { data } = await api.post("/auth/signup", body);
      localStorage.setItem("authToken", data.authToken);
      await loadCurrentUser();
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const login = async (body) => {
    try {
      setLoading(true);
      const { data } = await api.post("/auth/login", body);
      localStorage.setItem("authToken", data.authToken);
      await loadCurrentUser();
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    navigate("/login");
  };

  const verify = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      await loadCurrentUser();
    } catch {
      localStorage.removeItem("authToken");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verify();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout, updateUser: setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
