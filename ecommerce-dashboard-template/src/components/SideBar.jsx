import React from "react";
import {
  LayoutDashboard,
  ListOrdered,
  Package,
  Users,
  User,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenedComponent } from "../store/slices/extraSlice";
import ThemeToggle from "./ThemeToggle";

const SideBar = () => {
  const { user } = useSelector((state) => state.auth || {});
  const { openedComponent } = useSelector((state) => state.extra || {});
  const dispatch = useDispatch();

  const navItems = [
    { label: "Dashboard", Icon: LayoutDashboard },
    { label: "Users", Icon: Users },
    { label: "Products", Icon: Package },
    { label: "Orders", Icon: ListOrdered },
    { label: "Profile", Icon: User },
  ];

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border">
      <div className="h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="w-5 h-5 text-sidebar-foreground" />
          <span className="font-semibold text-sidebar-foreground">Dashboard</span>
        </div>
        <ThemeToggle />
      </div>

      <div className="px-4 pb-4">
        <div className="text-sm text-sidebar-foreground">
          {user?.name ? `Admin: ${user.name}` : "Admin"}
        </div>
        <div className="text-xs text-sidebar-foreground/70 mt-1">{user?.email || ""}</div>
      </div>

      <nav className="px-4 pb-6 space-y-2">
        {navItems.map(({ label, Icon }) => {
          const active = openedComponent === label;
          return (
            <button
              key={label}
              onClick={() => dispatch(setOpenedComponent(label))}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/80"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default SideBar;
