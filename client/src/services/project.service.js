import api from "./api";

export const getAllProjects = async () => {
  return await api.get("/projects");
};

export const createProject = async (data) => {
  return await api.post("/projects", data);
};
