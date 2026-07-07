import { ArrowLeft, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import { useAuth } from "../context/AuthContext";

interface BrandLayoutProps {
  brandCode: string;
  brandName?: string;
  children: React.ReactNode;
}

function BrandLayout({ brandCode, brandName, children }: BrandLayoutProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <Sidebar brandCode={brandCode} />

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="flex h-20 items-center justify-between px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/overview")}
                className="rounded-xl border border-slate-200 p-3 text-slate-500 hover:bg-slate-50"
              >
                <ArrowLeft size={20} />
              </button>

              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  {brandName || brandCode} Dashboard
                </h1>
                <p className="text-sm text-slate-500">
                  Brand-specific performance workspace
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="hidden rounded-xl border border-slate-200 p-3 text-slate-500 hover:bg-slate-50 sm:block">
                <Bell size={20} />
              </button>

              <div className="hidden text-right sm:block">
                <p className="font-semibold text-slate-800">
                  {user?.emp_name}
                </p>
                <p className="text-sm text-slate-500">
                  {user?.designation}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                {user?.emp_name?.charAt(0) || "S"}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-6 py-8 lg:px-8">
          {children}
        </main>

        <footer className="border-t border-slate-200 bg-white px-6 py-5 text-sm text-slate-500 lg:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Sprinklez General Trading LLC</p>
            <p>{brandName || brandCode} · Brand Workspace</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default BrandLayout;