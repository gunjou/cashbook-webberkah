const startsWith = (bytes, signature, offset = 0) =>
  signature.every((value, index) => bytes[offset + index] === value);

const ascii = (text) => [...text].map((char) => char.charCodeAt(0));

// URL bisa tanpa ekstensi, jadi jenis file dibaca dari isinya.
// SVG sengaja tidak dianggap gambar supaya tidak di-preview.
export const detectFromBlob = async (blob) => {
  const bytes = new Uint8Array(await blob.slice(0, 12).arrayBuffer());

  if (startsWith(bytes, ascii("%PDF"))) return "pdf";

  if (
    startsWith(bytes, [0x89, 0x50, 0x4e, 0x47]) ||
    startsWith(bytes, [0xff, 0xd8, 0xff]) ||
    startsWith(bytes, ascii("GIF8")) ||
    (startsWith(bytes, ascii("RIFF")) && startsWith(bytes, ascii("WEBP"), 8))
  ) {
    return "image";
  }

  // Tetap dicoba; kalau browser gagal menampilkan, onError memunculkan fallback.
  if (/^image\/(heic|heif|avif|bmp)$/i.test(blob.type)) return "image";

  return "other";
};
