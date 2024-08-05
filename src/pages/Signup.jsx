import React, { useState } from "react";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import anonymousImg from "../assets/anonymous.jpg";
import { FcCamera } from "react-icons/fc";
import { GiCrossMark } from "react-icons/gi";
import { toast } from "react-hot-toast";
import { signupUser } from "../services/operations/authAPI";
import Button from "../components/Button";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [previewImg, setPreviewImg] = useState("");
  const navigate = useNavigate();
  //   const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
    username: "",
    profile: "",
  });

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    const strongPasswordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
    if (!strongPasswordPattern.test(signupData.password.trim())) {
      toast.error("Strong Password Required");
      return;
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
      username: "",
      profile: "",
    });
    setPreviewImg("");
    document.getElementById("profile").value = "";
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
    setSignupData((prev) => ({
      ...prev,
      [e.target.name]: file,
    }));
    const objectURL = URL.createObjectURL(file);
    setPreviewImg(objectURL);
  };

  return (
    <div className="h-screen grid place-items-center p-2">
      <div
        className={`animate rounded-lg px-4 py-6  max-w-[400px] w-full overflow-hidden border border-gray-600/30`}
      >
        <h3 className="text-3xl font-bold  text-center">Signup</h3>
        <form
          className="animate flex flex-col gap-6 mt-8 items-center"
          onSubmit={handleCreateAccount}
        >
          <div className="max-w-[100px] h-[100px]">
            {previewImg ? (
              <div className="relative">
                <picture>
                  <img
                    src={previewImg}
                    alt="profile"
                    className="rounded-full h-[100px] w-[100px] object-cover"
                  />
                </picture>
                <button
                  title="Remove"
                  className="absolute -right-2 -top-2 text-red-500 dark:shadow-dark-mode shadow-light-mode p-1 rounded-full"
                  onClick={() => {
                    setPreviewImg("");
                    document.getElementById("profile").value = "";
                    // setFileInputKey(Date.now());
                  }}
                >
                  <GiCrossMark size={20} />
                </button>
              </div>
            ) : (
              <label htmlFor="profile" className="cursor-pointer relative">
                <picture>
                  <img
                    src={anonymousImg}
                    alt="profile"
                    className="h-full w-full rounded-full object-cover"
                  />
                </picture>
                <span className="absolute right-1 bottom-0">
                  <FcCamera size={30} />
                </span>
              </label>
            )}

            <input
              type="file"
              name="profile"
              id="profile"
              className="hidden"
              //   key={fileInputKey}
              onChange={handleProfile}
              required
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="username" className="">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={signupData.username}
              onChange={handleChange}
              className="form-style"
              required
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="email" className="">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={signupData.email}
              onChange={handleChange}
              className="form-style"
              required
            />
          </div>

          <div className="flex flex-col relative w-full">
            <label htmlFor="password">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={signupData.password}
              onChange={handleChange}
              className="form-style"
              required
            />
            <span
              className=" absolute top-10 right-2 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <BsFillEyeSlashFill /> : <BsFillEyeFill />}
            </span>
          </div>

          <div>
            <Button type="submit" customClass={"px-4 py-2"}>
              Create
            </Button>
          </div>

          <span className="text-[12px] tracking-wider ">
            Have an account?{" "}
            <Link to={"/login"} className="underline">
              Login
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Signup;
