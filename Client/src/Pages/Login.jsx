import { useState } from "react";
import { useAuth } from "../Context/AuthContext";

function Login() {
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(form);
  };

  return (
    <div className="w-full max-w-sm rounded border border-slate-200 bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">Login</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm text-slate-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="you@example.com"
            onChange={handleChange}
            value={form.email}
            autoComplete="email"
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-sm text-slate-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Enter your password"
            onChange={handleChange}
            value={form.password}
            autoComplete="current-password"
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
          />
        </div>

        <button
          className="w-full rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
