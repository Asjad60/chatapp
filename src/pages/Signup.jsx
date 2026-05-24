import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import anonymousImg from "../assets/anonymous.jpg";
import signupIllustration from "../assets/signup_illustration.png";
import { FcCamera } from "react-icons/fc";
import { GiCrossMark } from "react-icons/gi";
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiShield } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { signupUser } from "../services/operations/authAPI";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [previewImg, setPreviewImg] = useState("");
  const navigate = useNavigate();
  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    profile: "",
  });
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    const strongPasswordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;

    if (!strongPasswordPattern.test(signupData.password.trim())) {
      toast.error("Strong Password Required");
      return;
    }

    if (signupData.password.trim() !== signupData.confirmPassword.trim()) {
      toast.error("Passwords do not match");
      return;
    }

    if (!signupData.profile) {
      return toast.error("Profile pic is required");
    }

    if (!agreeTerms) {
      return toast.error("You must agree to the Terms of Service & Privacy Policy");
    }

    const formData = new FormData();
    formData.append("email", signupData.email);
    formData.append("password", signupData.password.trim());
    formData.append("username", signupData.username.trim());
    formData.append("profile", signupData.profile);

    await signupUser(formData, navigate);

    setSignupData({
      email: "",
      password: "",
      confirmPassword: "",
      username: "",
      profile: "",
    });
    setPreviewImg("");
    document.getElementById("profile").value = "";
    setAgreeTerms(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "username" && /[^\w]/.test(value)) {
      toast.error("Username Must Not Contain Special Characters or Spaces");
      return;
    }

    setSignupData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSignupData((prev) => ({
        ...prev,
        [e.target.name]: file,
      }));
      const objectURL = URL.createObjectURL(file);
      setPreviewImg(objectURL);
    }
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
              Experience social connection at the speed of thought. Minimal friction, maximum expression.
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
              Create an Account
            </h2>
            <p className="text-slate-500 mt-0.5 text-xs">
              Sign up to get started with Chit Chat.
            </p>

            <form
              className="mt-3 flex flex-col gap-3"
              onSubmit={handleCreateAccount}
            >
              {/* Profile Photo Uploader */}
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-semibold text-slate-600 mb-0.5">
                  Profile Photo
                </span>
                <div className="relative group">
                  {previewImg ? (
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-indigo-100 shadow-sm">
                      <picture>
                        <img
                          src={previewImg}
                          alt="Profile Preview"
                          className="w-full h-full object-cover"
                        />
                      </picture>
                      <button
                        type="button"
                        title="Remove image"
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-150"
                        onClick={() => {
                          setPreviewImg("");
                          setSignupData((prev) => ({ ...prev, profile: "" }));
                          document.getElementById("profile").value = "";
                        }}
                      >
                        <GiCrossMark size={14} />
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="profile"
                      className="cursor-pointer w-14 h-14 rounded-full border-2 border-indigo-100 shadow-sm flex items-center justify-center bg-white hover:bg-slate-50 transition-colors duration-150 relative group"
                    >
                      <picture>
                        <img
                          src={anonymousImg}
                          alt="Default Avatar"
                          className="w-full h-full rounded-full object-cover opacity-80"
                        />
                      </picture>
                      <span className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        <FcCamera size={18} />
                      </span>
                    </label>
                  )}
                  <input
                    type="file"
                    name="profile"
                    accept="image/*"
                    id="profile"
                    className="hidden"
                    onChange={handleProfile}
                  />
                </div>
              </div>

              {/* Username Field */}
              <div className="flex flex-col">
                <label
                  htmlFor="username"
                  className="light-input-label"
                >
                  Username
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-slate-400">
                    <FiUser size={15} />
                  </span>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="choose_a_username"
                    value={signupData.username}
                    onChange={handleChange}
                    className="light-input-field"
                    required
                  />
                </div>
              </div>

              {/* Email Address Field */}
              <div className="flex flex-col">
                <label
                  htmlFor="email"
                  className="light-input-label"
                >
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
                    value={signupData.email}
                    onChange={handleChange}
                    className="light-input-field"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="flex flex-col">
                <label
                  htmlFor="password"
                  className="light-input-label"
                >
                  Password
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-slate-400">
                    <FiLock size={15} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    value={signupData.password}
                    onChange={handleChange}
                    className="light-input-field"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="flex flex-col">
                <label
                  htmlFor="confirmPassword"
                  className="light-input-label"
                >
                  Confirm Password
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-slate-400">
                    <FiShield size={15} />
                  </span>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={signupData.confirmPassword}
                    onChange={handleChange}
                    className="light-input-field"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showConfirmPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                  </button>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-2 mt-0.5">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-[#0047e1] border-slate-300 focus:ring-indigo-500 mt-0.5 cursor-pointer"
                  required
                />
                <label
                  htmlFor="agreeTerms"
                  className="text-[10px] text-slate-500 leading-normal select-none cursor-pointer"
                >
                  I agree to the <span className="text-[#0047e1] hover:underline cursor-pointer">Terms of Service</span> and <span className="text-[#0047e1] hover:underline cursor-pointer">Privacy Policy</span>.
                </label>
              </div>

              {/* Create Account Button */}
              <button
                type="submit"
                className="light-btn-primary"
              >
                Create Account
              </button>

              {/* Divider */}
              <div className="relative my-0.5 w-full flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <span className="relative px-3 bg-white text-[9px] text-slate-400 uppercase tracking-wider font-semibold">
                  or
                </span>
              </div>

              {/* Login Button */}
              <Link
                to="/login"
                className="light-btn-secondary"
              >
                Log In Instead
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

