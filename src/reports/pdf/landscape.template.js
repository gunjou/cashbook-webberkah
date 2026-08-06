import jsPDF from "jspdf";

import { drawFooter, drawHeader, drawSignature } from "./pdf.helper";

export const createLandscapeTemplate = ({
  title,
  finance,
  logo = "/images/logo.png",
}) => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const margin = 15;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  drawHeader({
    doc,
    margin,
    pageWidth,
    title,
    logo,
  });

  return {
    doc,
    margin,
    pageWidth,
    pageHeight,
    startY: 52,

    drawFooter: (page = 1, total = 1) =>
      drawFooter({
        doc,
        margin,
        pageWidth,
        pageHeight,
        page,
        total,
      }),

    drawSignature: (startY, title = "Finance") =>
      drawSignature({
        doc,
        pageWidth,
        startY,
        finance,
        title,
      }),
  };
};
