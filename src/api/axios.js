// src/api/axios.js
import axios from "axios";
import swal from "../lib/swal";

const api = axios.create({
  // baseURL: "http://127.0.0.1:5000",
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
});

let isSessionErrorHandled = false;

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const status = error.response?.status;

    if (status === 401 || status === 422) {
      // Hindari Swal muncul berkali-kali
      if (!isSessionErrorHandled) {
        isSessionErrorHandled = true;

        // Hapus session
        localStorage.clear();

        await swal.fire({
          icon: "warning",
          title: "Sesi Tidak Valid",
          text: "Sesi Anda telah berakhir atau tidak valid. Silakan login kembali.",
          confirmButtonText: "Login Kembali",
          allowOutsideClick: false,
        });

        window.location.href = "/";
      }

      // Jangan reject error lagi.
      // Biarkan request berhenti karena halaman akan redirect.
      return new Promise(() => {});
    }

    // Error selain authentication tetap diteruskan
    return Promise.reject(error);
  },
);

export default api;
