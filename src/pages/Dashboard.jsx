import { Calendar, IndianRupee, ShoppingCart, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { getSales } from "../services/sales.service";
import { getPurchases } from "../services/purchase.service";
import { formatDate } from "../utils/date";

const Dashboard = () => {
  const [stats, setStats] = useState({ sales: 0, purchase: 0, profit: 0 });
  const [filter, setFilter] = useState("monthly"); // 'today', 'weekly', 'monthly', 'yearly'
  const [loading, setLoading] = useState(false);
  const [dates, setDates] = useState({ start: "", end: "" });
  const [topInsights, setTopInsights] = useState({
    topSellingProducts: [],
    topSellingParties: [],
    topPurchasedProducts: [],
    topPurchasedParties: [],
  });

  const calculateRankings = (data, nameKey, amountKey) => {
    const ranking = data.reduce((acc, curr) => {
      const name = curr[nameKey];
      if (!acc[name]) acc[name] = 0;
      acc[name] += Number(curr[amountKey]) || 0;
      return acc;
    }, {});

    return Object.entries(ranking)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5); // Get top 5
  };

  // Helper to get date ranges
  const getDateRange = (type) => {
    const end = new Date();
    const start = new Date();
    if (type === "today") start.setHours(0, 0, 0, 0);
    if (type === "weekly") start.setDate(end.getDate() - 7);
    if (type === "monthly") start.setMonth(end.getMonth() - 1);
    if (type === "yearly") start.setFullYear(end.getFullYear() - 1);

    return {
      start: start.toISOString().split("T")[0],
      end: end.toISOString().split("T")[0],
    };
  };

  const fetchDashboardData = async (rangeType) => {
    const { start, end } = getDateRange(rangeType);
    setDates({ start, end });
    // Fetch both Incomes (Sales) and Expenses (Purchase)
    setLoading(true);
    const salesResp = getSales(`start=${start}&end=${end}`);
    const purchaseResp = getPurchases(`start=${start}&end=${end}`);
    const [salesRes, purchaseRes] = await Promise.all([
      await salesResp,
      await purchaseResp,
    ]);

    const totalSales = salesRes.reduce(
      (acc, curr) => acc + (Number(curr.total_amount) || 0),
      0,
    );
    const totalExp = purchaseRes.reduce(
      (acc, curr) => acc + (Number(curr.total_amount) || 0),
      0,
    );

    // Update main stats
    setStats({
      sales: totalSales,
      purchase: totalExp,
      profit: totalSales - totalExp,
    });
    // Inside fetchDashboardData after fetching results:
    setTopInsights({
      topSellingProducts: calculateRankings(
        salesRes,
        "product",
        "total_amount",
      ),
      topSellingParties: calculateRankings(
        salesRes,
        "party_name",
        "total_amount",
      ),
      topPurchasedProducts: calculateRankings(
        purchaseRes,
        "product",
        "total_amount",
      ),
      topPurchasedParties: calculateRankings(
        purchaseRes,
        "party_name",
        "total_amount",
      ),
    });

    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData(filter);
  }, [filter]);

  return (
    <>
      {/* Header & Filter Buttons */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-linear-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Financial Overview
          </h1>
          <p className="text-xs text-slate-500 text-center md:text-left mt-2 font-medium">
            {formatDate(dates.start, "dd Mon yyyy")}
            {" - "}
            {formatDate(dates.end, "dd Mon yyyy")}
          </p>
        </div>

        <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700 shadow-md">
          {["today", "weekly", "monthly", "yearly"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                filter === type
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-6">
        <StatCard
          title="Total Sales"
          value={stats.sales}
          icon={<Wallet className="text-emerald-400" />}
          color="border-emerald-500/20"
          loading={loading}
        />
        <StatCard
          title="Total Purchase"
          value={stats.purchase}
          icon={<ShoppingCart className="text-orange-400" />}
          color="border-orange-500/20"
          loading={loading}
        />
        <StatCard
          title="Net Profit"
          value={stats.profit}
          icon={<IndianRupee className="text-blue-400" />}
          color="border-blue-500/20"
          isProfit={true}
          loading={loading}
        />
      </div>

      {/* Insights Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <InsightList
          title="Top Selling Products"
          data={topInsights.topSellingProducts}
          loading={loading}
          accentColor="text-emerald-400"
        />
        <InsightList
          title="Top Selling Party"
          data={topInsights.topSellingParties}
          loading={loading}
          accentColor="text-blue-400"
        />
        <InsightList
          title="Top Purchased Products"
          data={topInsights.topPurchasedProducts}
          loading={loading}
          accentColor="text-orange-400"
        />
        <InsightList
          title="Top Purchased Party"
          data={topInsights.topPurchasedParties}
          loading={loading}
          accentColor="text-purple-400"
        />
      </div>
    </>
  );
};

const StatCard = ({ title, value, icon, color, isProfit, loading }) => (
  <div
    className={`bg-slate-800 border ${color} p-6 rounded-lg shadow-xl hover:scale-[1.02] transition-transform`}
  >
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-slate-700 rounded-lg">{icon}</div>

      {/* <Calendar size={16} className="text-slate-500" /> */}
    </div>
    <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">
      {title}
    </p>
    {loading ? (
      <div className="flex text-3xl font-bold items-center  gap-2">
        ₹
        <img
          className="w-10 h-10"
          src='data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><radialGradient id="a10" cx=".66" fx=".66" cy=".3125" fy=".3125" gradientTransform="scale(1.5)"><stop offset="0" stop-color="%23FFFFFF"></stop><stop offset=".3" stop-color="%23FFFFFF" stop-opacity=".9"></stop><stop offset=".6" stop-color="%23FFFFFF" stop-opacity=".6"></stop><stop offset=".8" stop-color="%23FFFFFF" stop-opacity=".3"></stop><stop offset="1" stop-color="%23FFFFFF" stop-opacity="0"></stop></radialGradient><circle transform-origin="center" fill="none" stroke="url(%23a10)" stroke-width="15" stroke-linecap="round" stroke-dasharray="200 1000" stroke-dashoffset="0" cx="100" cy="100" r="70"><animateTransform type="rotate" attributeName="transform" calcMode="spline" dur="2" values="360;0" keyTimes="0;1" keySplines="0 0 1 1" repeatCount="indefinite"></animateTransform></circle><circle transform-origin="center" fill="none" opacity=".2" stroke="%23FFFFFF" stroke-width="15" stroke-linecap="round" cx="100" cy="100" r="70"></circle></svg>'
          alt=""
        />
      </div>
    ) : (
      <h2
        className={`text-3xl font-bold mt-1 ${isProfit && value < 0 ? "text-red-400" : "text-white"}`}
      >
        ₹{value.toLocaleString()}
      </h2>
    )}
  </div>
);

const InsightList = ({ title, data, loading, accentColor }) => (
  <div className="bg-slate-800 border border-slate-700/50 p-5 rounded-lg shadow-lg">
    <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4 border-b border-slate-700 pb-2">
      {title}
    </h3>
    <div className="space-y-3">
      {loading ? (
        [...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-8 bg-slate-700/50 animate-pulse rounded"
          ></div>
        ))
      ) : data.length > 0 ? (
        data.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center group">
            <span className="text-sm text-slate-300 truncate max-w-30 capitalize group-hover:text-white transition-colors">
              {idx + 1}. {item.name || "Unknown"}
            </span>
            <span className={`text-xs font-mono font-semibold ${accentColor}`}>
              ₹{item.total.toLocaleString()}
            </span>
          </div>
        ))
      ) : (
        <p className="text-slate-600 text-xs py-2 italic">No records found</p>
      )}
    </div>
  </div>
);

export default Dashboard;
