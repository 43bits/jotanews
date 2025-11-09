import apiClient from "./apiClient";

export const getAllUsers = async () => {
  const res = await apiClient.get("/showcase/community/all-users");
  return res.data; 
};

export const getUserShowcases = async (userId) => {
  const res = await apiClient.get("/showcase");
  if (!res.data || !Array.isArray(res.data.showcases)) return [];
  return res.data.showcases.filter((i) => i.userId === userId);
};