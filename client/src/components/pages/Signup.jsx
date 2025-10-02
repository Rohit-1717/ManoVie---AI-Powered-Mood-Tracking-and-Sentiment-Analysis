import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [formValues, setFormValues] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    avatar: null,
  });

  const registerUser = useAuthStore((state) => state.registerUser);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormValues({ ...formValues, avatar: file });
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullName", formValues.fullName);
    formData.append("username", formValues.username);
    formData.append("email", formValues.email);
    formData.append("password", formValues.password);
    if (formValues.avatar) {
      formData.append("avatar", formValues.avatar);
    }

    const result = await registerUser(formData);
    if (result.success) {
      navigate("/dashboard"); // or wherever after signup
    } else {
      alert(result.message);
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
            className="space-y-4"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formValues.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="input input-bordered w-full rounded-md"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                type="text"
                name="username"
                value={formValues.username}
                onChange={handleChange}
                placeholder="Choose a username"
                className="input input-bordered w-full rounded-md"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={formValues.email}
                onChange={handleChange}
                placeholder="Enter your email"
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
                  value={formValues.password}
                  onChange={handleChange}
                  placeholder="Create a password"
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

            <div className="form-control">
              <label className="label">
                <span className="label-text">Profile Picture</span>
              </label>
              <input
                type="file"
                accept="image/*"
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
            <NavLink to={"/login"} className="hover:underline cursor-pointer">
              Login
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
