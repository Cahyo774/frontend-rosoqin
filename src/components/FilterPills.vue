<template>
  <div class="product-filters">
    <button 
      v-for="filter in filters" 
      :key="filter.value"
      :class="['filter-btn', { active: activeFilter === filter.value }]"
      @click="$emit('filter-change', filter.value)"
    >
      {{ filter.label }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'FilterPills',
  props: {
    filters: {
      type: Array,
      default: () => [],
      validator: (filters) => filters.every(filter => 
        filter && typeof filter.value === 'string' && typeof filter.label === 'string'
      )
    },
    activeFilter: {
      type: String,
      default: ''
    }
  },
  emits: ['filter-change']
}
</script>