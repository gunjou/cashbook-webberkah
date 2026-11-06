import {
  LayoutDashboard,
  ArrowLeftRight,
  Landmark,
  Tags,
  Wallet,
  ClipboardList,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import Logo from "./Logo";

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
    title: "Opening Balance",
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
    group: "Master",
  },
  {
    title: "Kategori",
    path: "/categories",
    icon: Tags,
    group: "Master",
  },
];

const Sidebar = ({ sidebarOpen }) => {
  return (
    <aside
      className={`card-glass m-3 hidden shrink-0 overflow-hidden transition-all duration-300 lg:block ${
        sidebarOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}

        <div
          className={`flex h-[76px] items-center ${
            sidebarOpen ? "px-4 justify-start" : "justify-center"
          }`}
        >
          <Logo title="Cashbook" className={`${
              sidebarOpen ? "h-10 w-10" : "h-9 w-9"
            } object-contain transition-all`} />

          {sidebarOpen && (
            <div className="ml-3">
              <h1 className="text-sm font-semibold text-ink">Cashbook</h1>
              <p className="text-xs text-neutral-600">Berkah Angsana</p>
            </div>
          )}
        </div>

        {/* Menu */}

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {menus.map((menu, index) => {
            const Icon = menu.icon;

            const previousGroup = index > 0 ? menus[index - 1].group : null;

            return (
              <div key={menu.path}>
                {sidebarOpen && menu.group && menu.group !== previousGroup && (
                  <p className="px-3 pt-5 pb-2 text-xs font-semibold uppercase tracking-wider text-neutral-600">
                    {menu.group}
                  </p>
                )}

                <NavLink
                  to={menu.path}
                  className={({ isActive }) =>
                    `flex min-h-11 w-full items-center rounded-full px-4 py-2.5 text-sm transition ${
                      sidebarOpen ? "gap-3" : "justify-center"
                    } ${
                      isActive
                        ? "bg-white/80 font-semibold text-primary-strong shadow-sm"
                        : "text-ink hover:bg-white/50"
                    }`
                  }
                >
                  <Icon size={20} strokeWidth={1.5} className="shrink-0" />

                  {sidebarOpen && <span className="truncate">{menu.title}</span>}
                </NavLink>
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
