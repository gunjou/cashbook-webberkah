import api from "../../api/axios";

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

export const ATTACHMENT_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
export const ATTACHMENT_PDF_TYPE = "application/pdf";
export const ATTACHMENT_MAX_SIZE = 10 * 1024 * 1024; // 10 MB
export const ATTACHMENT_MAX_FILES = 10;
export const ATTACHMENT_ACCEPT = [
  ...ATTACHMENT_IMAGE_TYPES,
  ATTACHMENT_PDF_TYPE,
].join(",");

const isPdfFile = (file) =>
  file?.type === ATTACHMENT_PDF_TYPE || /\.pdf$/i.test(file?.name || "");

const isImageFile = (file) => ATTACHMENT_IMAGE_TYPES.includes(file?.type);

// Mengembalikan pesan error, atau null jika file valid.
export const validateAttachment = (file) => {
  if (!file) return "File tidak ditemukan.";

  if (!isImageFile(file) && !isPdfFile(file)) {
    return "Lampiran harus berupa gambar (JPG, PNG, WEBP) atau PDF.";
  }

  if (file.size > ATTACHMENT_MAX_SIZE) {
    return `Ukuran file maksimal ${ATTACHMENT_MAX_SIZE / 1024 / 1024} MB.`;
  }

  return null;
};

// Backend menggabungkan file sesuai urutan menjadi 1 PDF, lalu menguploadnya ke
// CDN. Timeout dibuat longgar karena mencakup upload, merge, dan upload ke CDN.
export const uploadAttachments = async (files, { onProgress } = {}) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  try {
    const response = await api.post(
      "/cashbook/transactions/attachments",
      formData,
      {
        timeout: 300000,
        onUploadProgress: (event) => {
          if (onProgress && event.total) {
            onProgress(Math.round((event.loaded / event.total) * 100));
          }
        },
      },
    );

    return response.data.data.attachment_path;
  } catch (err) {
    if (err.code === "ECONNABORTED") {
      throw new Error(
        "Upload bukti pembayaran terlalu lama (timeout). Coba file yang lebih kecil atau periksa koneksi.",
      );
    }

    throw new Error(
      err.response?.data?.message || err.message || "Upload bukti pembayaran gagal.",
    );
  }
};
