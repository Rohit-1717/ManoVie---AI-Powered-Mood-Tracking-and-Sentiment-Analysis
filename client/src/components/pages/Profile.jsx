import React, { useRef } from "react";
import {
  FaUserEdit,
  FaEnvelope,
  FaUser,
  FaClock,
  FaUserCircle,
} from "react-icons/fa";
import { MdOutlineModeEdit } from "react-icons/md";
import useAuthStore from "../../store/useAuthStore";
import { NavLink } from "react-router-dom";

function Profile() {
  const { user, updateAvatar } = useAuthStore();
  const fileInputRef = useRef(null);

  if (!user) {
    return (
      <div className="text-center mt-20 text-xl font-semibold text-error">
        User data not available. Please login again.
      </div>
    );
  }

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const result = await updateAvatar(file);
      if (!result.success) {
        alert(result.message);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-base-200 rounded-lg shadow-md mt-10">
      {/* Profile Picture Section */}
      <div className="flex flex-col items-center">
        <div className="avatar">
          <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
            <img
              src={user?.avatar || "https://via.placeholder.com/100"}
              alt="Profile"
              className="object-center object-cover w-full h-full"
            />
          </div>
        </div>
        <button
          onClick={handleAvatarClick}
          className="btn btn-sm btn-primary rounded-md mt-3 flex gap-2"
        >
          <MdOutlineModeEdit /> Change Picture
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* User Info Section */}
      <div className="mt-6 space-y-4 text-center md:text-left">
        <div className="flex items-center gap-3 text-lg">
          <FaUser className="text-blue-500" />
          <span className="font-semibold">Full Name:</span> {user.fullName}
        </div>

        <div className="flex items-center gap-3 text-lg">
          <FaUserCircle className="text-green-500" />
          <span className="font-semibold">Username:</span> {user.username}
        </div>

        <div className="flex items-center gap-3 text-lg">
          <FaEnvelope className="text-red-500" />
          <span className="font-semibold">Email:</span> {user.email}
        </div>

        <div className="flex items-center gap-3 text-lg">
          <FaClock className="text-green-500" />
          <span className="font-semibold">Joined On:</span>{" "}
          {new Date(user.createdAt).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>

        <div className="flex flex-col gap-2">
          <span className="font-semibold">Bio:</span>
          <p className="inline-block px-4 py-2 border-2 border-zinc-700 rounded-md max-w-full ">
            {user.bio}
          </p>
        </div>
      </div>

      {/* Edit Profile Button */}
      <div className="mt-6 flex justify-center">
        <button className="btn btn-outline btn-accent flex gap-2 rounded-md">
          <FaUserEdit />
          <NavLink to="/Settings">Edit Profile</NavLink>
        </button>
      </div>
    </div>
  );
}

export default Profile;
