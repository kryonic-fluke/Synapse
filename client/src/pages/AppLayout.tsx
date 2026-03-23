import { Outlet, useNavigate, useParams } from "react-router-dom";

import { useLayout } from "../context/LayoutContext";
import { SideBar } from "../components/Sidebar";
import { Navbar } from "../components/AppNavBar";
import { useAuth } from "../context/AuthContext";
import { useGetCanvases } from "../hooks/usegetCanvases";
import { useEffect } from "react";

export function AppLayout() {
  const { isSidebarOpen } = useLayout();

  const { user } = useAuth();
  const { data: canvases, isSuccess } = useGetCanvases();
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess && user && canvases) {
      const currentCanvasId = params._id;
      const userCanvasIds = canvases.map((c: { _id: string; }) => c._id);
      if (currentCanvasId && !userCanvasIds.includes(currentCanvasId)) {
        navigate("/app", { replace: true });
      }
    }
  }, [isSuccess, canvases, user, params._id, navigate]);

  
  return (
    <div
      className={`grid ${
        isSidebarOpen ? "grid-cols-[18rem_1fr]" : "grid-cols-[0rem_1fr]"
      } h-screen transition-all duration-300`}
    >
      <div className="bg-gray-800 overflow-hidden">
        <SideBar />
      </div>
      <div className="flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 p-6 bg-gray-100 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
