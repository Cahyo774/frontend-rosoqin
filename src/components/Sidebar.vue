<template>
  <div class="sidebar">
    <!-- Logo -->
    <div class="logo">
      <img src="../assets/R.svg" alt="Logo" class="logo-image" />
    </div>

    <!-- Navigation Menu -->
    <nav class="sidebar-nav">
      <ul>
        <li v-for="item in menuItems" :key="item.name">
          <router-link 
            :to="item.path" 
            class="nav-link"
            :class="{ 'active': isActiveRoute(item.path) }"
            :title="item.name"
          >
            <span class="nav-icon">
              <HeroIcon :icon="item.icon" size="xl" />
            </span>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- User Profile Section -->
    <div class="sidebar-footer">
      <button 
        @click="logout" 
        class="logout-btn"
        title="Logout"
      >
        <HeroIcon icon="logout" size="xl" />
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import HeroIcon from './HeroIcon.vue'

export default {
  name: 'Sidebar',
  components: {
    HeroIcon
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const toast = useToast()

    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const userRole = user.role || 'user'

    const menuItems = computed(() => {
      const baseMenu = [
        { name: 'Home', path: '/home', icon: 'home' }
      ]

      if (userRole === 'admin') {
        return [
          ...baseMenu,
          { name: 'Manajemen Produk', path: '/admin/products', icon: 'shopping-bag' },
          { name: 'Kelola User', path: '/admin/users', icon: 'user' },
          { name: 'Kelola Komentar', path: '/admin/comments', icon: 'chat-bubble' }, 
          { name: 'Statistik', path: '/admin/stats', icon: 'chart-bar' }
        ]
      } else {
        return [
          ...baseMenu,
          { name: 'Dashboard Saya', path: '/user-dashboard', icon: 'chart-bar' }
        ]
      }
    })

    const isActiveRoute = (path) => {
      if (path === '/home') {
        return route.path === '/home'
      }
      return route.path.startsWith(path)
    }

    const logout = () => {
      if (!confirm('Yakin ingin keluar?')) return
      
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      toast.success('Logout berhasil')
      router.push('/')
    }

    return {
      menuItems,
      userRole,
      isActiveRoute,
      logout
    }
  }
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 95%;
  width: 100px;
  background-color: white;
  border: 2px solid #bbbbbb;
  border-radius: 20px;
  padding: 2vh;
  margin: 2vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;
  z-index: 1000;
  gap: 2vh;
}

.logo {
  width: 100%;
  display: flex;
  justify-content: center;
  padding-bottom: 1vh;
  border-bottom: 1px solid #d4c4b0;
}

.logo-image {
  width: 50px;
  height: 50px;
}

.sidebar-nav {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2vh;
  align-items: center;
}

.sidebar-nav li {
  width: 100%;
  display: flex;
  justify-content: center;
}

.nav-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  background-color: transparent;
}

/* PERBAIKAN: Pastikan warna icon konsisten */
.nav-link {
  color: #D00C1C; /* Warna untuk state normal */
}

.nav-link:hover {
  background-color: rgba(208, 12, 28, 0.1);
  border-color: #D00C1C;
  color: #D00C1C; /* Pastikan warna tetap sama saat hover */
}

.nav-link.active {
  /* background-color: #d0ac0c1f; */
  border-color: #D00C1C;
  color: #D00C1C; /* Warna icon berubah putih saat active */
}

/* PERBAIKAN: Pastikan icon SVG mewarisi warna dengan benar */
.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

/* PERBAIKAN: Force SVG untuk mewarisi warna dari parent */
.nav-icon :deep(svg) {
  color: inherit !important;
  stroke: currentColor !important;
  fill: none !important;
}

.nav-link.active .nav-icon :deep(svg) {
  color: inherit !important;
  stroke: currentColor !important;
}

.sidebar-footer {
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 1vh;
  border-top: 1px solid #d4c4b0;
}

.logout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background-color: transparent;
  border: 2px solid transparent;
  border-radius: 12px;
  color: #D00C1C;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.logout-btn:hover {
  background-color: rgba(208, 12, 28, 0.1);
  border-color: #D00C1C;
}

/* PERBAIKAN: Force SVG di logout button juga */
.logout-btn :deep(svg) {
  color: inherit !important;
  stroke: currentColor !important;
  fill: none !important;
}

/* Scrollbar Styling */
.sidebar-nav::-webkit-scrollbar {
  width: 4px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: #d4c4b0;
  border-radius: 2px;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: #b8a89a;
}

@media (max-width: 768px) {
  .sidebar {
    width: 100px;
    height: auto;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    top: auto;
    border-radius: 20px 20px 0 0;
    margin: 0;
    flex-direction: row;
    padding: 1vh 2vh;
  }

  .logo {
    display: none;
  }

  .sidebar-nav ul {
    flex-direction: row;
    gap: 1vh;
  }

  .sidebar-footer {
    border-top: none;
    border-left: 1px solid #d4c4b0;
    padding-left: 1vh;
    padding-top: 0;
  }
}
</style>