import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in (using token from localStorage)
    const checkUserLoggedIn = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        try {
          const response = await axios.get("/api/auth/me");
          setCurrentUser(response.data.data.user);
        } catch (err) {
          console.error("Failed to authenticate token", err);
          localStorage.removeItem("token");
          delete axios.defaults.headers.common["Authorization"];
        }
      }
      setLoading(false);
    };

    checkUserLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await axios.post("/api/auth/login", { email, password });
      const { token, user } = response.data.data;

      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setCurrentUser(user);
      return user;
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to login. Please check your credentials."
      );
      throw err;
    }
  };

  const register = async (name, email, password) => {
    try {
      setError(null);
      const response = await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });
      const { token, user } = response.data.data;

      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setCurrentUser(user);
      return user;
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to register. Please try again."
      );
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
