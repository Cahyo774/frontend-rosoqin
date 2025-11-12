<template>
  <div :class="['status-badge', `status-${type}`]">
    <HeroIcon :icon="statusIcon" size="xs" />
    <span>{{ text }}</span>
  </div>
</template>

<script>
import HeroIcon from './HeroIcon.vue'

export default {
  name: 'StatusBadge',
  components: { HeroIcon },
  props: {
    type: {
      type: String,
      default: 'available',
      validator: (value) => [
        'available', 'unavailable', 'pending', 'processed', 'completed',
        'approved', 'rejected', 'positive', 'negative', 'neutral'
      ].includes(value)
    },
    text: { type: String, default: '' }
  },
  computed: {
    statusIcon() {
      const iconMap = {
        available: 'check',
        unavailable: 'x-mark',
        pending: 'information-circle',
        processed: 'clock',
        completed: 'check-circle',
        approved: 'check',
        rejected: 'x-mark',
        positive: 'check',
        negative: 'x-mark',
        neutral: 'information-circle'
      }
      return iconMap[this.type] || 'information-circle'
    }
  }
}
</script>