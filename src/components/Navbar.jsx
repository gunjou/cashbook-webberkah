import { useEffect, useRef, useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Eye,
  EyeOff,
  Moon,
  Sun,
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
  darkMode,
  toggleDarkMode,
  hideAmount,
  toggleHideAmount,
  user,
  onLogout,
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
    <header className="sticky top-0 z-40 flex h-[68px] items-center justify-between border-b border-border bg-surface px-4 lg:px-6">
      {/* Left */}

      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="hidden rounded-lg p-2 text-text transition hover:bg-primary-hover hover:text-white lg:flex"
        >
          {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>

        <h1 className="text-lg font-bold text-secondary lg:hidden">
          Cashbook Berkah
        </h1>
      </div>

      {/* Right */}

      <div className="flex items-center gap-2 lg:gap-3">
        <button
          onClick={handleToggleCurrency}
          className="rounded-lg p-2 text-text transition hover:bg-primary-hover hover:text-white"
          title={hideAmount ? "Tampilkan Saldo" : "Sembunyikan Saldo"}
        >
          {hidden ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>

        <button
          onClick={toggleDarkMode}
          className="rounded-lg p-2 text-text transition hover:bg-primary-hover hover:text-white"
          title={darkMode ? "Light Mode" : "Dark Mode"}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setOpenProfile((prev) => !prev)}
            className="flex items-center gap-2 rounded-lg p-1 transition hover:bg-primary-hover hover:text-white lg:px-3 lg:py-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-semibold text-white">
              {user?.display_name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="hidden text-left lg:block">
              <p className="text-sm font-semibold text-text">
                {user?.display_name || "Administrator"}
              </p>

              <p className="text-xs text-muted">{user?.role || "-"}</p>
            </div>

            <ChevronDown size={20} className="hidden text-muted lg:block" />
          </button>

          {openProfile && (
            <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-card shadow-card">
              <button className="flex w-full items-center gap-3 px-4 py-3 text-sm text-text transition hover:bg-primary-hover hover:text-white">
                <User size={20} />
                Profile
              </button>

              <button
                onClick={onLogout}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 transition hover:bg-red-500/10"
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
