import React, { useEffect, useState } from "react";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
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
    <div className="h-screen grid place-items-center p-2">
      <div
        className={`animate rounded-lg px-4 py-6 shadow-light-mode dark:shadow-dark-mode bg-light-gradient dark:bg-dark-gradient max-w-[400px] w-full overflow-hidden`}
      >
        <h3 className="text-3xl font-bold  text-center">Login</h3>
        <form
          className="animate flex flex-col gap-6 mt-8 items-center"
          onSubmit={handleSubmitLogin}
        >
          <div className="flex flex-col w-full">
            <label htmlFor="email" className="">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={loginData.email}
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
              value={loginData.password}
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
            <Link
              to="/forgot-password"
              className="text-[12px] hover:underline text-end mt-1 max-w-max self-end"
            >
              <span>Forgot Password</span>
            </Link>
          </div>

          <div>
            <button type="submit" className="btn">
              Login
            </button>
          </div>

          <span className="text-[12px] tracking-wider ">
            Don't have account?{" "}
            <Link to={"/signup"} className="underline">
              SignUp
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Login;
