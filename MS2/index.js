import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./Config.js/db.js";
import userRoutes from "./Routes/UserRoute.js";
import courseRoutes from "./Routes/CourseRoutes.js";


dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);
app.use(express.static("public"));


// Routes
app.use("/user", userRoutes);
app.use("/course", courseRoutes);

// Connect Database
connectDB();

// Server
const PORT = process.env.PORT || 8002;
app.listen(PORT, () => {
  console.log(`✅ Server started on port ${PORT}`);
});
