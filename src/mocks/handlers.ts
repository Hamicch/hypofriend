import { http, HttpResponse } from 'msw'

export const handlers = [
  http.post('/q', async ({ request }) => {
    const body = (await request.json()) as { query: string; variables?: { region?: string } }
    const { query } = body

    if (query.includes('rates_table')) {
      return HttpResponse.json({
        data: {
          root: {
            rates_table: {
              '5': { borrowingRate: 0.7, monthlyRate: 710.24 },
              '10': { borrowingRate: 0.75, monthlyRate: 723.39 },
              '15': { borrowingRate: 1.04, monthlyRate: 799.68 },
              '20': { borrowingRate: 1.32, monthlyRate: 873.33 },
              '25': { borrowingRate: 1.89, monthlyRate: 1023.27 },
              '30': { borrowingRate: 1.94, monthlyRate: 1036.43 },
            },
          },
        },
      })
    }
    if (query.includes('calculateCityTax')) {
      const reg = body?.variables?.region ?? 'berlin'
      const map: Record<string, number> = {
        berlin: 0.06,
        bavaria: 0.05,
        brandenburg: 0.065,
        hamburg: 0.045,
        saxony: 0.07,
        'baden-wurttemberg': 0.08,
        hesse: 0.02,
      }
      return HttpResponse.json({ data: { calculateCityTax: { tax: map[reg] ?? 0.06 } } })
    }
    if (query.includes('calculateMaklerFee')) {
      return HttpResponse.json({ data: { calculateMaklerFee: { tax: 0.032 } } })
    }
    return HttpResponse.json({ data: {} })
  }),
]
