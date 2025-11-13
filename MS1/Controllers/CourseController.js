import axios from "axios";
import Course from "../Models/Courses.js";
import { AUDIT_SERVICE_URL } from "../Config.js/serviceUrls.js";
import uploadToCloudinary from "../_Utils/uploadToCloudinary.js";



export const createCourse = async (req, res) => {
  try {
    const { title, description, startDate, budget, enrolledStudents } = req.body;

    if (!title || !description || !startDate || !budget) {
      return res.status(400).json({
        success: false,
        error: "All required fields must be filled",
      });
    }

    let uploadedUrl = null;
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.path);
      uploadedUrl = uploadResult?.secure_url || uploadResult?.url || uploadResult || null;
    }

    const newCourse = await Course.create({
      title,
      description,
      startDate,
      budget,
      enrolledStudents: enrolledStudents || [],
      attachment: uploadedUrl || undefined, // only set if uploaded
    });

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (err) {
    console.error("Create Course Error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// UPDATE course
export const updateCourse = async (req, res) => {
  try {
    const { title, description, startDate, budget, enrolledStudents } = req.body;

    const updateData = {
      title,
      description,
      startDate,
      budget,
      enrolledStudents: enrolledStudents || [],
    };

    // Only update attachment if a new file is uploaded
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.path);
      updateData.attachment = uploadResult?.secure_url || uploadResult?.url || uploadResult || undefined;
    }

    const updatedCourse = await Course.findOneAndUpdate(
      { _id: req.params.id, removed: false },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedCourse)
      return res.status(404).json({ success: false, message: "Course not found" });

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (err) {
    console.error("Update Course Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ===========================
// GET ALL COURSES
// ===========================
// Controllers/CourseController.js

export const getAllCourses = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "" } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    // Build search query
    const query = {
      removed: false,
      $or: [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
    };

    // Total courses matching search
    const total = await Course.countDocuments(query);

    // Fetch courses with pagination
    const courses = await Course.find(query)
      .populate("enrolledStudents", "name email")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total,           // total matching courses
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      count: courses.length,
      data: courses,
    });
  } catch (err) {
    console.error("Get Courses Error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};


// ===========================
// GET SINGLE COURSE BY ID
// ===========================
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.id, removed: false }).populate(
      "enrolledStudents",
      "name email"
    );

    if (!course) {
      return res.status(404).json({ success: false, error: "Course not found" });
    }

    return res.status(200).json({ success: true, data: course });
  } catch (err) {
    console.error("Get Course Error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};



// ===========================
// DELETE COURSE
// ===========================
export const deleteCourse = async (req, res) => {
  try {
    const deletionTimestamp = new Date();

    const deletedCourse = await Course.findOneAndUpdate(
      { _id: req.params.id, removed: false },
      { removed: true, deletedAt: deletionTimestamp },
      { new: true }
    );

    if (!deletedCourse) {
      return res.status(404).json({ success: false, error: "Course not found" });
    }

    if (deletedCourse) {
      const payload = {
        courseId: deletedCourse._id?.toString(),
        courseTitle: deletedCourse.title,
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
          budget: deletedCourse.budget,
          startDate: deletedCourse.startDate,
          enrolledStudents: deletedCourse.enrolledStudents,
        },
      };

      try {
        await axios.post(`${AUDIT_SERVICE_URL}/course/audit-log`, payload);
      } catch (err) {
        console.error("Audit log failed:", {
          message: err?.message,
          status: err?.response?.status,
          data: err?.response?.data,
        });
      }
      console.log("Audit log sent successfully");
    }

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (err) {
    console.error("Delete Course Error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};
