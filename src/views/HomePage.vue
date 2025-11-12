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