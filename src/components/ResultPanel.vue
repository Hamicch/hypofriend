<template>
  <Card>
    <div class="flex flex-col gap-2">
      <p class="text-base">{{ title }}</p>
      <EmptyState v-if="!calculatedValue">
        Fill the form to get the result
      </EmptyState>
      <p class="text-3xl font-bold" v-else>
        {{ calculatedValue }}
      </p>
    </div>
  </Card>
</template>

<script setup lang="ts">
import Card from '@/components/ui/card/Card.vue'
import EmptyState from '@/components/EmptyState.vue'

interface ResultPanelProps {
  title: string
  calculatedValue: string
}

defineProps<ResultPanelProps>()
</script>
