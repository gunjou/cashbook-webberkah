import {
  LayoutDashboard,
  ArrowLeftRight,
  Landmark,
  Tags,
  Wallet,
  ClipboardList,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menus = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Transaksi",
    path: "/transactions",
    icon: ArrowLeftRight,
  },
  {
    title: "Opening",
    path: "/opening-balances",
    icon: Wallet,
  },
  {
    title: "Pengajuan",
    path: "/purchase-requests",
    icon: ClipboardList,
  },
  {
    title: "Account",
    path: "/accounts",
    icon: Landmark,
  },
  {
    title: "Kategori",
    path: "/categories",
    icon: Tags,
  },
];

const BottomNavigation = () => {
  return (
    <nav className="glass fixed bottom-4 left-1/2 z-40 w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 rounded-full p-1.5 lg:hidden">
      <div className="grid grid-cols-6 gap-0.5">
        {menus.map((menu) => {
          const Icon = menu.icon;

          return (
            <NavLink key={menu.path} to={menu.path} aria-label={menu.title}>
              {({ isActive }) => (
                <div
                  className={`flex h-11 items-center justify-center rounded-full transition ${
                    isActive
                      ? "bg-white/80 text-primary-strong shadow-sm"
                      : "text-neutral-600 hover:text-ink"
                  }`}
                >
                  <Icon size={20} strokeWidth={isActive ? 2 : 1.5} aria-hidden="true" />
                </div>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
