import { http, HttpResponse } from 'msw'

export const handlers = [
  http.post('/q', async ({ request }) => {
    const { query } = (await request.json()) as { query: string }
    if (typeof query === 'string' && query.includes('rates_table')) {
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
    if (typeof query === 'string' && query.includes('calculateCityTax')) {
      return HttpResponse.json({ data: { calculateCityTax: { tax: 0.06 } } })
    }
    if (typeof query === 'string' && query.includes('calculateMaklerFee')) {
      return HttpResponse.json({ data: { calculateMaklerFee: { tax: 0.032 } } })
    }
    return HttpResponse.json({ data: {} })
  }),
]
