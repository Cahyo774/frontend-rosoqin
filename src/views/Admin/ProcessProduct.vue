<template>
  <div class="process-product-container">
    <div class="page-header">
      <h1>Proses Produk</h1>
      <p>Verifikasi dan tentukan harga rosokan</p>
    </div>

    <div v-if="loading" class="loading">Memuat data produk...</div>
    
    <div v-else-if="product" class="process-content">
      <!-- Informasi Produk -->
      <div class="product-info">
        <h2>{{ product.title }}</h2>
        <div class="product-details">
          <div class="product-image">
            <img :src="product.photo_url" :alt="product.title" />
          </div>
          <div class="product-meta">
            <p><strong>Deskripsi:</strong> {{ product.description }}</p>
            <p><strong>Jenis:</strong> {{ product.category?.name }}</p>
            <p><strong>Lokasi:</strong> {{ product.address }}</p>
            <p><strong>Pemilik:</strong> {{ product.user?.name }}</p>
          </div>
        </div>
      </div>

      <!-- Form Verifikasi Admin -->
      <form @submit.prevent="processProduct" class="process-form">
        <div class="form-section">
          <h3>Verifikasi dan Penilaian</h3>
          
          <div class="inp">
            <label for="weight">Berat (kg) *</label>
            <input 
              v-model="processData.weight" 
              type="number" 
              id="weight" 
              step="0.1"
              min="0.1"
              placeholder="Masukkan berat dalam kg"
              required
            />
          </div>

          <div class="inp">
            <label for="price">Harga per kg (Rp) *</label>
            <input 
              v-model="processData.price_per_kg" 
              type="number" 
              id="price" 
              min="100"
              placeholder="Masukkan harga per kg"
              required
            />
          </div>

          <div class="calculation">
            <div class="calc-item">
              <span>Berat:</span>
              <span>{{ processData.weight || 0 }} kg</span>
            </div>
            <div class="calc-item">
              <span>Harga per kg:</span>
              <span>Rp {{ formatPrice(processData.price_per_kg || 0) }}</span>
            </div>
            <div class="calc-item total">
              <span><strong>Total Harga:</strong></span>
              <span><strong>Rp {{ calculateTotalPrice() }}</strong></span>
            </div>
          </div>

          <div class="inp">
            <label for="admin_notes">Catatan Admin</label>
            <textarea 
              v-model="processData.admin_notes" 
              id="admin_notes" 
              rows="3"
              placeholder="Berikan catatan untuk user (opsional)"
            ></textarea>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn second" @click="goBack">
            Kembali
          </button>
          <button type="submit" class="btn primary" :disabled="processing">
            <HeroIcon v-if="processing" icon="info" size="sm" />
            {{ processing ? 'Memproses...' : 'Selesaikan Proses' }}
          </button>
        </div>
      </form>
    </div>

    <div v-else class="error-state">
      <p>Produk tidak ditemukan</p>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import api from '../../../service/api'
import HeroIcon from '../../../components/HeroIcon.vue'

export default {
  name: 'ProcessProduct',
  components: {
    HeroIcon
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const toast = useToast()
    
    const loading = ref(true)
    const processing = ref(false)
    const product = ref(null)

    const processData = reactive({
      weight: null,
      price_per_kg: null,
      admin_notes: '',
      status: 'processed'
    })

    const fetchProduct = async () => {
      try {
        const response = await api.get(`/produks/${route.params.id}`)
        product.value = response.data
      } catch (error) {
        console.error('Error fetching product:', error)
        toast.error('Gagal memuat data produk')
      } finally {
        loading.value = false
      }
    }

    const calculateTotalPrice = () => {
      if (!processData.weight || !processData.price_per_kg) return '0'
      const total = processData.weight * processData.price_per_kg
      return formatPrice(total)
    }

    const processProduct = async () => {
      try {
        processing.value = true

        const response = await api.put(`/admin/produks/${route.params.id}/process`, processData)

        toast.success('Produk berhasil diproses!')
        router.push('/admin/pending-products')
      } catch (error) {
        console.error('Error processing product:', error)
        toast.error('Gagal memproses produk')
      } finally {
        processing.value = false
      }
    }

    const goBack = () => {
      router.push('/admin/pending-products')
    }

    const formatPrice = (price) => {
      if (!price) return '0'
      return new Intl.NumberFormat('id-ID').format(price)
    }

    onMounted(() => {
      fetchProduct()
    })

    return {
      loading,
      processing,
      product,
      processData,
      calculateTotalPrice,
      processProduct,
      goBack,
      formatPrice
    }
  }
}
</script>

<style scoped>
.process-product-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2vh;
}

.page-header {
  margin-bottom: 3vh;
}

.page-header h1 {
  color: #333;
  margin-bottom: 1vh;
}

.page-header p {
  color: #666;
}

/* Product Info */
.product-info {
  background: white;
  border: 0.5px solid #bbbbbb;
  border-radius: 4vh;
  padding: 2vh;
  margin-bottom: 3vh;
}

.product-details {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 2rem;
}

.product-image img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 2vh;
  border: 1px solid #bbbbbb;
}

.product-meta p {
  margin-bottom: 1vh;
  color: #333;
}

/* Process Form */
.process-form {
  background: white;
  border: 0.5px solid #bbbbbb;
  border-radius: 4vh;
  padding: 2vh;
}

.form-section {
  margin-bottom: 2vh;
}

.form-section h3 {
  color: #333;
  margin-bottom: 2vh;
  border-bottom: 1px solid #eee;
  padding-bottom: 1vh;
}

/* Calculation */
.calculation {
  background: #f9f9f9;
  border-radius: 2vh;
  padding: 2vh;
  margin: 2vh 0;
}

.calc-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1vh;
}

.calc-item.total {
  border-top: 1px solid #ddd;
  padding-top: 1vh;
  margin-top: 1vh;
}

/* Form Inputs */
.inp {
  display: flex;
  flex-direction: column;
  margin-bottom: 2vh;
}

.inp label {
  margin-bottom: 0.5vh;
  color: #333;
  font-weight: 500;
}

.inp input,
.inp textarea {
  background-color: white;
  padding: 1vh 2vh;
  border: 1px solid #bbbbbb;
  border-radius: 5vh;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.inp textarea {
  border-radius: 2vh;
  resize: vertical;
  min-height: 80px;
}

.inp input:focus,
.inp textarea:focus {
  border-color: #757575;
  outline: none;
}

/* Form Actions */
.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 3vh;
  padding-top: 2vh;
  border-top: 1px solid #eee;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1vh 3vh;
  border: 1px solid;
  border-radius: 5vh;
  text-decoration: none;
  text-align: center;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
  background: none;
  font-family: inherit;
  font-size: inherit;
}

.primary {
  background-color: #D00C1C;
  border-color: #910d18;
  color: white;
}

.primary:hover:not(:disabled) {
  background-color: #ad0c1a;
}

.primary:disabled {
  background-color: #cccccc;
  border-color: #999;
  cursor: not-allowed;
}

.second {
  background-color: #ffffff;
  border-color: #bbbbbb;
  color: black;
}

.second:hover {
  background-color: #dddddd;
}

.loading, .error-state {
  text-align: center;
  padding: 4rem;
  color: #666;
}

@media (max-width: 768px) {
  .product-details {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .product-image img {
    height: 200px;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>