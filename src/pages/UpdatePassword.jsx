import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { IoCheckmarkCircleOutline, IoCloseCircleOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import { updatePassword } from "../services/operations/userAPI";

const rules = [
  { label: "6+ Characters", test: (p) => p.length >= 6 },
  { label: "Uppercase (A-Z)", test: (p) => /[A-Z]/.test(p) },
  { label: "Lowercase (a-z)", test: (p) => /[a-z]/.test(p) },
  { label: "Number (0-9)", test: (p) => /[0-9]/.test(p) },
  { label: "Symbol (@#$)", test: (p) => /[@#$]/.test(p) },
];

const UpdatePassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const strongPasswordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$])[A-Za-z\d@#$]{6,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!strongPasswordPattern.test(formData.password.trim())) {
      toast.error("Please meet all password requirements.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setLoading(true);
    await updatePassword({ ...formData, token }, navigate);
    setLoading(false);
  };

  const passwordMatch =
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;

  return (
    <div className="light-page-bg min-h-screen">
      <div className="light-card-frame max-w-[480px] lg:max-w-[480px] lg:h-auto">
        <div className="w-full flex flex-col justify-center p-8 sm:p-10">

          {/* Branding */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-[#0047e1] flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-blue-500/20">
              C
            </div>
            <span className="font-extrabold text-[#0047e1] text-base tracking-tight">
              Chit Chat
            </span>
          </div>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-xl font-extrabold text-slate-800 leading-tight">
              Set new password
            </h1>
            <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
              Create a strong password to secure your account.
            </p>
          </div>

          {/* Password strength checklist */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 mb-5">
            {rules.map((rule) => {
              const passed = rule.test(formData.password);
              return (
                <div
                  key={rule.label}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[10px] font-bold transition-all duration-200 ${
                    passed
                      ? "bg-green-50 border-green-200 text-green-600"
                      : "bg-slate-50 border-slate-200 text-slate-400"
                  }`}
                >
                  {passed ? (
                    <IoCheckmarkCircleOutline size={13} className="shrink-0" />
                  ) : (
                    <IoCloseCircleOutline size={13} className="shrink-0 text-slate-300" />
                  )}
                  {rule.label}
                </div>
              );
            })}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* New password */}
            <div className="flex flex-col gap-1">
              <label htmlFor="new-password" className="light-input-label">
                New Password
              </label>
              <div className="relative flex items-center">
                <FiLock size={14} className="absolute left-3 text-slate-400" />
                <input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className="light-input-field w-full pr-9"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div className="flex flex-col gap-1">
              <label htmlFor="confirm-password" className="light-input-label">
                Confirm Password
              </label>
              <div className="relative flex items-center">
                <FiLock size={14} className="absolute left-3 text-slate-400" />
                <input
                  id="confirm-password"
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter new password"
                  className={`light-input-field w-full pr-9 ${
                    formData.confirmPassword.length > 0
                      ? passwordMatch
                        ? "border-green-300 focus:border-green-400"
                        : "border-red-300 focus:border-red-400"
                      : ""
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showConfirm ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>
              {formData.confirmPassword.length > 0 && !passwordMatch && (
                <p className="text-[10px] text-red-500 font-semibold mt-0.5 pl-1">
                  Passwords don't match
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="light-btn-primary mt-1 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                "Update Password"
              )}
            </button>
          </form>

          {/* Back to login */}
          <Link
            to="/login"
            className="flex items-center gap-1.5 mt-7 text-[11px] font-bold text-slate-500 hover:text-[#0047e1] transition-colors duration-200 w-fit"
          >
            <FiArrowLeft size={13} />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
