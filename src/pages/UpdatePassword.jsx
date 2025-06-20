import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import { FaArrowLeftLong } from "react-icons/fa6";
import toast from "react-hot-toast";
import { updatePassword } from "../services/operations/userAPI";

const UpdatePassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setformData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    const strongPasswordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$])[A-Za-z\d@#$]{6,}$/;
    if (!strongPasswordPattern.test(formData.password.trim())) {
      toast.error("Strong Password Required");
      return;
    }

    const result = await updatePassword({ ...formData, token }, navigate);
  };

  const handleNewPassword = (e) => {
    setformData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  // console.log("formData => ", formData);

  return (
    <section className="grid place-items-center min-h-screen w-full text-slate-100">
      <div className="max-w-[600px] p-4 md:p-10 border border-gray-300/10">
        <div className="mb-6">
          <h1 className="text-4xl font-extrabold font-inter text-blue-800">
            CHIT CHAT
          </h1>
          <h2 className="text-2xl font-bold mt-2 mb-4">Reset password</h2>
          <p className="text-gray-700 mb-4">
            Just type it twice and try not to forget it. Password should be and
            must contain:
          </p>
          <div className="flex flex-wrap gap-2 mb-4 text-sm text-gray-600">
            <span
              className={` p-2 rounded ${
                formData.password.length >= 6
                  ? "bg-blue-800 text-white"
                  : "bg-gray-200"
              }`}
            >
              6+ <br />
              Character
            </span>
            <span
              className={`${
                /[A-Z]/g.test(formData.password)
                  ? "bg-blue-800 text-white"
                  : "bg-gray-200"
              } p-2 rounded`}
            >
              AA <br />
              Uppercase
            </span>
            <span
              className={`p-2 rounded ${
                /[a-z]/g.test(formData.password)
                  ? "bg-blue-800 text-white"
                  : "bg-gray-200"
              }`}
            >
              aa <br />
              Lowercase
            </span>
            <span
              className={`p-2 rounded ${
                /[0-9]/g.test(formData.password)
                  ? "bg-blue-800 text-white"
                  : "bg-gray-200"
              }`}
            >
              123 <br /> Number
            </span>
            <span
              className={`p-2 rounded ${
                /[@$#]/.test(formData.password)
                  ? "bg-blue-800 text-white"
                  : "bg-gray-200"
              }`}
            >
              @$# <br /> Symbol
            </span>
          </div>
        </div>
        <form onSubmit={handleUpdatePassword}>
          <div className="mb-3">
            <label htmlFor="new-password" className="block text-gray-700">
              New Password
            </label>
            <input
              type="password"
              id="new-password"
              name="password"
              className="form-style"
              placeholder="Enter new password"
              onChange={handleNewPassword}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="confirm-password" className="block text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              name="confirmPassword"
              className="form-style"
              placeholder="Confirm new password"
              onChange={handleNewPassword}
              required
            />
          </div>
          <Button type="submit" customClass="py-2 px-4 ">
            Update Password
          </Button>
        </form>
        <Link
          to="/login"
          className=" text-blue-800 mt-4 flex gap-2 items-center "
        >
          <FaArrowLeftLong />
          <p>Back To Login</p>
        </Link>
      </div>
    </section>
  );
};

export default UpdatePassword;
