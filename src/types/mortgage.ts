import { z } from 'zod'

const requiredNumberWithLimits = (label: string, min: number, max: number) =>
  z.coerce
    .number({ invalid_type_error: `${label} is required` })
    .min(min, `Min ${min.toLocaleString()}`)
    .max(max, `Max ${max.toLocaleString()}`)
    .refine((n) => Number.isFinite(n), { message: `${label} is required` })

export const REGIONS = [
  { label: 'Berlin', value: 'berlin' },
  { label: 'Bavaria', value: 'bavaria' },
  { label: 'Brandenburg', value: 'brandenburg' },
  { label: 'Hamburg', value: 'hamburg' },
  { label: 'Saxony', value: 'saxony' },
  { label: 'Baden-Württemberg', value: 'baden-wurttemberg' },
  { label: 'Hesse', value: 'hesse' },
] as const

export type Region = (typeof REGIONS)[number]['value']

export const REGION_VALUES = REGIONS.map(r => r.value) as unknown as readonly [
  'berlin', 'bavaria', 'brandenburg', 'hamburg', 'saxony', 'baden-wurttemberg', 'hesse'
]

export const mortgageFormSchema = z.object({
  realEstateCommission: z.boolean({
    required_error: 'Real estate commission selection is required',
  }),
  propertyPrice: z.array(z.number()).min(1).max(1).refine(
    (arr) => arr.length === 1 && arr[0] >= 50_000 && arr[0] <= 2_000_000,
    { message: 'Property price must be between €50,000 and €2,000,000' }
  ),
  totalSavings: z.array(z.number()).min(1).max(1).refine(
    (arr) => arr.length === 1 && arr[0] >= 0 && arr[0] <= 1_000_000,
    { message: 'Total savings must be between €0 and €1,000,000' }
  ),
  repayment: requiredNumberWithLimits('Repayment', 1, 10),

  region: z.enum(REGION_VALUES, { required_error: 'Region is required' }),
  newProperty: z.boolean({ required_error: 'New property selection is required' }),
})

export type MortgageFormValues = z.infer<typeof mortgageFormSchema>
