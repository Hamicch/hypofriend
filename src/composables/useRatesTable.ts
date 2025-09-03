import { ref } from 'vue'
import type { RatesRow } from '@/types/rates'
import { gqlFetch } from '@/lib/graphql'
import { Q_RATES_TABLE } from '@/lib/gql-docs'

type QueryArgs = {
  property_price: number
  repayment: number
  loan_amount: number
  years_fixed: number[]
}

type RawRatesTable = Record<string, { borrowingRate: number; monthlyRate: number }> | undefined

const cache = new Map<string, RatesRow[]>()

function keyOf(args: QueryArgs): string {
  return JSON.stringify([
    args.property_price,
    args.repayment,
    args.loan_amount,
    args.years_fixed.join(','),
  ])
}

function normalize(raw: RawRatesTable): RatesRow[] {
  if (!raw) return []
  return Object.entries(raw)
    .map(([k, v]) => ({
      yearsFixed: Number(k),
      borrowingRate: v.borrowingRate,
      monthlyRate: v.monthlyRate,
    }))
    .sort((a, b) => a.yearsFixed - b.yearsFixed)
}

export function useRatesTable() {
  const rows = ref<RatesRow[] | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  let ctrl: AbortController | null = null

  async function fetchRates(args: QueryArgs) {
    const cacheKey = keyOf(args)
    if (cache.has(cacheKey)) {
      rows.value = cache.get(cacheKey)!.slice()
      return
    }

    loading.value = true
    error.value = null
    ctrl?.abort()
    ctrl = new AbortController()

    try {
      const data = await gqlFetch<{
        root?: {
          rates_table?: RawRatesTable
        }
      }>({ query: Q_RATES_TABLE, variables: args }, ctrl.signal)

      const raw = data.root?.rates_table
      const list = normalize(raw)

      rows.value = list
      cache.set(cacheKey, list)
    } catch (e: any) {
      if (e?.name !== 'AbortError') {
        error.value = e?.message ?? 'Failed to load rates'
      }
    } finally {
      loading.value = false
    }
  }

  function reset() {
    rows.value = null
    error.value = null
    loading.value = false
  }

  return { rows, loading, error, fetchRates, reset }
}
