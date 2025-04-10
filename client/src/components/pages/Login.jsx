import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";

function Login() {
  const { register, handleSubmit } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const loginUser = useAuthStore((state) => state.loginUser);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const result = await loginUser(data);
      if (result) {
        navigate("/dashboard");
      }
    } catch (err) {
      setErrorMessage("Invalid username or password. Please try again.");
    }
  };

  return (
    <div className="hero min-h-screen bg-base-300">
      <div className="hero-content flex-col lg:flex-row gap-10">
        <div className="hidden lg:flex w-1/2">
          <img
            src="./login_Page_bg.png"
            alt="Mental Health"
            className="rounded-xl shadow-lg"
          />
        </div>

        <div className="card w-full max-w-md bg-base-200 rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-center mb-4">Welcome Back!</h2>
          <p className="text-center mb-4">
            Login to track your mood and improve well-being.
          </p>

          {errorMessage && (
            <p className="text-red-500 text-center mb-2">{errorMessage}</p>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                type="text"
                {...register("username", { required: true })}
                placeholder="Enter your username"
                className="input input-bordered w-full rounded-md"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", { required: true })}
                  placeholder="Enter your password"
                  className="input input-bordered w-full pr-10 rounded-md"
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
              <NavLink to="/forgot-password" className="hover:underline">
                Forgot Password?
              </NavLink>
            </div>

            <button type="submit" className="btn btn-primary w-full rounded-md">
              Login
            </button>
          </form>

          <p className="text-center text-sm mt-4">
            Don't have an account?{" "}
            <NavLink to="/signup" className="hover:underline">
              Sign Up
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
