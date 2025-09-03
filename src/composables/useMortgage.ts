import { computed } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { mortgageFormSchema, type MortgageFormValues } from '@/types/mortgage'

type Options = {
  initial?: Partial<MortgageFormValues>
  onSubmit?: (values: MortgageFormValues) => Promise<void> | void
}

export function useMortgage(options: Options = {}) {
  const form = useForm<MortgageFormValues>({
    validationSchema: toTypedSchema(mortgageFormSchema),
    initialValues: {
      realEstateCommission: true,
      propertyPrice: [50_000],
      totalSavings: [0],
      repayment: 2.0,
      region: 'berlin',
      newProperty: false,
      ...(options.initial ?? {}),
    },
    validateOnMount: false,
  })

  const canSubmit = computed(() => form.meta.value.valid && !form.isSubmitting.value)

  const submit = form.handleSubmit(async (values) => {
    await options.onSubmit?.(values)
  })

  return { form, canSubmit, submit }
}
