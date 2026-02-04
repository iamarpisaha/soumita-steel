import { useState } from "react";
import { addSale } from "../services/sales.service";
import Input from "./Input";
import { formatDate } from "../utils/date";
import SearchInput from "./SearchInput";

const AddSales = ({ onSuccess, suggestions }) => {
  const [newSale, setNewSale] = useState({
    date: formatDate(new Date(), "yyyy-MM-dd'T'HH:mm"),
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleAddSales = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);

      const formattedSale = {
        date: newSale.date,
        party_name: newSale.party_name?.toLowerCase() || "",
        product: newSale.product?.toLowerCase() || "",
        total_amount: newSale.total_amount ? Number(newSale.total_amount) : 0,
      };

      await addSale(formattedSale);

      setNewSale({
        date: formatDate(new Date(), "yyyy-MM-dd'T'HH:mm"),
      });
      if (onSuccess) onSuccess(formattedSale);
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
        onSubmit={handleAddSales}
      >
        <Input
          type="datetime-local"
          placeholder="Date"
          value={newSale.date}
          onChange={(e) => setNewSale({ ...newSale, date: e.target.value })}
          required={true}
        />

        <SearchInput
          placeholder="Party Name"
          value={newSale.party_name}
          onChange={(e) =>
            setNewSale({ ...newSale, party_name: e.target.value })
          }
          suggestions={suggestions.parties}
        />

        <SearchInput
          placeholder="Product (*)"
          value={newSale.product}
          onChange={(e) => setNewSale({ ...newSale, product: e.target.value })}
          suggestions={suggestions.products}
          required={true}
        />

        <Input
          type="number"
          placeholder="Total Amount (*)"
          value={newSale.total_amount}
          onChange={(e) =>
            setNewSale({ ...newSale, total_amount: e.target.value })
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

export default AddSales;
