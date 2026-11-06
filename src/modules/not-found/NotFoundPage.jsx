import { ArrowLeft, House } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import Logo from "../../components/Logo";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-primary-50 px-6">
      {/* Background Decoration */}

      <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-primary-strong/10 blur-3xl" />

      <div className="relative w-full max-w-lg p-10 text-center panel-glass rounded-card">
        <Logo title="Cashbook" className="mx-auto mb-6 h-20 w-20 object-contain" />

        <span className="rounded-full bg-primary/20 px-4 py-1 text-sm font-semibold text-primary-strong">
          Oops!
        </span>

        <h1 className="mt-6 text-7xl font-extrabold tracking-tight">
          <span className="text-primary-strong">4</span>
          <span className="text-primary">0</span>
          <span className="text-primary-strong">4</span>
        </h1>

        <h2 className="mt-5 text-2xl font-semibold tracking-tight text-ink lg:text-3xl">
          Halaman Tidak Ditemukan
        </h2>

        <p className="mt-4 leading-7 text-neutral-600">
          Maaf, halaman yang Anda cari tidak tersedia, telah dipindahkan, atau
          alamat URL yang dimasukkan tidak benar.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-strong transition hover:opacity-90"
          >
            <House size={18} />
            Dashboard
          </Link>

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold text-ink transition hover:bg-primary/15 glass-button"
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
