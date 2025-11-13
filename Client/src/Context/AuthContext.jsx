// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { loginUser } from "../Api/apis/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false); 
  }, []);

  const login = async (credentials) => {
    try {
      const data = await loginUser(credentials);
      const userData = {
        ...data.user,
        token: data.data.token,
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", userData.token);

      if (userData.role === "admin") {
        navigate("/system");
      } else {
        navigate("/system/sdashboard");
      }

      return { success: true, data: userData };
    } catch (err) {
      console.error("Login failed:", err);
      return {
        success: false,
        message: err.response?.data?.error || "Invalid credentials",
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
