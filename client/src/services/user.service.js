import api from "./api";

export const registerUser = async (data) => {
  return await api.post("/users/register", data);
};

export const loginUser = async (data) => {
  return await api.post("/users/login", data);
};
