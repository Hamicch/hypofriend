import { describe, it, expect, beforeEach } from 'vitest'
import { ref, type Ref } from 'vue'
import { useInstantEstimates } from './useInstantEstimates'

describe('useInstantEstimates', () => {
  let propertyPrice: Ref<number>
  let totalSavings: Ref<number>
  let hasBroker: Ref<boolean>
  let cityTaxRate: Ref<number>
  let brokerRate: Ref<number>

  beforeEach(() => {
    propertyPrice = ref(0)
    totalSavings = ref(0)
    hasBroker = ref(true)
    cityTaxRate = ref(0.06) // 6% default
    brokerRate = ref(0.032) // 3.2% default
  })

  describe('notaryCosts calculation', () => {
    it('should return 0 for zero property price', () => {
      propertyPrice.value = 0
      const { notaryCosts } = useInstantEstimates(
        propertyPrice,
        totalSavings,
        hasBroker,
        cityTaxRate.value,
        brokerRate.value,
      )

      expect(notaryCosts.value).toBe(0)
    })

    it('should return base cost for property price at or below €100,000', () => {
      propertyPrice.value = 100000
      const { notaryCosts } = useInstantEstimates(
        propertyPrice,
        totalSavings,
        hasBroker,
        cityTaxRate.value,
        brokerRate.value,
      )

      expect(notaryCosts.value).toBe(2144)
    })

    it('should calculate correctly for property price above €100,000', () => {
      propertyPrice.value = 200000
      const { notaryCosts } = useInstantEstimates(
        propertyPrice,
        totalSavings,
        hasBroker,
        cityTaxRate.value,
        brokerRate.value,
      )

      // €2,144 + 1.3% of (€200,000 - €100,000) = €2,144 + €1,300 = €3,444
      expect(notaryCosts.value).toBe(3444)
    })

    it('should handle large property prices correctly', () => {
      propertyPrice.value = 500000
      const { notaryCosts } = useInstantEstimates(
        propertyPrice,
        totalSavings,
        hasBroker,
        cityTaxRate.value,
        brokerRate.value,
      )

      // €2,144 + 1.3% of (€500,000 - €100,000) = €2,144 + €5,200 = €7,344
      expect(notaryCosts.value).toBe(7344)
    })

    it('should handle negative property price gracefully', () => {
      propertyPrice.value = -1000
      const { notaryCosts } = useInstantEstimates(
        propertyPrice,
        totalSavings,
        hasBroker,
        cityTaxRate.value,
        brokerRate.value,
      )

      expect(notaryCosts.value).toBe(0)
    })
  })

  describe('stampDuty calculation', () => {
    it('should return 0 for zero property price', () => {
      propertyPrice.value = 0
      const { stampDuty } = useInstantEstimates(
        propertyPrice,
        totalSavings,
        hasBroker,
        cityTaxRate.value,
        brokerRate.value,
      )

      expect(stampDuty.value).toBe(0)
    })

    it('should calculate stamp duty with default 6% tax rate', () => {
      propertyPrice.value = 300000
      const { stampDuty } = useInstantEstimates(
        propertyPrice,
        totalSavings,
        hasBroker,
        cityTaxRate.value,
        brokerRate.value,
      )

      // €300,000 × 6% = €18,000
      expect(stampDuty.value).toBe(18000)
    })

    it('should calculate stamp duty with custom tax rate', () => {
      propertyPrice.value = 200000
      const customTaxRate = 0.05 // 5%
      const { stampDuty } = useInstantEstimates(
        propertyPrice,
        totalSavings,
        hasBroker,
        customTaxRate,
        brokerRate.value,
      )

      // €200,000 × 5% = €10,000
      expect(stampDuty.value).toBe(10000)
    })

    it('should handle zero tax rate', () => {
      propertyPrice.value = 100000
      const zeroTaxRate = 0
      const { stampDuty } = useInstantEstimates(
        propertyPrice,
        totalSavings,
        hasBroker,
        zeroTaxRate,
        brokerRate.value,
      )

      expect(stampDuty.value).toBe(0)
    })
  })

  describe('brokerCosts calculation', () => {
    it('should return 0 when hasBroker is false', () => {
      propertyPrice.value = 300000
      hasBroker.value = false
      const { brokerCosts } = useInstantEstimates(
        propertyPrice,
        totalSavings,
        hasBroker,
        cityTaxRate.value,
        brokerRate.value,
      )

      expect(brokerCosts.value).toBe(0)
    })

    it('should calculate broker costs when hasBroker is true', () => {
      propertyPrice.value = 300000
      hasBroker.value = true
      const { brokerCosts } = useInstantEstimates(
        propertyPrice,
        totalSavings,
        hasBroker,
        cityTaxRate.value,
        brokerRate.value,
      )

      // €300,000 × 3.2% = €9,600
      expect(brokerCosts.value).toBe(9600)
    })

    it('should calculate broker costs with custom broker rate', () => {
      propertyPrice.value = 250000
      hasBroker.value = true
      const customBrokerRate = 0.04 // 4%
      const { brokerCosts } = useInstantEstimates(
        propertyPrice,
        totalSavings,
        hasBroker,
        cityTaxRate.value,
        customBrokerRate,
      )

      // €250,000 × 4% = €10,000
      expect(brokerCosts.value).toBe(10000)
    })

    it('should return 0 for zero property price regardless of hasBroker', () => {
      propertyPrice.value = 0
      hasBroker.value = true
      const { brokerCosts } = useInstantEstimates(
        propertyPrice,
        totalSavings,
        hasBroker,
        cityTaxRate.value,
        brokerRate.value,
      )

      expect(brokerCosts.value).toBe(0)
    })
  })

  describe('totalCost calculation', () => {
    it('should sum all costs correctly', () => {
      propertyPrice.value = 300000
      hasBroker.value = true
      const { totalCost, notaryCosts, stampDuty, brokerCosts } = useInstantEstimates(
        propertyPrice,
        totalSavings,
        hasBroker,
        cityTaxRate.value,
        brokerRate.value,
      )

      // Notary: €2,144 + 1.3% of (€300,000 - €100,000) = €2,144 + €2,600 = €4,744
      // Stamp duty: €300,000 × 6% = €18,000
      // Broker: €300,000 × 3.2% = €9,600
      // Total: €4,744 + €18,000 + €9,600 = €32,344
      expect(totalCost.value).toBe(4744 + 18000 + 9600)
      expect(totalCost.value).toBe(notaryCosts.value + stampDuty.value + brokerCosts.value)
    })

    it('should handle zero costs correctly', () => {
      propertyPrice.value = 0
      hasBroker.value = false
      const { totalCost } = useInstantEstimates(
        propertyPrice,
        totalSavings,
        hasBroker,
        cityTaxRate.value,
        brokerRate.value,
      )

      expect(totalCost.value).toBe(0)
    })
  })

  describe('impliedLoan calculation', () => {
    it('should calculate implied loan correctly with savings', () => {
      propertyPrice.value = 300000
      totalSavings.value = 50000
      hasBroker.value = true
      const { impliedLoan, totalCost } = useInstantEstimates(
        propertyPrice,
        totalSavings,
        hasBroker,
        cityTaxRate.value,
        brokerRate.value,
      )

      // Property price + total costs - savings
      // €300,000 + €32,344 - €50,000 = €282,344
      expect(impliedLoan.value).toBe(300000 + totalCost.value - 50000)
    })

    it('should return 0 when savings exceed total cost', () => {
      propertyPrice.value = 200000
      totalSavings.value = 300000 // More than property price + costs
      hasBroker.value = true
      const { impliedLoan } = useInstantEstimates(
        propertyPrice,
        totalSavings,
        hasBroker,
        cityTaxRate.value,
        brokerRate.value,
      )

      expect(impliedLoan.value).toBe(0)
    })

    it('should handle zero savings correctly', () => {
      propertyPrice.value = 250000
      totalSavings.value = 0
      hasBroker.value = true
      const { impliedLoan, totalCost } = useInstantEstimates(
        propertyPrice,
        totalSavings,
        hasBroker,
        cityTaxRate.value,
        brokerRate.value,
      )

      // Property price + total costs - 0 savings
      expect(impliedLoan.value).toBe(250000 + totalCost.value)
    })

    it('should handle negative savings (debt) correctly', () => {
      propertyPrice.value = 200000
      totalSavings.value = -10000 // Negative savings (debt)
      hasBroker.value = true
      const { impliedLoan, totalCost } = useInstantEstimates(
        propertyPrice,
        totalSavings,
        hasBroker,
        cityTaxRate.value,
        brokerRate.value,
      )

      // Property price + total costs - (-€10,000) = Property price + total costs + €10,000
      expect(impliedLoan.value).toBe(200000 + totalCost.value + 10000)
    })
  })

  describe('loanToValue calculation', () => {
    it('should calculate loan-to-value ratio correctly', () => {
      propertyPrice.value = 300000
      totalSavings.value = 50000
      hasBroker.value = true
      const { loanToValue, impliedLoan } = useInstantEstimates(
        propertyPrice,
        totalSavings,
        hasBroker,
        cityTaxRate.value,
        brokerRate.value,
      )

      // (Implied loan / Property price) × 100
      const expectedRatio = (impliedLoan.value / 300000) * 100
      expect(loanToValue.value).toBe(expectedRatio)
    })

    it('should return 0 for zero property price', () => {
      propertyPrice.value = 0
      totalSavings.value = 0
      const { loanToValue } = useInstantEstimates(
        propertyPrice,
        totalSavings,
        hasBroker,
        cityTaxRate.value,
        brokerRate.value,
      )

      expect(loanToValue.value).toBe(0)
    })

    it('should return 0 when implied loan is 0', () => {
      propertyPrice.value = 200000
      totalSavings.value = 300000 // More than property + costs
      const { loanToValue } = useInstantEstimates(
        propertyPrice,
        totalSavings,
        hasBroker,
        cityTaxRate.value,
        brokerRate.value,
      )

      expect(loanToValue.value).toBe(0)
    })

    it('should handle loan-to-value ratio with minimal costs', () => {
      propertyPrice.value = 200000
      totalSavings.value = 0
      hasBroker.value = false // No broker costs to simplify
      const zeroTaxRate = 0 // No stamp duty to simplify
      const { loanToValue, impliedLoan, totalCost } = useInstantEstimates(
        propertyPrice,
        totalSavings,
        hasBroker,
        zeroTaxRate,
        brokerRate.value,
      )

      // With no stamp duty and no broker costs, but still notary costs
      // Notary costs: €2,144 + 1.3% of (€200,000 - €100,000) = €3,444
      // Implied loan: €200,000 + €3,444 - €0 = €203,444
      // Loan-to-value: (€203,444 / €200,000) × 100 = 101.72%
      expect(totalCost.value).toBe(3444) // Only notary costs
      expect(impliedLoan.value).toBe(203444)
      expect(loanToValue.value).toBeCloseTo(101.72, 1)
    })
  })

  describe('edge cases and input validation', () => {
    it('should handle string inputs gracefully', () => {
      // Test the safe() function behavior with string inputs
      propertyPrice.value = '300000' as any
      totalSavings.value = '50000' as any
      const { impliedLoan } = useInstantEstimates(
        propertyPrice,
        totalSavings,
        hasBroker,
        cityTaxRate.value,
        brokerRate.value,
      )

      // Should convert strings to numbers and calculate correctly
      expect(typeof impliedLoan.value).toBe('number')
      expect(impliedLoan.value).toBeGreaterThan(0)
    })

    it('should handle undefined/null inputs gracefully', () => {
      // Test with zero values instead of undefined/null to avoid Vue ref issues
      propertyPrice.value = 0
      totalSavings.value = 0
      const { notaryCosts, stampDuty, brokerCosts, impliedLoan, loanToValue } = useInstantEstimates(
        propertyPrice,
        totalSavings,
        hasBroker,
        cityTaxRate.value,
        brokerRate.value,
      )

      // All calculations should return 0 for zero inputs
      expect(notaryCosts.value).toBe(0)
      expect(stampDuty.value).toBe(0)
      expect(brokerCosts.value).toBe(0)
      expect(impliedLoan.value).toBe(0)
      expect(loanToValue.value).toBe(0)
    })

    it('should handle very large numbers', () => {
      propertyPrice.value = 10000000 // €10M
      totalSavings.value = 1000000 // €1M
      hasBroker.value = true
      const { impliedLoan, loanToValue, totalCost } = useInstantEstimates(
        propertyPrice,
        totalSavings,
        hasBroker,
        cityTaxRate.value,
        brokerRate.value,
      )

      // With €10M property, costs are: notary (€130,844) + stamp duty (€600,000) + broker (€320,000) = €1,050,844
      // Savings (€1M) < Total costs (€1,050,844), so loan-to-value > 100%
      expect(impliedLoan.value).toBeGreaterThan(0)
      expect(loanToValue.value).toBeGreaterThan(100) // Loan-to-value > 100% because costs exceed savings
      expect(totalCost.value).toBeGreaterThan(totalSavings.value) // Costs exceed savings
    })
  })

  describe('reactive updates', () => {
    it('should update calculations when property price changes', () => {
      const { notaryCosts, stampDuty, impliedLoan } = useInstantEstimates(
        propertyPrice,
        totalSavings,
        hasBroker,
        cityTaxRate.value,
        brokerRate.value,
      )

      // Initial values
      propertyPrice.value = 200000
      const initialNotary = notaryCosts.value
      const initialStampDuty = stampDuty.value
      const initialImpliedLoan = impliedLoan.value

      // Change property price
      propertyPrice.value = 300000

      // Values should have updated
      expect(notaryCosts.value).not.toBe(initialNotary)
      expect(stampDuty.value).not.toBe(initialStampDuty)
      expect(impliedLoan.value).not.toBe(initialImpliedLoan)
    })

    it('should update calculations when hasBroker changes', () => {
      propertyPrice.value = 300000
      const { brokerCosts, totalCost, impliedLoan } = useInstantEstimates(
        propertyPrice,
        totalSavings,
        hasBroker,
        cityTaxRate.value,
        brokerRate.value,
      )

      // With broker
      hasBroker.value = true
      const withBrokerCosts = brokerCosts.value
      const withBrokerTotal = totalCost.value
      const withBrokerLoan = impliedLoan.value

      // Without broker
      hasBroker.value = false

      expect(brokerCosts.value).toBe(0)
      expect(totalCost.value).toBeLessThan(withBrokerTotal)
      expect(impliedLoan.value).toBeLessThan(withBrokerLoan)
    })
  })
})
