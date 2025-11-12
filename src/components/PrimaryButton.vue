<template>
  <button 
    :class="['primary', { 'loading': loading }]" 
    :disabled="disabled || loading"
    @click="$emit('click')"
  >
    <HeroIcon v-if="loading" icon="arrow-path" size="sm" class="loading-spinner" />
    <HeroIcon v-else-if="icon" :icon="icon" :size="iconSize" />
    <span>{{ loading ? loadingText : text }}</span>
  </button>
</template>

<script>
import HeroIcon from './HeroIcon.vue'

export default {
  name: 'PrimaryButton',
  components: { HeroIcon },
  props: {
    text: { type: String, default: 'Button' },
    icon: { type: String, default: null },
    iconSize: { type: String, default: 'sm' },
    loading: { type: Boolean, default: false },
    loadingText: { type: String, default: 'Loading...' },
    disabled: { type: Boolean, default: false }
  },
  emits: ['click']
}
</script>