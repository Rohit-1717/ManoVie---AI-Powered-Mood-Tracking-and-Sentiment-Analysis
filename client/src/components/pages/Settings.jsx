import React, { useState } from "react";
import { FaUserEdit, FaLock, FaImage } from "react-icons/fa";
import { MdSave } from "react-icons/md";

function Settings() {
  const [name, setName] = useState("John Doe");
  const [username, setUsername] = useState("johndoe");
  const [bio, setBio] = useState("Passionate developer and tech enthusiast.");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h2 className="text-3xl font-bold text-center text-primary">Settings</h2>


      {/* Update Profile Information */}
      <div className="card bg-base-100 shadow-xl p-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FaUserEdit className="text-green-500" /> Update Profile
        </h3>
        <div className="mt-4 space-y-3">
          <input
            type="text"
            className="input input-bordered w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
          />
          <input
            type="text"
            className="input input-bordered w-full"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <textarea
            className="textarea textarea-bordered w-full"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Bio"
          ></textarea>
          <button className="btn btn-primary w-full flex items-center gap-2">
            <MdSave /> Save Changes
          </button>
        </div>
      </div>

      {/* Change Password */}
      <div className="card bg-base-100 shadow-xl p-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FaLock className="text-red-500" /> Change Password
        </h3>
        <div className="mt-4 space-y-3">
          <input
            type="password"
            className="input input-bordered w-full"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Old Password"
          />
          <input
            type="password"
            className="input input-bordered w-full"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
          />
          <input
            type="password"
            className="input input-bordered w-full"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm New Password"
          />
          <button className="btn btn-error w-full flex items-center gap-2">
            <MdSave /> Update Password
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;