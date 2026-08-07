import { useEffect, useState } from "react";
import { X } from "lucide-react";

import swal from "../../lib/swal";

import Loading from "../../components/Loading";

const CategoryAddModal = ({ open, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!open) return;

    setName("");
    setDescription("");
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!name.trim()) {
      return swal.fire({
        icon: "warning",
        title: "Data Belum Lengkap",
        text: "Nama kategori wajib diisi.",
      });
    }

    try {
      setLoading(true);

      await onSave({
        name: name.trim(),
        description: description.trim() || null,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-border bg-card shadow-modal"
      >
        {/* Header */}

        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-secondary">
              Tambah Kategori
            </h2>

            <p className="text-sm text-muted">
              Tambahkan kategori transaksi baru.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 transition text-secondary hover:bg-primary hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}

        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 space-y-5 overflow-y-auto p-5">
            {/* Nama */}

            <div>
              <label className="mb-2 block text-sm font-medium text-text">
                Nama Kategori
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama kategori"
                className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text outline-none transition focus:border-primary"
              />
            </div>

            {/* Deskripsi */}

            <div>
              <label className="mb-2 block text-sm font-medium text-text">
                Deskripsi
              </label>

              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Masukkan deskripsi kategori (opsional)"
                className="w-full resize-none rounded-lg border border-border bg-surface px-4 py-3 text-text outline-none transition focus:border-primary"
              />
            </div>
          </div>

          {/* Footer */}

          <div className="flex justify-end gap-3 border-t border-border px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-border bg-surface px-5 py-2 font-medium text-text transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex min-w-[150px] items-center justify-center rounded-lg bg-primary px-5 py-2 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <Loading.Button text="Menyimpan..." />
              ) : (
                "Simpan Kategori"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryAddModal;
