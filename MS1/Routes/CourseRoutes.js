import express from "express";
import {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
} from "../Controllers/CourseController.js";
import upload from "../Middleware/MulterMiddleware.js";
import Auth from "../Middleware/Auth.js"
import { authorizeRole } from "../Middleware/AuthorizedRole.js";

const router = express.Router();

// create course
router.post("/",Auth, authorizeRole(["admin"]), upload.single("attachment"), createCourse);

// get all courses
router.get("/",Auth, authorizeRole(["admin","student"]), getAllCourses);

// get course by id
router.get("/:id",Auth, authorizeRole(["admin"]), getCourseById);

// update course by id
router.put("/:id",Auth, authorizeRole(["admin"]), upload.single("attachment"), updateCourse);

// delete course by id
router.delete("/:id",Auth, authorizeRole(["admin"]), deleteCourse);

export default router;
