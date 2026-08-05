import Swal from "sweetalert2";

const swal = Swal.mixin({
  reverseButtons: true,

  buttonsStyling: false,

  allowOutsideClick: true,

  customClass: {
    popup: "rounded-xl border border-border bg-card text-text shadow-modal",

    title: "text-secondary",

    htmlContainer: "text-muted",

    actions: "flex gap-3",

    confirmButton:
      "rounded-lg bg-primary px-5 py-2 font-medium text-white transition hover:opacity-90",

    cancelButton:
      "rounded-lg bg-secondary px-5 py-2 font-medium text-card transition hover:opacity-90",
  },
});

export default swal;
