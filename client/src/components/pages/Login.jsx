import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import DemoCredentials from "../demoCredentials/DemoCredentials";


function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loginUser = useAuthStore((state) => state.loginUser);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
      const res = await loginUser({ username, password });

      if (!res.success) {
        throw new Error(res.message || "Login failed");
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hero min-h-screen bg-base-300">
      <div className="hero-content flex-col lg:flex-row gap-10 w-full">
        {/* Left Image */}
        <div className="hidden lg:flex w-1/2">
          <img
            src="./login_Page_bg.png"
            alt="Mental Health"
            className="rounded-xl shadow-lg"
          />
        </div>

        {/* Right Card */}
        <div className="w-full max-w-md flex flex-col gap-4">
          <div className="card bg-base-200 rounded-2xl shadow-2xl p-8 flex flex-col gap-4">
            <h2 className="text-3xl font-bold text-center">Welcome Back!</h2>
            <p className="text-center text-sm sm:text-base">
              Login to track your mood and improve well-being.
            </p>

            {/* Demo Credentials */}
            <DemoCredentials />

            {/* Error Message */}
            {error && <p className="text-red-500 text-center">{error}</p>}

            {/* Login Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Username</span>
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  className="input input-bordered w-full rounded-md"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    className="input input-bordered w-full pr-10 rounded-md"
                    required
                  />
                  <span
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <NavLink to="/forgot-password" className="hover:underline text-sm">
                  Forgot Password?
                </NavLink>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full rounded-md"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="text-center text-sm mt-2">
              Don't have an account?{" "}
              <NavLink to="/signup" className="hover:underline">
                Sign Up
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
