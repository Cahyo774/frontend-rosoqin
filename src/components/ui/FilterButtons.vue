<template>
  <div class="flex space-x-2">
    <button
      v-for="filter in filters"
      :key="filter.value"
      class="py-1 px-3 rounded text-sm transition-colors"
      :class="getFilterClasses(filter.value)"
      @click="$emit('filter-change', filter.value)"
    >
      {{ filter.label }}
    </button>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'FilterButtons',
  props: {
    filters: {
      type: Array,
      required: true,
      validator: (filters) => {
        return filters.every(filter => 
          filter.value && filter.label
        )
      }
    },
    activeFilter: {
      type: String,
      default: 'all'
    },
    type: {
      type: String,
      default: 'default' // 'default' or 'comment'
    }
  },
  emits: ['filter-change'],
  setup(props) {
    const getFilterClasses = (filterValue) => {
      const isActive = props.activeFilter === filterValue
      
      if (props.type === 'comment') {
        return {
          'active-filter': isActive,
          'bg-gray-200 hover:bg-gray-300': !isActive
        }
      }
      
      // Default filter styling
      return {
        'active-filter': isActive,
        'bg-gray-200 hover:bg-gray-300': !isActive
      }
    }

    return {
      getFilterClasses
    }
  }
}
</script>

<style scoped>
.active-filter {
  background-color: var(--merah);
  color: var(--putih);
}
</style>