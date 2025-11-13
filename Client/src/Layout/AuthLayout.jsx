import { Outlet } from "react-router";

function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-3xl px-6 py-4">
          <h1 className="text-base font-semibold text-slate-800">Course Portal</h1>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Course Portal
      </footer>
    </div>
  );
}

export default AuthLayout;