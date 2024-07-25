import mongoose, { Schema, Types } from "mongoose";

const groupSchema = new Schema(
  {
    members: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
    admin: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
    messages: [
      {
        type: Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  { timestamps: true }
);
