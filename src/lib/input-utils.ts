/**
 * Utility functions for input handling and validation
 */

/**
 * Sanitizes input to only allow numeric characters and decimal points
 * @param value - The input string to sanitize
 * @returns Sanitized string with only digits and decimal points
 */
export function sanitizeNumericInput(value: string): string {
  return value.replace(/[^\d.]/g, '')
}

/**
 * Safely converts a value to a number
 * Handles both string and number inputs, returning 0 for invalid values
 * @param value - The value to convert
 * @returns A valid number or 0
 */
export function safeNumber(value: string | number | undefined): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  }
  return 0
}

/**
 * Validates if a string represents a valid numeric input
 * @param value - The string to validate
 * @returns True if the string is a valid number
 */
export function isValidNumericInput(value: string): boolean {
  return /^\d*\.?\d*$/.test(value)
}

/**
 * Formats a number for display in input fields
 * Removes unnecessary decimal places and trailing zeros
 * @param value - The number to format
 * @returns Formatted string representation
 */
export function formatNumericDisplay(value: number): string {
  if (!Number.isFinite(value)) return '0'

  // Remove trailing zeros and unnecessary decimal point
  return value.toString().replace(/\.?0+$/, '')
}
