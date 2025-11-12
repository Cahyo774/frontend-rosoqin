<template>
  <nav class="breadcrumb">
    <template v-for="(item, index) in items" :key="item.name">
      <router-link 
        v-if="item.to" 
        :to="item.to" 
        class="breadcrumb-item"
      >
        <HeroIcon v-if="item.icon" :icon="item.icon" size="sm" />
        <span>{{ item.name }}</span>
      </router-link>
      <span v-else class="breadcrumb-item current">
        {{ item.name }}
      </span>
      
      <HeroIcon 
        v-if="index < items.length - 1" 
        icon="chevron-right" 
        size="xs" 
        color="secondary" 
      />
    </template>
  </nav>
</template>

<script>
import HeroIcon from './HeroIcon.vue'

export default {
  name: 'Breadcrumb',
  components: { HeroIcon },
  props: {
    items: {
      type: Array,
      default: () => [],
      validator: (items) => items.every(item => 
        item && typeof item.name === 'string' && 
        (item.to === undefined || typeof item.to === 'string')
      )
    }
  }
}
</script>