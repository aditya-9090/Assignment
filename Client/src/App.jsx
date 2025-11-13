import { Routes, Route } from "react-router";
import "./App.css";

import AuthLayout from "./Layout/AuthLayout";
import MainLayout from "./Layout/MainLayout";
import Login from "./Pages/Login";
import AdminDashboard from "./Pages/AdminDashboard";
import StudentDashboard from "./Pages/StudentDashboard";
import AddCourses from "./Pages/AddCourses";
import AddStudents from "./Pages/AddStudents";
import ProtectedRoute from "./Components/ProtectedRoute";
import CourseList from "./Pages/CourseList";
import AuditLogs from "./Pages/AuditLogs";
function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route index element={<Login />} />
      </Route>

      <Route path="System" element={<MainLayout />}>
        <Route
          index
          element={
            <ProtectedRoute requiredRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="sdashboard"
          element={
            <ProtectedRoute requiredRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="course"
          element={
            <ProtectedRoute requiredRoles={["admin"]}>
              <AddCourses />
            </ProtectedRoute>
          }
        />

        <Route
          path="course/:id"
          element={
            <ProtectedRoute requiredRoles={["admin"]}>
              <AddCourses />
            </ProtectedRoute>
          }
        />


        <Route
          path="courselist"
          element={
            <ProtectedRoute requiredRoles={["admin", "student"]}>
              <CourseList />
            </ProtectedRoute>
          }
        />


        <Route
          path="student"
          element={
            <ProtectedRoute requiredRoles={["admin"]}>
              <AddStudents />
            </ProtectedRoute>
          }
        />

        <Route
          path="student/:id"
          element={
            <ProtectedRoute requiredRoles={["admin"]}>
              <AddStudents />
            </ProtectedRoute>
          }
        />

        <Route
          path="auditlogs"
          element={
            <ProtectedRoute requiredRoles={["admin"]}>
              <AuditLogs />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
