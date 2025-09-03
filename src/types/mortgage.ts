import { z } from 'zod'

/** Required number helper with messages */
const requiredNumber = (label: string) =>
  z.coerce
    .number({ invalid_type_error: `${label} is required` })
    .refine((n) => Number.isFinite(n), { message: `${label} is required` })

/** Required number with min/max constraints */
const requiredNumberWithLimits = (label: string, min: number, max: number) =>
  z.coerce
    .number({ invalid_type_error: `${label} is required` })
    .min(min, `Min ${min.toLocaleString()}`)
    .max(max, `Max ${max.toLocaleString()}`)
    .refine((n) => Number.isFinite(n), { message: `${label} is required` })

export const REGIONS = [
  "Berlin",
  "Bavaria",
  "Brandenburg",
  "Hamburg",
  "Saxony",
  "Baden-Württemberg",
  "Hesse",
] as const;
export type Region = typeof REGIONS[number];

export const mortgageFormSchema = z.object({
  realEstateCommission: z.boolean(),
  propertyPrice: requiredNumber('Property price'),
  totalSavings: requiredNumber('Total savings'),
  repayment: requiredNumberWithLimits('Repayment', 1, 100),
  region: z.enum(REGIONS, { required_error: "Region is required" }),
  newProperty: z.boolean({ required_error: "New property selection is required" })
})

export type MortgageFormValues = z.infer<typeof mortgageFormSchema>
