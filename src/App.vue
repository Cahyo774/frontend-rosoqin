<template>
  <div id="app">
    <!-- Tidak tampilkan sidebar di halaman auth -->
    <template v-if="showAuthPages">
      <router-view />
    </template>
    
    <!-- Tampilkan layout dengan sidebar untuk halaman yang membutuhkan auth -->
    <template v-else>
      <div class="app-layout">
        <Sidebar />
        <main class="main-content">
          <router-view />
        </main>
      </div>
    </template>
  </div>
</template>

<script>
import Sidebar from "./components/Sidebar.vue";
import { computed } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: "App",
  components: {
    Sidebar,
  },
  setup() {
    const route = useRoute()
    
    const showAuthPages = computed(() => {
      const authRoutes = ['Welcome', 'Login', 'Register']
      return authRoutes.includes(route.name)
    })

    return {
      showAuthPages
    }
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-layout {
  width: 100%;
  /* display: flex; */
  /* min-height: 100vh; */
}

.main-content {
  flex: 1;
  /* margin-left: 280px; */
  padding: 2vh;
  /* background-color: #f8f9fa; */
  min-height: 100vh;
  transition: margin-left 0.3s ease;
}

.sidebar-collapsed ~ .main-content {
  margin-left: 80px;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    width: 100%;
  }
}
</style>