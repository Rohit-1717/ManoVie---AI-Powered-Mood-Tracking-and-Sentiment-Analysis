import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Nav from "./components/nav/Nav.jsx";
import Hero from "./components/hero/Hero.jsx";
import Footer from "./components/footer/Footer.jsx";
import useTheme from "./hooks/useTheme.js";
import useAuthStore from "./store/useAuthStore.js";

import About from "./components/pages/About.jsx";
import Contact from "./components/pages/Contact.jsx";
import Features from "./components/pages/Features.jsx";
import Login from "./components/pages/Login.jsx";
import Signup from "./components/pages/Signup.jsx";
import ForgotPassword from "./components/pages/ForgotPassword.jsx";
import ResetPassword from "./components/pages/ResetPassword.jsx";
import Profile from "./components/pages/Profile.jsx";
import Settings from "./components/pages/Settings.jsx";
import Dashboard from "./components/pages/Dashboard.jsx";
import WriteJournal from "./components/pages/WriteJournal.jsx";
import TrackMood from "./components/pages/TrackMood.jsx";
import { UnderConstruction } from "./components/pages/UnderConstruction.jsx";
import { Offline } from "./components/pages/Offline.jsx";
import ViewReport from "./components/pages/ViewReport.jsx";

function App() {
  const { theme } = useTheme();
  const {
    isAuthenticated,
    authChecked,
    fetchUserFromToken,
    logoutUser,
  } = useAuthStore();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Fetch user on app load
  useEffect(() => {
    const initAuth = async () => {
      try {
        await fetchUserFromToken();
      } catch {
        logoutUser();
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  // Optional: refresh access token every 10 minutes
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        if (isAuthenticated) {
          await fetchUserFromToken();
        }
      } catch {
        logoutUser();
      }
    }, 1000 * 60 * 10);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const ProtectedRoute = ({ children }) => {
    if (!authChecked) return null; // wait until auth status checked
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-300">
      <Nav />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Hero />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/under-construction" element={<UnderConstruction />} />
        <Route path="/offline" element={<Offline />} />

        {/* Protected Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/journal/write"
          element={
            <ProtectedRoute>
              <WriteJournal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mood/track"
          element={
            <ProtectedRoute>
              <TrackMood />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/ViewReport"
          element={
            <ProtectedRoute>
              <ViewReport />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
