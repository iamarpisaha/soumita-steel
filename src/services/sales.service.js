const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

export async function getSales(query = "") {
  const url = query
    ? `${BASE_API_URL}?type=sales&${query}`
    : `${BASE_API_URL}?type=sales`;

  const resp = await fetch(url);
  const data = await resp.json();
  return data;
}

export async function addSale(sale) {
  await fetch(BASE_API_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...sale, action: "insert", type: "sales" }),
  });
}
export async function updateSale(rowId, payload) {
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
      type: "sales",
    }),
  });
}

export async function deleteSale(rowId) {
  await fetch(BASE_API_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ row: rowId, action: "delete", type: "sales" }),
  });
}
