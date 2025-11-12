<template>
  <button 
    :class="['btn', 'second', size]" 
    :disabled="disabled"
    @click="$emit('click')"
  >
    <HeroIcon v-if="icon" :icon="icon" :size="iconSize" />
    <span>{{ text }}</span>
  </button>
</template>

<script>
import HeroIcon from './HeroIcon.vue'

export default {
  name: 'SecondaryButton',
  components: { HeroIcon },
  props: {
    text: { type: String, default: 'Button' },
    icon: { type: String, default: null },
    iconSize: { type: String, default: 'sm' },
    size: { type: String, default: '' }, // 'small', 'text'
    disabled: { type: Boolean, default: false }
  },
  emits: ['click']
}
</script>