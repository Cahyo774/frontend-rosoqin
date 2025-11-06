<template>
  <component 
    :is="iconComponent" 
    :class="customClass"
    :style="iconStyles"
  />
</template>

<script>
import { computed } from 'vue'

// Import semua icon yang dibutuhkan dari @heroicons/vue
import {
  // Outline Icons
  HomeIcon,
  UserIcon,
  ShoppingBagIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  MapPinIcon, 
  
  HomeIcon as HomeIconSolid,
  UserIcon as UserIconSolid,
  ShoppingBagIcon as ShoppingBagIconSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  PlusIcon as PlusIconSolid,
  PencilIcon as PencilIconSolid,
  TrashIcon as TrashIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
} from '@heroicons/vue/24/outline'

export default {
  name: 'HeroIcon',
  props: {
    icon: {
      type: String,
      required: true,
      validator: (value) => [
        // Outline Icons
        'home', 'user', 'shopping-bag', 'chat-bubble', 'chart-bar',
        'plus', 'pencil', 'trash', 'cog', 'logout', 'eye', 'check',
        'x-mark', 'search', 'chevron-left', 'chevron-right', 'warning',
        'info', 'map',
        
        // Solid Icons
        'home-solid', 'user-solid', 'shopping-bag-solid', 'chat-bubble-solid',
        'chart-bar-solid', 'plus-solid', 'pencil-solid', 'trash-solid', 'cog-solid'
      ].includes(value)
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
    },
    color: {
      type: String,
      default: 'currentColor'
    },
    customClass: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const iconMap = {
      // Outline Icons
      'home': HomeIcon,
      'user': UserIcon,
      'shopping-bag': ShoppingBagIcon,
      'chat-bubble': ChatBubbleLeftRightIcon,
      'chart-bar': ChartBarIcon,
      'plus': PlusIcon,
      'pencil': PencilIcon,
      'trash': TrashIcon,
      'cog': Cog6ToothIcon,
      'logout': ArrowRightOnRectangleIcon,
      'eye': EyeIcon,
      'check': CheckIcon,
      'x-mark': XMarkIcon,
      'search': MagnifyingGlassIcon,
      'chevron-left': ChevronLeftIcon,
      'chevron-right': ChevronRightIcon,
      'warning': ExclamationTriangleIcon,
      'info': InformationCircleIcon,
      'map': MapPinIcon,
      
      // Solid Icons
      'home-solid': HomeIconSolid,
      'user-solid': UserIconSolid,
      'shopping-bag-solid': ShoppingBagIconSolid,
      'chat-bubble-solid': ChatBubbleLeftRightIconSolid,
      'chart-bar-solid': ChartBarIconSolid,
      'plus-solid': PlusIconSolid,
      'pencil-solid': PencilIconSolid,
      'trash-solid': TrashIconSolid,
      'cog-solid': Cog6ToothIconSolid,
    }

    const sizeMap = {
      xs: { width: '12px', height: '12px' },
      sm: { width: '16px', height: '16px' },
      md: { width: '20px', height: '20px' },
      lg: { width: '24px', height: '24px' },
      xl: { width: '32px', height: '32px' }
    }

    const colorMap = {
      current: 'currentColor',
      primary: '#D00C1C',
      secondary: '#666666',
      success: '#2e7d32',
      warning: '#ef6c00',
      error: '#c62828',
      white: '#ffffff',
      black: '#000000'
    }

    const iconComponent = computed(() => iconMap[props.icon])

    const iconStyles = computed(() => {
      const sizeStyle = sizeMap[props.size] || sizeMap.md
      const colorValue = colorMap[props.color] || props.color
      
      return {
        ...sizeStyle,
        color: colorValue,
        display: 'inline-block',
        flexShrink: 0
      }
    })

    return {
      iconComponent,
      iconStyles
    }
  }
}
</script>