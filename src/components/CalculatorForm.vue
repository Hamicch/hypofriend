<script setup lang="ts">
import { ref, watchEffect } from 'vue'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FormControl, FormLabel } from '@/components/ui/form'
import {
  NumberField,
  NumberFieldInput,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
} from '@/components/ui/number-field'
import { FieldSet } from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { CurrencyInput } from '@/components/ui/input'

import { useMortgage } from '@/composables/useMortgage'

const emit = defineEmits<{
  (e: 'submit', payload: { propertyPrice: number; repayment: number }): void
}>()

const { form, canSubmit, submit } = useMortgage({
  onSubmit: (values) => {
    emit('submit', { propertyPrice: values.propertyPrice, repayment: values.repayment })
  },
})

const propertyPrice = ref(0)
const totalSavings = ref(0)
const hasBroker = ref(true)

watchEffect(() => {
  propertyPrice.value = form.values.propertyPrice || 0
  totalSavings.value = form.values.totalSavings || 0
  hasBroker.value = form.values.realEstateCommission ?? true
})

defineExpose({
  form,
  propertyPrice,
  totalSavings,
  hasBroker,
})
</script>

<template>
  <Card>
    <h2 class="text-2xl font-medium">Mortgage Calculator</h2>
    <form :form="form" class="space-y-6" @submit.prevent="submit">
      <!-- Real Estate Commission -->
      <FieldSet field-name="realEstateCommission" label="Real estate commission">
        <template #control="{ componentField }">
          <FormControl>
            <RadioGroup
              class="flex items-center space-x-6"
              :model-value="componentField.modelValue ? 'yes' : 'no'"
              @update:model-value="(val) => componentField['onUpdate:modelValue']?.(val === 'yes')"
            >
              <div class="flex items-center gap-2">
                <RadioGroupItem id="commission-yes" value="yes" />
                <FormLabel for="commission-yes">Yes</FormLabel>
              </div>
              <div class="flex items-center gap-2">
                <RadioGroupItem id="commission-no" value="no" />
                <FormLabel for="commission-no">No</FormLabel>
              </div>
            </RadioGroup>
          </FormControl>
        </template>
      </FieldSet>

      <!-- Property Price -->
      <FieldSet field-name="propertyPrice" label="Property purchase price">
        <template #control="{ componentField }">
          <FormControl>
            <CurrencyInput
              required
              inputmode="numeric"
              placeholder="320000"
              v-bind="componentField"
            />
          </FormControl>
        </template>
      </FieldSet>

      <!-- Savings -->
      <FieldSet field-name="totalSavings" label="Total savings">
        <template #control="{ componentField }">
          <FormControl>
            <CurrencyInput v-bind="componentField" />
          </FormControl>
        </template>
      </FieldSet>

      <!-- Repayment % with stepper -->
      <FieldSet field-name="repayment" label="Annual repayment rate (%)">
        <template #control="{ componentField }">
          <FormControl>
            <NumberField
              :model-value="Number(componentField.modelValue) || 0"
              @update:model-value="(value) => componentField['onUpdate:modelValue']?.(value)"
              :min="1"
              :max="100"
              :step="0.1"
            >
              <NumberFieldContent>
                <NumberFieldDecrement />
                <NumberFieldInput />
                <NumberFieldIncrement />
              </NumberFieldContent>
            </NumberField>
          </FormControl>
        </template>
      </FieldSet>

      <div class="flex justify-end w-full pt-8">
        <Button class="w-full sm:w-fit" size="lg" type="submit" :disabled="!canSubmit"
          >Calculate</Button
        >
      </div>
    </form>
  </Card>
</template>

<style scoped></style>
