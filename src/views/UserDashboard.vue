<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h1>Dashboard Saya</h1>
      <p>Kelola produk dan aktivitas Anda</p>
    </div>

    <div class="dashboard-content">
      <div class="dashboard-grid">
        <div class="main-content">
          <div class="stats-section">
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-icon">
                  <HeroIcon icon="check" size="xl" color="success" />
                </div>
                <div class="stat-info">
                  <span class="stat-number">{{ activeProductsCount }}</span>
                  <span class="stat-label">Produk Aktif</span>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon">
                  <HeroIcon icon="x-mark" size="xl" color="warning" />
                </div>
                <div class="stat-info">
                  <span class="stat-number">{{ inactiveProductsCount }}</span>
                  <span class="stat-label">Produk Nonaktif</span>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon">
                  <HeroIcon icon="eye" size="xl" color="primary" />
                </div>
                <div class="stat-info">
                  <span class="stat-number">{{ totalViews }}</span>
                  <span class="stat-label">Total Dilihat</span>
                </div>
              </div>
            </div>
          </div>

          <div class="products-section">
            <div class="section-header">
              <h2>Produk Saya</h2>
              <button class="add-product-btn" @click="addProduct">
                <HeroIcon icon="plus" size="xl" color="white" />
                Tambah Produk
              </button>
            </div>

            <div class="product-filters">
              <button 
                v-for="filter in productFilters" 
                :key="filter.value"
                :class="['filter-btn', { active: activeFilter === filter.value }]"
                @click="activeFilter = filter.value"
              >
                {{ filter.label }}
              </button>
            </div>

            <div v-if="loadingProducts" class="loading">
              <HeroIcon icon="info" size="xl" color="secondary" />
              <p>Memuat produk...</p>
            </div>

            <div v-else class="products-grid">
              <ProductCard 
                v-for="product in filteredUserProducts" 
                :key="product.id" 
                :product="formatProductData(product)"
                :status="product.status"
                :show-actions="true"
                :action-text="getActionText(product.status)"
                @detail="viewProductDetail"
                @action="handleProductAction"
              />
            </div>

            <div v-if="!loadingProducts && filteredUserProducts.length === 0" class="empty-state">
              <div class="empty-icon">
                <HeroIcon icon="shopping-bag" size="xl" color="secondary" />
              </div>
              <p v-if="activeFilter === 'all'">Belum ada unggahan.</p>
              <p v-else>Tidak ada produk dengan status "{{ getFilterLabel(activeFilter) }}".</p>
              <button v-if="activeFilter === 'all'" class="add-first-product-btn" @click="addProduct">
                <HeroIcon icon="plus" size="sm" color="white" />
                Tambah Produk Pertama Anda!
              </button>
            </div>
          </div>

          <div class="comments-section">
            <div class="section-header">
              <h2>Komentar Saya</h2>
            </div>

            <div v-if="loadingComments" class="loading">
              <HeroIcon icon="info" size="xl" color="secondary" />
              <p>Memuat komentar...</p>
            </div>

            <div v-else class="comments-list">
              <div v-for="comment in userComments" :key="comment.id" class="comment-card">
                <div class="comment-header">
                  <div class="comment-product">
                    <strong>Produk:</strong> {{ comment.product?.title || 'Produk tidak tersedia' }}
                  </div>
                  <div class="comment-meta">
                    <span class="comment-date">{{ formatDate(comment.created_at) }}</span>
                    <span :class="`comment-status status-${comment.status}`">
                      <HeroIcon v-if="comment.status === 'approved'" icon="check" size="md" color="success" />
                      <HeroIcon v-else-if="comment.status === 'pending'" icon="info" size="md" color="warning" />
                      <HeroIcon v-else icon="x-mark" size="md" color="error" />
                      {{ comment.status }}
                    </span>
                  </div>
                </div>
                <p class="comment-text">{{ comment.comment }}</p>
                <div class="comment-actions">
                  <button class="btn-edit" @click="editComment(comment.id)">
                    <HeroIcon icon="pencil" size="sm" />
                    Edit
                  </button>
                  <button class="btn-delete" @click="deleteComment(comment.id)">
                    <HeroIcon icon="trash" size="sm" />
                    Hapus
                  </button>
                </div>
              </div>
            </div>

            <div v-if="!loadingComments && userComments.length === 0" class="empty-state">
              <HeroIcon icon="chat-bubble" size="xl" color="secondary" />
              <p>Belum ada komentar.</p>
            </div>
          </div>
        </div>

        <div class="sidebar">
          <div class="profile-section">
            <h2>Profil & Aktivitas</h2>
            <div class="profile-card">
              <div class="profile-info">
                <div class="user-avatar">
                  <img 
                    v-if="userPhoto" 
                    :src="userPhoto" 
                    :alt="userName"
                    class="avatar-image"
                    @error="handleImageError"
                  />
                  <div v-else class="avatar-placeholder">
                    <HeroIcon icon="user" size="xl" color="white" />
                  </div>
                </div>
                <div class="user-details">
                  <h3>{{ userName }}</h3>
                  <p class="user-email">{{ userEmail }}</p>
                </div>
              </div>
              <div class="activity-stats">
                <div class="stat">
                  <span class="stat-number">{{ userProducts.length }}</span>
                  <span class="stat-label">Total Produk</span>
                </div>
                <div class="stat">
                  <span class="stat-number">{{ activeProductsCount }}</span>
                  <span class="stat-label">Produk Aktif</span>
                </div>
                <div class="stat">
                  <span class="stat-number">{{ inactiveProductsCount }}</span>
                  <span class="stat-label">Produk Nonaktif</span>
                </div>
              </div>
              <button class="edit-profile-btn" @click="editProfile">
                <HeroIcon icon="pencil" size="md" />
                Edit Profil
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import api from '../service/api'
import ProductCard from '../components/ProductCard.vue'
import HeroIcon from '../components/HeroIcon.vue'

export default {
  name: 'UserDashboard',
  components: { ProductCard, HeroIcon },
  setup() {
    const userProducts = ref([])
    const userComments = ref([])
    const loadingProducts = ref(false)
    const loadingComments = ref(false)
    const activeFilter = ref('all')
    const router = useRouter()
    const toast = useToast()

    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const userName = user.name || 'User'
    const userEmail = user.email || 'user@example.com'
    const userPhoto = ref(user.photo || user.photo_url || user.avatar || '')

    const productFilters = [
      { value: 'all', label: 'Semua' },
      { value: 'available', label: 'Aktif' },
      { value: 'unavailable', label: 'Nonaktif' }
    ]

    const handleImageError = (event) => {
      event.target.style.display = 'none'
    }

    const fetchUserProducts = async () => {
      try {
        loadingProducts.value = true
        const response = await api.get('/my-products')
        userProducts.value = response.data.data || response.data
      } catch {
        toast.error('Gagal memuat produk')
      } finally {
        loadingProducts.value = false
      }
    }

    const fetchUserComments = async () => {
      loadingComments.value = true
      userComments.value = []
      loadingComments.value = false
    }

    const fetchUserData = async () => {
      try {
        const response = await api.get('/user/profile')
        const userData = response.data.data || response.data
        userPhoto.value = userData.photo || userData.photo_url || userData.avatar || ''
      } catch {}
    }

    onMounted(() => {
      fetchUserProducts()
      fetchUserComments()
      fetchUserData()
    })

    const activeProductsCount = computed(() =>
      userProducts.value.filter(p => p.status === 'available').length
    )

    const inactiveProductsCount = computed(() =>
      userProducts.value.filter(p => p.status === 'unavailable').length
    )

    const totalViews = computed(() =>
      userProducts.value.reduce((t, p) => t + (p.views || 0), 0)
    )

    const filteredUserProducts = computed(() =>
      activeFilter.value === 'all'
        ? userProducts.value
        : userProducts.value.filter(p => p.status === activeFilter.value)
    )

    const formatProductData = (p) => {
      let imageUrl = ''

      // Gunakan URL dari backend jika sudah lengkap
      if (p.photo_url) {
        imageUrl = p.photo_url
      }
      // Jika hanya path disimpan (contoh: "produk/abc.jpg")
      else if (p.photo) {
        const cleanPath = p.photo.replace(/\\/g, '/')
        imageUrl = `http://127.0.0.1:8000/storage/${cleanPath}`
      } 
      // Jika tidak ada gambar sama sekali
      else {
        imageUrl = '/default-product.png'
      }

      return { ...p, photo: imageUrl, photo_url: imageUrl }
    }


    const getActionText = (status) => (status === 'available' ? 'Edit' : 'Aktifkan')

    const getFilterLabel = (val) =>
      productFilters.find(f => f.value === val)?.label || 'Semua'

    const formatDate = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    }

    const addProduct = () => router.push('/product/add')
    const editProfile = () => router.push('/profile/edit')
    const viewProductDetail = (id) => router.push(`/product/${id}`)

    const handleProductAction = async (id) => {
      const product = userProducts.value.find(p => p.id === id)
      if (product.status === 'available') {
        router.push(`/product/edit/${id}`)
      } else {
        await activateProduct(id)
      }
    }

    const activateProduct = async (id) => {
      try {
        await api.put(`/produks/${id}`, { status: 'available' })
        toast.success('Produk berhasil diaktifkan')
        fetchUserProducts()
      } catch {
        toast.error('Gagal mengaktifkan produk')
      }
    }

    const editComment = () => toast.info('Fitur edit komentar belum tersedia')

    const deleteComment = async () => {
      if (!confirm('Yakin ingin menghapus komentar ini?')) return
      toast.success('Komentar berhasil dihapus')
      fetchUserComments()
    }

    return {
      userProducts,
      userComments,
      loadingProducts,
      loadingComments,
      activeFilter,
      productFilters,
      userName,
      userEmail,
      userPhoto,
      activeProductsCount,
      inactiveProductsCount,
      totalViews,
      filteredUserProducts,
      handleImageError,
      formatProductData,
      getActionText,
      getFilterLabel,
      formatDate,
      addProduct,
      editProfile,
      viewProductDetail,
      handleProductAction,
      editComment,
      deleteComment
    }
  }
}
</script>
