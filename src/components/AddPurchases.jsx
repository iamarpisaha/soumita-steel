import { useState } from "react";
import { addPurchase } from "../services/purchase.service";
import { formatDate } from "../utils/date";
import Input from "./Input";
import SearchInput from "./SearchInput";

const AddPurchases = ({ onSuccess, suggestions }) => {
  const [newPurchase, setNewPurchase] = useState({
    date: formatDate(new Date(), "yyyy-MM-dd'T'HH:mm"),
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleAddPurchases = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);

      const formattedPurchase = {
        date: newPurchase.date,
        party_name: newPurchase.party_name?.toLowerCase() || "",
        product: newPurchase.product?.toLowerCase() || "",
        total_amount: newPurchase.total_amount
          ? Number(newPurchase.total_amount)
          : 0,
      };

      await addPurchase(formattedPurchase);

      setNewPurchase({
        date: formatDate(new Date(), "yyyy-MM-dd'T'HH:mm"),
      });
      if (onSuccess) onSuccess(formattedPurchase);
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
        onSubmit={handleAddPurchases}
      >
        <Input
          type="datetime-local"
          placeholder="Date"
          value={newPurchase.date}
          onChange={(e) =>
            setNewPurchase({ ...newPurchase, date: e.target.value })
          }
          required={true}
        />

        <SearchInput
          placeholder="Party Name"
          value={newPurchase.party_name}
          onChange={(e) =>
            setNewPurchase({ ...newPurchase, party_name: e.target.value })
          }
          suggestions={suggestions.parties}
        />

        <SearchInput
          placeholder="Product (*)"
          value={newPurchase.product}
          onChange={(e) =>
            setNewPurchase({ ...newPurchase, product: e.target.value })
          }
          suggestions={suggestions.products}
          required={true}
        />

        <Input
          type="number"
          placeholder="Total Amount (*)"
          value={newPurchase.total_amount}
          onChange={(e) =>
            setNewPurchase({ ...newPurchase, total_amount: e.target.value })
          }
          required={true}
          min={0}
        />

        <button
          type="submit"
          className={`bg-blue-600  rounded text-white py-2 font-semibold ${isLoading ? "opacity-80 cursor-not-allowed" : "cursor-pointer hover:bg-blue-700"}`}
          disabled={isLoading}
        >
          {isLoading ? "Adding..." : "Add"}
        </button>
      </form>
    </div>
  );
};

export default AddPurchases;
