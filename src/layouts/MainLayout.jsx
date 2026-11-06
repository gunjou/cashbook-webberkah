import { useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNavigation from "../components/BottomNavigation";

import notify from "../lib/notify";
import { getUser, logout } from "../modules/auth/auth.service";
import FloatingActionButton from "../components/FloatingActionButton";
import TransactionAddModal from "../modules/transactions/TransactionAddModal";
import ThemePicker from "../components/ThemePicker";

const MainLayout = ({ children }) => {
  const user = getUser();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openAddTransaction, setOpenAddTransaction] = useState(false);
  const [openTheme, setOpenTheme] = useState(false);

  const [hideAmount, setHideAmount] = useState(
    localStorage.getItem("hide_amount") === "true",
  );

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const toggleHideAmount = () => {
    const value = !hideAmount;

    setHideAmount(value);

    localStorage.setItem("hide_amount", value);
  };

  const handleLogout = async () => {
    const result = await notify.fire({
      icon: "warning",
      title: "Logout",
      text: "Apakah Anda yakin ingin keluar dari aplikasi?",
      showCancelButton: true,
      confirmButtonText: "Logout",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    logout();

    await notify.fire({
      icon: "success",
      title: "Logout Berhasil",
      text: "Sampai jumpa kembali.",
      timer: 1200,
      showConfirmButton: false,
    });

    window.location.href = "/login";
  };

  return (
    <div className="flex h-screen min-w-0 overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          hideAmount={hideAmount}
          toggleHideAmount={toggleHideAmount}
          user={user}
          onLogout={handleLogout}
          onOpenTheme={() => setOpenTheme(true)}
        />

        <main className="min-w-0 flex-1 overflow-y-auto pb-28 lg:pb-0">
          {children}
        </main>
      </div>

      <FloatingActionButton onClick={() => setOpenAddTransaction(true)} />

      <TransactionAddModal
        open={openAddTransaction}
        onClose={() => setOpenAddTransaction(false)}
      />

      {/* Di luar Navbar: backdrop-filter membuat position: fixed mengacu ke Navbar. */}
      <ThemePicker open={openTheme} onClose={() => setOpenTheme(false)} />

      <BottomNavigation />
    </div>
  );
};

export default MainLayout;
