<template>
  <div class="container">
    <h1 class="judol">Daftar <span>Produk</span></h1>
    
    <div class="card">
      <div class="card-header">
        <h2>Manajemen Produk</h2>
        <router-link to="/produk/tambah" class="btn primary">
          + Tambah Produk
        </router-link>
      </div>

      <div class="table-container">
        <table class="produk-table">
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
              <td class="photo-cell">
                <img 
                  :src="p.photo_url" 
                  :alt="p.title" 
                  class="produk-photo"
                  v-if="p.photo_url" 
                />
                <span v-else class="no-photo">No Image</span>
              </td>
              <td>
                <router-link :to="`/produk/${p.id}`" class="produk-link">
                  {{ p.title }}
                </router-link>
              </td>
              <td class="description">{{ truncateDescription(p.description) }}</td>
              <td class="price">Rp {{ formatPrice(p.price) }}</td>
              <td>
                <span :class="`status status-${p.status.toLowerCase()}`">
                  {{ p.status }}
                </span>
              </td>
              <td class="actions">
                <router-link 
                  :to="`/produk/edit/${p.id}`" 
                  class="btn outline small"
                >
                  Edit
                </router-link>
                <button 
                  @click="hapusProduk(p.id)" 
                  class="btn danger small"
                  :disabled="loading"
                >
                  {{ loading ? 'Menghapus...' : 'Hapus' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div v-if="produks.length === 0" class="empty-state">
          <p>Belum ada produk. Silakan tambah produk baru.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../service/api.js"
import { useToast } from 'vue-toastification'

export default {
  name: "ProdukList",
  setup() {
    const toast = useToast()
    return { toast }
  },
  data() {
    return { 
      produks: [],
      loading: false
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async loadData() {
      try {
        this.loading = true
        const res = await api.get("/produks")
        this.produks = res.data.map(p => ({
          ...p,
          photo_url: p.photo ? `http://127.0.0.1:8000/storage/${p.photo}` : null,
        }))
      } catch (err) {
        console.error(err)
        this.toast.error('Gagal memuat data produk', { timeout: 2500 })
      } finally {
        this.loading = false
      }
    },
    
    async hapusProduk(id) {
      if (!confirm("Yakin ingin menghapus produk ini?")) return
      
      try {
        this.loading = true
        await api.delete(`/produks/${id}`)
        this.toast.success('Produk berhasil dihapus', { timeout: 2500 })
        this.loadData()
      } catch (err) {
        console.error(err)
        this.toast.error('Gagal menghapus produk', { timeout: 2500 })
      } finally {
        this.loading = false
      }
    },
    
    truncateDescription(description) {
      if (!description) return '-'
      const maxLength = 50
      return description.length > maxLength 
        ? `${description.substring(0, maxLength)}...` 
        : description
    },
    
    formatPrice(price) {
      return new Intl.NumberFormat('id-ID').format(price)
    }
  },
}
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
}

.container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    padding: 5vh;
    min-height: 80vh;
}

.judol {
    font-size: 1.75rem;
    color: #D00C1C;
    font-weight: lighter;
    margin-bottom: 2vh;
}

.judol span {
    color: #333;
}

.card {
    width: 90%;
    max-width: 1200px;
    text-align: start;
    border: 0.5px solid #bbbbbb;
    border-radius: 4vh;
    padding: 3vh;
    transition: all 0.3s ease;
}

.card:hover {
    box-shadow: 0 10px 0px #bbbbbb56;
    transform: translateY(-5px);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2vh;
    padding-bottom: 1vh;
    border-bottom: 1px solid #eeeeee;
}

.card-header h2 {
    color: #333;
    margin: 0;
}

.table-container {
    overflow-x: auto;
    border-radius: 2vh;
}

.produk-table {
    width: 100%;
    border-collapse: collapse;
    background-color: white;
}

.produk-table th,
.produk-table td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
}

.produk-table th {
    background-color: #f5f5f5;
    font-weight: 600;
    color: #555;
    border-top: 1px solid #e0e0e0;
}

.photo-cell {
    text-align: center;
    width: 100px;
}

.produk-photo {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 2vh;
    border: 1px solid #bbbbbb;
}

.no-photo {
    color: #999;
    font-style: italic;
    font-size: 0.9rem;
}

.produk-link {
    color: #D00C1C;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
}

.produk-link:hover {
    color: #ad0c1a;
    text-decoration: underline;
}

.description {
    max-width: 200px;
    color: #555;
}

.price {
    font-weight: 600;
    color: #2e7d32;
}

.actions {
    display: flex;
    gap: 0.5rem;
}

.status {
    padding: 4px 12px;
    border-radius: 5vh;
    font-size: 0.8rem;
    font-weight: 500;
    text-transform: capitalize;
}

.status-aktif {
    background-color: #e8f5e9;
    color: #2e7d32;
}

.status-nonaktif {
    background-color: #ffebee;
    color: #c62828;
}

.status-draft {
    background-color: #fff3e0;
    color: #ef6c00;
}

.btn {
    display: inline-block;
    text-decoration: none;
    text-align: center;
    padding: 1vh 2vh;
    border: 1px solid;
    cursor: pointer;
    border-radius: 5vh;
    transition: all 0.3s ease;
    font-size: 0.9rem;
    font-weight: 500;
}

.primary {
    background-color: #D00C1C;
    border-color: #910d18;
    color: white;
}

.primary:hover {
    background-color: #ad0c1a;
}

.outline {
    background-color: #ffffff;
    border-color: #bbbbbb;
    color: #333;
}

.outline:hover {
    background-color: #dddddd;
}

.danger {
    background-color: #d32f2f;
    border-color: #c62828;
    color: white;
}

.danger:hover {
    background-color: #c62828;
}

.danger:disabled {
    background-color: #ffcdd2;
    border-color: #ef9a9a;
    cursor: not-allowed;
}

.small {
    padding: 0.8vh 1.5vh;
    font-size: 0.8rem;
}

.empty-state {
    text-align: center;
    padding: 4vh;
    color: #666;
}

.empty-state p {
    margin: 0;
    font-style: italic;
}

/* Responsive design */
@media (max-width: 768px) {
    .container {
        padding: 2vh;
    }
    
    .card {
        width: 95%;
        padding: 2vh;
    }
    
    .card-header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
    }
    
    .produk-table th,
    .produk-table td {
        padding: 8px 10px;
        font-size: 0.9rem;
    }
    
    .actions {
        flex-direction: column;
    }
    
    .description {
        max-width: 150px;
    }
}

@media (max-width: 480px) {
    .produk-table {
        font-size: 0.8rem;
    }
    
    .produk-photo {
        width: 60px;
        height: 60px;
    }
    
    .btn {
        padding: 0.8vh 1.5vh;
        font-size: 0.8rem;
    }
}
</style>