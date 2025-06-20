import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/User.js";

export const socketAuthenticator = async (err, socket, next) => {
  try {
    if (err) return next(err);
    const token =
      socket.request.cookies.token ||
      socket.handshake.auth.token ||
      socket.handshake.query.token;
    if (!token) {
      return next(new ApiError("Please Login to Access This Route", 401));
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedData.id);
    if (!user) {
      return next(new ApiError("Please Login to Access This Route", 401));
    }
    socket.user = decodedData;

    return next();
  } catch (error) {
    console.log(error);
    return next(new ApiError("Please login to access this route", 401));
  }
};

export const isAuthenticated = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");
    // console.log("cookies token => ", req.cookies.token);

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token Missing",
      });
    }

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decode;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "token is invalid",
        error: error.message,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Went Wrong while getting the token",
      error: error.message,
    });
  }
};
