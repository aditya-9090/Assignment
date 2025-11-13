import express from "express";
import {
  createUser,
  login,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../Controllers/UserController.js";
import Auth from "../Middleware/Auth.js";
import { authorizeRole } from "../Middleware/AuthorizedRole.js";
const router = express.Router();

// create user or student
router.post("/", Auth, authorizeRole(["admin"]), createUser);

// login
router.post("/login", login);

// get all users or students
router.get("/", Auth, authorizeRole(["admin","student"]), getAllUsers);  
   
// get user by id
router.get("/:id", getUserById);

// update user by id
router.put("/:id", Auth, authorizeRole(["admin"]), updateUser);

// delete user by id
router.delete("/:id", Auth, authorizeRole(["admin"]), deleteUser);

export default router;
