import {
  colors,
  designs,
  productTypes,
  sizes,
  transactionTypes,
} from "@/lib/product-data"

export const productTypeLabelByValue = Object.fromEntries(
  productTypes.map((p) => [p.value, p.label])
) as Record<string, string>

export const colorLabelByValue = Object.fromEntries(
  colors.map((c) => [c.value, c.label])
) as Record<string, string>

export const designLabelByValue = Object.fromEntries(
  designs.map((d) => [d.value, d.label])
) as Record<string, string>

export const sizeLabelByValue = Object.fromEntries(
  sizes.map((s) => [s.value, s.label])
) as Record<string, string>

/** Short size labels for compact tables */
export const sizeShortLabelByValue: Record<string, string> = {
  small: "S",
  medium: "M",
  large: "L",
  xl: "XL",
  xxl: "2XL",
  xxxl: "3XL",
  "one-size": "One Size",
}

export const paymentMethodLabelByValue = Object.fromEntries(
  transactionTypes.map((t) => [t.value, t.label])
) as Record<string, string>

export function getProductTypeLabel(value: string) {
  return productTypeLabelByValue[value] ?? value
}

export function getColorLabel(value: string | null | undefined) {
  if (!value) return "N/A"
  return colorLabelByValue[value] ?? value
}

export function getDesignLabel(value: string) {
  return designLabelByValue[value] ?? value
}

export function getSizeLabel(value: string | null | undefined, short = false) {
  if (!value) return "N/A"
  if (short) return sizeShortLabelByValue[value] ?? value
  return sizeLabelByValue[value] ?? value
}

export function getPaymentMethodLabel(value: string) {
  return paymentMethodLabelByValue[value] ?? value
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}
