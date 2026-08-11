import autoTable from "jspdf-autotable";
import { createPortraitTemplate } from "./portrait.template";

const formatCurrency = (value) =>
  new Intl.NumberFormat("id-ID").format(value ?? 0);

const formatDate = (date) => {
  if (!date) return "-";
  const [year, month, day] = date.split("-");
  if (!year || !month || !day) return date;
  return `${day}-${month}-${year}`;
};

export const exportOpeningBalancePDF = (openingBalances, user) => {
  const { doc, margin, startY, drawFooter, drawSignature } =
    createPortraitTemplate({
      title: "Laporan Opening Balance",
      finance: user?.display_name ?? "Finance",
    });

  autoTable(doc, {
    startY,

    head: [
      ["No", "Account", "Jenis", "Effective", "Opening Balance", "Catatan"],
    ],

    body: openingBalances.map((item, index) => [
      index + 1,
      item.account_name,
      item.account_kind,
      formatDate(item.effective_date),
      `Rp ${formatCurrency(item.opening_balance)}`,
      item.notes ?? "-",
    ]),

    theme: "grid",

    margin: {
      left: margin,
      right: margin,
    },

    styles: {
      fontSize: 7.5,
      cellPadding: 2.2,
      valign: "middle",
      lineColor: [180, 180, 180],
      lineWidth: 0.1,
      overflow: "linebreak",
    },

    headStyles: {
      fillColor: [229, 58, 54],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
      valign: "middle",
    },

    alternateRowStyles: {
      fillColor: [248, 248, 248],
    },

    columnStyles: {
      // No
      0: {
        cellWidth: 10,
        halign: "center",
      },

      // Account
      1: {
        cellWidth: 42,
        halign: "left",
      },

      // Jenis
      2: {
        cellWidth: 20,
        halign: "center",
      },

      // Effective
      3: {
        cellWidth: 25,
        halign: "center",
      },

      // Opening Balance
      4: {
        cellWidth: 35,
        halign: "right",
      },

      // Notes
      5: {
        cellWidth: "auto",
        halign: "left",
      },
    },
  });

  drawSignature(doc.lastAutoTable.finalY + 18);

  drawFooter();

  doc.save("Laporan Opening Balance - Semua Account.pdf");
};
