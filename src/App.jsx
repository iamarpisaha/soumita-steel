import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import logo from "./assets/logo.webp";
import Navbar from "./components/Navbar";

export default function App() {
  const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
  const Purchase = lazy(() => import("./pages/Purchase.jsx"));
  const Sales = lazy(() => import("./pages/Sales.jsx"));

  return (
    <div className="min-h-screen  bg-slate-950 text-white p-4">
      <h1 className="text-2xl font-bold mb-4 text-center md:text-left">
        <img
          src={logo}
          alt="Soumita Steel Logo"
          className="inline-block w-16"
        />
        <span className="hidden md:inline-block md:ml-2">Soumita Steel</span>
      </h1>

      <Navbar />

      <Suspense
        fallback={
          <div>
            <img
              className="w-16 h-16 mx-auto mt-10"
              src='data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><radialGradient id="a10" cx=".66" fx=".66" cy=".3125" fy=".3125" gradientTransform="scale(1.5)"><stop offset="0" stop-color="%23FFFFFF"></stop><stop offset=".3" stop-color="%23FFFFFF" stop-opacity=".9"></stop><stop offset=".6" stop-color="%23FFFFFF" stop-opacity=".6"></stop><stop offset=".8" stop-color="%23FFFFFF" stop-opacity=".3"></stop><stop offset="1" stop-color="%23FFFFFF" stop-opacity="0"></stop></radialGradient><circle transform-origin="center" fill="none" stroke="url(%23a10)" stroke-width="15" stroke-linecap="round" stroke-dasharray="200 1000" stroke-dashoffset="0" cx="100" cy="100" r="70"><animateTransform type="rotate" attributeName="transform" calcMode="spline" dur="2" values="360;0" keyTimes="0;1" keySplines="0 0 1 1" repeatCount="indefinite"></animateTransform></circle><circle transform-origin="center" fill="none" opacity=".2" stroke="%23FFFFFF" stroke-width="15" stroke-linecap="round" cx="100" cy="100" r="70"></circle></svg>'
              alt=""
            />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/purchases" element={<Purchase />} />
          <Route path="/sales" element={<Sales />} />
        </Routes>
      </Suspense>
    </div>
  );
}
