export type DisplayFlag = 'currency' | 'percentage'

/**
 * Formats a number for display based on the display flag
 * @param value - The number to format
 * @param flag - The display flag
 * @returns Formatted string representation
 */
export function formatDisplay(value: number, flag: DisplayFlag): string {
  if (flag === 'currency') {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value)
  }
  if (flag === 'percentage') {
    return new Intl.NumberFormat('de-DE', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 2,
    }).format(value / 100)
  }
  return new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)
}
