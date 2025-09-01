<template>
  <component :is="as" class="card" v-bind="$attrs">
    <slot />
  </component>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    as?: string
  }>(),
  {
    as: 'div',
  },
)
</script>

<style scoped>
.card {
  background: #fff;
  box-shadow:
    0 2px 6px rgba(0, 0, 0, 0.08),
    0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}
</style>
