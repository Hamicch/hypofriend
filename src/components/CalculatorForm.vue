<script setup lang="ts">
import { ref, watchEffect } from 'vue'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FormControl } from '@/components/ui/form'
import {
  NumberField,
  NumberFieldInput,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
} from '@/components/ui/number-field'
import { FieldSet } from '@/components/ui/form'
import { CurrencyInput } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

import { useMortgage } from '@/composables/useMortgage'
import { REGIONS } from '@/types/mortgage'

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
const region = ref('Berlin')
const newProperty = ref(false)

watchEffect(() => {
  propertyPrice.value = form.values.propertyPrice || 0
  totalSavings.value = form.values.totalSavings || 0
  hasBroker.value = form.values.realEstateCommission ?? true
  region.value = form.values.region ?? 'Berlin'
  newProperty.value = form.values.newProperty ?? false
})

defineExpose({
  form,
  propertyPrice,
  totalSavings,
  hasBroker,
  region,
  newProperty,
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
            <Tabs :model-value="componentField.modelValue ? 'yes' : 'no'"
              @update:model-value="(val) => componentField['onUpdate:modelValue']?.(val === 'yes')">
              <TabsList class="grid w-full grid-cols-2">
                <TabsTrigger value="yes">Yes</TabsTrigger>
                <TabsTrigger value="no">No</TabsTrigger>
              </TabsList>
            </Tabs>
          </FormControl>
        </template>
      </FieldSet>

      <!-- Property Price -->
      <FieldSet field-name="propertyPrice" label="Property purchase price">
        <template #control="{ componentField }">
          <FormControl>
            <CurrencyInput placeholder="320,000" v-bind="componentField" />
          </FormControl>
        </template>
      </FieldSet>

      <!-- Savings -->
      <FieldSet field-name="totalSavings" label="Total savings">
        <template #control="{ componentField }">
          <FormControl>
            <CurrencyInput v-bind="componentField" placeholder="32,000" />
          </FormControl>
        </template>
      </FieldSet>

      <!-- Repayment % with stepper -->
      <FieldSet field-name="repayment" label="Annual repayment rate (%)">
        <template #control="{ componentField }">
          <FormControl>
            <NumberField :model-value="Number(componentField.modelValue) || 0"
              @update:model-value="(value) => componentField['onUpdate:modelValue']?.(value)" :min="1" :max="100"
              :step="0.1">
              <NumberFieldContent>
                <NumberFieldDecrement />
                <NumberFieldInput />
                <NumberFieldIncrement />
              </NumberFieldContent>
            </NumberField>
          </FormControl>
        </template>
      </FieldSet>

      <!-- State Selection -->
      <FieldSet field-name="region" label="Region">
        <template #control="{ componentField }">
          <FormControl>
            <Select v-bind="componentField">
              <SelectTrigger>
                <SelectValue placeholder="Select a region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="region in REGIONS" :key="region" :value="region">
                  {{ region }}
                </SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
        </template>
      </FieldSet>

      <!-- New Property -->
      <FieldSet field-name="newProperty" label="New Property">
        <template #control="{ componentField }">
          <FormControl>
            <Tabs :model-value="componentField.modelValue ? 'yes' : 'no'"
              @update:model-value="(val) => componentField['onUpdate:modelValue']?.(val === 'yes')">
              <TabsList class="grid w-full grid-cols-2">
                <TabsTrigger value="yes">Yes</TabsTrigger>
                <TabsTrigger value="no">No</TabsTrigger>
              </TabsList>
            </Tabs>
          </FormControl>
        </template>
      </FieldSet>

      <div class="flex justify-end w-full pt-8">
        <Button class="w-full sm:w-fit" size="lg" type="submit" :disabled="!canSubmit">Calculate</Button>
      </div>
    </form>
  </Card>
</template>

<style scoped></style>
