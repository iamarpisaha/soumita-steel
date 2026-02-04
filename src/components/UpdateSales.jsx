import { useState } from "react";
import { updateSale } from "../services/sales.service";
import Input from "./Input";
import { formatDate } from "../utils/date";
import SearchInput from "./SearchInput";

const UpdateSales = ({ singleSale = {}, onSuccess, onCancel, suggestions }) => {
  const [sale, setSale] = useState({
    ...singleSale,
    date: formatDate(new Date(singleSale.date), "yyyy-MM-dd'T'HH:mm"),
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateSales = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);

      const formattedSale = {
        date: sale.date,
        party_name: sale.party_name || "",
        product: sale.product || "",
        total_amount: sale.total_amount ? Number(sale.total_amount) : 0,
      };

      await updateSale(sale.row, formattedSale);

      if (onSuccess) onSuccess(sale.row, formattedSale);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3"
        onSubmit={handleUpdateSales}
      >
        <Input
          type="datetime-local"
          placeholder="Date"
          value={sale.date}
          onChange={(e) => setSale({ ...sale, date: e.target.value })}
          required={true}
        />

        <SearchInput
          placeholder="Party Name"
          value={sale.party_name}
          onChange={(e) => setSale({ ...sale, party_name: e.target.value })}
          suggestions={suggestions.parties}
        />

        <SearchInput
          placeholder="Product (*)"
          value={sale.product}
          onChange={(e) => setSale({ ...sale, product: e.target.value })}
          suggestions={suggestions.products}
          required={true}
        />

        <Input
          type="number"
          placeholder="Total Amount"
          value={sale.total_amount}
          onChange={(e) => setSale({ ...sale, total_amount: e.target.value })}
          required={true}
          min={0}
        />

        <div className="flex space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className={`bg-slate-600 w-full   rounded text-white py-2 font-semibold ${isLoading ? "opacity-80 cursor-not-allowed" : "cursor-pointer hover:bg-slate-700"}`}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`bg-emerald-600 w-full   rounded text-white py-2 font-semibold ${isLoading ? "opacity-80 cursor-not-allowed" : "cursor-pointer hover:bg-emerald-700"}`}
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateSales;
