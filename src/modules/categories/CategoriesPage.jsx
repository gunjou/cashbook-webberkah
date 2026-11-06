// import { useEffect, useRef, useState } from "react";
import { useEffect, useState } from "react";

// import {
//   Download,
//   ChevronDown,
//   FileSpreadsheet,
//   FileText,
//   Pencil,
//   Plus,
//   Search,
//   Trash2,
// } from "lucide-react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";

import MainLayout from "../../layouts/MainLayout";
import Loading from "../../components/Loading";
import notify from "../../lib/notify";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "./category.service";
import CategoryAddModal from "./CategoryAddModal";
import CategoryEditModal from "./CategoryEditModal";
// import { getUser } from "../auth/auth.service";

const CategoryPage = () => {
  // const user = getUser();

  // const exportRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");

  // const [openExport, setOpenExport] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (exportRef.current && !exportRef.current.contains(event.target)) {
  //       setOpenExport(false);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);

  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const data = await getCategories();

      setCategories(data);
    } catch (error) {
      notify.fire({
        icon: "error",
        title: "Gagal Memuat Data",
        text: error.response?.data?.message ?? "Terjadi kesalahan.",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter((item) => {
    const keyword = search.toLowerCase();

    return (
      item.name.toLowerCase().includes(keyword) ||
      item.description.toLowerCase().includes(keyword)
    );
  });

  // const handleExportPDF = () => {
  //   console.log("Export PDF");

  //   setOpenExport(false);
  // };

  // const handleExportExcel = () => {
  //   console.log("Export Excel");

  //   setOpenExport(false);
  // };

  const handleCreate = async (payload) => {
    try {
      await createCategory(payload);

      setShowAddModal(false);

      await fetchCategories();

      notify.fire({
        icon: "success",
        title: "Berhasil",
        text: "Kategori berhasil ditambahkan.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      notify.fire({
        icon: "error",
        title: "Gagal",
        text: error.response?.data?.message ?? "Terjadi kesalahan.",
      });
    }
  };

  const handleUpdate = async (payload) => {
    try {
      await updateCategory(editingCategoryId, payload);

      setEditingCategoryId(null);

      await fetchCategories();

      notify.fire({
        icon: "success",
        title: "Berhasil",
        text: "Kategori berhasil diperbarui.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      notify.fire({
        icon: "error",
        title: "Gagal",
        text: error.response?.data?.message ?? "Terjadi kesalahan.",
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await notify.fire({
      icon: "warning",
      title: "Hapus Kategori",
      text: "Kategori akan dihapus secara permanen.",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteCategory(id);

      await fetchCategories();

      notify.fire({
        icon: "success",
        title: "Berhasil",
        text: "Kategori berhasil dihapus.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      notify.fire({
        icon: "error",
        title: "Gagal",
        text: error.response?.data?.message ?? "Terjadi kesalahan.",
      });
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 p-4 sm:p-6">
        {/* Header */}

        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-ink lg:text-3xl">Kategori</h1>

            <p className="mt-1 text-neutral-600">
              Kelola seluruh kategori transaksi perusahaan.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Export */}

            {/* <div ref={exportRef} className="relative">
              <button
                onClick={() => setOpenExport((prev) => !prev)}
                className="flex items-center gap-2 rounded-full px-4 py-3 text-sm font-medium text-ink transition hover:bg-primary/15 glass-button"
              >
                <Download size={18} />
                Export
                <ChevronDown
                  size={16}
                  className={`transition duration-200 ${
                    openExport ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openExport && (
                <div className="absolute right-0 z-20 mt-2 w-52 overflow-hidden lg:left-0 lg:right-auto panel-dialog rounded-card">
                  <button
                    onClick={handleExportPDF}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm text-ink transition hover:bg-red-500/10 hover:text-red-600"
                  >
                    <FileText size={18} />
                    Export PDF
                  </button>

                  <button
                    onClick={handleExportExcel}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm text-ink transition hover:bg-green-500/10 hover:text-green-600"
                  >
                    <FileSpreadsheet size={18} />
                    Export Excel
                  </button>
                </div>
              )}
            </div> */}

            {/* Add */}

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 rounded-full glass-primary px-4 py-3 font-semibold transition hover:opacity-90"
            >
              <Plus size={18} />
              Tambah Kategori
            </button>
          </div>
        </div>

        {/* Search */}

        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600"
          />

          <input
            type="text"
            placeholder="Cari kategori..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-2xl bg-white/70 ring-1 ring-ink/8 focus:ring-2 focus:ring-primary-500 w-full py-3 pl-11 pr-4 text-ink outline-none transition"
          />
        </div>

        {/* Desktop Table */}

        <div className="hidden overflow-hidden lg:block panel-glass rounded-card">
          <table className="w-full">
            <thead className="bg-primary-100 text-ink">
              <tr>
                <th className="w-20 px-5 py-3 text-center text-md font-semibold">
                  No
                </th>

                <th className="px-5 py-3 text-left text-md font-semibold">
                  Nama Kategori
                </th>

                <th className="px-5 py-3 text-left text-md font-semibold">
                  Deskripsi
                </th>

                <th className="w-36 px-5 py-3 text-center text-md font-semibold">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4}>
                    <div className="flex justify-center py-12">
                      <Loading.Data text="Memuat kategori..." />
                    </div>
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-neutral-600">
                    Belum ada kategori.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category, index) => (
                  <tr
                    key={category.id_category}
                    className="border-t border-primary-200 transition"
                  >
                    <td className="px-5 py-2 text-center">{index + 1}</td>

                    <td className="px-5 py-2 font-medium text-primary-strong">
                      {category.name}
                    </td>

                    <td className="max-w-xl truncate px-5 py-2 text-ink">
                      {category.description}
                    </td>

                    <td
                      className="px-5 py-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() =>
                            setEditingCategoryId(category.id_category)
                          }
                          className="rounded-full p-2 text-ink transition hover:text-ink glass-button"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() => handleDelete(category.id_category)}
                          className="rounded-full p-2 text-red-600 transition glass-button"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Mobile Card */}

        <div className="space-y-4 lg:hidden">
          {loading ? (
            <div className="p-6 text-center text-neutral-600 panel-glass rounded-card">
              <Loading.Data text="Memuat kategori..." />
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="p-6 text-center text-neutral-600 panel-glass rounded-card">
              Belum ada kategori.
            </div>
          ) : (
            filteredCategories.map((category) => (
              <div
                key={category.id_category}
                className="p-4 transition panel-glass rounded-card"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-primary-strong">
                      {category.name}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-ink">
                      {category.description}
                    </p>
                  </div>
                </div>

                <div
                  className="mt-5 flex justify-end gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setEditingCategoryId(category.id_category)}
                    className="rounded-full p-2 text-ink transition glass-button"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => handleDelete(category.id_category)}
                    className="rounded-full p-2 text-red-600 transition glass-button"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add */}

      <CategoryAddModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleCreate}
      />

      {/* Edit */}

      {editingCategoryId && (
        <CategoryEditModal
          categoryId={editingCategoryId}
          onClose={() => setEditingCategoryId(null)}
          onSave={handleUpdate}
        />
      )}
    </MainLayout>
  );
};

export default CategoryPage;
