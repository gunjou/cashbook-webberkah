import api from "../../api/axios";

export const getCategories = async () => {
  const response = await api.get("/cashbook/categories");

  return response.data.data;
};

export const getCategoryDetail = async (id) => {
  const response = await api.get(`/cashbook/categories/${id}`);

  return response.data.data;
};

export const createCategory = async (payload) => {
  const response = await api.post("/cashbook/categories", payload);

  return response.data;
};

export const updateCategory = async (id, payload) => {
  const response = await api.put(`/cashbook/categories/${id}`, payload);

  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await api.delete(`/cashbook/categories/${id}`);

  return response.data;
};
