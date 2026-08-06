import ExcelJS from "exceljs";

import {
  autoFitColumns,
  downloadWorkbook,
  drawFooter,
  drawHeader,
  drawSignature,
  drawTableBody,
  drawTableHeader,
} from "./excel.helper";

export const createExcelTemplate = async ({
  title,
  finance,
  orientation = "landscape",
}) => {
  const workbook = new ExcelJS.Workbook();

  workbook.creator = "Cashbook WebBerkah";
  workbook.company = "PT. Berkah Angsana Teknika";
  workbook.subject = title;
  workbook.title = title;
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet(title);

  worksheet.pageSetup = {
    orientation,
    paperSize: 9,
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,

    margins: {
      left: 0.5,
      right: 0.5,
      top: 0.6,
      bottom: 0.6,
      header: 0.3,
      footer: 0.3,
    },
  };

  worksheet.views = [
    {
      state: "frozen",
      ySplit: 7,
    },
  ];

  worksheet.properties.defaultRowHeight = 20;

  await drawHeader({
    workbook,
    worksheet,
    title,
  });

  return {
    workbook,
    worksheet,

    startRow: 8,

    drawTableHeader,

    drawTableBody,

    autoFitColumns: () => autoFitColumns(worksheet),

    drawFooter: (row) => drawFooter(worksheet, row),

    drawSignature: (row, title = "Finance") =>
      drawSignature({
        worksheet,
        row,
        finance,
        title,
      }),

    download: (filename) => downloadWorkbook(workbook, filename),
  };
};
