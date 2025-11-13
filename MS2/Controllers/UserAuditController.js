import UserAuditLog from "../Models/UserAuditLog.js";

export const createUserAuditLog = async (req, res) => {
  try {
    const { userId, userName, userEmail, deletedBy, deletedAt, metadata } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    if (!deletedAt) {
      return res.status(400).json({
        success: false,
        message: "deletedAt is required",
      });
    }

    const log = await UserAuditLog.create({
      userId,
      userName,
      userEmail,
      deletedBy,
      deletedAt,
      metadata,
    });

    return res.status(201).json({
      success: true,
      message: "User audit log stored successfully",
      data: log,
    });
  } catch (error) {
    console.error("createUserAuditLog error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to store user audit log",
    });
  }
};

export const getUserAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [
        { userName: regex },
        { userEmail: regex },
        { userId: regex },
        { "deletedBy.name": regex },
        { "deletedBy.email": regex },
        { "deletedBy.role": regex },
      ];
    }

    const data = await UserAuditLog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const count = await UserAuditLog.countDocuments(filter);
    const totalPages = Math.ceil(count / limit) || 1;

    return res.status(200).json({
      success: true,
      data,
      totalPages,
      count,
    });
  } catch (err) {
    console.error("getUserAuditLogs error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};


