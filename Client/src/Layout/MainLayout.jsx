import { Outlet, useNavigate } from "react-router";
import { useAuth } from "../Context/AuthContext";
import MainNavbar from "../Components/MainNavbar";

function MainLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <MainNavbar onLogout={handleLogout} />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-3">
        <div className="relative mb-6 flex justify-start">
          <button
            onClick={handleBack}
            className="flex items-center justify-center rounded border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:border-slate-400"
          >
            ← Back
          </button>
        </div>
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 py-4">
        <div className="mx-auto w-full max-w-5xl px-4 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Course Portal
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;
