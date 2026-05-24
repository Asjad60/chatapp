import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMail, FiArrowLeft } from "react-icons/fi";
import { IoCheckmarkCircle } from "react-icons/io5";
import { sendResetPasswordMail } from "../services/operations/userAPI";

const ResetPassword = () => {
  const [mailSent, setMailSent] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await sendResetPasswordMail(email, setMailSent);
    setLoading(false);
  };

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

          {!mailSent ? (
            <>
              {/* Header */}
              <div className="mb-7">
                <h1 className="text-xl font-extrabold text-slate-800 leading-tight">
                  Reset your password
                </h1>
                <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                  Enter your email and we'll send you a link to reset your
                  password.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label htmlFor="reset-email" className="light-input-label">
                    Email Address
                  </label>
                  <div className="relative flex items-center">
                    <FiMail
                      size={14}
                      className="absolute left-3 text-slate-400"
                    />
                    <input
                      id="reset-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="light-input-field w-full"
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="light-btn-primary mt-1 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Success state */
            <div className="flex flex-col items-center text-center gap-5 py-4">
              <div className="w-16 h-16 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center shadow-sm">
                <IoCheckmarkCircle size={32} className="text-green-500" />
              </div>
              <div>
                <h1 className="text-lg font-extrabold text-slate-800">
                  Check your inbox
                </h1>
                <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed max-w-xs mx-auto">
                  We've sent a password reset link to{" "}
                  <span className="font-bold text-slate-700">{email}</span>.
                  Check your spam folder if you don't see it.
                </p>
              </div>
              <form onSubmit={handleSubmit} className="w-full">
                <button type="submit" className="light-btn-secondary w-full">
                  Resend Email
                </button>
              </form>
            </div>
          )}

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

export default ResetPassword;
