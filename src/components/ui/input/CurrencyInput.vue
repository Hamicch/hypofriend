<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { useVModel } from '@vueuse/core'
import { cn } from '@/lib/utils'
import { Euro } from 'lucide-vue-next'
import { useFormattedInput } from '@/composables/useFormattedInput'

interface Props {
  defaultValue?: string | number
  modelValue?: string | number
  class?: HTMLAttributes['class']
  id?: string
  type?: string
  formatOnBlur?: boolean
}

const props = defineProps<Props>()

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void
}>()

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
})

// Use the formatted input composable for all input logic
const {
  displayValue,
  handleFocus,
  handleBlur,
  handleInput
} = useFormattedInput(modelValue, props.formatOnBlur)

/**
 * Computed classes for the input element
 */
const inputClasses = computed(() => cn(
  // Base input styles
  'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-12 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
  // Focus styles
  'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
  // Error states
  'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive pl-8',
  // Custom classes
  props.class,
))
</script>

<template>
  <div class="relative w-full items-center">
    <input
      :id="id"
      :type="type"
      :value="displayValue"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      data-slot="formatted-input"
      :class="inputClasses"
    />
    <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
      <Euro class="size-4 text-muted-foreground" />
    </span>
  </div>
</template>
