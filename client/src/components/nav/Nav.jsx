import React from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";
import useThemeStore from "../../hooks/useTheme";
import useAuthStore from "../../store/useAuthStore";

function Nav() {
  const { theme, toggleTheme } = useThemeStore();
  const { isAuthenticated, user, logoutUser } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const userDisplayName = user?.fullName || user?.username || "User";

  return (
    <div className="mx-auto md:px-16 lg:px-20">
      <div className="navbar bg-base-300">
        {/* Navbar Start */}
        <div className="navbar-start">
          {/* Mobile Dropdown */}
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
              src="/ManoVie.svg"
              alt="ManoVie Logo"
            />
            <NavLink to="/" className="text-xl font-bold ml-2">
              ManoVie
            </NavLink>
          </div>
        </div>

        {/* Center Navigation (visible on desktop) */}
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

        {/* Navbar End */}
        <div className="navbar-end flex gap-4 items-center">
          {/* Theme toggle */}
          <button className="btn btn-outline rounded-md" onClick={toggleTheme}>
            {theme === "wireframe" ? (
              <MdDarkMode className="text-xl" />
            ) : (
              <MdLightMode className="text-xl" />
            )}
          </button>

          {/* Authenticated Section */}
          {isAuthenticated && user ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="avatar btn btn-ghost btn-circle tooltip"
                data-tip={userDisplayName}
              >
                <div className="w-10 rounded-full">
                  <img
                    src={user.avatar || "/default-avatar.png"}
                    alt="User Avatar"
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-md shadow mt-3 w-44"
              >
                <li>
                  <NavLink to="/profile">Profile</NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard">Dashboard</NavLink>
                </li>
                <li>
                  <NavLink to="/settings">Settings</NavLink>
                </li>
                <li>
                  <button onClick={handleLogout}>Logout</button>
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
