import { ref, shallowRef, watchEffect } from 'vue'
import { gqlFetch } from '@/lib/graphql'
import { M_CITY_TAX, M_BROKER_TAX } from '@/lib/gql-docs'

type Tax = { cityTax: number; brokerTax: number }
const cache = new Map<string, Tax>()

export function useTaxRates(params: {
  region: () => string
  hasBroker: () => boolean
  newProperty: () => boolean
}) {
  const tax = shallowRef<Tax>({ cityTax: 0, brokerTax: 0 })
  const loading = ref(false)
  const error = ref<string | null>(null)
  let ctrl: AbortController | null = null

  async function load() {
    loading.value = true
    error.value = null

    const key = `${params.region()}|${params.hasBroker()}|${params.newProperty()}`
    if (cache.has(key)) {
      tax.value = cache.get(key)!
      loading.value = false
      return
    }

    ctrl?.abort()
    ctrl = new AbortController()

    try {
      const city = await gqlFetch<{ calculateCityTax: { tax: number } }>(
        { query: M_CITY_TAX, variables: { region: params.region() } },
        ctrl.signal,
      )

      let brokerTax = 0
      if (params.hasBroker()) {
        const broker = await gqlFetch<{ calculateMaklerFee: { tax: number } }>(
          {
            query: M_BROKER_TAX,
            variables: { region: params.region(), new_property: params.newProperty() },
          },
          ctrl.signal,
        )
        brokerTax = broker.calculateMaklerFee.tax
      }

      const payload = { cityTax: city.calculateCityTax.tax, brokerTax }
      cache.set(key, payload)
      tax.value = payload
    } catch (e: any) {
      if (e?.name !== 'AbortError') error.value = e?.message ?? 'Failed to load tax rates'
    } finally {
      loading.value = false
    }
  }

  watchEffect(load)
  return { tax, loading, error }
}
