import { SquarePen, Trash2 } from "lucide-react";
import { useState } from "react";
import { formatDate } from "../utils/date";

export default function LedgerTable({
  title,
  data,
  tableCols = [],
  isLoading,
  onEdit,
  onDelete,
}) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");

  // Search + Sort
  // const filteredAndSortedData = data
  //   .filter((item) => {
  //     const q = search.toLowerCase();
  //     return (
  //       item.product.toLowerCase().includes(q) ||
  //       item.party.toLowerCase().includes(q)
  //     );
  //   })
  //   .sort((a, b) => {
  //     if (sortBy === "date-desc") return new Date(b.date) - new Date(a.date);
  //     if (sortBy === "date-asc") return new Date(a.date) - new Date(b.date);
  //     if (sortBy === "total-desc") return b.totalAmount - a.totalAmount;
  //     if (sortBy === "total-asc") return a.totalAmount - b.totalAmount;
  //     return 0;
  //   });

  return (
    <div className="bg-slate-800 p-4 rounded-lg shadow-md">
      {title && (
        <h2 className="text-xl text-center mt-2 font-semibold mb-4">{title}</h2>
      )}

      {/* SEARCH + SORT */}
      {/* <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder={`Search by product or ${
            isBuy ? "supplier" : "customer"
          }`}
          className="input flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="input sm:w-56"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="date-desc">Date (Newest)</option>
          <option value="date-asc">Date (Oldest)</option>
          <option value="total-desc">Total (High → Low)</option>
          <option value="total-asc">Total (Low → High)</option>
        </select>
      </div> */}

      {/* TABLE */}
      <div className="overflow-x-auto pb-6">
        <table className="w-full text-sm border-separate border border-slate-700 shadow-sm whitespace-nowrap">
          <thead className="text-slate-200 bg-blue-900 h-10">
            <tr>
              {tableCols.map((col) => (
                <th key={col} className="px-2 whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr
                  key={index}
                  className={`${index % 2 === 0 ? "" : "bg-slate-700"}  rounded-lg text-center capitalize animate-pulse`}
                >
                  {tableCols.map((_, colIndex) => (
                    <td key={colIndex} className="px-2 py-2">
                      <div className="bg-slate-600 h-4 w-full rounded"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length > 0 ? (
              data
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((item, index) => (
                  <tr
                    key={index}
                    className={`${index % 2 === 0 ? "" : "bg-slate-700"}  rounded-lg text-center capitalize`}
                  >
                    <td className="px-2 py-2">{index + 1}</td>
                    <td className="px-2 py-2">
                      {formatDate(item.date, "dd Mon yyyy")}
                    </td>
                    <td className="px-2 py-2">
                      {item.party_name || "Unknown"}
                    </td>
                    <td className="px-2 py-2">{item.product || "Unknown"}</td>

                    <td className="px-2 py-2 text-emerald-400 font-semibold">
                      ₹{item.total_amount}
                    </td>
                    <td className="px-2 py-2 space-x-2">
                      <button
                        className="cursor-pointer bg-green-600 p-1  rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-white"
                        title="Edit"
                        onClick={() => {
                          onEdit(item);
                        }}
                      >
                        <SquarePen size={18} />
                      </button>
                      <button
                        className="cursor-pointer bg-red-600 p-1  rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-white"
                        title="Delete"
                        onClick={() => {
                          if (
                            !window.confirm(
                              "Are you sure you want to delete this entry?",
                            )
                          )
                            return;
                          onDelete(item.row);
                        }}
                      >
                        <Trash2 size={18} className="text-white" />
                      </button>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td
                  colSpan={tableCols.length}
                  className="text-center py-4 text-slate-400"
                >
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
