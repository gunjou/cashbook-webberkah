import { useEffect, useRef, useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Eye,
  EyeOff,
  Palette,
  User,
  LogOut,
} from "lucide-react";
import {
  isCurrencyHidden,
  toggleCurrencyHidden,
} from "../utils/currency-visibility";

const Navbar = ({
  sidebarOpen,
  toggleSidebar,
  hideAmount,
  toggleHideAmount,
  user,
  onLogout,
  onOpenTheme,
}) => {
  const [openProfile, setOpenProfile] = useState(false);
  const [hidden, setHidden] = useState(isCurrencyHidden());
  const handleToggleCurrency = () => {
    setHidden(toggleCurrencyHidden());
  };

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="glass sticky top-0 z-40 mx-3 mt-3 flex h-[60px] shrink-0 items-center justify-between rounded-full px-2 sm:px-3 lg:ml-0 lg:mr-3">
      {/* Left */}

      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? "Tutup sidebar" : "Buka sidebar"}
          className="hidden size-11 items-center justify-center rounded-full text-ink transition hover:bg-white/60 active:scale-95 lg:flex"
        >
          {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>

        <h1 className="truncate pl-3 text-base font-semibold tracking-tight text-ink sm:text-lg lg:hidden">
          Cashbook Berkah
        </h1>
      </div>

      {/* Right */}

      <div className="flex shrink-0 items-center gap-1 lg:gap-2">
        <button
          onClick={handleToggleCurrency}
          className="flex size-11 items-center justify-center rounded-full text-ink transition hover:bg-white/60 active:scale-95"
          title={hideAmount ? "Tampilkan Saldo" : "Sembunyikan Saldo"}
          aria-label={hideAmount ? "Tampilkan Saldo" : "Sembunyikan Saldo"}
        >
          {hidden ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>

        <button
          onClick={onOpenTheme}
          className="flex size-11 items-center justify-center rounded-full text-ink transition hover:bg-white/60 active:scale-95"
          title="Warna Tema"
          aria-label="Warna Tema"
        >
          <Palette size={20} strokeWidth={1.5} />
        </button>

        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setOpenProfile((prev) => !prev)}
            className="flex items-center gap-2 rounded-full p-1 transition hover:bg-white/60 lg:pr-3"
          >
            <div className="glass-primary flex size-9 items-center justify-center rounded-full font-semibold">
              {user?.display_name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="hidden text-left lg:block">
              <p className="text-sm font-semibold text-ink">
                {user?.display_name || "Administrator"}
              </p>

              <p className="text-xs text-neutral-600">{user?.role || "-"}</p>
            </div>

            <ChevronDown size={20} className="hidden text-neutral-600 lg:block" />
          </button>

          {openProfile && (
            <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl p-1 panel-dialog">
              <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-ink transition hover:bg-primary-100">
                <User size={20} />
                Profile
              </button>

              <button
                onClick={onLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-600 transition hover:bg-red-500/10"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
