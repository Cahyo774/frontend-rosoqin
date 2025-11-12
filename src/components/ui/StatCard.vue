<template>
  <div class="card p-4 rounded-lg text-center">
    <div class="mb-2" :class="iconColor">
      <i :class="iconClass" class="text-3xl"></i>
    </div>
    <p class="text-2xl font-bold">{{ value }}</p>
    <p class="text-gray-600">{{ label }}</p>
    
    <!-- Trend Indicator -->
    <div v-if="trend" class="mt-2 text-sm" :class="trendColor">
      <i :class="trendIcon"></i>
      <span>{{ trend }}%</span>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'StatCard',
  props: {
    value: {
      type: [String, Number],
      required: true
    },
    label: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: 'blue'
    },
    trend: {
      type: Number,
      default: null
    }
  },
  setup(props) {
    const iconColor = computed(() => {
      const colors = {
        green: 'text-green-600',
        yellow: 'text-yellow-500',
        blue: 'text-blue-500',
        red: 'text-red-600',
        purple: 'text-purple-600'
      }
      return colors[props.color] || colors.blue
    })

    const iconClass = computed(() => {
      const icons = {
        dashboard: 'fas fa-tachometer-alt',
        products: 'fas fa-box',
        eye: 'fas fa-eye',
        check: 'fas fa-check-circle',
        pause: 'fas fa-pause-circle',
        users: 'fas fa-users',
        comments: 'fas fa-comments',
        sales: 'fas fa-shopping-cart'
      }
      return icons[props.icon] || props.icon
    })

    const trendColor = computed(() => {
      if (!props.trend) return 'text-gray-500'
      return props.trend > 0 ? 'text-green-600' : 'text-red-600'
    })

    const trendIcon = computed(() => {
      if (!props.trend) return 'fas fa-minus'
      return props.trend > 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'
    })

    return {
      iconColor,
      iconClass,
      trendColor,
      trendIcon
    }
  }
}
</script>