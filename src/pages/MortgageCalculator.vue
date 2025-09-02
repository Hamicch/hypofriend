<script setup lang="ts">
import { ref } from 'vue'
import Card from '@/components/ui/card/Card.vue'
import InstantResultPanel from '@/components/ResultPanel.vue'
import { formatCurrency, formatPercentage } from '@/lib/formatters'
import CalculatorForm from '@/components/CalculatorForm.vue'
import RatesTable from '@/components/RatesTable.vue'

const impliedLoan = ref(formatCurrency(264202))
const loanToValue = ref(formatPercentage(80))
</script>

<template>
  <main class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 mt-4">
    <div class="grid grid-cols-1 lg:grid-cols-6 gap-6 items-start">
      <section aria-labelledby="calc-title" class="space-y-6 lg:col-span-3">
        <h2 id="calc-title" class="sr-only">Mortgage Calculator</h2>
        <CalculatorForm :propertyPrice="264202" :totalSavings="100000" :repayment="5" />
      </section>

      <section aria-labelledby="results-title" class="lg:col-span-3">
        <h2 id="results-title" class="sr-only">Results</h2>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InstantResultPanel title="Implied Loan" :calculatedValue="impliedLoan" />

          <InstantResultPanel title="Loan to value" :calculatedValue="loanToValue" />

          <Card class="min-h-24 max-w-full lg:col-span-2 flex-1">
            <h3 class="text-md font-semibold">Rates Table
            </h3>
            <RatesTable />
          </Card>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped></style>
