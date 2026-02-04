const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

export async function getPurchases(query = "") {
  const url = query
    ? `${BASE_API_URL}?type=purchases&${query}`
    : `${BASE_API_URL}?type=purchases`;
  const resp = await fetch(url);
  const data = await resp.json();
  return data;
}

export async function addPurchase(purchase) {
  await fetch(BASE_API_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...purchase, action: "insert", type: "purchases" }),
  });
}
export async function updatePurchase(rowId, payload) {
  await fetch(BASE_API_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...payload,
      row: rowId,
      action: "update",
      type: "purchases",
    }),
  });
}

export async function deletePurchase(rowId) {
  await fetch(BASE_API_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ row: rowId, action: "delete", type: "purchases" }),
  });
}
