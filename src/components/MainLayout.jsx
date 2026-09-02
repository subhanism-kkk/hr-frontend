import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Users,
  Briefcase,
  Tag,
  FileText,
  Settings,
  LogOut,
  FolderTree,
  CalendarDays,
  Contact,
  Layers,
  Building2,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Coins,
} from "lucide-react";

export default function MainLayout() {
  const navigate = useNavigate();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(true);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const navItems = [
    {
      label: "Persons",
      path: "/persons",
      icon: Users,
    },
    {
      label: "Positions",
      path: "/positions",
      icon: Briefcase,
    },
    {
      label: "Structures",
      path: "/structures",
      icon: Building2,
    },
    {
      label: "Orders",
      path: "/orders",
      icon: FileText,
    },
    {
      label: "Staffing Plans",
      path: "/staffing-plans",
      icon: Layers,
    },
  ];

  const settingsItems = [
    {
      label: "Order Types",
      path: "/settings/order-types",
      icon: FolderTree,
    },
    {
      label: "Leave Types",
      path: "/settings/leave-types",
      icon: CalendarDays,
    },
    {
      label: "Bonus Types",
      path: "/settings/bonus-types",
      icon: Coins,
    },
    {
      label: "Statuses",
      path: "/statuses",
      icon: Tag,
    },
    {
      label: "Contact Types",
      path: "/settings/contact-types",
      icon: Contact,
    },
  ];

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
      isActive
        ? "bg-indigo-50 text-indigo-600 font-semibold"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  const collapsedLinkClass = ({ isActive }) =>
    `flex items-center justify-center rounded-lg py-2.5 transition-colors ${
      isActive
        ? "bg-indigo-50 text-indigo-600"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside
        className={`sticky top-0 flex h-screen shrink-0 flex-col justify-between border-r border-slate-200 bg-white p-4 transition-all duration-200 ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="space-y-6">
          {/* Header */}
          <div
            className={`flex items-center ${
              sidebarCollapsed
                ? "justify-center"
                : "justify-between"
            }`}
          >
            {!sidebarCollapsed && (
              <div className="px-3 py-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  HR Portal
                </h1>

                <p className="mt-0.5 text-xs text-slate-400">
                  Management System
                </p>
              </div>
            )}

            {/* Sidebar toggle */}
            <button
              type="button"
              onClick={() =>
                setSidebarCollapsed(
                  (previous) => !previous
                )
              }
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
              title={
                sidebarCollapsed
                  ? "Open sidebar"
                  : "Collapse sidebar"
              }
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen size={19} />
              ) : (
                <PanelLeftClose size={19} />
              )}
            </button>
          </div>

          {/* Main Navigation */}
          <nav className="space-y-1">
            {!sidebarCollapsed && (
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Menu
              </p>
            )}

            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={
                    sidebarCollapsed
                      ? collapsedLinkClass
                      : linkClass
                  }
                  title={
                    sidebarCollapsed
                      ? item.label
                      : undefined
                  }
                >
                  <Icon size={18} />

                  {!sidebarCollapsed && (
                    <span>{item.label}</span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Settings */}
          <nav className="space-y-1">
            {sidebarCollapsed ? (
              /*
               * When sidebar is collapsed, show only the
               * Settings icon.
               *
               * Clicking it opens the sidebar instead of
               * trying to display the settings children
               * inside the narrow sidebar.
               */
              <button
                type="button"
                onClick={() =>
                  setSidebarCollapsed(false)
                }
                className="flex w-full items-center justify-center rounded-lg py-2.5 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                title="Settings"
              >
                <Settings size={18} />
              </button>
            ) : (
              <>
                {/* Settings header */}
                <button
                  type="button"
                  onClick={() =>
                    setSettingsOpen(
                      (previous) => !previous
                    )
                  }
                  className="mb-2 flex w-full items-center gap-1.5 rounded-lg px-3 py-1 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 transition-colors hover:text-slate-600"
                >
                  <ChevronRight
                    size={15}
                    className={`transition-transform duration-200 ${
                      settingsOpen
                        ? "rotate-90"
                        : ""
                    }`}
                  />

                  <Settings size={13} />

                  <span>Settings</span>
                </button>

                {/* Settings children */}
                {settingsOpen && (
                  <div className="space-y-1">
                    {settingsItems.map((item) => {
                      const Icon = item.icon;

                      return (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          className={linkClass}
                        >
                          <Icon size={18} />

                          <span>{item.label}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </nav>
        </div>

        {/* Footer Logout */}
        <div className="border-t border-slate-200 pt-4">
          <button
            onClick={handleLogout}
            className={`flex w-full items-center rounded-lg py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 ${
              sidebarCollapsed
                ? "justify-center"
                : "gap-3 px-3.5"
            }`}
            title={
              sidebarCollapsed
                ? "Logout"
                : undefined
            }
          >
            <LogOut size={18} />

            {!sidebarCollapsed && (
              <span>Logout</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Page Content */}
      <main className="min-w-0 flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}