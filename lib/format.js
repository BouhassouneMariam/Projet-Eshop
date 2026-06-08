const euroFormat = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0
});

export function formatPrice(value) {
  return euroFormat.format(value);
}

export function computeShipping(subtotal) {
  if (subtotal === 0) {
    return 0;
  }

  return subtotal >= 120 ? 0 : 9;
}
