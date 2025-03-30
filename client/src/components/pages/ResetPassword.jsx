import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { NavLink } from "react-router-dom";

function ResetPassword() {
  const { register, handleSubmit, watch } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = (data) => {
    console.log("Reset Password Data:", data);
  };

  return (
    <div className="hero min-h-screen bg-base-300">
      <div className="hero-content flex-col lg:flex-row gap-10">
        {/* Left Side - Image */}
        <div className="hidden lg:flex w-1/2">
          <img
            src="./reset_password_bg.png"
            alt="Reset Password"
            className="rounded-xl shadow-lg"
          />
        </div>

        {/* Right Side - Reset Password Form */}
        <div className="card w-full max-w-md bg-base-200 rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-center mb-4">
            Reset Your Password
          </h2>
          <p className="text-center mb-4">Enter your new password below.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* New Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">New Password</span>
              </label>
              <div className="relative">
                <input
                  {...register("newPassword", { required: true })}
                  placeholder="Enter new password"
                  className="input input-bordered w-full pr-10 rounded-md"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword", {
                    required: true,
                    validate: (value) =>
                      value === watch("newPassword") ||
                      "Passwords do not match",
                  })}
                  placeholder="Confirm new password"
                  className="input input-bordered w-full pr-10 rounded-md"
                />
                <span
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary w-full rounded-md">
              Reset Password
            </button>
          </form>

          {/* Back to Login */}
          <p className="text-center text-sm mt-4">
            <NavLink to="/login" className="hover:underline">
              Back to Login
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
