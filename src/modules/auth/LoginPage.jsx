import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

import logo from "../../assets/logo.png";

import Loading from "../../components/Loading";
import swal from "../../lib/swal";

import { login } from "./auth.service";

const LoginPage = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!username || !password) {
      return swal.fire({
        icon: "warning",
        title: "Data Belum Lengkap",
        text: "Username dan password wajib diisi.",
      });
    }

    setLoading(true);

    try {
      await login(username, password);

      await swal.fire({
        icon: "success",
        title: "Login Berhasil",
        text: "Selamat datang kembali.",
        timer: 1200,
        showConfirmButton: false,
      });

      navigate("/dashboard", { replace: true });
    } catch (error) {
      swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: error.response?.data?.message ?? "Username atau password salah.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-10">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-card">
        <div className="mb-8 flex flex-col items-center">
          <img
            src={logo}
            alt="Cashbook WebBerkah"
            className="mb-4 h-24 w-24 object-contain"
          />

          <h1 className="text-2xl font-bold text-secondary">
            Cashbook WebBerkah
          </h1>

          <p className="mt-2 text-center text-sm text-muted">
            Sistem Pencatatan Keuangan Internal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-text">
              Username
            </label>

            <input
              type="text"
              value={username}
              disabled={loading}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text placeholder:text-muted outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-70"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-text">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                disabled={loading}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full rounded-lg border border-border bg-surface px-4 py-3 pr-12 text-text placeholder:text-muted outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-70"
              />

              <button
                type="button"
                disabled={loading}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted transition hover:bg-primary/15 hover:text-secondary disabled:pointer-events-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-lg bg-primary py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? <Loading.Button text="Memproses..." /> : "Masuk"}
          </button>

          <div className="mt-8 text-center text-xs text-muted">
            © {new Date().getFullYear()} Outlook-Project. All rights reserved.
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
