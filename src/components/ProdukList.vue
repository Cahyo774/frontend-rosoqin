<template>
  <div class="produk-list">
    <h2>Daftar Produk</h2>
    <router-link to="/produk/tambah" class="btn">+ Tambah Produk</router-link>

    <table>
      <thead>
        <tr>
          <th>Foto</th>
          <th>Judul</th>
          <th>Deskripsi</th>
          <th>Harga</th>
          <th>Status</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in produks" :key="p.id">
          <td>
            <img :src="p.photo_url" alt="foto" width="80" v-if="p.photo_url" />
          </td>
          <td>{{ p.title }}</td>
          <td>{{ p.description }}</td>
          <td>Rp {{ p.price }}</td>
          <td>{{ p.status }}</td>
          <td>
            <router-link :to="`/produk/edit/${p.id}`">Edit</router-link> |
            <button @click="hapusProduk(p.id)">Hapus</button>
          </td>
          <td>
  <router-link :to="`/produk/${produk.id}`">
    {{ produk.title }}
  </router-link>
</td>

        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import api from "../service/api.js";

export default {
  name: "ProdukList",
  data() {
    return { produks: [] };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      try {
        const res = await api.get("/produks");
        this.produks = res.data.map(p => ({
          ...p,
          photo_url: p.photo ? `http://127.0.0.1:8000/storage/${p.photo}` : null,
        }));
      } catch (err) {
        console.error(err);
      }
    },
    async hapusProduk(id) {
      if (!confirm("Yakin ingin hapus produk ini?")) return;
      await api.delete(`/produks/${id}`);
      this.loadData();
    },
  },
};
</script>
