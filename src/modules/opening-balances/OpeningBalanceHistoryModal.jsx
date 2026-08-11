import { useRef, useEffect, useState } from "react";
import { ChevronDown, Download, X } from "lucide-react";
import { FaRegFilePdf } from "react-icons/fa";
import { RiFileExcel2Line } from "react-icons/ri";

import swal from "../../lib/swal";
import Loading from "../../components/Loading";

import { getOpeningBalanceHistory } from "./opening-balance.service";
import { formatCurrency } from "../../utils/currency";
import { formatPeriod } from "../../utils/date";
import { exportOpeningBalanceHistoryPDF } from "../../reports/pdf/history-opening-balance.report";
import { getUser } from "../auth/auth.service";

const OpeningBalanceHistoryModal = ({ accountId, onClose }) => {
  const exportRef = useRef(null);
  const [openExport, setOpenExport] = useState(false);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [accountName, setAccountName] = useState("");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportRef.current && !exportRef.current.contains(event.target)) {
        setOpenExport(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!accountId) return;
    fetchHistory();
    // eslint-disable-next-line
  }, [accountId]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await getOpeningBalanceHistory(accountId);
      setHistory(data);
      if (data.length > 0) {
        setAccountName(data[0].account_name);
      }
    } catch (error) {
      onClose();
      swal.fire({
        icon: "error",
        title: "Gagal Memuat Data",
        text: error.response?.data?.message ?? "Terjadi kesalahan.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!accountId) return null;

  const handleExportPDF = () => {
    const user = getUser();
    exportOpeningBalanceHistoryPDF(history, user);

    setOpenExport(false);
  };

  const handleExportExcel = () => {
    console.log("Export Excel");
    setOpenExport(false);
  };

  const handleClose = () => {
    setOpenExport(false);
    onClose();
  };

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-border bg-card shadow-modal"
      >
        {/* Header */}

        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-secondary">
              History Opening Balance
            </h2>

            <p className="mt-1 text-md font-semibold text-muted">
              {accountName || "-"}
            </p>
          </div>

          <button
            onClick={handleClose}
            className="rounded-full p-2 transition text-secondary hover:bg-primary hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Toolbar */}

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
          {/* Export */}

          <div ref={exportRef} className="relative">
            <button
              onClick={() => setOpenExport((prev) => !prev)}
              className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-text transition hover:bg-primary hover:text-white"
            >
              <Download size={18} />
              Export
              <ChevronDown
                size={16}
                className={`transition ${openExport ? "rotate-180" : ""}`}
              />
            </button>

            {openExport && (
              <div className="absolute left-0 z-20 mt-2 w-52 overflow-hidden rounded-xl border border-border bg-card shadow-card lg:left-0 lg:right-auto">
                <button
                  onClick={handleExportPDF}
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm transition text-red-600 hover:bg-red-500/10 hover:text-red-600"
                >
                  <FaRegFilePdf size={18} />
                  Export PDF
                </button>

                {false && (
                  <button
                    onClick={handleExportExcel}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm transition text-green-600 hover:bg-green-500/10 hover:text-green-600"
                  >
                    <RiFileExcel2Line size={18} />
                    Export Excel
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        {/* Body */}

        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <Loading.Data text="Memuat history opening balance..." />
          ) : history.length === 0 ? (
            <div className="flex h-full min-h-[300px] items-center justify-center rounded-xl border border-border bg-surface">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-secondary">
                  Belum Ada History
                </h3>

                <p className="mt-2 text-sm text-muted">
                  Opening balance untuk account ini belum tersedia.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="min-w-full border-collapse">
                <thead className="bg-secondary text-white">
                  <tr>
                    <th className="w-16 px-4 py-3 text-center text-sm font-semibold">
                      No
                    </th>

                    <th className="w-32 px-4 py-3 text-left text-sm font-semibold">
                      Periode
                    </th>

                    <th className="w-48 px-4 py-3 text-right text-sm font-semibold">
                      Opening Balance
                    </th>

                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Catatan
                    </th>

                    <th className="w-44 px-4 py-3 text-left text-sm font-semibold">
                      Dibuat Oleh
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {history.map((item, index) => (
                    <tr
                      key={item.id_opening_balance}
                      className="border-t border-border transition hover:bg-primary/10"
                    >
                      <td className="text-center text-sm px-4 py-3">
                        {index + 1}
                      </td>

                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        {formatPeriod(item.effective_date)}
                      </td>

                      <td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-secondary">
                        {formatCurrency(item.opening_balance)}
                      </td>

                      <td
                        className="max-w-0 px-4 py-3 text-sm"
                        title={item.notes ?? "-"}
                      >
                        <div className="truncate">{item.notes ?? "-"}</div>
                      </td>

                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        {item.created_by ?? "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}

        <div className="flex justify-end border-t border-border px-6 py-5">
          <button
            onClick={handleClose}
            className="rounded-lg bg-primary px-5 py-2 font-semibold text-white transition hover:opacity-90"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default OpeningBalanceHistoryModal;
