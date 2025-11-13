import CourseAuditLog from "../Models/CourseAuditLog.js";

export const createCourseAuditLog = async (req, res) => {
  try {
    const { courseId, courseTitle, deletedBy, deletedAt, metadata } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "courseId is required",
      });
    }

    if (!deletedAt) {
      return res.status(400).json({
        success: false,
        message: "deletedAt is required",
      });
    }

    const log = await CourseAuditLog.create({
      courseId,
      courseTitle,
      deletedBy,
      deletedAt,
      metadata,
    });

    return res.status(201).json({
      success: true,
      message: "Course audit log stored successfully",
      data: log,
    });
  } catch (error) {
    console.error("createCourseAuditLog error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to store course audit log",
    });
  }
};

export const getCourseAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const skip = (page - 1) * limit;

    let filter = {};

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [
        { courseTitle: regex },
        { courseId: regex },
        { "deletedBy.name": regex },
        { "deletedBy.email": regex },
        { "deletedBy.role": regex },
      ];
    }

    const data = await CourseAuditLog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const count = await CourseAuditLog.countDocuments(filter);
    const totalPages = Math.ceil(count / limit) || 1;

    return res.status(200).json({
      success: true,
      data,
      totalPages,
      count,
    });
  } catch (err) {
    console.error("getCourseAuditLogs error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};


