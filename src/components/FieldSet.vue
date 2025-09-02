<script setup lang="ts">
import { FormField, FormItem, FormLabel, FormDescription, FormMessage } from '@/components/ui/form'

interface Props {
  fieldName: string
  label: string
  description?: string
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {})
</script>

<template>
  <FormField v-slot="{ componentField }" :name="fieldName">
    <FormItem>
      <FormLabel :for="fieldName" class="text-sm">
        {{ label }}
      </FormLabel>
      <slot name="control" :component-field="componentField" />
      <FormDescription v-if="description">
        {{ description }}
      </FormDescription>
      <FormMessage />
    </FormItem>
  </FormField>
</template>

<style scoped></style>
