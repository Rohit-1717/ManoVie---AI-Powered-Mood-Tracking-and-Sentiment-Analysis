import React from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import useTheme from "../../hooks/useTheme";
import { NavLink } from "react-router-dom";

function Nav() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="mx-auto md:px-16 lg:px-20">
      <div className="navbar bg-base-300">
        <div className="navbar-start">
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
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive ? "text-primary font-bold" : ""
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    isActive ? "text-primary font-bold" : ""
                  }
                >
                  About
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/features"
                  className={({ isActive }) =>
                    isActive ? "text-primary font-bold" : ""
                  }
                >
                  Features
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/contact"
                  className={({ isActive }) =>
                    isActive ? "text-primary font-bold" : ""
                  }
                >
                  Contact
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="flex items-center justify-between">
            <img
              className="h-12 w-12 lg:h-18 lg:w-18"
              src="./ManoVie.svg"
              alt="Logo_Manovie"
            />
            <NavLink to="/" className="text-xl font-bold">
              ManoVie
            </NavLink>
          </div>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "text-primary font-bold" : "hover:text-primary"
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  isActive ? "text-primary font-bold" : "hover:text-primary"
                }
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/features"
                className={({ isActive }) =>
                  isActive ? "text-primary font-bold" : "hover:text-primary"
                }
              >
                Features
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  isActive ? "text-primary font-bold" : "hover:text-primary"
                }
              >
                Contact
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Navbar End Section */}
        <div className="navbar-end flex gap-4 items-center">
          {/* Dark Mode Toggle Button */}
          <button className="btn btn-outline" onClick={toggleTheme}>
            {theme === "light" ? (
              <MdDarkMode className="text-xl" />
            ) : (
              <MdLightMode className="text-xl" />
            )}
          </button>

          {/* Login Button */}
          <NavLink to="/login" className="btn btn-primary">
            Login
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Nav;
