import axios from "axios";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../Models/User.js";
import Course from "../Models/Courses.js";
import { AUDIT_SERVICE_URL } from "../Config.js/serviceUrls.js";

// ------------------------- CREATE USER -------------------------
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, course } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let assignedCourse = null;

    if (course) {
      assignedCourse = await Course.findOne({ _id: course, removed: false });

      if (!assignedCourse) {
        return res.status(400).json({ success: false, message: "Invalid course selected" });
      }
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "student",
      course: assignedCourse?._id || null,
    });

    if (assignedCourse) {
      await Course.findByIdAndUpdate(assignedCourse._id, {
        $push: { enrolledStudents: user._id },
      });
    }

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// ------------------------- LOGIN -------------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "All fields required",
      });
    }

    const user = await User.findOne({ email});

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        success: false,
        error: "Incorrect password :(",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const userData = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    return res.status(200).json({
      success: true,
      data: { token },
      user: userData,
      message: "Login successful",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};













// ------------------------- GET ALL STUDENTS -------------------------
// Controllers/UserController.js

export const getAllUsers = async (req, res) => {
  try {
    let { page = 1, limit = 4, search = "" } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const query = {
      role: "student",
      removed: false,
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };

    // Count total students matching search
    const total = await User.countDocuments(query);

    // Fetch students with pagination
    const students = await User.find(query)
      .select("-password")
      .populate({ path: "course", select: "title" })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total,          // total matching students
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      count: students.length,
      data: students,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};


// ------------------------- GET USER BY ID -------------------------
export const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, removed: false })
      .select("-password")
      .populate({ path: "course" }).select("-enrolledStudents"); // ✅ populate course title

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching user" });
  }
};


// ------------------------- UPDATE USER -------------------------
export const updateUser = async (req, res) => {
  try {
    const { name, email, role, course } = req.body;

    const user = await User.findOne({ _id: req.params.id, removed: false });

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    let newCourse = null;
    if (course) {
      newCourse = await Course.findOne({ _id: course, removed: false });
      if (!newCourse) {
        return res.status(400).json({ success: false, message: "Invalid course selected" });
      }
    }

    const previousCourseId = user.course?.toString();
    const nextCourseId = newCourse?._id?.toString() || null;

    user.name = name ?? user.name;
    user.email = email ?? user.email;
    user.role = role ?? user.role;
    user.course = nextCourseId;

    await user.save();

    if (previousCourseId && previousCourseId !== nextCourseId) {
      await Course.findByIdAndUpdate(previousCourseId, {
        $pull: { enrolledStudents: user._id },
      });
    }

    if (nextCourseId && previousCourseId !== nextCourseId) {
      await Course.findByIdAndUpdate(nextCourseId, {
        $push: { enrolledStudents: user._id },
      });
    }

    const updatedUser = await User.findById(user._id).select("-password");


    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating user" });
  }
};

// ------------------------- DELETE USER -------------------------
export const deleteUser = async (req, res) => {
  try {
    const deletionTimestamp = new Date();

    const deletedUser = await User.findOneAndUpdate(
      { _id: req.params.id, removed: false },
      { removed: true, deletedAt: deletionTimestamp },
      { new: true }
    );

    if (!deletedUser)
      return res.status(404).json({ success: false, message: "User not found" });

    if (deletedUser) {
      const payload = {
        userId: deletedUser._id?.toString(),
        userName: deletedUser.name,
        userEmail: deletedUser.email,
        deletedAt: deletionTimestamp,
        deletedBy: req.user
          ? {
              id: req.user.id,
              name: req.user.name,
              email: req.user.email,
              role: req.user.role,
            }
          : undefined,
        metadata: {
          role: deletedUser.role,
          course: deletedUser.course,
        },
      };

      try {
        await axios.post(`${AUDIT_SERVICE_URL}/user/audit-log`, payload);
      } catch (err) {
        console.error("User audit logging failed:", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
      }
      
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting user" });
  }
};
