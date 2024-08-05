import crypto from "crypto";
import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import mailSender from "../utils/mailSender.js";
import { resetPassowrdTemplate } from "../mail/ResetPassTemplate.js";

export const sendResetPasswordToken = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email }).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Registered",
      });
    }

    const token = crypto.randomBytes(20).toString("hex");

    const url = `https://chitchat-chatapp.vercel.app/update-password/${token}`;

    await mailSender(
      email,
      "Reset Password",
      resetPassowrdTemplate(email, url)
    );
    user.token = token;
    user.resetPasswordExpire = Date.now() + 3600000;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Email Sent Successfully Please Check Your Email",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Some Error on Sending The Reset Message",
    });
  }
};

export const resetPassowrd = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password No Matching",
      });
    }

    const userDetails = await User.findOne({ token });
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    if (!(userDetails.resetPasswordExpire > Date.now())) {
      return res.status(404).json({
        success: false,
        message: "Request Timed out",
      });
    }
    const hashedPass = await bcrypt.hash(password, 10);
    await User.findOneAndUpdate(
      { token },
      { password: hashedPass },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Password Changed",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Some Error on Reset Password",
    });
  }
};
