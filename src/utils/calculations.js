// Calculate total amount from ledger entries
export const getTotalAmount = (entries) => {
  return entries.reduce((sum, item) => {
    return sum + Number(item.totalAmount || 0);
  }, 0);
};

// Filter entries by month
export const filterByMonth = (entries, filterType) => {
  if (filterType === "overall") return entries;

  const now = new Date();

  return entries.filter((item) => {
    const entryDate = new Date(item.date);

    if (filterType === "this") {
      return (
        entryDate.getMonth() === now.getMonth() &&
        entryDate.getFullYear() === now.getFullYear()
      );
    }

    if (filterType === "last") {
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return (
        entryDate.getMonth() === lastMonth.getMonth() &&
        entryDate.getFullYear() === lastMonth.getFullYear()
      );
    }

    return true;
  });
};

// Net Profit
export const calculateProfit = (revenue, investment) => {
  return revenue - investment;
};
