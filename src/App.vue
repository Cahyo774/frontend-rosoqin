<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div class="container">
        <router-link to="/produk" class="navbar-brand">Manajemen Produk</router-link>
      </div>
    </nav>

    <router-view />
  </div>
</template>




<script>
import Produk from "./views/Produk.vue";

export default {
  name: "App",
  components: {
    Produk,
  },
};
</script>






<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
