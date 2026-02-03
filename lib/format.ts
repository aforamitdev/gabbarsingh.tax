export const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export const percent = new Intl.NumberFormat("en-IN", {
  style: "percent",
  maximumFractionDigits: 2,
});

export const intlDollar = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
