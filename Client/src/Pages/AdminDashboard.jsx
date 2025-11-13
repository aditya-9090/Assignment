import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getAllStudents, deleteStudent } from "../Api/apis/studentApi";
import { useDebounce } from "use-debounce";
import StudentCard from "../Components/StudentCard";
import { usePermission } from "../Hooks/usePermission";

//to manage students 
const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const canAddStudent = usePermission("add");

  const fetchStudents = async () => {
    try {
      const result = await getAllStudents(debouncedSearch, page);
      setStudents(result.data || []);
      setTotalPages(result.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [debouncedSearch, page]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    try {
      await deleteStudent(id);
      fetchStudents();
    } catch (error) {
      console.error("Failed to delete student:", error);
    }
  };

  return (
    <div className="space-y-6">
      <header className="space-y-4 text-center">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Students</h2>
          {canAddStudent && (
            <button
              onClick={() => navigate("/System/student")}
              className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Add Student
            </button>
          )}
        </div>

        <div className="flex justify-center">
        <input
          type="text"
          placeholder="Search by name or email"
          className="w-full max-w-sm rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          value={search}
        />
        </div>
      </header>

      {students.length === 0 ? (
        <div className="rounded border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
          No students found.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {students.map((student) => (
            <StudentCard
              key={student._id}
              student={student}
              onEdit={() => navigate(`/System/Student/${student._id}`)}
              onDelete={() => handleDelete(student._id)}
            />
          ))}
        </div>
      )}


      {/* pagination section */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setPage((prev) => (prev - 1 ))}
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
    </div>
  );
};

export default AdminDashboard;
