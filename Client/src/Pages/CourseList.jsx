import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { getCourse, deleteCourse } from "../Api/apis/courseApi";
import CourseCard from "../Components/CourseCard";
import { useDebounce } from "use-debounce";
import { usePermission } from "../Hooks/usePermission";

function CourseList() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showStudents, setShowStudents] = useState(false);
  const canAddCourse = usePermission("add");

  const fetchCourses = async () => {
    try {
      const result = await getCourse({ search: debouncedSearch, page });
      setCourses(result.data);
      setTotalPages(result.totalPages || 1);
    } catch (err) {
      console.error("Error fetching courses:", err);
      toast.error("Unable to load courses");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [debouncedSearch, page]);

  const handleEdit = (course) => {
    navigate(`/System/course/${course._id}`);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this course?");
    if (!confirmDelete) return;

    try {
      await deleteCourse(id);
      toast.success("Course deleted successfully ✅");
      setCourses((prev) => prev.filter((course) => course._id !== id));
    } catch (err) {
      console.error("Error deleting course:", err);
      toast.error(err.response?.data?.message || "Failed to delete course ❌");
    }
  };

  const handleViewStudents = (course) => {
    setSelectedCourse(course);
    setShowStudents(true);
  };

  const closeStudentsModal = () => {
    setShowStudents(false);
    setSelectedCourse(null);
  };

  return (
    <div className="space-y-6">
      <header className="space-y-4 text-center">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Course List</h2>
          {canAddCourse && (
            <button
              onClick={() => navigate("/System/course")}
              className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Add Course
            </button>
          )}
        </div>
        <div className="flex justify-center">
          <input
            type="text"
            placeholder="Search by title or description"
            className="w-full max-w-sm rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </header>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewStudents={handleViewStudents}
            />
          ))}
        </div>
      ) : (
        <div className="rounded border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
          No courses found.
        </div>
      )}

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1}
          className="rounded border border-slate-300 px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-slate-600">
          Page {page} / {totalPages || 1}
        </span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page >= totalPages}
          className="rounded border border-slate-300 px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {showStudents && selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-lg bg-white p-4 shadow-lg">
            <header className="mb-3 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  {selectedCourse.title || "Course"}
                </h3>
                <p className="text-xs text-slate-500">
                  Enrolled students ({selectedCourse.enrolledStudents?.length || 0})
                </p>
              </div>
              <button
                onClick={closeStudentsModal}
                className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-600 hover:border-slate-400"
              >
                Close
              </button>
            </header>

            {selectedCourse.enrolledStudents?.length ? (
              <ul className="space-y-2 text-sm text-slate-700">
                {selectedCourse.enrolledStudents.map((student) => (
                  <li
                    key={student._id}
                    className="rounded border border-slate-200 px-3 py-2"
                  >
                    <p className="font-medium">{student.name || "Unnamed"}</p>
                    <p className="text-xs text-slate-500">{student.email || "No email"}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded border border-slate-200 bg-slate-50 px-3 py-4 text-sm text-slate-500">
                No students enrolled yet.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseList;
