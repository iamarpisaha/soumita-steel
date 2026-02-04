import { useEffect, useState } from "react";
import LedgerTable from "../components/LedgerTable";
import { deleteSale, getSales } from "../services/sales.service";
import AddSales from "../components/AddSales";
import UpdateSales from "../components/UpdateSales";

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [singleSale, setSingleSale] = useState(null);
  const [suggestions, setSuggestions] = useState({
    parties: [],
    products: [],
  });

  async function handleGetSales() {
    try {
      setIsLoading(true);
      const sales = await getSales();
      setSales(sales);
    } catch (error) {
      console.error("Error fetching sales:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteSales(rowId) {
    try {
      setIsLoading(true);
      await deleteSale(rowId);
      const filteredSales = sales.filter((sale) => sale.row !== rowId);
      setSales(filteredSales);
    } catch (error) {
      console.error("Error deleting sale:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    handleGetSales();
  }, []);

  useEffect(() => {
    const partiesSet = new Set();
    const productsSet = new Set();
    sales.forEach((sale) => {
      if (sale.party_name) partiesSet.add(sale.party_name);
      if (sale.product) productsSet.add(sale.product);
    });
    setSuggestions({
      parties: Array.from(partiesSet),
      products: Array.from(productsSet),
    });
  }, [sales]);

  return (
    <div className="bg-slate-800 pt-6  rounded-lg space-y-6">
      <h2 className="text-xl text-center font-semibold">Sales Ledger</h2>
      <div className="px-6">
        {singleSale ? (
          <UpdateSales
            singleSale={singleSale}
            onSuccess={(rowId, updatedSale) => {
              setSingleSale(null);
              const updatedSales = sales.map((sale) =>
                sale.row === rowId ? { ...sale, ...updatedSale } : sale,
              );
              setSales(updatedSales);
            }}
            onCancel={() => setSingleSale(null)}
            suggestions={suggestions}
          />
        ) : (
          <AddSales
            onSuccess={(newSale) => {
              setSales([newSale, ...sales]);
            }}
            suggestions={suggestions}
          />
        )}
      </div>
      <LedgerTable
        data={sales}
        isLoading={isLoading}
        onDelete={handleDeleteSales}
        onEdit={(item) => {
          setSingleSale(item);
        }}
        tableCols={[
          "Sl. No",
          "Date",
          "Party Name",
          "Product",
          "Total Amount",
          "Actions",
        ]}
      />
    </div>
  );
}
