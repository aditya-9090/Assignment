import express from "express";
import { createCourseAuditLog, getCourseAuditLogs } from "../Controllers/CourseAuditController.js";

const router = express.Router();

router.post("/audit-log", createCourseAuditLog);
router.get("/audit-log", getCourseAuditLogs);

export default router;

