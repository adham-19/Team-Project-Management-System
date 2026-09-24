import api from "./api";

export const register = async (data) => {
  return await api.post("/users/register", data);
};

export const login = async (data) => {
  return await api.post("/users/login", data);
};
