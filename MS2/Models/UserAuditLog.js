import mongoose from "mongoose";

const userAuditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    userName: {
      type: String,
    },
    userEmail: {
      type: String,
    },
    action: {
      type: String,
      default: "DELETE",
      enum: ["DELETE"],
    },
    deletedBy: {
      id: { type: String },
      name: { type: String },
      email: { type: String },
      role: { type: String },
    },
    deletedAt: {
      type: Date,
      required: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

export default mongoose.model("UserAuditLog", userAuditLogSchema);

