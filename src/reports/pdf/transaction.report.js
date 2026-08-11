import autoTable from "jspdf-autotable";

import { drawHeader, drawFooter, drawSignature } from "./pdf.helper";

import jsPDF from "jspdf";
import { generateReportFilename } from "./report.filename";

const formatCurrency = (value) =>
  new Intl.NumberFormat("id-ID").format(value ?? 0);

const formatDate = (date) => {
  if (!date) return "-";

  const [year, month, day] = String(date).slice(0, 10).split("-");

  if (!year || !month || !day) return "-";

  const dateObject = new Date(Number(year), Number(month) - 1, Number(day));

  const weekday = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
  }).format(dateObject);

  return `${weekday}, ${day}-${month}-${year}`;
};

export const exportTransactionPDF = (accounts, user, reportFilter) => {
  if (!accounts?.length) return;

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const margin = 15;

  const pageWidth = doc.internal.pageSize.getWidth();

  const pageHeight = doc.internal.pageSize.getHeight();

  accounts.forEach((accountData, accountIndex) => {
    /**
     * =====================================
     * PAGE BREAK
     * =====================================
     */

    if (accountIndex > 0) {
      doc.addPage();
    }

    /**
     * =====================================
     * HEADER SETIAP HALAMAN
     * =====================================
     */

    drawHeader({
      doc,
      margin,
      pageWidth,
      title: "Laporan Transaksi",
    });

    let currentY = 52;

    /**
     * =====================================
     * ACCOUNT
     * =====================================
     */

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);

    doc.text(
      `${accountData.account.account_name} (${accountData.account.account_kind})`,
      margin,
      currentY,
    );

    currentY += 6;

    /**
     * =====================================
     * SUMMARY BOX
     * =====================================
     */

    const summaryBoxHeight = 16;

    doc.setDrawColor(220);
    doc.setFillColor(249, 249, 249);

    doc.roundedRect(
      margin,
      currentY,
      pageWidth - margin * 2,
      summaryBoxHeight,
      2,
      2,
      "FD",
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);

    const summaryX = [margin + 5, margin + 95, margin + 185];

    const labelOffset = 0;
    const valueOffset = 32;

    // Row 1
    doc.text("Starting Balance", summaryX[0] + labelOffset, currentY + 6);
    doc.text(":", summaryX[0] + valueOffset, currentY + 6);
    doc.text(
      `Rp ${formatCurrency(accountData.starting_balance)}`,
      summaryX[0] + valueOffset + 4,
      currentY + 6,
    );

    doc.setTextColor(0, 0, 0);
    doc.text("Income", summaryX[1] + labelOffset, currentY + 6);
    doc.text(":", summaryX[1] + 28, currentY + 6);
    // Income value → HIJAU
    doc.setTextColor(46, 125, 50);
    doc.text(
      `Rp ${formatCurrency(accountData.total_income)}`,
      summaryX[1] + 32,
      currentY + 6,
    );
    // Reset ke hitam agar elemen setelahnya tidak ikut berwarna
    doc.setTextColor(0, 0, 0);

    doc.text("Transaction", summaryX[2] + labelOffset, currentY + 6);
    doc.text(":", summaryX[2] + 34, currentY + 6);
    doc.text(
      `${accountData.transaction_count}`,
      summaryX[2] + 38,
      currentY + 6,
    );

    // Row 2
    doc.text("Ending Balance", summaryX[0] + labelOffset, currentY + 12);
    doc.text(":", summaryX[0] + valueOffset, currentY + 12);
    doc.text(
      `Rp ${formatCurrency(accountData.ending_balance)}`,
      summaryX[0] + valueOffset + 4,
      currentY + 12,
    );

    // Row 2 - Expense
    doc.setTextColor(0, 0, 0);
    doc.text("Expense", summaryX[1] + labelOffset, currentY + 12);
    doc.text(":", summaryX[1] + 28, currentY + 12);
    // Expense value → MERAH
    doc.setTextColor(198, 40, 40);
    doc.text(
      `Rp ${formatCurrency(accountData.total_expense)}`,
      summaryX[1] + 32,
      currentY + 12,
    );
    // Reset ke hitam agar elemen setelahnya tidak ikut berwarna
    doc.setTextColor(0, 0, 0);

    currentY += 21;

    /**
     * =====================================
     * TABLE
     * =====================================
     */

    autoTable(doc, {
      startY: currentY,

      head: [
        ["No", "Hari/Tanggal", "Kategori", "Deskripsi", "IN", "OUT", "Saldo"],
      ],

      body: [
        ...accountData.transactions.map((trx, index) => [
          index + 1,

          formatDate(trx.transaction_date),

          trx.category_name,

          trx.transaction_description,

          trx.transaction_type === "IN"
            ? `Rp ${formatCurrency(trx.amount)}`
            : "-",

          trx.transaction_type === "OUT"
            ? `Rp ${formatCurrency(trx.amount)}`
            : "-",

          `Rp ${formatCurrency(trx.balance_after)}`,
        ]),

        // TOTAL ROW
        [
          {
            content: "TOTAL",
            colSpan: 4,
            styles: {
              halign: "center",
              valign: "middle",
              fontStyle: "bold",
            },
          },

          `Rp ${formatCurrency(accountData.total_income)}`,

          `Rp ${formatCurrency(accountData.total_expense)}`,

          `Rp ${formatCurrency(accountData.ending_balance)}`,
        ],
      ],

      theme: "grid",

      margin: {
        left: margin,
        right: margin,
      },

      styles: {
        fontSize: 8,
        cellPadding: 2.5,
        lineColor: [190, 190, 190],
        lineWidth: 0.1,
        overflow: "linebreak",
        valign: "middle",
      },

      alternateRowStyles: {
        fillColor: [249, 249, 249],
      },

      headStyles: {
        fillColor: [229, 58, 54],
        textColor: [255, 255, 255],
        halign: "center",
        valign: "middle",
        fontStyle: "bold",
      },

      columnStyles: {
        // No
        0: {
          cellWidth: 10,
          halign: "center",
        },

        // Date
        1: {
          cellWidth: 35,
          halign: "center",
        },

        // Category
        2: {
          cellWidth: 42,
        },

        // Description
        3: {
          cellWidth: 90,
        },

        // IN
        4: {
          cellWidth: 28,
          halign: "right",
        },

        // OUT
        5: {
          cellWidth: 28,
          halign: "right",
        },

        // Balance
        6: {
          cellWidth: 35,
          halign: "right",
        },
      },

      didParseCell(data) {
        if (data.section !== "body") return;

        const isTotalRow = data.row.index === accountData.transactions.length;

        /**
         * =====================================
         * TOTAL ROW
         * =====================================
         */

        if (isTotalRow) {
          data.cell.styles.fillColor = [245, 245, 245];
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.lineWidth = 0.3;
          data.cell.styles.textColor = [0, 0, 0];

          // TOTAL → merged 4 kolom pertama
          if (data.column.index === 0) {
            data.cell.styles.halign = "center";
            data.cell.styles.valign = "middle";
          }

          // TOTAL IN → HIJAU
          if (data.column.index === 4) {
            data.cell.styles.textColor = [46, 125, 50];
            data.cell.styles.fontStyle = "bold";
          }

          // TOTAL OUT → MERAH
          if (data.column.index === 5) {
            data.cell.styles.textColor = [198, 40, 40];
            data.cell.styles.fontStyle = "bold";
          }

          // TOTAL SALDO → HITAM
          if (data.column.index === 6) {
            data.cell.styles.textColor = [0, 0, 0];
            data.cell.styles.fontStyle = "bold";
          }

          return;
        }

        /**
         * =====================================
         * TRANSACTION ROW
         * =====================================
         */

        const trx = accountData.transactions[data.row.index];

        // IN → HIJAU
        if (data.column.index === 4 && trx.transaction_type === "IN") {
          data.cell.styles.textColor = [46, 125, 50];
          data.cell.styles.fontStyle = "bold";
        }

        // OUT → MERAH
        if (data.column.index === 5 && trx.transaction_type === "OUT") {
          data.cell.styles.textColor = [198, 40, 40];
          data.cell.styles.fontStyle = "bold";
        }

        // SALDO → BOLD
        if (data.column.index === 6) {
          data.cell.styles.fontStyle = "bold";
        }
      },
    });

    const finalY = doc.lastAutoTable.finalY;

    /**
     * =====================================
     * SIGNATURE
     * =====================================
     */

    drawSignature({
      doc,
      pageWidth,
      startY: finalY + 18,
      finance: user?.display_name ?? "Finance",
    });

    /**
     * =====================================
     * FOOTER
     * =====================================
     */

    drawFooter({
      doc,
      margin,
      pageWidth,
      pageHeight,
      page: accountIndex + 1,
      total: accounts.length,
    });
  });

  /**
   * =====================================
   * SAVE PDF
   * =====================================
   */

  const filename = generateReportFilename({
    reportName: "Transaksi",
    ...reportFilter,
  });

  doc.save(filename);
};
