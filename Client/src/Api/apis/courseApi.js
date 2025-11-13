import api from "../api";

export const getCourse = async ({ search = "", page = 1, limit = 6 } = {}) => {
  const res = await api.get("/course", {
    params: {
      search: search.trim(),
      page,
      limit,
    },
  });
  return res.data;
};

export const getCourseById = async (id) => {
  const res = await api.get(`/course/${id}`);
  return res.data.data;
};

export const createCourse = async (data) => {
  const res = await api.post("/course", data);
  return res.data;
};

export const updateCourse = async (id, data) => {
  const res = await api.put(`/course/${id}`, data);
  return res.data;
};

export const deleteCourse = async (id) => {
  const res = await api.delete(`/course/${id}`);
  return res.data;
};