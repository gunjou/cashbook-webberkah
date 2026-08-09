import api from "../../api/axios";
import cdn from "../../api/cdn";

/* ==========================
   GET LIST TRANSACTIONS
========================== */

export const getTransactions = async (params = {}) => {
  const response = await api.get("/cashbook/transactions", {
    params,
  });

  return response.data.data;
};

/* ==========================
   GET DETAIL TRANSACTION
========================== */

export const getTransactionDetail = async (idTransaction) => {
  const response = await api.get(`/cashbook/transactions/${idTransaction}`);

  return response.data.data;
};

/* ==========================
   CREATE TRANSACTION
========================== */

export const createTransaction = async (payload) => {
  const response = await api.post("/cashbook/transactions", payload);

  return response.data;
};

/* ==========================
   UPDATE TRANSACTION
========================== */

export const updateTransaction = async (idTransaction, payload) => {
  const response = await api.put(
    `/cashbook/transactions/${idTransaction}`,
    payload,
  );

  return response.data.data;
};

/* ==========================
   ACCOUNT DROPDOWN
========================== */

export const getAccountDropdown = async () => {
  const response = await api.get("/cashbook/accounts/dropdown");

  return response.data.data;
};

/* ==========================
   CATEGORY DROPDOWN
========================== */

export const getCategoryDropdown = async () => {
  const response = await api.get("/cashbook/categories");

  return response.data.data;
};

/* ==========================
   UPLOAD ATTACHMENT
========================== */

export const uploadAttachment = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  const serviceName = process.env.REACT_APP_CDN_SERVICE_NAME;

  const category = process.env.REACT_APP_CDN_CATEGORY;

  const response = await cdn.post(
    `/api/upload/${serviceName}/${category}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};
