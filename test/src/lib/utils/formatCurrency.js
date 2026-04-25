export function formatCurrency(amount, currency = "USD") {
  if (amount === null || amount === undefined || amount === "") return "Not set";
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(Number(amount));
}
