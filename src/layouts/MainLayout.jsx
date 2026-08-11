import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNavigation from "../components/BottomNavigation";

import swal from "../lib/swal";
import { getUser, logout } from "../modules/auth/auth.service";
import FloatingActionButton from "../components/FloatingActionButton";
import TransactionAddModal from "../modules/transactions/TransactionAddModal";

const MainLayout = ({ children }) => {
  const user = getUser();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openAddTransaction, setOpenAddTransaction] = useState(false);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("dark_mode") === "true",
  );

  const [hideAmount, setHideAmount] = useState(
    localStorage.getItem("hide_amount") === "true",
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const toggleDarkMode = () => {
    const value = !darkMode;

    setDarkMode(value);

    localStorage.setItem("dark_mode", value);
  };

  const toggleHideAmount = () => {
    const value = !hideAmount;

    setHideAmount(value);

    localStorage.setItem("hide_amount", value);
  };

  const handleLogout = async () => {
    const result = await swal.fire({
      icon: "warning",
      title: "Logout",
      text: "Apakah Anda yakin ingin keluar dari aplikasi?",
      showCancelButton: true,
      confirmButtonText: "Logout",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    logout();

    await swal.fire({
      icon: "success",
      title: "Logout Berhasil",
      text: "Sampai jumpa kembali.",
      timer: 1200,
      showConfirmButton: false,
    });

    window.location.href = "/login";
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar sidebarOpen={sidebarOpen} />

      <div className="flex flex-1 flex-col">
        <Navbar
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          hideAmount={hideAmount}
          toggleHideAmount={toggleHideAmount}
          user={user}
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-y-auto bg-background pb-20 lg:pb-0">
          {children}
        </main>
      </div>

      <FloatingActionButton onClick={() => setOpenAddTransaction(true)} />

      <TransactionAddModal
        open={openAddTransaction}
        onClose={() => setOpenAddTransaction(false)}
      />

      <BottomNavigation />
    </div>
  );
};

export default MainLayout;
