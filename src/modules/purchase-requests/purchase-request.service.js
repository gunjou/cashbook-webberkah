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

export const ATTACHMENT_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
export const ATTACHMENT_PDF_TYPE = "application/pdf";
export const ATTACHMENT_MAX_SIZE = 10 * 1024 * 1024; // 10 MB
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

// Upload ke CDN: image -> endpoint image cashbook, PDF -> endpoint document.
// Upload CDN ±4 detik/MB, jadi timeout dibuat longgar (default axios cdn 30s
// membuat file > ~7 MB selalu gagal).
export const uploadAttachment = async (file, { onProgress } = {}) => {
  const error = validateAttachment(file);
  if (error) throw new Error(error);

  const formData = new FormData();
  formData.append("file", file);

  const documentUrl = process.env.REACT_APP_CDN_DOCUMENT_UPLOAD_URL;
  const documentKey = process.env.REACT_APP_CDN_DOCUMENT_API_KEY;

  const usingDocumentEndpoint = isPdfFile(file) && documentUrl && documentKey;

  const url = usingDocumentEndpoint
    ? documentUrl
    : `/api/upload/${process.env.REACT_APP_CDN_SERVICE_NAME}/${process.env.REACT_APP_CDN_CATEGORY}`;

  try {
    const response = await cdn.post(url, formData, {
      timeout: 180000,
      headers: usingDocumentEndpoint ? { "X-API-KEY": documentKey } : {},
      onUploadProgress: (event) => {
        if (onProgress && event.total) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      },
    });

    const result = response.data;

    if (!result?.status || !result?.url) {
      throw new Error(result?.message || "Upload bukti pembayaran gagal.");
    }

    return result;
  } catch (err) {
    if (err.code === "ECONNABORTED") {
      throw new Error(
        "Upload bukti pembayaran terlalu lama (timeout). Coba file yang lebih kecil atau periksa koneksi.",
      );
    }

    const message =
      err.response?.data?.message || err.response?.data?.detail;

    throw new Error(
      message
        ? `Upload bukti pembayaran gagal: ${message}`
        : err.message || "Upload bukti pembayaran gagal.",
    );
  }
};
