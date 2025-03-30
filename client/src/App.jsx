import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Nav from "./components/nav/Nav.jsx";
import Hero from "./components/hero/Hero.jsx";
import Footer from "./components/footer/Footer.jsx";
import useTheme from "./hooks/useTheme.js";
import About from "./components/pages/About.jsx";
import Contact from "./components/pages/Contact.jsx";
import Features from "./components/pages/Features.jsx";
import Login from "./components/pages/Login.jsx";
import Signup from "./components/pages/Signup.jsx";
import ForgotPassword from "./components/pages/ForgotPassword.jsx";
import ResetPassword from "./components/pages/ResetPassword.jsx";
import Profile from "./components/pages/Profile.jsx";
import Settings from "./components/pages/Settings.jsx";
import { UnderConstruction } from "./components/pages/UnderConstruction.jsx";
import { Offline } from "./components/pages/Offline.jsx";

function App() {
  const { theme } = useTheme();

  // Apply the theme globally on mount and when theme changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-base-300">
      <Nav />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/under-construction" element={<UnderConstruction />} />
        <Route path="/offline" element={<Offline />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
