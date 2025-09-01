<script setup lang="ts">
import Card from '@/components/Card.vue'
</script>

<template>
  <!-- Responsive layout: 1 column on small screens, 2 columns from lg up -->
  <main class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 border-2 border-blue-500">
    <div class="grid grid-cols-1 lg:grid-cols-6 gap-6 items-start">
      <!-- Left column: Calculator takes 2/3 on large screens -->
      <section aria-labelledby="calc-title" class="space-y-6 lg:col-span-6">
        <h2 id="calc-title" class="sr-only">Mortgage Calculator</h2>
        <Card>
          <div class="p-4 sm:p-6 min-h-24">
            <p class="text-xl font-semibold">Mortgage Calculator</p>
          </div>
        </Card>
      </section>

      <!-- Right column: Results stack (top to bottom) -->
      <section aria-labelledby="results-title" class="lg:col-span-6">
        <h2 id="results-title" class="sr-only">Results</h2>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full border-2 border-red-500">
          <!-- Row 1: Results -->
          <Card class="min-h-24">
            <div class="p-4 sm:p-6">
              <p class="text-xl font-semibold">Results</p>
            </div>
          </Card>

          <!-- Row 1: Summary -->
          <Card class="min-h-24">
            <div class="p-4 sm:p-6">
              <p class="text-xl font-semibold">Summary</p>
            </div>
          </Card>

          <!-- Row 2: Rate Table spans both columns on lg+ -->
          <Card class="min-h-24 lg:col-span-2">
            <div class="p-4 sm:p-6">
              <p class="text-xl font-semibold">Rate Table</p>
            </div>
          </Card>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped></style>
