import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

// Layout components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// Page components
import HomePage from "./pages/HomePage";
import BusinessListPage from "./pages/BusinessListPage";
import BusinessDetailPage from "./pages/BusinessDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SubmitBusinessPage from "./pages/SubmitBusinessPage";
import DashboardPage from "./pages/DashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import NotFoundPage from "./pages/NotFoundPage";

// Protected route component
const ProtectedRoute = ({ children, requireAdmin }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && currentUser.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

const App = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/businesses" element={<BusinessListPage />} />
          <Route
            path="/businesses/category/:categoryId"
            element={<BusinessListPage />}
          />
          <Route
            path="/businesses/location/:locationId"
            element={<BusinessListPage />}
          />
          <Route path="/businesses/:id" element={<BusinessDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route
            path="/submit-business"
            element={
              <ProtectedRoute>
                <SubmitBusinessPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* 404 route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
