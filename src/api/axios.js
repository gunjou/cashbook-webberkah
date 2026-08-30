// src/api/axios.js
import axios from "axios";
import swal from "../lib/swal";

const baseURL = process.env.REACT_APP_API_URL;
// const baseURL = "http://127.0.0.1:5000";

const api = axios.create({
  baseURL: baseURL,
  timeout: 10000,
});

let isSessionErrorHandled = false;

// =====================================================
// REQUEST INTERCEPTOR
// =====================================================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const status = error.response?.status;

    // Hanya handle Unauthorized
    if (status === 401) {
      // Hindari Swal muncul berkali-kali
      if (!isSessionErrorHandled) {
        isSessionErrorHandled = true;

        // Hapus session
        localStorage.clear();

        await swal.fire({
          icon: "warning",
          title: "Sesi Tidak Valid",
          text: "Sesi Anda telah berakhir. Silakan login kembali.",
          confirmButtonText: "Login Kembali",
          allowOutsideClick: false,
        });

        window.location.href = "/";
      }

      // Hentikan request karena akan redirect
      return new Promise(() => {});
    }

    // Error selain authentication tetap diteruskan
    return Promise.reject(error);
  },
);

export default api;
