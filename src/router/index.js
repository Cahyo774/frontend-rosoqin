import { createRouter, createWebHistory } from "vue-router";
import ProdukList from "../components/ProdukList.vue";
import ProdukForm from "../components/ProdukForm.vue";
import ProdukDetail from "../views/ProdukDetail.vue";

const routes = [
  { path: "/produk", component: ProdukList },
  { path: "/produk/tambah", component: ProdukForm },
  { path: "/produk/edit/:id", component: ProdukForm },
  { path: "/produk/:id", component: ProdukDetail }, // 🔥 ini baru
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
