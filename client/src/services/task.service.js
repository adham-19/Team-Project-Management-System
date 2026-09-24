import api from "./api";

export const createTask = async (data) => {
  return await api.post("/tasks", data);
};

export const getAllTasks = async (params) => {
  return api.get("/tasks", {
    params,
  });
};

export const getTaskById = async (id) => {
  return await api.get(`/tasks/${id}`);
};

export const updateTask = async (id, data) => {
  return await api.patch(`/tasks/${id}`, data);
};

export const deleteTask = async (id) => {
  return await api.delete(`/tasks/${id}`);
};
