<script setup lang="ts">
import { computed } from 'vue'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDisplay } from '@/lib/formatters'
import EmptyState from '@/components/EmptyState.vue'

interface RateData {
  fixationLength: string
  monthlyRate: number
  interestRate: number
}

const ratesData: RateData[] = [
  { fixationLength: '5 Years', monthlyRate: 1568, interestRate: 0.50 },
  { fixationLength: '10 Years', monthlyRate: 583, interestRate: 0.65 },
  { fixationLength: '15 Years', monthlyRate: 656, interestRate: 0.98 },
  { fixationLength: '20 Years', monthlyRate: 718, interestRate: 1.20 },
  { fixationLength: '25 Years', monthlyRate: 738, interestRate: 1.35 },
  { fixationLength: '30 Years', monthlyRate: 751, interestRate: 1.41 },
]

// Sort by interest rate (borrowing rate) in ascending order
const sortedRates = computed(() => ratesData.sort((a, b) => a.interestRate - b.interestRate))
</script>

<template>
  <EmptyState v-if="sortedRates.length === 0">Rates are available after calculation</EmptyState>
  <Table v-else class="w-full h-full">
    <!-- Table header -->
    <TableHeader>
      <TableRow>
        <TableHead>
          Fixation length
        </TableHead>
        <TableHead>Monthly rate</TableHead>
        <TableHead>Interest rate</TableHead>
      </TableRow>
    </TableHeader>

    <!-- Table body -->
    <TableBody>
      <TableRow v-for="rate in sortedRates" :key="rate.fixationLength">
        <TableCell class="font-medium">
          {{ rate.fixationLength }}
        </TableCell>
        <TableCell>{{ formatDisplay(rate.monthlyRate, 'currency') }}</TableCell>
        <TableCell>{{ formatDisplay(rate.interestRate, 'percentage') }}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
