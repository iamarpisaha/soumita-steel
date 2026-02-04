import { NavLink } from "react-router-dom";

const base = "px-3 py-2 rounded";
const active = "bg-blue-700";
const normal = "bg-slate-800 hover:bg-slate-700";

export default function Navbar() {
  return (
    <nav className="flex gap-2 mb-6">
      <NavLink
        to="/"
        end
        className={({ isActive }) => `${base} ${isActive ? active : normal}`}
      >
        Dashboard
      </NavLink>

      <NavLink
        to="/purchases"
        className={({ isActive }) => `${base} ${isActive ? active : normal}`}
      >
        Purchases
      </NavLink>

      <NavLink
        to="/sales"
        className={({ isActive }) => `${base} ${isActive ? active : normal}`}
      >
        Sales
      </NavLink>
    </nav>
  );
}
