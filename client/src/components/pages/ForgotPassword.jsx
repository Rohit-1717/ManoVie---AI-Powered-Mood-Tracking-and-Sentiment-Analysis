import React from "react";
import { useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";

function ForgotPassword() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log("Forgot Password Request:", data);
    // Implement password reset logic (send email with reset link)
  };

  return (
    <div className="hero min-h-screen bg-base-300">
      <div className="hero-content flex-col lg:flex-row gap-10">
        <div className="hidden lg:flex w-1/2">
          <img
            src="./forgot_password_bg.png"
            alt="Forgot Password"
            className="rounded-xl shadow-lg"
          />
        </div>

        <div className="card w-full max-w-md bg-base-200 rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-center mb-4">
            Forgot Password?
          </h2>
          <p className="text-center mb-4">
            Enter your registered email to reset your password.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                {...register("email", { required: true })}
                placeholder="Enter your email"
                className="input input-bordered w-full rounded-md"
              />
            </div>

            <button type="submit" className="btn btn-primary w-full rounded-md">
              Send Reset Link
            </button>
          </form>

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

export default ForgotPassword;
