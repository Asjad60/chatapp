import mongoose, { Schema, model } from "mongoose";

const messageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    attachments: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],

    content: {
      type: String,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    seen: {
      type: Boolean,
      default: false,
    },
    group: {
      type: Schema.Types.ObjectId,
      ref: "Group",
    },
  },
  { timestamps: true }
);

messageSchema.index({ group: 1, createdAt: -1 });

export const Message =
  mongoose.models.Message || model("Message", messageSchema);
