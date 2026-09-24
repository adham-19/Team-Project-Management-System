import api from "./api";

export const registerUser = async (data) => {
  return api.post("/users/register", data);
};

export const loginUser = async (data) => {
  return api.post("/users/login", data);
};

export const getProfile = async () => {
  return api.get("/users/profile");
};

export const updateProfile = async (data) => {
  return api.patch("/users/profile", data);
};

export const changePassword = async (data) => {
  return api.patch("/users/change-password", data);
};

export const deleteAccount = async () => {
  return api.delete("/users/profile");
};

export const getAllUsers = async () => {
  return api.get("/users");
};
