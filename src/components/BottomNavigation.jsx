import {
  LayoutDashboard,
  ArrowLeftRight,
  Landmark,
  Tags,
  Wallet,
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
    // <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface lg:hidden">
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface lg:hidden">
      <div className="grid grid-cols-5">
        {menus.map((menu) => {
          const Icon = menu.icon;

          return (
            <NavLink key={menu.path} to={menu.path}>
              {({ isActive }) => (
                <div
                  className={`flex flex-col items-center justify-center gap-1 py-3 transition ${
                    isActive
                      ? "text-white bg-background rounded-b-lg"
                      : "text-muted hover:text-secondary"
                  }`}
                >
                  <Icon size={24} strokeWidth={isActive ? 2.6 : 2} />

                  <span
                    className={`text-[11px] font-medium ${
                      isActive ? "text-secondary" : ""
                    }`}
                  >
                    {/* {menu.title} */}
                  </span>
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
