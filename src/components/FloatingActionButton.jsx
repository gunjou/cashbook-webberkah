import { Plus } from "lucide-react";

const FloatingActionButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="
      fixed

      bottom-24
      right-5

      z-40

      flex
      h-14
      w-14

      items-center
      justify-center

      rounded-full

      bg-primary

      text-white

      shadow-xl

      transition

      active:scale-95

      lg:hidden
      "
    >
      <Plus size={28} />
    </button>
  );
};

export default FloatingActionButton;
