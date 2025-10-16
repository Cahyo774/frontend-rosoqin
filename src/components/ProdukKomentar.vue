<template>
  <div class="komentar-container">
    <h3>Komentar</h3>

    <!-- Form Tambah Komentar -->
    <form @submit.prevent="tambahKomentar" class="komen-form">
      <textarea
        v-model="form.content"
        placeholder="Tulis komentar kamu..."
        required
      ></textarea>

      <select v-model="form.sentiment">
        <option value="positif">Positif</option>
        <option value="negatif">Negatif</option>
        <option value="netral">Netral</option>
      </select>

      <button type="submit">Kirim</button>
    </form>

    <!-- Daftar Komentar -->
    <div v-if="loading" class="loading">Memuat komentar...</div>

    <div v-else>
      <div v-if="komentar.length === 0" class="no-komens">
        Belum ada komentar.
      </div>

      <div v-for="komen in komentar" :key="komen.id" class="komen-item">
        <p class="komen-user">
          <strong>{{ komen.user?.nama || "Anonim" }}</strong> -
          <span class="sentiment">{{ komen.sentiment }}</span>
        </p>
        <p class="komen-content">{{ komen.content }}</p>
        <button @click="hapusKomentar(komen.id)" class="hapus-btn">
          Hapus
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import api from "../service/api.js";

const props = defineProps({
  productId: {
    type: Number,
    required: true,
  },
});

const komentar = ref([]);
const loading = ref(true);
const form = ref({
  content: "",
  sentiment: "netral",
});

const getKomentar = async () => {
  try {
    loading.value = true;
    const res = await api.get(`/produk/${props.productId}/komentar`);
    komentar.value = res.data;
  } catch (err) {
    console.error("❌ Gagal memuat komentar:", err);
  } finally {
    loading.value = false;
  }
};

const tambahKomentar = async () => {
  try {
    await api.post(`/produk/${props.productId}/komentar`, form.value);
    form.value.content = "";
    form.value.sentiment = "netral";
    await getKomentar();
  } catch (err) {
    console.error("❌ Gagal menambah komentar:", err);
  }
};

const hapusKomentar = async (id) => {
  if (!confirm("Yakin ingin menghapus komentar ini?")) return;
  try {
    await api.delete(`/komentar/${id}`);
    await getKomentar();
  } catch (err) {
    console.error("❌ Gagal menghapus komentar:", err);
  }
};

onMounted(() => {
  getKomentar();
});

// Kalau ID produk berubah (misal pindah halaman produk lain)
watch(() => props.productId, getKomentar);
</script>

<style scoped>
.komentar-container {
  margin-top: 20px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.komen-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.komen-form textarea {
  resize: none;
  min-height: 80px;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.komen-form select,
.komen-form button {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.komen-item {
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
}

.komen-user {
  font-weight: 500;
}

.sentiment {
  text-transform: capitalize;
  font-size: 0.9rem;
  color: #666;
}

.hapus-btn {
  background: #ff4d4d;
  color: white;
  border: none;
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.no-komens {
  color: #666;
}

.loading {
  color: #888;
  font-style: italic;
}
</style>
