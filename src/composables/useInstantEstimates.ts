import { computed, type Ref } from 'vue'

/**
 * Safely converts unknown values to numbers
 * Handles both numeric and string inputs, returning 0 for invalid values
 */
function safe(n: unknown): number {
  if (typeof n === 'number' && Number.isFinite(n)) {
    return n
  }
  if (typeof n === 'string' && n.trim() !== '') {
    const parsed = Number(n)
    return Number.isFinite(parsed) ? parsed : 0
  }
  return 0
}

/**
 * Composable for calculating mortgage-related estimates
 * Provides real-time calculations for costs, loan amounts, and ratios
 */
export function useInstantEstimates(
  propertyPrice: Ref<number>,
  totalSavings: Ref<number>,
  hasBroker: Ref<boolean>,
  cityTaxRate = 0.06,    // TODO: Replace with GraphQL when region is added
  brokerRate = 0.032     // TODO: Replace with GraphQL + hasBroker toggle
) {
  /**
   * Calculates notary costs based on property price
   * Formula: €2,144 + 1.3% of amount over €100,000
   */
  const notaryCosts = computed(() => {
    const price = safe(propertyPrice.value)
    if (price <= 0) return 0
    return 2144 + 0.013 * Math.max(0, price - 100000.0)
  })

  /**
   * Calculates stamp duty (city tax) on property purchase
   */
  const stampDuty = computed(() => {
    const price = safe(propertyPrice.value)
    return price * cityTaxRate
  })

  /**
   * Calculates broker commission costs
   * Only applies if hasBroker is true
   */
  const brokerCosts = computed(() => {
    const price = safe(propertyPrice.value)
    return hasBroker.value ? price * brokerRate : 0
  })

  /**
   * Total additional costs (notary + stamp duty + broker)
   */
  const totalCost = computed(() =>
    notaryCosts.value + stampDuty.value + brokerCosts.value
  )

  /**
   * Calculates the implied loan amount needed
   * Formula: Property Price + Total Costs - Available Savings
   */
  const impliedLoan = computed(() => {
    const price = safe(propertyPrice.value)
    const savings = safe(totalSavings.value)
    return Math.max(0, price + totalCost.value - savings)
  })

  /**
   * Calculates loan-to-value ratio as a percentage
   * Formula: (Implied Loan / Property Price) × 100
   */
  const loanToValue = computed(() => {
    const price = safe(propertyPrice.value)
    if (price <= 0) return 0
    return (impliedLoan.value / price) * 100
  })

  return {
    notaryCosts,
    stampDuty,
    brokerCosts,
    totalCost,
    impliedLoan,
    loanToValue
  }
}
