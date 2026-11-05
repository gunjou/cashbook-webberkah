// Nama lampiran yang bisa diklik: bagian nama dipotong dengan "..." bila tidak
// cukup, sedangkan ekstensi (.pdf, .jpg, dst) selalu terlihat.
const AttachmentFileName = ({ name = "", onClick }) => {
  const extension = name.match(/\.[^./\\]+$/)?.[0] || "";
  const baseName = extension ? name.slice(0, -extension.length) : name;
  const textClass =
    "text-sm font-semibold text-secondary group-hover:underline";

  return (
    <button
      type="button"
      onClick={onClick}
      title={name}
      className="group flex w-full min-w-0 text-left"
    >
      <span className={`min-w-0 truncate ${textClass}`}>{baseName}</span>
      <span className={`shrink-0 ${textClass}`}>{extension}</span>
    </button>
  );
};

export default AttachmentFileName;
