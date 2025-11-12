<template>
  <div class="sidebar">
    <div class="p-6">
      <!-- Logo -->
      <div class="mb-8 text-center">
        <h1 class="judul text-2xl text-red-700">ROSOQIN</h1>
        <p class="text-gray-600 text-sm mt-1">Ubah Barang Jadi Uang</p>
      </div>

      <!-- Menu Navigasi -->
      <nav class="space-y-2">
        <SidebarMenuItem
          v-for="item in menuItems"
          :key="item.name"
          :item="item"
          :is-active="isActive(item.routeName)"
          @click="navigateTo(item.routeName)"
        />
      </nav>

      <!-- Quick Stats -->
      <QuickStats 
        :stats="quickStats"
        class="mt-8"
      />
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import SidebarMenuItem from './SidebarMenuItem.vue'
import QuickStats from '@/components/ui/QuickStats.vue'

export default {
  name: 'UserSidebar',
  components: {
    SidebarMenuItem,
    QuickStats
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const userStore = useUserStore()

    const menuItems = [
      { name: 'Dashboard', icon: 'fas fa-tachometer-alt', routeName: 'user-dashboard' },
      { name: 'Produk Saya', icon: 'fas fa-box', routeName: 'my-products' },
      { name: 'Tambah Produk', icon: 'fas fa-plus-circle', routeName: 'add-product' },
      { name: 'Komentar Saya', icon: 'fas fa-comments', routeName: 'my-comments' },
      { name: 'Statistik', icon: 'fas fa-chart-bar', routeName: 'statistics' },
      { name: 'Transaksi', icon: 'fas fa-exchange-alt', routeName: 'transactions' },
      { name: 'Pengaturan', icon: 'fas fa-cog', routeName: 'settings' }
    ]

    const quickStats = computed(() => [
      { label: 'Produk Aktif:', value: userStore.quickStats.activeProducts },
      { label: 'Komentar:', value: userStore.quickStats.comments },
      { label: 'Penjualan:', value: userStore.quickStats.sales }
    ])

    const isActive = (routeName) => {
      return route.name === routeName
    }

    const navigateTo = (routeName) => {
      router.push({ name: routeName })
    }

    return {
      menuItems,
      quickStats,
      isActive,
      navigateTo
    }
  }
}
</script>