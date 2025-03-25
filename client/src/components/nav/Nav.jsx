import { useState, useEffect } from "react";
import { FaBars, FaTimes, FaMoon, FaSun } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <nav className="navbar bg-base-100 shadow-md px-4 md:px-12 lg:px-20 py-4">
      {/* Navbar Start */}
      <div className="navbar-start flex items-center">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="btn btn-ghost lg:hidden"
        >
          {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>

        {/* Logo */}
        <div className="flex items-center space-x-2 ml-4 lg:ml-0">
          <img
            src="/ManoVie.svg"
            alt="ManoVie Logo"
            className="h-10 w-10  lg:h-16 w-auto "
          />
          <a className="text-2xl font-bold text-primary  ml-0.5">ManoVie</a>
        </div>
      </div>

      {/* Navbar Center - Desktop Menu */}
      <div className="navbar-center hidden lg:flex flex-grow justify-center">
        <ul className="menu menu-horizontal space-x-6 text-lg">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/features">Features</a>
          </li>
          <li>
            <a href="/about">About</a>
          </li>
          <li>
            <a href="/contact">Contact</a>
          </li>
        </ul>
      </div>

      {/* Navbar End - Buttons */}
      <div className="navbar-end space-x-4">
        {/* Theme Toggle Button */}
        <button
          className="btn btn-ghost"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? <FaMoon size={20} /> : <FaSun size={20} />}
        </button>

        {/* CTA Buttons */}
        <button className="btn btn-outline btn-primary hidden md:inline-block">
          Login
        </button>
        <button className="btn btn-primary hidden md:inline-block">
          Sign Up
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <ul className="absolute left-0 top-16 z-50 w-full bg-base-100 p-4 shadow-md lg:hidden">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/features">Features</a>
          </li>
          <li>
            <a href="/about">About</a>
          </li>
          <li>
            <a href="/contact">Contact</a>
          </li>
          <li>
            <button className="btn btn-outline btn-primary w-full mt-2">
              Login
            </button>
          </li>
          <li>
            <button className="btn btn-primary w-full mt-2">Sign Up</button>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
