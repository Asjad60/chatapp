import mongoose, { Schema } from "mongoose";

const groupSchema = new Schema(
  {
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    admin: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    groupName: {
      type: String,
      required: true,
      trim: true,
    },
    groupProfile: {
      type: String,
    },
  },
  { timestamps: true }
);

groupSchema.index({ members: 1 });
groupSchema.index({ admin: 1 });

const Group = mongoose.models.Group || mongoose.model("Group", groupSchema);
export default Group;
