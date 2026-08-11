import autoTable from "jspdf-autotable";

import { createPortraitTemplate } from "./portrait.template";

const formatCurrency = (value) =>
  new Intl.NumberFormat("id-ID").format(value ?? 0);

const formatDate = (date) => {
  if (!date) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(new Date(date));
};

export const exportOpeningBalanceHistoryPDF = (histories, user) => {
  if (!histories.length) return;

  const { doc, margin, startY, drawFooter, drawSignature } =
    createPortraitTemplate({
      title: "History Opening Balance",
      finance: user?.display_name ?? "Finance",
    });

  // Informasi Account

  doc.setFontSize(9);

  doc.setFont("helvetica", "bold");

  doc.text("Account", margin, startY);

  doc.setFont("helvetica", "normal");

  doc.text(`: ${histories[0].account_name}`, margin + 28, startY);

  doc.setFont("helvetica", "bold");

  doc.text("Jumlah History", margin, startY + 6);

  doc.setFont("helvetica", "normal");

  doc.text(`: ${histories.length}`, margin + 28, startY + 6);

  autoTable(doc, {
    startY: startY + 14,

    head: [["No", "Effective Date", "Opening Balance", "Catatan"]],

    body: histories.map((item, index) => [
      index + 1,
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
      fontSize: 8,
      cellPadding: 2.5,
      lineWidth: 0.1,
      lineColor: [180, 180, 180],
      overflow: "linebreak",
      valign: "middle",
    },

    alternateRowStyles: {
      fillColor: [248, 248, 248],
    },

    headStyles: {
      fillColor: [229, 58, 54],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
    },

    columnStyles: {
      0: {
        cellWidth: 10,
        halign: "center",
      },

      1: {
        cellWidth: 35,
        halign: "center",
      },

      2: {
        cellWidth: 42,
        halign: "right",
      },

      3: {
        cellWidth: "auto",
      },
    },
  });

  drawSignature(doc.lastAutoTable.finalY + 18);

  drawFooter();

  doc.save(`History Opening Balance - ${histories[0].account_name}.pdf`);
};
