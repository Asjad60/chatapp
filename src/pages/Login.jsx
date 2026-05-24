import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import signupIllustration from "../assets/signup_illustration.png";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { loginUser } from "../services/operations/authAPI";
import { getContextData } from "../context/AuthProvider";

const Login = () => {
  const navigate = useNavigate();
  const { setToken, setUser } = getContextData();
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setLoginData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    await loginUser(loginData, navigate, setToken, setUser);
  };

  return (
    <div className="light-page-bg z-50">
      {/* Floating Card Container */}
      <div className="light-card-frame">
        {/* Left Column - Branding & Graphic */}
        <div className="w-full lg:w-1/2 bg-[#e0e7ff] flex flex-col justify-center items-center p-6 lg:p-8 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-xs flex flex-col items-center">
            {/* Illustration Card */}
            <div className="w-[180px] h-[180px] lg:w-[220px] lg:h-[220px] bg-white/20 backdrop-blur-md rounded-3xl p-4 shadow-lg flex items-center justify-center transform hover:scale-[1.02] transition-transform duration-300">
              <picture>
                <img
                  src={signupIllustration}
                  alt="Chit Chat 3D Illustration"
                  className="max-w-full max-h-full object-contain rounded-2xl"
                />
              </picture>
            </div>

            {/* Application Branding */}
            <h1 className="text-3xl lg:text-4xl font-[900] text-[#0047e1] tracking-tight mt-5">
              Chit Chat
            </h1>
            <p className="text-slate-600 mt-2 max-w-xs text-[11px] leading-relaxed">
              Experience social connection at the speed of thought. Minimal
              friction, maximum expression.
            </p>
          </div>
          {/* Subtle background glow effect */}
          <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-[#818cf8]/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-[#c7d2fe]/30 rounded-full blur-3xl"></div>
        </div>

        {/* Right Column - Form */}
        <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center items-center p-6 lg:p-8">
          <div className="max-w-sm w-full my-auto py-1">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-slate-500 mt-0.5 text-xs">
              Sign in to continue chatting on Chit Chat.
            </p>

            <form
              className="mt-6 flex flex-col gap-4"
              onSubmit={handleSubmitLogin}
            >
              {/* Email Address Field */}
              <div className="flex flex-col">
                <label htmlFor="email" className="light-input-label">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-slate-400">
                    <FiMail size={15} />
                  </span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                    value={loginData.email}
                    onChange={handleChange}
                    className="light-input-field"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-0.5">
                  <label htmlFor="password" className="light-input-label">
                    Password
                  </label>
                  <Link
                    to="/reset-password"
                    className="text-[10px] text-[#0047e1] hover:underline font-semibold"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-slate-400">
                    <FiLock size={15} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={handleChange}
                    className="light-input-field"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? (
                      <FiEyeOff size={15} />
                    ) : (
                      <FiEye size={15} />
                    )}
                  </button>
                </div>
              </div>

              {/* Log In Button */}
              <button type="submit" className="light-btn-primary mt-2">
                Log In
              </button>

              {/* Divider */}
              <div className="relative my-1 w-full flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <span className="relative px-3 bg-white text-[9px] text-slate-400 uppercase tracking-wider font-semibold">
                  or
                </span>
              </div>

              {/* Create Account Button */}
              <Link to="/signup" className="light-btn-secondary">
                Create Account Instead
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
