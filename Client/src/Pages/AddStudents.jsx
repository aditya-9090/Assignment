import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { getCourse } from "../Api/apis/courseApi";
import { createStudent, getStudentById, updateStudent } from "../Api/apis/studentApi";

function AddStudents() {
  const navigate = useNavigate();
  const { id } = useParams(); // get student id from URL (edit mode)
  const [errors, setErrors] = useState({});
  const [courses, setCourses] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    course: "", // selected course
  });


  const validateForm = () => {
    const validationErrors = {};
    if (!form.name.trim()) {
      validationErrors.name = "Name is required";
    }
    if (!form.email.trim()) {
      validationErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      validationErrors.email = "Invalid email";
    }
    if (!id) {
      if (!form.password.trim()) {
        validationErrors.password = "Password is required";
      } else if (form.password.trim().length < 6) {
        validationErrors.password = "Password must be at least 6 characters";
      }
    }
    if (!form.course) {
      validationErrors.course = "Please select a course";
    }
    return validationErrors;
  };

  // Fetch courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const result = await getCourse();
        setCourses(result.data);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        toast.error("Failed to load courses");
      }
    };
    fetchCourses();
  }, []);

  // Fetch existing student for edit
  useEffect(() => {
    const fetchStudent = async () => {
      if (!id) return;
      try {
        const data = await getStudentById(id);
        setForm({
          name: data.name || "",
          email: data.email || "",
          password: "", // password left empty
          course: data.course?._id || "",
        });
      } catch (err) {
        console.error("Failed to fetch student:", err);
        toast.error("Failed to load student data");
      }
    };
    fetchStudent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      course: form.course,
    };

    if (!id) {
      payload.password = form.password.trim();
    }

    try {
      if (id) {
        await updateStudent(id, payload);
        toast.success("Student updated successfully!");
      } else {
        await createStudent(payload);
        toast.success("Student created successfully!");
      }
      navigate("/System/");
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Error saving student");
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 rounded border border-slate-200 bg-white p-6">
      <header className="text-center">
        <h2 className="text-xl font-semibold text-slate-900">
          {id ? "Edit Student" : "Add Student"}
        </h2>
      </header>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1">
          <label htmlFor="name" className="text-sm font-medium text-slate-700">
            Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Student name"
            onChange={handleChange}
            value={form.name}
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
          />
          {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
        </div>

        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="student@example.com"
            onChange={handleChange}
            value={form.email}
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
          />
          {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
        </div>

        {!id && (
          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Set a password"
              onChange={handleChange}
              value={form.password}
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
            {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
          </div>
        )}

        <div className="space-y-1">
          <label htmlFor="course" className="text-sm font-medium text-slate-700">
            Course
          </label>
          <select
            id="course"
            name="course"
            value={form.course}
            onChange={handleChange}
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
          >
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>
          {errors.course && <p className="text-xs text-red-600">{errors.course}</p>}
        </div>

        <button
          type="submit"
          className="w-full rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          {id ? "Save" : "Create"}
        </button>
      </form>
    </div>
  );
}

export default AddStudents;
