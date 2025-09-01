<script setup lang="ts">
import Card from '@/components/Card.vue'
import ResultPanel from '@/components/ResultPanel.vue'
import { formatDisplay } from '@/composables/useFormatters'

const impliedLoan = formatDisplay(264202, 'currency')
const loanToValue = formatDisplay(80, 'percentage')
</script>

<template>
  <main class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 border-2 border-blue-500">
    <div class="grid grid-cols-1 lg:grid-cols-6 gap-6 items-start">
      <section aria-labelledby="calc-title" class="space-y-6 lg:col-span-6">
        <h2 id="calc-title" class="sr-only">Mortgage Calculator</h2>
        <Card>
          <div class="p-4 sm:p-6 min-h-24">
            <p class="text-xl font-semibold">Mortgage Calculator</p>
          </div>
        </Card>
      </section>

      <!-- Right column: Results stack (top to bottom) -->
      <section aria-labelledby="results-title" class="lg:col-span-6">
        <h2 id="results-title" class="sr-only">Results</h2>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResultPanel title="Implied Loan" :calculatedValue="impliedLoan" />

          <ResultPanel title="Loan to value" :calculatedValue="loanToValue" />

          <Card class="min-h-24 lg:col-span-2">
            <div class="p-4 sm:p-6">
              <p class="text-xl font-semibold">Rate Table</p>
            </div>
          </Card>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped></style>
