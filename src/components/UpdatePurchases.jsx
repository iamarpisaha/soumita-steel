import { useState } from "react";
import { updatePurchase } from "../services/purchase.service";
import { formatDate } from "../utils/date";
import Input from "./Input";
import SearchInput from "./SearchInput";

const UpdatePurchases = ({
  singlePurchase = {},
  onSuccess,
  onCancel,
  suggestions,
}) => {
  const [purchase, setPurchase] = useState({
    ...singlePurchase,
    date: formatDate(new Date(singlePurchase.date), "yyyy-MM-dd'T'HH:mm"),
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleUpdatePurchases = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);

      const formattedPurchase = {
        date: purchase.date,
        party_name: purchase.party_name || "",
        product: purchase.product || "",
        total_amount: purchase.total_amount ? Number(purchase.total_amount) : 0,
      };

      await updatePurchase(purchase.row, formattedPurchase);

      if (onSuccess) onSuccess(purchase.row, formattedPurchase);
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
        onSubmit={handleUpdatePurchases}
      >
        <Input
          type="datetime-local"
          placeholder="Date"
          value={purchase.date}
          onChange={(e) => setPurchase({ ...purchase, date: e.target.value })}
          required={true}
        />

        <SearchInput
          placeholder="Party Name"
          value={purchase.party_name}
          onChange={(e) =>
            setPurchase({ ...purchase, party_name: e.target.value })
          }
          suggestions={suggestions.parties}
        />

        <SearchInput
          placeholder="Product (*)"
          value={purchase.product}
          onChange={(e) =>
            setPurchase({ ...purchase, product: e.target.value })
          }
          suggestions={suggestions.products}
          required={true}
        />

        <Input
          type="number"
          placeholder="Total Amount"
          value={purchase.total_amount}
          onChange={(e) =>
            setPurchase({ ...purchase, total_amount: e.target.value })
          }
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

export default UpdatePurchases;
