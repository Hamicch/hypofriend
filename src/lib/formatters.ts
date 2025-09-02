const DEFAULT_LOCALE = 'de-DE'

export function formatCurrency(value: number, locale: string = DEFAULT_LOCALE): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatNumber(value: number, locale: string = DEFAULT_LOCALE): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatPercentage(value: number, locale: string = DEFAULT_LOCALE): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(value / 100)
}

export function parseNumber(formatted: string, locale: string = DEFAULT_LOCALE): number {
  // Remove all non-numeric characters except decimal separator
  const cleanValue = formatted.replace(/[^\d,.-]/g, '')
  // Convert German decimal separator (comma) to dot
  const normalizedValue = cleanValue.replace(',', '.')
  return parseFloat(normalizedValue) || 0
}
