<script setup lang="ts">
import { ref, computed } from 'vue'
import { ref as vref } from 'vue'
import Card from '@/components/ui/card/Card.vue'
import InstantResultPanel from '@/components/ResultPanel.vue'
import { formatDisplay } from '@/lib/formatters'
import CalculatorForm from '@/components/CalculatorForm.vue'
import RatesTable from '@/components/RatesTable.vue'
import { useInstantEstimates } from '@/composables/useInstantEstimates'

import { useRatesTable } from '@/composables/useRatesTable'

// Expose the calculator form to the parent
const calcRef = ref<InstanceType<typeof CalculatorForm> | null>(null)

// constants for now, swap to useTaxRates later
const cityTaxRate = vref(0.06) // TODO: replace with GraphQL when region is added
const brokerRate = vref(0.032) // TODO: replace with GraphQL + hasBroker toggle

const { impliedLoan, loanToValue } = useInstantEstimates(
  computed(() => calcRef.value?.propertyPrice ?? 0),
  computed(() => calcRef.value?.totalSavings ?? 0),
  computed(() => calcRef.value?.hasBroker ?? true),
  cityTaxRate.value,
  brokerRate.value,
)

const impliedLoanFormatted = computed(() => formatDisplay(impliedLoan.value, 'currency'))
const loanToValueFormatted = computed(() => formatDisplay(loanToValue.value, 'percentage'))

const { rows, loading, error, fetchRates } = useRatesTable()

function onFormSubmit(values: { propertyPrice: number; repayment: number }) {
  fetchRates({
    property_price: values.propertyPrice,
    repayment: values.repayment,
    loan_amount: impliedLoan.value,
    years_fixed: [5, 10, 15, 20, 25, 30],
  })
}
</script>

<template>
  <main class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 mt-4">
    <div class="grid grid-cols-1 lg:grid-cols-6 gap-6 items-start">
      <section aria-labelledby="calc-title" class="space-y-6 lg:col-span-3">
        <h2 id="calc-title" class="sr-only">Mortgage Calculator</h2>
        <CalculatorForm ref="calcRef" @submit="onFormSubmit" />
      </section>

      <section aria-labelledby="results-title" class="lg:col-span-3">
        <h2 id="results-title" class="sr-only">Results</h2>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InstantResultPanel title="Implied Loan" :calculatedValue="impliedLoanFormatted" />

          <InstantResultPanel title="Loan to value" :calculatedValue="loanToValueFormatted" />

          <Card class="min-h-24 max-w-full lg:col-span-2 flex-1">
            <h3 class="text-md font-semibold">Rates Table</h3>
            <RatesTable :rows="rows" :loading="loading" :error="error" />
          </Card>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped></style>
