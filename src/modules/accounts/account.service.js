import api from "../../api/axios";

export const getAccounts = async () => {
  const response = await api.get("/cashbook/accounts");
  return response.data.data;
};

export const getAccountDetail = async (id) => {
  const response = await api.get(`/cashbook/accounts/${id}`);
  return response.data.data;
};

export const createAccount = async (payload) => {
  const response = await api.post("/cashbook/accounts", payload);
  return response.data;
};

export const updateAccount = async (id, payload) => {
  const response = await api.put(`/cashbook/accounts/${id}`, payload);
  return response.data;
};

export const deleteAccount = async (id) => {
  const response = await api.delete(`/cashbook/accounts/${id}`);

  return response.data;
};
