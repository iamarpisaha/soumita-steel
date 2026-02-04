export function formatDate(dateString, format) {
  const date = new Date(dateString);

  switch (format) {
    case "dd/mm/yyyy":
      return date.toLocaleDateString("en-GB");
    case "dd Mon yyyy":
      // Format: 02 Jan 2024
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    case "yyyy-MM-dd'T'HH:mm":
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      return `${year}-${month}-${day}T${hours}:${minutes}`;
    default:
      return date.toISOString();
  }
}
