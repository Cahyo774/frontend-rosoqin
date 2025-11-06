<template>
  <div class="home-container">
    <div class="home-header">
      <h1>Beranda Rosoqin</h1>
      <p>Telusuri produk terbaik dari komunitas kami</p>
    </div>

    <div class="home-content">
      <!-- Filter Kategori -->
      <div class="filter-section">
        <select v-model="selectedCategory" class="category-filter">
          <option value="">Semua Kategori</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>

      <div class="main-layout">
        <!-- Feed Utama Produk -->
        <div class="products-feed">
          <h2>Produk Terbaru</h2>
          <div v-if="loadingProducts" class="loading">Memuat produk...</div>
          <div v-else class="products-grid">
            <ProductCard 
              v-for="product in filteredProducts" 
              :key="product.id" 
              :product="formatProductData(product)"
              :status="product.status"
              :show-actions="false"
              @detail="viewProductDetail"
            />
          </div>
          <div v-if="!loadingProducts && filteredProducts.length === 0" class="empty-state">
            <p>Tidak ada produk ditemukan</p>
          </div>
        </div>

        <!-- Highlight Testimoni -->
        <div class="testimonials-sidebar">
          <h2>Testimoni Positif</h2>
          <div v-if="loadingTestimonials" class="loading">Memuat testimoni...</div>
          <div v-else class="testimonials-list">
            <div v-for="testimonial in positiveTestimonials" :key="testimonial.id" class="testimonial-card">
              <div class="testimonial-content">
                <p>"{{ testimonial.comment }}"</p>
                <div class="testimonial-meta">
                  <span class="testimonial-author">{{ testimonial.user?.name || 'Anonymous' }}</span>
                  <span class="testimonial-product">Untuk: {{ testimonial.product?.title }}</span>
                </div>
                <span class="sentiment-badge positive">Positif</span>
              </div>
            </div>
          </div>
          <div v-if="!loadingTestimonials && positiveTestimonials.length === 0" class="empty-state">
            <p>Belum ada testimoni positif</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../service/api'
import { useToast } from 'vue-toastification'
import ProductCard from '../components/ProductCard.vue'

export default {
  name: 'HomePage',
  components: {
    ProductCard
  },
  setup() {
    const selectedCategory = ref('')
    const products = ref([])
    const testimonials = ref([])
    const categories = ref([])
    const loadingProducts = ref(false)
    const loadingTestimonials = ref(false)
    const router = useRouter()
    const toast = useToast()

    const fetchProducts = async () => {
      try {
        loadingProducts.value = true
        // Ganti endpoint dari '/products' ke '/produks'
        const response = await api.get('/produks')
        products.value = response.data.data || response.data
      } catch (error) {
        console.error('Error fetching products:', error)
        toast.error('Gagal memuat produk')
      } finally {
        loadingProducts.value = false
      }
    }

    const fetchTestimonials = async () => {
      try {
        loadingTestimonials.value = true
        // Sementara komentar karena endpoint comments mungkin belum ada
        // const response = await api.get('/comments?sentiment=positive')
        // testimonials.value = response.data.data || response.data
        
        // Mock data sementara
        testimonials.value = [
          {
            id: 1,
            comment: "Produk sangat berkualitas dan pengiriman cepat!",
            user: { name: "Budi Santoso" },
            product: { title: "Sampah Rosoq Premium" }
          },
          {
            id: 2,
            comment: "Pelayanan memuaskan, produk sesuai deskripsi",
            user: { name: "Sari Dewi" },
            product: { title: "Sampah Rosoq Standard" }
          }
        ]
      } catch (error) {
        console.error('Error fetching testimonials:', error)
        // toast.error('Gagal memuat testimoni')
      } finally {
        loadingTestimonials.value = false
      }
    }

    const fetchCategories = async () => {
      try {
        // Sementara mock categories karena endpoint mungkin belum ada
        // const response = await api.get('/categories')
        // categories.value = response.data.data || response.data
        
        categories.value = [
          { id: 1, name: "Elektronik" },
          { id: 2, name: "Fashion" },
          { id: 3, name: "Makanan" },
          { id: 4, name: "Otomotif" }
        ]
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    const formatProductData = (product) => {
      return {
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        status: product.status,
        image: product.photo_url, // Gunakan photo_url dari backend
        location: product.location || "Lokasi tidak tersedia",
        user: product.user || { name: "Unknown" }
      }
    }

    onMounted(() => {
      fetchProducts()
      fetchTestimonials()
      fetchCategories()
    })

    const filteredProducts = computed(() => {
      let filtered = products.value
      if (selectedCategory.value) {
        // Sementara filter berdasarkan nama kategori karena category_id mungkin belum ada
        filtered = filtered.filter(product => 
          product.title.toLowerCase().includes(selectedCategory.value.toLowerCase())
        )
      }
      return filtered
    })

    const positiveTestimonials = computed(() => {
      return testimonials.value.slice(0, 5)
    })

    const viewProductDetail = (productId) => {
      router.push(`/product/${productId}`)
    }

    return {
      selectedCategory,
      categories,
      filteredProducts,
      positiveTestimonials,
      loadingProducts,
      loadingTestimonials,
      viewProductDetail,
      formatProductData
    }
  }
}
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
}

.home-header {
  text-align: center;
  margin-bottom: 3vh;
}

.home-header h1 {
  color: #333;
  margin-bottom: 1vh;
}

.home-header p {
  color: #666;
}

.filter-section {
  margin-bottom: 2vh;
}

.category-filter {
  padding: 1vh 2vh;
  border: 1px solid #bbbbbb;
  border-radius: 5vh;
  background: white;
  font-size: 1rem;
  cursor: pointer;
}

.category-filter:focus {
  outline: none;
  border-color: #D00C1C;
}

.main-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.products-feed h2,
.testimonials-sidebar h2 {
  color: #333;
  margin-bottom: 2vh;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-style: italic;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #999;
  font-style: italic;
}

/* Testimonial Styles */
.testimonials-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.testimonial-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 2vh;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.testimonial-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.testimonial-content p {
  color: #333;
  font-style: italic;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.testimonial-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.testimonial-author {
  color: #666;
  font-weight: 500;
  font-size: 0.9rem;
}

.testimonial-product {
  color: #999;
  font-size: 0.8rem;
}

.sentiment-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  display: inline-block;
}

.sentiment-badge.positive {
  background-color: #e8f5e9;
  color: #2e7d32;
}

@media (max-width: 768px) {
  .main-layout {
    grid-template-columns: 1fr;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
  }
  
  .home-header h1 {
    font-size: 1.5rem;
  }
  
  .home-header p {
    font-size: 0.9rem;
  }
}
</style>