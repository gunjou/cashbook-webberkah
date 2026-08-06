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

export const drawHeader = ({ doc, margin, pageWidth, title }) => {
  try {
    doc.addImage(logo, "PNG", margin, 10, 18, 18);
  } catch (error) {
    console.warn("Logo gagal dimuat.", error);
  }

  const startX = margin + 23;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(229, 58, 54);

  doc.text(COMPANY.name, startX, 15);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(90);

  doc.text(COMPANY.address1, startX, 20);
  doc.text(COMPANY.address2, startX, 24);
  doc.text(COMPANY.contact, startX, 28);

  doc.setDrawColor(80);

  doc.setLineWidth(0.5);
  doc.line(margin, 33, pageWidth - margin, 33);

  doc.setLineWidth(0.15);
  doc.line(margin, 34, pageWidth - margin, 34);

  doc.setTextColor(0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);

  doc.text(title.toUpperCase(), pageWidth / 2, 43, {
    align: "center",
  });
};

export const drawFooter = ({
  doc,
  margin,
  pageWidth,
  pageHeight,
  page = 1,
  total = 1,
}) => {
  const footerY = pageHeight - 10;

  doc.setFont("helvetica", "italic");
  doc.setFontSize(7);
  doc.setTextColor(120);

  doc.text(
    `Dicetak otomatis melalui Cashbook PT. Berkah Angsana Teknika • ${formatDateTime()}`,
    margin,
    footerY,
  );

  doc.text(`Halaman ${page}/${total}`, pageWidth - margin, footerY, {
    align: "right",
  });
};

export const drawSignature = ({
  doc,
  pageWidth,
  startY,
  finance = "Finance",
  title = "Finance",
}) => {
  const centerX = pageWidth - 55;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  doc.text("Mengetahui,", centerX, startY, {
    align: "center",
  });

  doc.setFont("helvetica", "bold");

  doc.text(finance, centerX, startY + 24, {
    align: "center",
  });

  doc.setFont("helvetica", "normal");

  doc.line(centerX - 20, startY + 26, centerX + 20, startY + 26);

  doc.text(title, centerX, startY + 31, {
    align: "center",
  });
};
