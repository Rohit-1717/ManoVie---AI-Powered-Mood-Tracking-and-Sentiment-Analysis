import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";

function Signup() {
  const { register, handleSubmit } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const registerUser = useAuthStore((state) => state.registerUser);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("username", data.username);
      formData.append("email", data.email);
      formData.append("password", data.password);

      if (data.avatar && data.avatar.length > 0) {
        formData.append("avatar", data.avatar[0]);
      }

      const result = await registerUser(formData);
      if (result) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="hero min-h-screen bg-base-300">
      <div className="hero-content flex-col lg:flex-row gap-10">
        <div className="hidden lg:flex w-1/2 lg:h-1/2">
          <img
            src="/signup_bg.png"
            alt="Signup Illustration"
            className="rounded-xl shadow-lg"
          />
        </div>
        <div className="card w-full max-w-md bg-base-200 rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-center mb-4">
            Create Your Account
          </h2>
          <p className="text-center mb-4">
            Join us to track your mood and improve well-being.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            encType="multipart/form-data"
          >
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                {...register("fullName")}
                placeholder="Enter your full name"
                className="input input-bordered w-full rounded-md"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                type="text"
                {...register("username")}
                placeholder="Choose a username"
                className="input input-bordered w-full rounded-md"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                {...register("email")}
                placeholder="Enter your email"
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
                  {...register("password")}
                  placeholder="Create a password"
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

            <div className="form-control">
              <label className="label">
                <span className="label-text">Profile Picture</span>
              </label>
              <input
                type="file"
                accept="image/*"
                {...register("avatar")}
                className="file-input file-input-bordered w-full rounded-md"
                onChange={handleAvatarChange}
              />
              {avatarPreview && (
                <img
                  src={avatarPreview}
                  alt="Avatar Preview"
                  className="mt-2 w-20 h-20 rounded-md object-cover"
                />
              )}
            </div>

            <button type="submit" className="btn btn-primary w-full rounded-md">
              Sign Up
            </button>
          </form>

          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <NavLink to={"/login"} className="hover:underline cursor-pointer ">
              Login
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
