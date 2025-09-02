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

import { useMortgage } from '@/composables/useMortgage'

const { form, canSubmit, submit } = useMortgage()

</script>

<template>
  <Card>
    <h2 class="text-2xl font-medium">Mortgage Calculator</h2>
    <form :form="form" class="space-y-6" @submit.prevent="submit">
      <!-- Real Estate Commission -->
      <FieldSet field-name="realEstateCommission" label="Real estate commission">
        <template #control="{ componentField }">
          <FormControl>
            <RadioGroup class="flex items-center space-x-6" :model-value="componentField.modelValue ? 'yes' : 'no'"
              @update:model-value="val => componentField['onUpdate:modelValue']?.(val === 'yes')">
              <div class="flex items-center gap-2">
                <RadioGroupItem id="commission-yes" value="yes" />
                <Label for="commission-yes">Yes</Label>
              </div>
              <div class="flex items-center gap-2">
                <RadioGroupItem id="commission-no" value="no" />
                <Label for="commission-no">No</Label>
              </div>
            </RadioGroup>
          </FormControl>
        </template>
      </FieldSet>

      <!-- Property Price -->
      <FieldSet field-name="propertyPrice" label="Property purchase price">
        <template #control="{ componentField }">
          <FormControl>
            <Input required inputmode="numeric" placeholder="320000" v-bind="componentField" />
          </FormControl>
        </template>
      </FieldSet>

      <!-- Savings -->
      <FieldSet field-name="totalSavings" label="Total savings">
        <template #control="{ componentField }">
          <FormControl>
            <Input v-bind="componentField" />
          </FormControl>
        </template>
      </FieldSet>

      <!-- Repayment % with stepper -->
      <FieldSet field-name="repayment" label="Annual repayment rate (%)">
        <template #control="{ componentField }">
          <FormControl>
            <NumberField v-bind="componentField" :min="1" :max="100" :step="0.1">
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
        <Button class="w-full sm:w-fit" size="lg" type="submit" :disabled="!canSubmit">Calculate</Button>
      </div>
    </form>
  </Card>
</template>

<style scoped></style>
