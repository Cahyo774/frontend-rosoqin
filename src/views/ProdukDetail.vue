<template>
  <div class="container">
    <router-link to="/produk" class="back-btn">← Kembali</router-link>

    <div v-if="produk" class="produk-detail">
      <img :src="produk.photo_url" alt="foto" class="produk-foto" />
      <h2>{{ produk.title }}</h2>
      <p>{{ produk.description }}</p>
      <p><strong>Harga:</strong> Rp {{ produk.price }}</p>
      <p><strong>Status:</strong> {{ produk.status }}</p>
    </div>

    <!-- Komentar Produk -->
    <ProdukKomentar :productId="produk.id" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import api from "../service/api.js";
import ProdukKomentar from "../components/ProdukKomentar.vue";

const route = useRoute();
const produk = ref(null);

onMounted(async () => {
  const res = await api.get(`/produk/${route.params.id}`);
  produk.value = res.data;
});
</script>

<style scoped>
.container {
  padding: 20px;
}
.back-btn {
  display: inline-block;
  margin-bottom: 10px;
  color: #007bff;
  text-decoration: none;
}
.produk-detail {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  background: #fff;
}
.produk-foto {
  max-width: 200px;
  border-radius: 8px;
  margin-bottom: 10px;
}
</style>
