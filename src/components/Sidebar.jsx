import {
  LayoutDashboard,
  ArrowLeftRight,
  Landmark,
  Tags,
  Wallet,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import logo from "../assets/logo.png";

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
      className={`hidden border-r border-border bg-surface transition-all duration-300 lg:block ${
        sidebarOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}

        <div
          className={`flex h-[68px] items-center border-b border-border ${
            sidebarOpen ? "px-4 justify-start" : "justify-center"
          }`}
        >
          <img
            src={logo}
            alt="Cashbook"
            className={`${
              sidebarOpen ? "h-10 w-10" : "h-9 w-9"
            } object-contain transition-all`}
          />

          {sidebarOpen && (
            <div className="ml-3">
              <h1 className="text-sm font-bold text-secondary">Cashbook</h1>
              <p className="text-xs text-muted">Berkah Angsana</p>
            </div>
          )}
        </div>

        {/* Menu */}

        <nav className="flex-1 space-y-1 p-3">
          {menus.map((menu, index) => {
            const Icon = menu.icon;

            const previousGroup = index > 0 ? menus[index - 1].group : null;

            return (
              <div key={menu.path}>
                {sidebarOpen && menu.group && menu.group !== previousGroup && (
                  <p className="px-3 pt-5 pb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                    {menu.group}
                  </p>
                )}

                <NavLink
                  to={menu.path}
                  className={({ isActive }) =>
                    `flex w-full items-center rounded-lg px-3 py-3 transition ${
                      sidebarOpen ? "gap-3" : "justify-center"
                    } ${
                      isActive
                        ? "bg-primary text-white font-semibold"
                        : "text-text hover:bg-primary/15"
                    }`
                  }
                >
                  <Icon size={20} />

                  {sidebarOpen && <span>{menu.title}</span>}
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
