import {
  BarChart3,
  Bike,
  ClipboardList,
  DollarSign,
  LogOut,
  MessageSquareText,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface SidebarProps {
  brandCode: string;
}

function Sidebar({ brandCode }: SidebarProps) {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  const links = [
    {
      label: "Sales Dashboard",
      icon: BarChart3,
      path: `/brand/${brandCode}`,
    },
    {
      label: "P&L Dashboard",
      icon: DollarSign,
      path: `/brand/${brandCode}/pnl`,
    },
    {
      label: "Delivery Business",
      icon: Bike,
      path: `/brand/${brandCode}/delivery`,
    },
    {
      label: "Customer Reviews",
      icon: MessageSquareText,
      path: `/brand/${brandCode}/reviews`,
    },
    {
      label: "Project Pipeline",
      icon: ClipboardList,
      path: `/brand/${brandCode}/pipeline`,
    },
  ];

  return (
    <aside className="hidden min-h-screen w-72 border-r border-slate-200 bg-white lg:block">
      <div className="flex h-20 items-center border-b border-slate-200 px-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Sprinklez</h2>
          <p className="text-sm text-slate-500">Brand Workspace</p>
        </div>
      </div>

      <nav className="space-y-2 p-4">
        {links.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === `/brand/${brandCode}`}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              <Icon size={20} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="absolute bottom-0 w-72 border-t border-slate-200 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;