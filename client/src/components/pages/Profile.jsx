import React from "react";
import { FaUserEdit, FaEnvelope, FaUser, FaClock } from "react-icons/fa";
import { MdOutlineModeEdit } from "react-icons/md";

function Profile() {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-base-200 rounded-lg shadow-md mt-10">
      {/* Profile Picture Section */}
      <div className="flex flex-col items-center">
        <div className="avatar">
          <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            <img src="https://via.placeholder.com/100" alt="Profile" />
          </div>
        </div>
        <button className="btn btn-sm btn-primary rounded-md mt-3 flex gap-2">
          <MdOutlineModeEdit /> Change Picture
        </button>
      </div>

      {/* User Info Section */}
      <div className="mt-6 space-y-4 text-center md:text-left">
        <div className="flex items-center gap-3 text-lg">
          <FaUser className="text-blue-500" />
          <span className="font-semibold">Full Name:</span> John Doe
        </div>

        <div className="flex items-center gap-3 text-lg">
          <FaEnvelope className="text-red-500" />
          <span className="font-semibold">Email:</span> johndoe@example.com
        </div>

        <div className="flex items-center gap-3 text-lg">
          <FaClock className="text-green-500" />
          <span className="font-semibold">Last Login:</span> 28 March 2025, 10:00 AM
        </div>

        <div className="flex flex-col gap-2">
          <span className="font-semibold">Bio:</span>
          <textarea
            className="textarea textarea-bordered w-full"
            placeholder="Write a short bio about yourself..."
          ></textarea>
        </div>
      </div>

      {/* Edit Profile Button */}
      <div className="mt-6 flex justify-center">
        <button className="btn btn-outline btn-accent flex gap-2 rounded-md">
          <FaUserEdit /> Edit Profile
        </button>
      </div>
    </div>
  );
}

export default Profile;
