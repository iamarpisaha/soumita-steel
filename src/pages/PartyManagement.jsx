import React, { useState, useMemo } from "react";
import {
  UserPlus,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  History,
  Search,
} from "lucide-react";
import Input from "./components/Input"; // Using your previously created Input component

const PartyManagement = () => {
  const [selectedParty, setSelectedParty] = useState(null);
  const [parties, setParties] = useState([
    { id: 1, name: "Party X", type: "Creditor", phone: "9876543210" },
    { id: 2, name: "Customer Y", type: "Debitor", phone: "8877665544" },
  ]);

  // Mock data for transactions - in production, fetch based on selectedParty.id
  const [transactions, setTransactions] = useState([
    {
      id: 101,
      party_id: 1,
      date: "2026-02-03",
      desc: "Steel Sheets Received",
      bill: 100000,
      paid: 0,
    },
    {
      id: 102,
      party_id: 1,
      date: "2026-02-05",
      desc: "Partial Payment",
      bill: 0,
      paid: 60000,
    },
  ]);

  const currentLiability = useMemo(() => {
    if (!selectedParty) return 0;
    const pTx = transactions.filter((t) => t.party_id === selectedParty.id);
    const totalBill = pTx.reduce((sum, t) => sum + t.bill, 0);
    const totalPaid = pTx.reduce((sum, t) => sum + t.paid, 0);
    return totalBill - totalPaid;
  }, [selectedParty, transactions]);

  return (
    <div className="p-6 bg-slate-950 min-h-screen text-slate-100">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold bg-linear-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          Parties & Ledgers
        </h1>
        {!selectedParty && (
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-all shadow-lg">
            <UserPlus size={18} /> Add New Party
          </button>
        )}
      </div>

      {!selectedParty ? (
        /* Party List Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parties.map((party) => (
            <div
              key={party.id}
              onClick={() => setSelectedParty(party)}
              className="bg-slate-900 border border-slate-800 p-5 rounded-xl cursor-pointer hover:border-blue-500/50 transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{party.name}</h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${party.type === "Creditor" ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-400"}`}
                  >
                    {party.type}
                  </span>
                </div>
                <div className="bg-slate-800 p-2 rounded-lg text-slate-400">
                  <Wallet size={20} />
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-500">
                Contact: {party.phone}
              </p>
            </div>
          ))}
        </div>
      ) : (
        /* Party Detailed Ledger View */
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <button
            onClick={() => setSelectedParty(null)}
            className="text-sm text-slate-400 hover:text-white flex items-center gap-1"
          >
            ← Back to List
          </button>

          {/* Party Header Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 md:col-span-2">
              <h2 className="text-xl font-bold mb-1">{selectedParty.name}</h2>
              <p className="text-slate-500 text-sm">Ledger Overview</p>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <p className="text-xs text-slate-400 uppercase tracking-wider">
                    Total{" "}
                    {selectedParty.type === "Creditor"
                      ? "Liability"
                      : "Receivable"}
                  </p>
                  <p
                    className={`text-2xl font-bold mt-1 ${currentLiability > 0 ? "text-red-400" : "text-emerald-400"}`}
                  >
                    ₹{currentLiability.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <h3 className="text-sm font-semibold mb-4">New Entry</h3>
              <div className="space-y-3">
                <Input placeholder="Description" />
                <Input placeholder="Amount (Rs.)" type="number" />
                <button className="w-full bg-emerald-600 py-2 rounded-lg font-medium text-sm">
                  Add Transaction
                </button>
              </div>
            </div>
          </div>

          {/* Transaction Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800 text-slate-400">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4 text-right">Bill Amt</th>
                  <th className="px-6 py-4 text-right">Paid Amt</th>
                  <th className="px-6 py-4 text-right">Running Bal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {transactions
                  .filter((t) => t.party_id === selectedParty.id)
                  .map((t, idx, arr) => {
                    // Basic running balance calculation
                    const prevBal = arr
                      .slice(0, idx)
                      .reduce((s, prev) => s + (prev.bill - prev.paid), 0);
                    const currentBal = prevBal + (t.bill - t.paid);

                    return (
                      <tr
                        key={t.id}
                        className="hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-6 py-4 text-slate-400">{t.date}</td>
                        <td className="px-6 py-4 font-medium">{t.desc}</td>
                        <td className="px-6 py-4 text-right text-red-400 font-mono">
                          {t.bill > 0 ? `+ ₹${t.bill.toLocaleString()}` : "-"}
                        </td>
                        <td className="px-6 py-4 text-right text-emerald-400 font-mono">
                          {t.paid > 0 ? `- ₹${t.paid.toLocaleString()}` : "-"}
                        </td>
                        <td className="px-6 py-4 text-right font-bold font-mono">
                          ₹{currentBal.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartyManagement;
