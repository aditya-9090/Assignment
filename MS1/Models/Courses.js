import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,

    },
    description: {
      type: String,
      required: true,

    },
    startDate: {
      type: Date,
      required: true,
    },
    budget: {
      type: Number,
      required: true,

    },
    // If multiple students can enroll, make this an array
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    attachment: {
      type: String,
    },
    removed: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
    },
  },
  { timestamps: true } // automatically adds createdAt & updatedAt
);

export default mongoose.model("Course", courseSchema);
