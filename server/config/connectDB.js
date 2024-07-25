import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database Connection Successfully");
  } catch (error) {
    console.log("Database Connection Failed", error);
    process.exit(1);
  }
};
