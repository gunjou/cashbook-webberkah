import { ArrowLeft, House } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import logo from "../../assets/logo.png";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6">
      {/* Background Decoration */}

      <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />

      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-10 text-center shadow-card">
        <img
          src={logo}
          alt="Cashbook"
          className="mx-auto mb-6 h-20 w-20 object-contain"
        />

        <span className="rounded-full bg-primary/20 px-4 py-1 text-sm font-semibold text-secondary">
          Oops!
        </span>

        <h1 className="mt-6 text-7xl font-extrabold tracking-tight">
          <span className="text-secondary">4</span>
          <span className="text-primary">0</span>
          <span className="text-secondary">4</span>
        </h1>

        <h2 className="mt-5 text-3xl font-bold text-secondary">
          Halaman Tidak Ditemukan
        </h2>

        <p className="mt-4 leading-7 text-muted">
          Maaf, halaman yang Anda cari tidak tersedia, telah dipindahkan, atau
          alamat URL yang dimasukkan tidak benar.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-secondary transition hover:opacity-90"
          >
            <House size={18} />
            Dashboard
          </Link>

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-6 py-3 font-semibold text-text transition hover:bg-primary/15"
          >
            <ArrowLeft size={18} />
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
