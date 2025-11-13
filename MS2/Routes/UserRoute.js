import express from "express";
import { createUserAuditLog, getUserAuditLogs } from "../Controllers/UserAuditController.js";

const router = express.Router();

router.post("/audit-log", createUserAuditLog);
router.get("/audit-log", getUserAuditLogs);

export default router;

