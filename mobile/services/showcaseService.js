import apiClient from "./apiClient";

export const getShowcases = async (page = 1, limit = 5) => {
  const res = await apiClient.get(`/showcase?page=${page}&limit=${limit}`);
  return res.data;
};

export const createShowcase = async (input) => {
  const res = await apiClient.post("/showcase", { input });
  return res.data;
};

export const updateShowcase = async (id, data) => {
  const res = await apiClient.put(`/showcase/${id}`, data);
  return res.data;
};

export const deleteShowcase = async (id) => {
  const res = await apiClient.delete(`/showcase/${id}`);
  return res.data;
  
};

export const updateShowcasePosition = async (id, posx,posy)=> {
 const res = await apiClient.put(`/showcase/${id}/position`,posx,posy);
  return res.data;
};
