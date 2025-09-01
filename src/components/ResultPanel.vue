<template>
  <Card>
    <div class=" flex flex-col gap-2 p-4 sm:p-5">
      <p class="text-base">{{ title }}</p>
      <p class="text-3xl font-bold">
        {{calculatedValue }}
      </p>
    </div>
  </Card>
</template>

<script setup lang="ts">
import Card from '@/components/Card.vue'

interface ResultPanelProps {
  title: string
  calculatedValue: string
}

defineProps<ResultPanelProps>()
</script>
