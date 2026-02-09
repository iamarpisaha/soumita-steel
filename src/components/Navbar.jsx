import { NavLink } from "react-router-dom";

const base = "px-3 py-2 rounded";
const active = "bg-blue-700";
const normal = "bg-slate-800 hover:bg-slate-700";

export default function Navbar() {
  return (
    <nav className="flex gap-2 mb-6 justify-center md:justify-start">
      <NavLink
        to="/"
        end
        className={({ isActive }) => `${base} ${isActive ? active : normal}`}
      >
        Dashboard
      </NavLink>

      <NavLink
        to="/cash-out"
        className={({ isActive }) => `${base} ${isActive ? active : normal}`}
      >
        Cash Out
      </NavLink>

      <NavLink
        to="/cash-in"
        className={({ isActive }) => `${base} ${isActive ? active : normal}`}
      >
        Cash In
      </NavLink>
    </nav>
  );
}
