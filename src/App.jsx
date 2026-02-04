import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { loadData, saveData } from "./utils/storage";
import logo from "./assets/logo.webp";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Purchase from "./pages/Purchase";
import Sales from "./pages/Sales";

export default function App() {
  const [purchases, setPurchases] = useState(() => loadData("purchases"));
  const [sales, setSales] = useState(() => loadData("sales"));

  useEffect(() => saveData("purchases", purchases), [purchases]);
  useEffect(() => saveData("sales", sales), [sales]);

  return (
    <BrowserRouter>
      <div className="min-h-screen  bg-slate-950 text-white p-4">
        <h1 className="text-2xl font-bold mb-4">
          <img
            src={logo}
            alt="Soumita Steel Logo"
            className="inline-block w-16  mr-2"
          />
          Soumita Steel
        </h1>

        <Navbar />

        <Routes>
          <Route
            path="/"
            element={<Dashboard purchases={purchases} sales={sales} />}
          />
          <Route
            path="/purchases"
            element={
              <Purchase purchases={purchases} setPurchases={setPurchases} />
            }
          />
          <Route
            path="/sales"
            element={<Sales sales={sales} setSales={setSales} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
