import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Nav from "./components/nav/Nav.jsx";
import Hero from "./components/hero/Hero.jsx";
import Footer from "./components/footer/Footer.jsx";
import useTheme from "./hooks/useTheme.js";
import About from "./components/pages/About.jsx";
import Contact from "./components/pages/Contact.jsx";
import Features from "./components/pages/Features.jsx";

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
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
