import { NavLink } from "react-router";
import { useAuth } from "../Context/AuthContext";

const MENU = [
  { label: "All Students", path: "/System/", roles: ["admin"] },
  { label: "Student Dashboard", path: "/System/sdashboard", roles: ["student"] },
  { label: "All Courses", path: "/System/courselist", roles: ["admin", "student"] },
  { label: "Add Course", path: "/System/course", roles: ["admin"] },
  { label: "Add Student", path: "/System/Student", roles: ["admin"] },
  { label: "Audit Logs", path: "/System/auditlogs", roles: ["admin"] },
];

const MainNavbar = ({ onLogout }) => {
  const { user } = useAuth();

  if (!user) return null;

  const links = MENU.filter((item) => item.roles.includes(user.role));

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-5xl items-center gap-3 px-4 py-3">
        <span className="text-sm font-medium text-slate-700">{user.name}</span>

        <nav className="flex flex-1 items-center gap-1">
          {links.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) =>
                `rounded px-3 py-2 text-sm ${
                  isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={onLogout}
          className="rounded border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:border-slate-400"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default MainNavbar;
