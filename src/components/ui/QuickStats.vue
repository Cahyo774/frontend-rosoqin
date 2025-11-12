<template>
  <div class="card p-4 rounded-lg">
    <h3 class="font-bold mb-3">{{ title }}</h3>
    <div class="space-y-2 text-sm">
      <div 
        v-for="stat in stats" 
        :key="stat.label"
        class="flex justify-between items-center"
      >
        <span>{{ stat.label }}</span>
        <span class="font-bold">{{ stat.value }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuickStats',
  props: {
    stats: {
      type: Array,
      required: true,
      validator: (stats) => {
        return stats.every(stat => 
          stat.label && stat.value !== undefined
        )
      }
    },
    title: {
      type: String,
      default: 'Statistik Cepat'
    }
  }
}
</script>