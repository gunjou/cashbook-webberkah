import { saveAs } from "file-saver";

import logo from "../../assets/logo_original.png";

const COMPANY = {
  name: "PT. BERKAH ANGSANA TEKNIKA",
  address1: "Perumahan Bukit Citra Kencana, Block B No. 35, Jl. Pengsong Raya",
  address2: "Desa Perampuan, Kecamatan Labuapi, Lombok Barat, NTB",
  contact: "Phone : 0370 785 3692 | admin@berkahangsana.com",
};

export const formatDateTime = () =>
  new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date());

export const loadLogo = async (workbook) => {
  const response = await fetch(logo);

  const buffer = await response.arrayBuffer();

  return workbook.addImage({
    buffer,
    extension: "png",
  });
};

export const drawHeader = async ({ workbook, worksheet, title }) => {
  const logoId = await loadLogo(workbook);

  worksheet.addImage(logoId, {
    tl: { col: 0.2, row: 0.2 },
    ext: { width: 55, height: 55 },
  });

  worksheet.mergeCells("C1:G1");
  worksheet.mergeCells("C2:G2");
  worksheet.mergeCells("C3:G3");
  worksheet.mergeCells("C4:G4");

  worksheet.getCell("C1").value = COMPANY.name;
  worksheet.getCell("C2").value = COMPANY.address1;
  worksheet.getCell("C3").value = COMPANY.address2;
  worksheet.getCell("C4").value = COMPANY.contact;

  worksheet.getCell("C1").font = {
    bold: true,
    size: 14,
    color: { argb: "FFE53A36" },
  };

  ["C2", "C3", "C4"].forEach((cell) => {
    worksheet.getCell(cell).font = {
      size: 9,
      color: { argb: "FF666666" },
    };
  });

  worksheet.mergeCells("A6:G6");

  worksheet.getCell("A6").value = title.toUpperCase();

  worksheet.getCell("A6").font = {
    bold: true,
    size: 13,
  };

  worksheet.getCell("A6").alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  worksheet.getRow(5).border = {
    bottom: {
      style: "double",
      color: { argb: "FF000000" },
    },
  };

  worksheet.getRow(6).height = 24;
};

export const drawTableHeader = (row) => {
  row.eachCell((cell) => {
    cell.font = {
      bold: true,
      color: {
        argb: "FFFFFFFF",
      },
    };

    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "FFE53A36",
      },
    };

    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    cell.border = {
      top: {
        style: "thin",
      },
      bottom: {
        style: "thin",
      },
      left: {
        style: "thin",
      },
      right: {
        style: "thin",
      },
    };
  });
};

export const drawTableBody = (row, alternate = false) => {
  row.eachCell((cell) => {
    cell.alignment = {
      vertical: "middle",
    };

    cell.border = {
      top: {
        style: "thin",
        color: { argb: "FFD6D6D6" },
      },
      bottom: {
        style: "thin",
        color: { argb: "FFD6D6D6" },
      },
      left: {
        style: "thin",
        color: { argb: "FFD6D6D6" },
      },
      right: {
        style: "thin",
        color: { argb: "FFD6D6D6" },
      },
    };

    if (alternate) {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: "FFF8F8F8",
        },
      };
    }
  });
};

export const drawSignature = ({
  worksheet,
  row,
  finance,
  title = "Finance",
}) => {
  worksheet.mergeCells(`F${row}:G${row}`);
  worksheet.mergeCells(`F${row + 4}:G${row + 4}`);
  worksheet.mergeCells(`F${row + 5}:G${row + 5}`);

  worksheet.getCell(`F${row}`).value = "Mengetahui,";

  worksheet.getCell(`F${row + 4}`).value = finance;

  worksheet.getCell(`F${row + 5}`).value = title;

  worksheet.getCell(`F${row}`).alignment = {
    horizontal: "center",
  };

  worksheet.getCell(`F${row + 4}`).alignment = {
    horizontal: "center",
  };

  worksheet.getCell(`F${row + 5}`).alignment = {
    horizontal: "center",
  };

  worksheet.getCell(`F${row + 4}`).font = {
    bold: true,
  };

  worksheet.getCell(`F${row + 4}`).border = {
    bottom: {
      style: "thin",
    },
  };
};

export const drawFooter = (worksheet, row) => {
  worksheet.mergeCells(`A${row}:F${row}`);

  worksheet.getCell(`A${row}`).value =
    `Dicetak otomatis melalui Cashbook PT. Berkah Angsana Teknika • ${formatDateTime()}`;

  worksheet.getCell(`A${row}`).font = {
    italic: true,
    size: 8,
    color: {
      argb: "FF888888",
    },
  };

  worksheet.getCell(`A${row}`).alignment = {
    horizontal: "left",
  };
};

export const autoFitColumns = (worksheet) => {
  worksheet.columns.forEach((column) => {
    let maxLength = 10;

    column.eachCell?.({ includeEmpty: true }, (cell) => {
      const value = cell.value ? cell.value.toString() : "";

      maxLength = Math.max(maxLength, value.length + 3);
    });

    column.width = Math.min(maxLength, 40);
  });
};

export const downloadWorkbook = async (workbook, filename) => {
  const buffer = await workbook.xlsx.writeBuffer();

  saveAs(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    filename,
  );
};
