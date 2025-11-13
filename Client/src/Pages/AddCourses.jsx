import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { getCourseById, createCourse, updateCourse } from "../Api/apis/courseApi";

function AddCourses() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [file, setFile] = useState(null); // New file
  const [existingAttachment, setExistingAttachment] = useState(""); // Existing attachment URL
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  
  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    budget: "",
  });

 

  const validateForm = () => {
    const validationErrors = {};

    if (!form.title.trim()) {
      validationErrors.title = "Title is required";
    }

    if (!form.description.trim()) {
      validationErrors.description = "Description is required";
    }

    if (!form.startDate) {
      validationErrors.startDate = "Start date is required";
    }

    if (!form.budget.toString().trim()) {
      validationErrors.budget = "Budget is required";
    } else if (Number(form.budget) < 0) {
      validationErrors.budget = "Budget cannot be negative";
    }

    return validationErrors;
  };

  // Fetch existing course (for update)
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await getCourseById(id);
        setForm({
          title: data.title || "",
          description: data.description || "",
          startDate: data.startDate ? data.startDate.split("T")[0] : "",
          budget: data.budget || "",
        });
        setExistingAttachment(data.attachment || "");
      } catch (err) {
        console.error("Error fetching course:", err);
        toast.error("Failed to load course data ❌");
      }
    };

    if (id) fetchCourse();
  }, [id]);

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file change
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title.trim());
      formData.append("description", form.description.trim());
      formData.append("startDate", form.startDate);
      formData.append("budget", form.budget);

      // Only append file if user selected a new one
      if (file) formData.append("attachment", file);

      if (id) {
        await updateCourse(id, formData);
        toast.success("Course updated successfully ✅");
      } else {
        await createCourse(formData);
        toast.success("Course created successfully 🎉");
      }

      navigate("/System/courselist");
    } catch (err) {
      console.error("Error saving course:", err);
      toast.error(err.response?.data?.message || "Something went wrong ❌");
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 rounded border border-slate-200 bg-white p-6">
      <header className="space-y-1 text-center">
        <h1 className="text-xl font-semibold text-slate-900">
          {id ? "Edit Course" : "Add Course"}
        </h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="title" className="text-sm font-medium text-slate-700">
            Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="e.g. React Fundamentals"
            value={form.title}
            onChange={handleChange}
            name="title"
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
          />
          {errors.title && <p className="text-xs text-red-600">{errors.title}</p>}
        </div>

        <div className="space-y-1">
          <label htmlFor="description" className="text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            id="description"
            placeholder="Briefly describe the course content"
            value={form.description}
            onChange={handleChange}
            name="description"
            rows={4}
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
          />
          {errors.description && <p className="text-xs text-red-600">{errors.description}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="startDate" className="text-sm font-medium text-slate-700">
              Start Date
            </label>
            <input
              id="startDate"
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
          {errors.startDate && <p className="text-xs text-red-600">{errors.startDate}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="budget" className="text-sm font-medium text-slate-700">
              Budget
            </label>
            <input
              id="budget"
              type="number"
              placeholder="Budget"
              name="budget"
              value={form.budget}
              onChange={handleChange}
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
          {errors.budget && <p className="text-xs text-red-600">{errors.budget}</p>}
          </div>
        </div>

        {existingAttachment && !file && (
          <div className="space-y-2 rounded border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
            <p>Current file:</p>
            {existingAttachment.match(/\.(jpeg|jpg|png|gif|webp)$/i) ? (
              <img
                src={existingAttachment}
                alt="Course attachment"
                className="h-32 w-full rounded object-cover"
              />
            ) : (
              <a
                href={existingAttachment}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-slate-700 underline"
              >
                View current file
              </a>
            )}
          </div>
        )}

        <div className="space-y-1">
          <label htmlFor="attachment" className="text-sm font-medium text-slate-700">
            Attachment
          </label>
          <input
            id="attachment"
            type="file"
            onChange={handleFileChange}
            className="w-full cursor-pointer rounded border border-slate-300 px-3 py-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-slate-900 file:px-3 file:py-1.5 file:text-sm file:text-white hover:border-slate-400"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          {submitting ? "Saving..." : id ? "Save" : "Create"}
        </button>
      </form>
    </div>
  );
}

export default AddCourses;
