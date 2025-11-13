import api from "../api";

// 🔹 Create a new student (admin use)
export const createStudent = async (data) => {
  try {
    const res = await api.post("/user", data);
    return res.data;
  } catch (err) {
    console.error("Error creating student:", err);
    throw err;
  }
};

// 🔹 Get all students (only users with role = student)
export const getAllStudents = async (search = "", page = 1, limit = 6) => {
  try {
    const res = await api.get("/user", {
      params: {
        search: search.trim(),
        page,
        limit,
      },
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching students:", err);
    throw err;
  }
};

// 🔹 Get a single student by ID
export const getStudentById = async (id) => {
  try {
    const res = await api.get(`/user/${id}`);
    return res.data.data;
  } catch (err) {
    console.error("Error fetching student:", err);
    throw err;
  }
};

// 🔹 Update student (admin use)
export const updateStudent = async (id, data) => {
  try {
    const res = await api.put(`/user/${id}`, data);
    return res.data;
  } catch (err) {
    console.error("Error updating student:", err);
    throw err;
  }
};

// 🔹 Delete student (admin use)
export const deleteStudent = async (id) => {
  try {
    const res = await api.delete(`/user/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error deleting student:", err);
    throw err;
  }
};
