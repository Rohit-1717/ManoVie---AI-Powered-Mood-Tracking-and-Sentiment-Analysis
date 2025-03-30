import React from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { NavLink } from "react-router-dom";
import useThemeStore from "../../hooks/useTheme"; // Ensure correct import
import useAuthStore from "../../hooks/useAuth";

function Nav() {
  const { theme, toggleTheme } = useThemeStore();
  const { isLoggedIn, user, logout } = useAuthStore(); // Get authentication state

  return (
    <div className="mx-auto md:px-16 lg:px-20">
      <div className="navbar bg-base-300">
        <div className="navbar-start">
          {/* Dropdown for Mobile Navigation */}
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
            >
              <li>
                <NavLink to="/">Home</NavLink>
              </li>
              <li>
                <NavLink to="/about">About</NavLink>
              </li>
              <li>
                <NavLink to="/features">Features</NavLink>
              </li>
              <li>
                <NavLink to="/contact">Contact</NavLink>
              </li>
            </ul>
          </div>

          {/* Logo */}
          <div className="flex items-center">
            <img
              className="h-12 w-12 lg:h-18 lg:w-18"
              src="./ManoVie.svg"
              alt="ManoVie Logo"
            />
            <NavLink to="/" className="text-xl font-bold ml-2">
              ManoVie
            </NavLink>
          </div>
        </div>

        {/* Navbar Center (Desktop Navigation) */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li>
              <NavLink to="/about">About</NavLink>
            </li>
            <li>
              <NavLink to="/features">Features</NavLink>
            </li>
            <li>
              <NavLink to="/contact">Contact</NavLink>
            </li>
          </ul>
        </div>

        {/* Navbar End Section */}
        <div className="navbar-end flex gap-4 items-center">
          {/* Dark Mode Toggle */}
          <button className="btn btn-outline rounded-md" onClick={toggleTheme}>
            {theme === "wireframe" ? (
              <MdDarkMode className="text-xl" />
            ) : (
              <MdLightMode className="text-xl" />
            )}
          </button>

          {/* Show Avatar if Logged In, Otherwise Show Login Button */}
          {isLoggedIn ? (
            <div className="dropdown dropdown-end ">
              <div
                tabIndex={0}
                role="button"
                className="avatar btn btn-ghost btn-circle"
              >
                <div className="w-10 rounded-full">
                  <img
                    src={user?.avatar || "/default-avatar.png"}
                    alt="User Avatar"
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-md shadow mt-3 w-40"
              >
                <li>
                  <NavLink to="/profile">Profile</NavLink>
                </li>
                <li>
                  <NavLink to="/settings">Settings</NavLink>
                </li>
                <li>
                  <button onClick={logout}>Logout</button>
                </li>
              </ul>
            </div>
          ) : (
            <NavLink to="/login" className="btn btn-primary rounded-md">
              Login
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
}

export default Nav;
