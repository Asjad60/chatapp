import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
  {
    userId: {
      // recipient
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderMessage: {
      imgURI: {
        type: String,
      },
      title: {
        type: String,
      },
    },
    read: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ["MESSAGE", "REQUEST"],
    },
    status: {
      type: String,
      default: "PENDING",
      enum: ["PENDING", "ACCEPTED", "REJECTED"],
    },
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, read: 1 });

export const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);
