import { ref, computed, type Ref } from 'vue'
import { formatDisplay } from '@/lib/formatters'
import { sanitizeNumericInput, safeNumber } from '@/lib/input-utils'

/**
 * Composable for handling formatted input logic
 * Manages focus state, display formatting, and input sanitization
 */
export function useFormattedInput(
  modelValue: Ref<string | number | undefined>,
  formatOnBlur = false,
) {
  const isFocused = ref(false)

  /**
   * Determines what value to display based on focus state
   * - While focused: shows raw numeric input for easy editing
   * - When blurred: shows formatted currency display
   */
  const displayValue = computed(() => {
    if (isFocused.value) {
      return modelValue.value?.toString() || ''
    }

    const numValue = safeNumber(modelValue.value)
    if (numValue > 0) {
      return formatDisplay(numValue, 'invalid' as any)
    }

    return modelValue.value?.toString() || ''
  })

  /**
   * Handles focus event - switches to raw numeric display
   */
  const handleFocus = () => {
    isFocused.value = true
  }

  /**
   * Handles blur event - switches to formatted display and optionally formats value
   */
  const handleBlur = () => {
    isFocused.value = false

    if (formatOnBlur) {
      const numValue = safeNumber(modelValue.value)
      if (Number.isFinite(numValue)) {
        modelValue.value = numValue
      }
    }
  }

  /**
   * Handles input events - sanitizes and updates the model value
   */
  const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    const sanitizedValue = sanitizeNumericInput(target.value)
    modelValue.value = sanitizedValue
  }

  return {
    isFocused,
    displayValue,
    handleFocus,
    handleBlur,
    handleInput,
  }
}
