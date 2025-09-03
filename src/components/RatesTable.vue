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
import type { RatesRow } from '@/types/rates'

const props = defineProps<{
  rows: RatesRow[] | null
}>()

const sortedRates = computed(() => props.rows ?? [])
</script>

<template>
  <EmptyState v-if="sortedRates.length === 0">Rates are available after calculation</EmptyState>
  <Table v-else class="w-full h-full">
    <!-- Table header -->
    <TableHeader>
      <TableRow>
        <TableHead> Fixation length </TableHead>
        <TableHead>Monthly rate</TableHead>
        <TableHead>Interest rate</TableHead>
      </TableRow>
    </TableHeader>

    <!-- Table body -->
    <TableBody>
      <TableRow v-for="rate in sortedRates" :key="rate.yearsFixed">
        <TableCell class="font-medium"> {{ rate.yearsFixed }} Years </TableCell>
        <TableCell>{{ formatDisplay(rate.monthlyRate, 'currency') }}</TableCell>
        <TableCell>{{ formatDisplay(rate.borrowingRate, 'percentage') }}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
