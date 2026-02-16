import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Attach token to axios globally
  useEffect(() => {
    axios.defaults.headers.common["Authorization"] =
      token ? `Bearer ${token}` : "";
  }, [token]);

  // Fetch logged-in user
  useEffect(() => {
    const fetchMe = async () => {
      try {
        if (!token) return setLoading(false);

        const res = await axios.get("/api/auth/me");
        setUser(res.data);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  const login = (token, user) => {
    localStorage.setItem("token", token);
    setUser(user);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
