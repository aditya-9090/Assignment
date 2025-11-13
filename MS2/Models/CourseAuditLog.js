import mongoose from "mongoose";

const courseAuditLogSchema = new mongoose.Schema(
  {
    courseId: {
      type: String,
      required: true,
      index: true,
    },
    courseTitle: {
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

export default mongoose.model("CourseAuditLog", courseAuditLogSchema);

