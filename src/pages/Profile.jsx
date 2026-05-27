import React, { useState, useEffect, useRef } from "react";
import { getContextData } from "../context/AuthProvider";
import { updateUserProfile } from "../services/operations/userAPI";
import {
  IoPersonOutline,
  IoMailOutline,
  IoLockClosedOutline,
  IoEyeOutline,
  IoEyeOffOutline,
  IoCameraOutline,
  IoCheckmarkCircleOutline,
  IoCalendarOutline,
  IoPeopleOutline,
  IoShieldCheckmarkOutline,
  IoSaveOutline,
  IoCloseOutline
} from "react-icons/io5";
import { toast } from "react-hot-toast";

const Profile = () => {
  const { user, setUser } = getContextData();

  // Form Fields State
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI States
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef(null);

  // Sync state with Context User once loaded
  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
      setImagePreview(user.image?.url || "");
    }
  }, [user]);

  // Handle Photo Picker Trigger
  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  // Handle Photo Selection & Local Preview Update
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size exceeds 2MB limit");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Check if anything has been modified from original
  const hasChanges = () => {
    if (!user) return false;
    const usernameChanged = username !== user.username;
    const fileChanged = imageFile !== null;
    const passwordAttempted = newPassword.trim() !== "";
    return usernameChanged || fileChanged || passwordAttempted;
  };

  // Reset form back to db values
  const handleCancel = () => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
      setImagePreview(user.image?.url || "");
    }
    setImageFile(null);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    toast.success("Changes discarded");
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hasChanges()) {
      toast.error("No modifications found to save");
      return;
    }

    if (username.trim() === "") {
      toast.error("Username cannot be empty");
      return;
    }

    // Password Update validation
    const hasPasswordInput = newPassword.trim() !== "";
    if (hasPasswordInput) {
      if (currentPassword.trim() === "") {
        toast.error("Please enter your current password to change passwords");
        return;
      }
      if (newPassword.length < 6) {
        toast.error("New password must be at least 6 characters long");
        return;
      }
      if (newPassword !== confirmPassword) {
        toast.error("New passwords do not match");
        return;
      }
    }

    setIsSubmitting(true);
    const formData = new FormData();

    if (username !== user.username) {
      formData.append("username", username.trim());
    }

    if (imageFile) {
      formData.append("profile", imageFile);
    }

    if (hasPasswordInput) {
      formData.append("currentPassword", currentPassword);
      formData.append("newPassword", newPassword);
    }

    const updatedUser = await updateUserProfile(formData, setUser);
    setIsSubmitting(false);

    if (updatedUser) {
      // Clear password fields on successful update
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setImageFile(null);
    }
  };

  // Format joined date beautifully
  const formattedJoinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric"
      })
    : "Joined recently";

  return (
    <div className="w-full h-full flex flex-col dotted-bg font-comfortaa overflow-y-auto p-6 md:p-8 light-scrollbar">
      {/* Header Block */}
      <div className="flex flex-col mb-8 animate">
        <div className="flex items-center gap-2 text-[#0047e1]">
          <IoPersonOutline size={24} className="shrink-0" />
          <h1 className="text-xl font-extrabold tracking-tight">Account Settings</h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Customize your profile interface, update password security, and configure your credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl">
        {/* Left Side: Avatar Container & Stats Cards (lg:col-span-4) */}
        <div className="lg:col-span-4 flex flex-col gap-6 animate">
          {/* Avatar Glass Card */}
          <div className="bg-white/95 border border-slate-200/80 chat-shadow-lg rounded-[28px] p-6 flex flex-col items-center relative overflow-hidden">
            {/* Visual background blob */}
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-blue-500/5 rounded-full blur-xl"></div>
            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl"></div>

            <div className="relative group w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md ring-4 ring-blue-500/10 cursor-pointer transition-transform duration-300 hover:scale-105" onClick={triggerFileSelect}>
              {imagePreview ? (
                <img src={imagePreview} className="w-full h-full object-cover" alt="Profile" />
              ) : (
                <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl uppercase">
                  {username ? username[0] : "?"}
                </div>
              )}
              {/* Dynamic Camera Hover Indicator */}
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <IoCameraOutline size={22} className="text-white animate-pulse" />
                <span className="text-[8px] text-white font-bold mt-1 uppercase tracking-wider">Change photo</span>
              </div>
            </div>

            {/* Hidden Input File selector */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />

            <h3 className="text-sm font-extrabold text-slate-800 mt-4 leading-normal text-center truncate w-full">
              {username || "Chit Chat User"}
            </h3>

            <div className="flex items-center gap-1.5 mt-1 bg-green-50/80 border border-green-100 rounded-full px-2.5 py-0.5">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
              <span className="text-[9px] text-green-600 font-extrabold tracking-wide uppercase">Online Status Active</span>
            </div>

            <p className="text-[10px] text-slate-400 mt-3 text-center">
              Supported files: JPG, PNG. Max size 2MB.
            </p>
          </div>

          {/* Core Stats Card */}
          <div className="bg-white/95 border border-slate-200/80 chat-shadow-md rounded-[28px] p-6 flex flex-col gap-4">
            <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">
              Quick Facts
            </h4>

            {/* Fact 1: Friends count */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0047e1]">
                  <IoPeopleOutline size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-slate-700">Conversations</span>
                  <span className="text-[9px] text-slate-400">Total Friends Connected</span>
                </div>
              </div>
              <span className="text-sm font-extrabold text-[#0047e1]">
                {user?.friends?.length || 0}
              </span>
            </div>

            {/* Fact 2: Member Since */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <IoCalendarOutline size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-slate-700">Member Since</span>
                  <span className="text-[9px] text-slate-400">Account Creation Date</span>
                </div>
              </div>
              <span className="text-[10px] font-extrabold text-indigo-600 uppercase">
                {formattedJoinedDate}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Account Forms & Credentials (lg:col-span-8) */}
        <div className="lg:col-span-8 flex flex-col gap-6 animate">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Personal Details Card */}
            <div className="bg-white/95 border border-slate-200/80 chat-shadow-lg rounded-[28px] p-6 md:p-8 flex flex-col gap-5 relative overflow-hidden">
              <h3 className="text-xs font-extrabold text-slate-800 flex items-center gap-2 border-b border-slate-50 pb-3">
                <IoShieldCheckmarkOutline size={16} className="text-[#0047e1]" />
                Personal Information
              </h3>

              {/* Username Field */}
              <div className="flex flex-col gap-1.5 relative">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                  Username / Public ID
                </label>
                <div className="relative">
                  <IoPersonOutline size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-2xl text-[12px] font-semibold text-slate-800 outline-none shadow-sm transition-all duration-200"
                  />
                </div>
              </div>

              {/* Email Field (Readonly) */}
              <div className="flex flex-col gap-1.5 relative">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                    Email Address
                  </label>
                  <span className="text-[8px] font-extrabold text-blue-600 bg-blue-50 rounded-full px-2 py-0.5 border border-blue-100 flex items-center gap-1">
                    <IoCheckmarkCircleOutline size={10} />
                    Verified Primary
                  </span>
                </div>
                <div className="relative">
                  <IoMailOutline size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-100/80 border border-slate-200 text-slate-400 cursor-not-allowed rounded-2xl text-[12px] font-semibold outline-none"
                  />
                </div>
                <p className="text-[9px] text-slate-400">
                  Email address is linked to your database ID and cannot be modified.
                </p>
              </div>
            </div>

            {/* Password Update Card */}
            <div className="bg-white/95 border border-slate-200/80 chat-shadow-lg rounded-[28px] p-6 md:p-8 flex flex-col gap-5">
              <h3 className="text-xs font-extrabold text-slate-800 flex items-center gap-2 border-b border-slate-50 pb-3">
                <IoLockClosedOutline size={16} className="text-[#0047e1]" />
                Security Credentials
              </h3>

              {/* Current Password */}
              <div className="flex flex-col gap-1.5 relative">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                  Current Password
                </label>
                <div className="relative">
                  <IoLockClosedOutline size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showCurrentPass ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-2xl text-[12px] font-semibold text-slate-800 outline-none shadow-sm transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    {showCurrentPass ? <IoEyeOffOutline size={16} /> : <IoEyeOutline size={16} />}
                  </button>
                </div>
              </div>

              {/* Password Grid (New & Confirm New) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* New Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                    New Password
                  </label>
                  <div className="relative">
                    <IoLockClosedOutline size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showNewPass ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-2xl text-[12px] font-semibold text-slate-800 outline-none shadow-sm transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      {showNewPass ? <IoEyeOffOutline size={16} /> : <IoEyeOutline size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <IoLockClosedOutline size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showConfirmPass ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-2xl text-[12px] font-semibold text-slate-800 outline-none shadow-sm transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      {showConfirmPass ? <IoEyeOffOutline size={16} /> : <IoEyeOutline size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Form Control Block */}
            <div className="flex items-center justify-end gap-3.5 mt-2">
              {/* Discard changes */}
              <button
                type="button"
                onClick={handleCancel}
                disabled={!hasChanges() || isSubmitting}
                className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 bg-white rounded-2xl text-slate-500 hover:text-slate-800 hover:bg-slate-50/80 font-bold text-[11px] tracking-wide uppercase transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <IoCloseOutline size={16} />
                Discard
              </button>

              {/* Submit Changes */}
              <button
                type="submit"
                disabled={!hasChanges() || isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#0047e1] text-white hover:bg-blue-700 font-bold text-[11px] tracking-wide uppercase rounded-2xl shadow-md hover:shadow-lg shadow-blue-500/10 active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <IoSaveOutline size={14} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
