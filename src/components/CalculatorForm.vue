<script setup lang="ts">
import { ref, watchEffect, computed } from 'vue'
import { Loader2 } from 'lucide-vue-next'

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { FormDescription } from '@/components/ui/form'

import { useMortgage } from '@/composables/useMortgage'
import { REGIONS, type Region } from '@/types/mortgage'
import { formatDisplay } from '@/lib/formatters'

const emit = defineEmits<{
  (e: 'submit', payload: { propertyPrice: number; repayment: number }): void
}>()

const { form, canSubmit, submit } = useMortgage({
  onSubmit: async (values) => {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    emit('submit', { propertyPrice: values.propertyPrice[0], repayment: values.repayment })
  },
})

const isLoading = computed(() => form.isSubmitting.value)

const propertyPrice = ref<number>(0)
const totalSavings = ref<number>(0)
const hasBroker = ref<boolean>(true)
const region = ref<Region>('berlin')
const newProperty = ref<boolean>(false)

watchEffect(() => {
  propertyPrice.value = form.values.propertyPrice?.[0] || 0
  totalSavings.value = form.values.totalSavings?.[0] || 0
  hasBroker.value = form.values.realEstateCommission ?? true
  region.value = (form.values.region as Region) ?? 'berlin'
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
            <Tabs
              :model-value="componentField.modelValue ? 'yes' : 'no'"
              @update:model-value="(val) => componentField['onUpdate:modelValue']?.(val === 'yes')"
            >
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
            <Slider
              :model-value="componentField.modelValue"
              :max="2_000_000"
              :min="50_000"
              :step="100"
              @update:model-value="componentField['onUpdate:modelValue']"
            />
            <FormDescription class="flex justify-end mt-2">
              <span>{{ formatDisplay(componentField.modelValue?.[0] as number, 'currency') }}</span>
            </FormDescription>
          </FormControl>
        </template>
      </FieldSet>

      <!-- Savings -->
      <FieldSet field-name="totalSavings" label="Total savings">
        <template #control="{ componentField }">
          <FormControl>
            <Slider
              :model-value="componentField.modelValue"
              :max="1_000_000"
              :min="0"
              :step="100"
              @update:model-value="componentField['onUpdate:modelValue']"
            />
            <FormDescription class="flex justify-end mt-2">
              <span>{{ formatDisplay(componentField.modelValue?.[0] as number, 'currency') }}</span>
            </FormDescription>
          </FormControl>
        </template>
      </FieldSet>

      <!-- Repayment % with stepper -->
      <FieldSet field-name="repayment" label="Annual repayment rate (%)">
        <template #control="{ componentField }">
          <FormControl>
            <NumberField
              :model-value="Number(componentField.modelValue) || 0"
              @update:model-value="
                (value: number) => componentField['onUpdate:modelValue']?.(value)
              "
              :min="1"
              :max="10"
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

      <!-- State Selection -->
      <FieldSet field-name="region" label="Region">
        <template #control="{ componentField }">
          <FormControl>
            <Select
              :model-value="String(componentField.modelValue ?? 'berlin')"
              @update:model-value="(val) => componentField['onUpdate:modelValue']?.(val)"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="region in REGIONS" :key="region.value" :value="region.value">
                  {{ region.label }}
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
            <Tabs
              :model-value="componentField.modelValue ? 'yes' : 'no'"
              @update:model-value="(val) => componentField['onUpdate:modelValue']?.(val === 'yes')"
            >
              <TabsList class="grid w-full grid-cols-2">
                <TabsTrigger value="yes">Yes</TabsTrigger>
                <TabsTrigger value="no">No</TabsTrigger>
              </TabsList>
            </Tabs>
          </FormControl>
        </template>
      </FieldSet>

      <div class="flex justify-end w-full pt-8">
        <Button class="w-full sm:w-fit" size="lg" type="submit" :disabled="!canSubmit || isLoading">
          <Loader2 v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4" />
          {{ isLoading ? 'Calculating...' : 'Calculate' }}
        </Button>
      </div>
    </form>
  </Card>
</template>

<style scoped></style>
