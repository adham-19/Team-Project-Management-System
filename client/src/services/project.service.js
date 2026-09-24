import api from "./api";

export const createProject = async (data) => {
  return await api.post("/projects", data);
};

export const getAllProjects = async () => {
  return await api.get("/projects");
};

export const getProjectById = async (id) => {
  return await api.get(`/projects/${id}`);
};

export const updateProject = async (id, data) => {
  return await api.patch(`/projects/${id}`, data);
};

export const deleteProject = async (id) => {
  return await api.delete(`/projects/${id}`);
};

export const addProjectMember = async (id, userId) => {
  return api.post(`/projects/${id}/members`, {
    userId,
  });
};

export const removeProjectMember = async (id, userId) => {
  return api.delete(`/projects/${id}/members/${userId}`);
};