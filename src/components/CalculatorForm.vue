<script setup lang="ts">
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
import FieldSet from '@/components/FieldSet.vue'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Input } from '@/components/ui/input'

const props = withDefaults(
  defineProps<{
    propertyPrice: number
    totalSavings: number
    repayment: number
    // Configs
    yearsOptions?: number[]
    priceMin?: number
    priceMax?: number
    priceStep?: number
    repaymentMin?: number
    repaymentMax?: number
    repaymentStep?: number
    totalSavingsMin?: number
    totalSavingsMax?: number
    totalSavingsStep?: number
  }>(),
  {
    yearsOptions: () => [5, 10, 15, 20, 25, 30],
    // regions: () => [
    //   { label: 'Berlin', value: 'berlin' },
    //   { label: 'Brandenburg', value: 'brandenburg' },
    //   { label: 'Bavaria', value: 'bavaria' },
    //   { label: 'Hamburg', value: 'hamburg' },
    //   { label: 'Saxony', value: 'saxony' },
    //   { label: 'Baden-Württemberg', value: 'baden-wurttemberg' },
    //   { label: 'Hesse', value: 'hesse' },
    // ],
    priceMin: 50000,
    priceMax: 2000000,
    priceStep: 1000,
    repaymentMin: 1,
    repaymentMax: 10,
    repaymentStep: 0.1,

    totalSavingsMin: 0,
    totalSavingsMax: 1000000,
    totalSavingsStep: 1000,
  },
)

const emit = defineEmits<{
  (e: 'update:propertyPrice', v: number): void
  (e: 'update:totalSavings', v: number): void
  (e: 'update:repayment', v: number): void
  (e: 'update:yearsFixed', v: number): void
  (e: 'update:region', v: string): void
  (e: 'update:hasBroker', v: boolean): void
}>()
</script>

<template>
  <Card>
    <h2 class="text-2xl font-medium">Mortgage Calculator</h2>
    <form class="space-y-6" @submit.prevent>
      <!-- Real Estate Commission -->
      <FieldSet field-name="realEstateCommission" label="Real estate commission">
        <template #control="{ componentField }">
          <FormControl>
            <RadioGroup class="flex items-center space-x-2" default-value="yes">
              <div class="flex items-center space-x-2">
                <RadioGroupItem v-bind="componentField" id="yes" value="yes" />
                <Label for="yes">Yes</Label>
              </div>
              <div class="flex items-center space-x-2">
                <RadioGroupItem v-bind="componentField" id="no" value="no" />
                <Label for="no">No</Label>
              </div>
            </RadioGroup>
          </FormControl>
        </template>
      </FieldSet>

      <!-- Property Price -->
      <FieldSet field-name="propertyPrice" label="Property purchase price">
        <template #control="{ componentField }">
          <FormControl>
            <Input type="number" v-bind="componentField" default-value="propertyPrice" />
          </FormControl>
        </template>
      </FieldSet>

      <!-- Savings -->
      <FieldSet field-name="totalSavings" label="Total savings">
        <template #control="{ componentField }">
          <FormControl>
            <Input type="number" v-bind="componentField" default-value="totalSavings" />
          </FormControl>
        </template>
      </FieldSet>

      <!-- Repayment % with stepper -->
      <FieldSet field-name="repayment" label="Annual repayment rate (%)">
        <template #control="{ componentField }">
          <FormControl>
            <NumberField v-bind="componentField" :default-value="repayment" :min="repaymentMin" :max="repaymentMax"
              :step="repaymentStep">
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
        <Button class="w-full sm:w-fit" size="lg" type="submit">Calculate</Button>
      </div>
    </form>
  </Card>
</template>

<style scoped></style>
