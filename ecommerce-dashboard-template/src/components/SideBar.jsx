import React from "react";
import {
  LayoutDashboard,
  ListOrdered,
  Package,
  Users,
  User,
  LogOut,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenedComponent } from "../store/slices/extraSlice";
import { logout, setAuthUser } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ThemeToggle from "./ThemeToggle";

const SideBar = () => {
  const { authUser } = useSelector((state) => state.auth || {});
  const { openedComponent } = useSelector((state) => state.extra || {});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";
      await axios.get(`${baseURL}/auth/logout`, { withCredentials: true });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      dispatch(setAuthUser(null));
      navigate("/login");
    }
  };

  const navItems = [
    { label: "Dashboard", Icon: LayoutDashboard },
    { label: "Users", Icon: Users },
    { label: "Products", Icon: Package },
    { label: "Orders", Icon: ListOrdered },
    { label: "Profile", Icon: User },
  ];

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="w-5 h-5 text-sidebar-foreground" />
          <span className="font-semibold text-sidebar-foreground">Dashboard</span>
        </div>
        <ThemeToggle />
      </div>

      <div className="px-4 pb-4">
        <div className="text-sm text-sidebar-foreground">
          {authUser?.name ? `Admin: ${authUser.name}` : "Admin"}
        </div>
        <div className="text-xs text-sidebar-foreground/70 mt-1">{authUser?.email || ""}</div>
      </div>

      <nav className="px-4 pb-6 space-y-2 flex-1">
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

      <div className="px-4 pb-6 border-t border-sidebar-border pt-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium bg-red-500/10 text-red-600 hover:bg-red-500/20"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default SideBar;
