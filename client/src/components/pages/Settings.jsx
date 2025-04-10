import React, { useState } from "react";
import { FaUserEdit, FaLock } from "react-icons/fa";
import { MdSave } from "react-icons/md";
import toast from "react-hot-toast";
import useAuthStore from "../../store/useAuthStore";

function Settings() {
  const { user, updateProfile, changePassword } = useAuthStore();

  const [name, setName] = useState(user?.fullName || "John Doe");
  const [email, setEmail] = useState(user?.email || "johndoe");
  const [bio, setBio] = useState(
    user?.bio || "Passionate developer and tech enthusiast."
  );
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleProfileUpdate = async () => {
    const toastId = toast.loading("Updating profile...");
    const res = await updateProfile({ fullName: name, email, bio });

    if (res.success) {
      toast.success("Profile updated", { id: toastId });
    } else {
      toast.error(res.message || "Profile update failed", { id: toastId });
    }
  };

  const handlePasswordUpdate = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      return toast.error("Please fill all password fields");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    const toastId = toast.loading("Updating password...");
    const res = await changePassword({ oldPassword, newPassword });

    if (res.success) {
      toast.success("Password updated", { id: toastId });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      toast.error(res.message || "Password update failed", { id: toastId });
    }
  };

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
            type="email"
            className="input input-bordered w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <textarea
            className="textarea textarea-bordered w-full"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Bio"
          ></textarea>
          <button
            className="btn btn-primary w-full flex items-center gap-2"
            onClick={handleProfileUpdate}
          >
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
          <button
            className="btn btn-error w-full flex items-center gap-2"
            onClick={handlePasswordUpdate}
          >
            <MdSave /> Update Password
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
