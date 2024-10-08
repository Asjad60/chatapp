import mongoose, { Schema, Types } from "mongoose";

const notificationSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderMessage: {
      imgURI: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
    },
    read: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "PENDING",
      enum: ["PENDING", "ACCEPTED", "REJECTED"],
    },
  },
  { timestamps: true }
);

export const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);
