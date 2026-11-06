import { useState } from "react";
import { Eye, EyeOff, Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Logo from "../../components/Logo";

import Button from "../../components/Button";
import Card from "../../components/Card";
import IconButton from "../../components/IconButton";
import Loading from "../../components/Loading";
import ThemePicker from "../../components/ThemePicker";
import notify from "../../lib/notify";

import { INPUT_CLASS } from "../../utils/classes";

import { login } from "./auth.service";

const LoginPage = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openTheme, setOpenTheme] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!username || !password) {
      return notify.fire({
        icon: "warning",
        title: "Data Belum Lengkap",
        text: "Username dan password wajib diisi.",
      });
    }

    setLoading(true);

    try {
      await login(username, password);

      await notify.fire({
        icon: "success",
        title: "Login Berhasil",
        text: "Selamat datang kembali.",
        timer: 1200,
        showConfirmButton: false,
      });

      navigate("/dashboard", { replace: true });
    } catch (error) {
      notify.fire({
        icon: "error",
        title: "Login Gagal",
        text: error.response?.data?.message ?? "Username atau password salah.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-10 sm:px-6">
      <IconButton
        label="Warna Tema"
        onClick={() => setOpenTheme(true)}
        className="fixed right-4 top-4 z-10 sm:right-6 sm:top-6"
      >
        <Palette size={20} strokeWidth={1.5} aria-hidden="true" />
      </IconButton>

      <Card className="w-full max-w-md p-6 sm:p-8">
        <div className="mb-8 flex flex-col items-center">
          <Logo title="Cashbook WebBerkah" className="mb-4 h-24 w-24 object-contain" />

          <h1 className="text-center text-2xl font-semibold tracking-tight text-ink">
            Cashbook WebBerkah
          </h1>

          <p className="mt-2 text-center text-sm text-neutral-600">
            Sistem Pencatatan Keuangan Internal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-ink">
              Username
            </label>

            <input
              type="text"
              value={username}
              disabled={loading}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-ink">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                disabled={loading}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className={`${INPUT_CLASS} pr-12`}
              />

              <button
                type="button"
                disabled={loading}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-neutral-600 transition hover:bg-white/60 hover:text-ink disabled:pointer-events-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <Button type="submit" size="lg" disabled={loading} className="w-full">
            {loading ? <Loading.Button text="Memproses..." /> : "Masuk"}
          </Button>

          <div className="mt-8 text-center text-xs text-neutral-600">
            © {new Date().getFullYear()} Outlook-Project. All rights reserved.
          </div>
        </form>
      </Card>

      <ThemePicker open={openTheme} onClose={() => setOpenTheme(false)} />
    </div>
  );
};

export default LoginPage;
