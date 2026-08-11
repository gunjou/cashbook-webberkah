import autoTable from "jspdf-autotable";

import { createLandscapeTemplate } from "./landscape.template";

export const exportAccountPDF = (accounts, user) => {
  // eslint-disable-next-line no-unused-vars
  const { doc, margin, pageWidth, startY, drawFooter, drawSignature } =
    createLandscapeTemplate({
      title: "Laporan Account",
      finance: user?.display_name ?? "Finance",
    });

  autoTable(doc, {
    startY,

    head: [
      [
        "No",
        "Nama Account",
        "Jenis",
        "Bank",
        "Cabang",
        "Nomor Rekening",
        "Pemilik",
      ],
    ],

    body: accounts.map((account, index) => [
      index + 1,
      account.account_name,
      account.account_kind,
      account.bank_name ?? "-",
      account.branch_name ?? "-",
      account.account_number ?? "-",
      account.account_holder ?? "-",
    ]),

    theme: "grid",

    margin: {
      left: margin,
      right: margin,
    },

    styles: {
      fontSize: 8,
      cellPadding: 2.5,
      valign: "middle",
      lineColor: [180, 180, 180],
      lineWidth: 0.1,
    },

    alternateRowStyles: {
      fillColor: [248, 248, 248],
    },

    headStyles: {
      fillColor: [229, 58, 54],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
      valign: "middle",
    },

    columnStyles: {
      0: {
        halign: "center",
        cellWidth: 10,
      },

      1: {
        halign: "left",
      },

      2: {
        halign: "center",
        cellWidth: 20,
      },

      3: {
        halign: "left",
      },

      4: {
        halign: "left",
      },

      5: {
        halign: "center",
      },

      6: {
        halign: "left",
      },
    },
  });

  drawSignature(doc.lastAutoTable.finalY + 18);

  drawFooter();

  doc.save("Laporan List Account.pdf");
};
