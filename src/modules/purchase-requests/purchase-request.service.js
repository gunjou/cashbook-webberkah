import api from "../../api/axios";
import cdn from "../../api/cdn";

/* ==========================
   PURCHASE REQUEST
========================== */

export const getPurchaseRequests = async (params = {}) => {
  const response = await api.get("/purchase-requests", { params });
  return response.data.data;
};

export const getPurchaseRequestHistory = async (params = {}) => {
  const response = await api.get("/purchase-requests/history", { params });
  return response.data.data;
};

export const getPurchaseRequestDetail = async (idRequest) => {
  const response = await api.get(`/purchase-requests/${idRequest}`);
  return response.data.data;
};

export const downloadPurchaseRequestPdf = async (idRequest) => {
  const response = await api.get(`/purchase-requests/${idRequest}/pdf`, {
    responseType: "blob",
  });

  return response.data;
};

/* ==========================
   MASTER
========================== */

export const getDepartments = async () => {
  const response = await api.get("/master/departemen");
  return response.data.data;
};

export const getCashbookAccounts = async () => {
  const response = await api.get("/cashbook/accounts/dropdown");
  return response.data.data;
};

export const getCashbookCategories = async () => {
  const response = await api.get("/cashbook/categories");
  return response.data.data;
};

/* ==========================
   CASHBOOK TRANSACTION
========================== */

export const createCashbookTransaction = async (payload) => {
  const response = await api.post("/cashbook/transactions", payload);
  return response.data;
};

/* ==========================
   PURCHASE REQUEST - PAID
========================== */

export const payPurchaseRequest = async (idRequest) => {
  const response = await api.post(`/purchase-requests/${idRequest}/paid`, {});
  return response.data;
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
