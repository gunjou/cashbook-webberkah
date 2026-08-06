import { createExcelTemplate } from "./excel.template";

export const exportAccountExcel = async (accounts, user) => {
  const {
    worksheet,
    startRow,
    drawTableHeader,
    drawTableBody,
    drawSignature,
    drawFooter,
    autoFitColumns,
    download,
  } = await createExcelTemplate({
    title: "Laporan Account",
    finance: user?.display_name ?? "Finance",
    orientation: "landscape",
  });

  /* =========================
     Header Table
  ========================= */

  const headerRow = worksheet.getRow(startRow);

  headerRow.values = [
    "No",
    "Nama Account",
    "Jenis",
    "Bank",
    "Cabang",
    "Nomor Rekening",
    "Pemilik",
  ];

  drawTableHeader(headerRow);

  headerRow.height = 24;

  /* =========================
     Body
  ========================= */

  accounts.forEach((account, index) => {
    const row = worksheet.getRow(startRow + index + 1);

    row.values = [
      index + 1,
      account.account_name,
      account.account_kind,
      account.bank_name ?? "-",
      account.branch_name ?? "-",
      account.account_number ?? "-",
      account.account_holder ?? "-",
    ];

    drawTableBody(row, index % 2 === 1);

    row.getCell(1).alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    row.getCell(3).alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    row.getCell(6).alignment = {
      horizontal: "center",
      vertical: "middle",
    };
  });

  /* =========================
     Column Width
  ========================= */

  worksheet.columns = [
    { width: 8 },
    { width: 34 },
    { width: 15 },
    { width: 24 },
    { width: 20 },
    { width: 24 },
    { width: 34 },
  ];

  autoFitColumns();

  /* =========================
     Signature
  ========================= */

  const signatureRow = startRow + accounts.length + 3;

  drawSignature(signatureRow);

  /* =========================
     Footer
  ========================= */

  drawFooter(signatureRow + 7);

  /* =========================
     Download
  ========================= */

  await download("Laporan_Account.xlsx");
};
