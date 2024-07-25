import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { uploadFileToCloud } from "../utils/uploadImgToCloud.js";
import fs from "fs";
import bcrypt from "bcrypt";

const checkImgType = (file) => {
  console.log("file", file);
};

const signupUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const profile = req.file.path;

    console.log(username, email, password);

    if (!username || !email || !password || !profile) {
      return res.status(400).json({
        success: false,
        message: "All fields are Required",
      });
    }
    checkImgType(profile);

    const user = await User.findOne({ email });
    if (user) {
      fs.unlinkSync(profile);
      return res.status(400).json({
        success: false,
        message: "User Already exits",
      });
    }

    const uploadImg = await uploadFileToCloud(
      profile,
      process.env.CLOUD_FOLDER_NAME
    );

    await User.create({
      username,
      email,
      password,
      image: { url: uploadImg.secure_url, publicId: uploadImg.public_id },
    });

    return res.status(200).json({
      success: true,
      message: "User Created",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error While Creating the User",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please Fill  The Details",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Register",
      });
    }

    const payload = {
      id: user._id,
      email: user.email,
    };

    try {
      if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "72h",
        });
        user.token = token;
        user.password = undefined;
        let options = {
          expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          sameSite: "none",
          httpOnly: true,
          secure: true,
        };

        return res.status(200).cookie("token", token, options).json({
          success: true,
          message: "Login Successfull",
          user: user,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Password Not Matching",
        });
      }
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error While Logging the User",
      error: error.message,
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user.id,
      {
        $unset: {
          token: 1, // this removes the field from document
        },
      },
      { new: true }
    );

    let options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
    };

    return res.status(200).clearCookie("token", options).json({
      success: true,
      message: "Logged Out",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logged Out failed",
      error: error.message,
    });
  }
};

export { signupUser, loginUser, logoutUser };
