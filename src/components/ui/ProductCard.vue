<template>
  <div class="border border-gray-300 rounded-lg p-4 card">
    <div class="flex flex-col md:flex-row md:items-center justify-between">
      <div class="flex items-center space-x-4 mb-3 md:mb-0">
        <!-- Product Image -->
        <div class="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
          <template v-if="product.photo">
            <img :src="product.photo" :alt="product.title" class="w-full h-full object-cover rounded-lg">
          </template>
          <template v-else>
            <i class="fas fa-image text-gray-400"></i>
          </template>
        </div>
        
        <!-- Product Info -->
        <div>
          <h3 class="font-bold">{{ product.title }}</h3>
          <p class="text-gray-600 text-sm">{{ product.address }}</p>
          <p class="text-gray-600 text-sm">{{ truncateDescription(product.description) }}</p>
          <button 
            v-if="showViewMore" 
            class="text-green-600 hover:text-green-800 text-sm mt-1"
            @click="$emit('view-more')"
          >
            Lihat selengkapnya
          </button>
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div class="flex space-x-2" v-if="showActions">
        <button 
          class="text-blue-600 hover:text-blue-800 text-sm"
          @click="$emit('edit')"
        >
          <i class="fas fa-edit"></i> Edit
        </button>
        <button 
          class="text-red-600 hover:text-red-800 text-sm"
          @click="$emit('delete')"
        >
          <i class="fas fa-trash"></i> Hapus
        </button>
      </div>
      
      <!-- Status Badge -->
      <div v-if="showStatus" class="mt-2 md:mt-0">
        <span 
          class="text-xs py-1 px-2 rounded"
          :class="statusClasses"
        >
          {{ statusText }}
        </span>
      </div>
    </div>
    
    <!-- Additional Info -->
    <div v-if="showPrice" class="mt-3 flex justify-between items-center">
      <span class="font-bold text-lg">Rp {{ formatPrice(product.price) }}</span>
      <span class="text-sm text-gray-500">{{ product.category }}</span>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true
    },
    showActions: {
      type: Boolean,
      default: true
    },
    showStatus: {
      type: Boolean,
      default: false
    },
    showPrice: {
      type: Boolean,
      default: false
    },
    showViewMore: {
      type: Boolean,
      default: false
    }
  },
  emits: ['edit', 'delete', 'view-more'],
  setup(props) {
    const statusClasses = computed(() => {
      const status = props.product.status
      return {
        'bg-green-100 text-green-800': status === 'active',
        'bg-yellow-100 text-yellow-800': status === 'pending',
        'bg-red-100 text-red-800': status === 'rejected',
        'bg-gray-100 text-gray-800': status === 'inactive'
      }
    })

    const statusText = computed(() => {
      const statusMap = {
        'active': 'Aktif',
        'pending': 'Menunggu',
        'rejected': 'Ditolak',
        'inactive': 'Nonaktif'
      }
      return statusMap[props.product.status] || props.product.status
    })

    const truncateDescription = (description) => {
      if (!description) return ''
      return description.length > 50 ? description.substring(0, 50) + '...' : description
    }

    const formatPrice = (price) => {
      return new Intl.NumberFormat('id-ID').format(price)
    }

    return {
      statusClasses,
      statusText,
      truncateDescription,
      formatPrice
    }
  }
}
</script>