import { useEffect, useState } from "react";
import AddPurchases from "../components/AddPurchases";
import LedgerTable from "../components/LedgerTable";
import UpdatePurchases from "../components/UpdatePurchases";
import { deletePurchase, getPurchases } from "../services/purchase.service";

export default function Purchase() {
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [singlePurchase, setSinglePurchase] = useState(null);
  const [suggestions, setSuggestions] = useState({
    parties: [],
    products: [],
  });

  async function handleGetPurchases() {
    try {
      setIsLoading(true);
      const purchases = await getPurchases();
      setPurchases(purchases);
    } catch (error) {
      console.error("Error fetching purchases:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeletePurchases(rowId) {
    try {
      setIsLoading(true);
      await deletePurchase(rowId);
      const filteredPurchases = purchases.filter(
        (purchase) => purchase.row !== rowId,
      );
      setPurchases(filteredPurchases);
    } catch (error) {
      console.error("Error deleting purchase:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    handleGetPurchases();
  }, []);

  useEffect(() => {
    const partiesSet = new Set();
    const productsSet = new Set();
    purchases.forEach((purchase) => {
      if (purchase.party_name) partiesSet.add(purchase.party_name);
      if (purchase.product) productsSet.add(purchase.product);
    });
    setSuggestions({
      parties: Array.from(partiesSet),
      products: Array.from(productsSet),
    });
  }, [purchases]);

  return (
    <div className="bg-slate-800 pt-6  rounded-lg space-y-6">
      <h2 className="text-xl text-center font-semibold">Cash Out Ledger</h2>
      <div className="px-6">
        {singlePurchase ? (
          <UpdatePurchases
            singlePurchase={singlePurchase}
            onSuccess={(rowId, updatedPurchase) => {
              setSinglePurchase(null);
              const updatedPurchases = purchases.map((purchase) =>
                purchase.row === rowId
                  ? { ...purchase, ...updatedPurchase }
                  : purchase,
              );
              setPurchases(updatedPurchases);
            }}
            onCancel={() => setSinglePurchase(null)}
            suggestions={suggestions}
          />
        ) : (
          <AddPurchases
            onSuccess={(newPurchase) => {
              setPurchases([newPurchase, ...purchases]);
            }}
            suggestions={suggestions}
          />
        )}
      </div>
      <LedgerTable
        data={purchases}
        isLoading={isLoading}
        onDelete={handleDeletePurchases}
        onEdit={(item) => {
          setSinglePurchase(item);
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
