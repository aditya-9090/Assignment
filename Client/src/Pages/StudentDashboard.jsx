import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { getStudentById } from "../Api/apis/studentApi";
import { toast } from "react-toastify";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const data = await getStudentById(user.id);
        setStudent(data);
      } catch (err) {
        console.error("Failed to load student profile:", err);
        toast.error("Unable to load your profile");
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [user?.id]);

  const course = student?.course;
  const courseTitle = course?.title || "Not assigned";

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-xl font-semibold text-slate-900">Student Dashboard</h2>
      </header>

      {loading ? (
        <div className="rounded border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
          Loading profile...
        </div>
      ) : !student ? (
        <div className="rounded border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
          No profile details found.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <section className="rounded border border-slate-200 bg-white p-4 text-sm text-slate-600">
            <h3 className="text-base font-semibold text-slate-900">Details</h3>
            <p className="mt-3">Name: {student.name}</p>
            <p className="mt-1">Email: {student.email}</p>
            <p className="mt-1">Course: {courseTitle}</p>
          </section>

          <section className="rounded border border-slate-200 bg-white p-4 text-sm text-slate-600">
            <h3 className="text-base font-semibold text-slate-900">Course Details</h3>
            {course ? (
              <div className="space-y-2 mt-3">
                <p>Title: {course.title}</p>
                {course.description && <p>Description: {course.description}</p>}
                {course.startDate && (
                  <p>
                    Start Date: {new Date(course.startDate).toLocaleDateString()}
                  </p>
                )}
                {course.budget && <p>Budget: ₹{course.budget}</p>}
              </div>
            ) : (
              <p className="mt-3">No course assigned yet.</p>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
