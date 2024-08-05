import React, { useState } from "react";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { sendResetPasswordMail } from "../services/operations/userAPI";

const ResetPassword = () => {
  const [mailSent, setMailSent] = useState(false);
  const [email, setEmail] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await sendResetPasswordMail(email, setMailSent);
    setLoading(false);
  };
  return (
    <section className="w-full min-h-screen grid place-items-center">
      {loading ? (
        <div className="w-full h-full flex justify-center items-center">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="max-w-[450px] w-full flex flex-col gap-4 p-2">
          <h1 className="text-3xl font-medium">
            {!mailSent ? "Reset Password" : "Check Mail"}
          </h1>
          <p>
            {!mailSent
              ? "Have no fear. We’ll email you instructions to reset your password. If you dont have access to your email we can try account recovery"
              : `We have sent the reset email to ${email}`}
          </p>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 ">
              {!mailSent && (
                <input
                  type="email"
                  className="form-style"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email"
                  required
                />
              )}
              <Button
                text={!mailSent ? "Reset Password" : "Resend Mail"}
                type="submit"
                customClass={"py-3 px-4 text-center w-full mt-3"}
              />
            </div>
          </form>
          <Link to={"/login"} className="text-sm flex gap-2 items-center">
            <FaArrowLeftLong />
            <p>Back to Login</p>
          </Link>
        </div>
      )}
    </section>
  );
};

export default ResetPassword;
