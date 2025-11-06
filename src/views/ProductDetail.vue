<template>
  <div class="product-detail-container">
    <div v-if="loading" class="loading">
      <HeroIcon icon="arrow-path" size="xl" class="loading-spinner" />
      <p>Memuat detail produk...</p>
    </div>
    
    <div v-else-if="product" class="product-detail">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <router-link to="/user-dashboard" class="breadcrumb-item">
          <HeroIcon icon="home" size="sm" />
          <span>Dashboard</span>
        </router-link>
        <HeroIcon icon="chevron-right" size="xs" color="secondary" />
        <span class="breadcrumb-item current">Detail Produk</span>
      </nav>

      <!-- Product Info -->
      <div class="product-header">
        <div class="product-gallery">
          <img 
            :src="getImageUrl()" 
            :alt="product.title" 
            class="main-image"
            @error="handleImageError"
          />
        </div>
        
        <div class="product-info">
          <div class="product-header-info">
            <h1>{{ product.title }}</h1>
            <div class="status-badge" :class="`status-${product.status}`">
              <HeroIcon 
                v-if="product.status === 'available'" 
                icon="check" 
                size="xs" 
              />
              <HeroIcon 
                v-else-if="product.status === 'unavailable'" 
                icon="x-mark" 
                size="xs" 
              />
              {{ getStatusText(product.status) }}
            </div>
          </div>
          
          <p class="description">{{ product.description }}</p>
          
          <div class="product-meta">
            <div class="meta-item">
              <HeroIcon icon="tag" size="sm" color="secondary" />
              <div class="meta-content">
                <span class="meta-label">Jenis Barang</span>
                <span class="meta-value">{{ product.category || 'Tidak tersedia' }}</span>
              </div>
            </div>
            <div class="meta-item">
              <HeroIcon icon="map-pin" size="sm" color="secondary" />
              <div class="meta-content">
                <span class="meta-label">Lokasi</span>
                <span class="meta-value">{{ product.address || 'Lokasi tidak tersedia' }}</span>
              </div>
            </div>
            <div class="meta-item" v-if="product.price && product.price > 0">
              <HeroIcon icon="currency" size="sm" color="secondary" />
              <div class="meta-content">
                <span class="meta-label">Harga</span>
                <span class="meta-value price">Rp {{ formatPrice(product.price) }}</span>
              </div>
            </div>
          </div>

          <!-- Maps Section -->
          <div class="location-info" v-if="hasValidCoordinates">
            <h3>
              <HeroIcon icon="map" size="sm" color="primary" />
              Lokasi Penjemputan
            </h3>
            
            <div class="coordinates-info">
              <HeroIcon icon="check-circle" size="sm" color="success" />
              <span>
                Koordinat: 
                <strong>{{ formattedLatitude }}, {{ formattedLongitude }}</strong>
              </span>
              <button 
                type="button" 
                @click="copyCoordinates" 
                class="btn small text"
                title="Salin koordinat"
              >
                <HeroIcon icon="clipboard" size="xs" />
                  Salin
              </button>
              <button 
                type="button" 
                @click="refreshMapView" 
                class="btn small text"
                title="Refresh peta"
              >
                <HeroIcon icon="arrow-path" size="xs" />
                Refresh Peta
              </button>
            </div>

            <!-- MapView Component -->
            <MapView
              v-if="hasValidCoordinates"
              :key="mapKey"
              :title="product.title"
              :address="product.address"
              :latitude="parseFloat(product.latitude)"
              :longitude="parseFloat(product.longitude)"
            />
          </div>
          <div v-else class="location-info">
            <h3>
              <HeroIcon icon="map-pin" size="sm" color="secondary" />
              Lokasi Penjemputan
            </h3>
            <div class="no-location">
              <HeroIcon icon="information-circle" size="xl" color="secondary" />
              <p>Lokasi koordinat tidak tersedia</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Admin Notes -->
      <div v-if="product.admin_notes" class="admin-notes">
        <div class="notes-header">
          <HeroIcon icon="information-circle" size="sm" color="warning" />
          <h3>Catatan Admin</h3>
        </div>
        <div class="notes-content">
          {{ product.admin_notes }}
        </div>
      </div>

      <!-- Comments Section -->
      <div class="comments-section">
        <div class="section-header">
          <h2>
            <HeroIcon icon="chat-bubble" size="sm" color="primary" />
            Komentar & Ulasan
          </h2>
          <button 
            v-if="product.status === 'processed' && !hasCommented" 
            class="btn primary"
            @click="showCommentForm = true"
          >
            <HeroIcon icon="chat-bubble" size="sm" />
            Beri Komentar
          </button>
        </div>

        <!-- Comment Form -->
        <div v-if="showCommentForm" class="comment-form">
          <h3>Beri Komentar</h3>
          <div class="inp">
            <label for="comment">Komentar Anda</label>
            <textarea 
              v-model="newComment" 
              id="comment" 
              rows="4"
              placeholder="Bagikan pengalaman Anda dengan layanan ini..."
              maxlength="500"
            ></textarea>
            <div class="char-count">{{ newComment.length }}/500</div>
          </div>
          <div class="form-actions">
            <button type="button" class="btn second" @click="cancelComment">
              Batal
            </button>
            <button 
              type="button" 
              class="btn primary" 
              @click="submitComment"
              :disabled="!newComment.trim() || submittingComment"
            >
              <HeroIcon v-if="submittingComment" icon="arrow-path" size="sm" class="loading-spinner" />
              {{ submittingComment ? 'Mengirim...' : 'Kirim Komentar' }}
            </button>
          </div>
        </div>

        <!-- Comments List -->
        <div v-if="comments.length > 0" class="comments-list">
          <div v-for="comment in comments" :key="comment.id" class="comment-card">
            <div class="comment-header">
              <div class="user-info">
                <div class="user-avatar">
                  {{ comment.user?.name?.charAt(0)?.toUpperCase() || 'U' }}
                </div>
                <div>
                  <div class="user-name">{{ comment.user?.name || 'User' }}</div>
                  <div class="comment-date">{{ formatDate(comment.created_at) }}</div>
                </div>
              </div>
              <div :class="`sentiment sentiment-${comment.sentiment}`">
                <HeroIcon 
                  v-if="comment.sentiment === 'positive'" 
                  icon="check" 
                  size="xs" 
                />
                <HeroIcon 
                  v-else-if="comment.sentiment === 'negative'" 
                  icon="x-mark" 
                  size="xs" 
                />
                <HeroIcon 
                  v-else 
                  icon="information-circle" 
                  size="xs" 
                />
                {{ getSentimentText(comment.sentiment) }}
              </div>
            </div>
            <p class="comment-text">{{ comment.comment }}</p>
            
            <!-- Admin Reply -->
            <div v-if="comment.admin_reply" class="admin-reply">
              <div class="reply-header">
                <HeroIcon icon="user" size="xs" color="primary" />
                <strong>Balasan Admin:</strong>
              </div>
              <p class="reply-text">{{ comment.admin_reply }}</p>
            </div>
          </div>
        </div>

        <div v-else class="empty-comments">
          <HeroIcon icon="chat-bubble" size="xl" color="secondary" />
          <p>Belum ada komentar</p>
          <p class="empty-subtext">Jadilah yang pertama memberikan komentar!</p>
        </div>
      </div>
    </div>

    <div v-else class="error-state">
      <HeroIcon icon="exclamation" size="xl" color="error" />
      <p>Produk tidak ditemukan</p>
      <router-link to="/user-dashboard" class="btn primary">
        <HeroIcon icon="arrow-left" size="sm" />
        Kembali ke Dashboard
      </router-link>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '../stores/auth'
import api from '../service/api'
import HeroIcon from '../components/HeroIcon.vue'
import MapView from '../components/MapView.vue'

export default {
  name: 'ProductDetail',
  components: {
    HeroIcon,
    MapView
  },
  setup() {
    const route = useRoute()
    const toast = useToast()
    const authStore = useAuthStore()
    
    const loading = ref(true)
    const product = ref(null)
    const comments = ref([])
    const showCommentForm = ref(false)
    const submittingComment = ref(false)
    const mapViewRef = ref(null)
    const mapKey = ref(0)

    const newComment = ref('')

    const userRole = computed(() => authStore.user?.role)

    const hasValidCoordinates = computed(() => {
      if (!product.value) return false
      const lat = product.value.latitude
      const lng = product.value.longitude
      return lat != null && lng != null && !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng))
    })

    const formattedLatitude = computed(() => {
      if (!hasValidCoordinates.value) return 'N/A'
      const lat = parseFloat(product.value.latitude)
      return isNaN(lat) ? 'N/A' : lat.toFixed(6)
    })

    const formattedLongitude = computed(() => {
      if (!hasValidCoordinates.value) return 'N/A'
      const lng = parseFloat(product.value.longitude)
      return isNaN(lng) ? 'N/A' : lng.toFixed(6)
    })

    const hasCommented = computed(() => {
      return comments.value.some(comment => comment.user_id === authStore.user?.id)
    })

    const refreshMapView = () => {
      mapKey.value += 1
      toast.info('Peta di-refresh')
    }

    const copyCoordinates = async () => {
      if (!hasValidCoordinates.value) {
        toast.error('Tidak ada koordinat untuk disalin')
        return
      }
      
      const coords = `${formattedLatitude.value}, ${formattedLongitude.value}`
      try {
        await navigator.clipboard.writeText(coords)
        toast.success('Koordinat berhasil disalin!')
      } catch (error) {
        const textArea = document.createElement('textarea')
        textArea.value = coords
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        toast.success('Koordinat berhasil disalin!')
      }
    }

    const getImageUrl = () => {
      if (product.value?.photo) {
        if (product.value.photo.startsWith('http')) {
          return product.value.photo
        }
        return `http://127.0.0.1:8000/storage/${product.value.photo}`
      }
      if (product.value?.photo_url) {
        return product.value.photo_url
      }
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik0xNjAgMTIwSDI0ME0xNjAgMTYwSDI0ME0xNjAgMjAwSDI0ME0xMjAgMTQwVjE4ME0xMjAgMTgwVjE0ME0yODAgMTQwVjE4ME0yODAgMTgwVjE0MCIgc3Ryb2tlPSIjQ0NDQ0NDIiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+'
    }

    const handleImageError = (event) => {
      event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik0xNjAgMTIwSDI0ME0xNjAgMTYwSDI0ME0xNjAgMjAwSDI0ME0xMjAgMTQwVjE4ME0xMjAgMTgwVjE0ME0yODAgMTQwVjE4ME0yODAgMTgwVjE0MCIgc3Ryb2tlPSIjQ0NDQ0NDIiB3aWR0aD0iMiIvPgo8L3N2Zz4='
    }

    const fetchProduct = async () => {
      try {
        console.log('📦 Fetching product data...')
        const response = await api.get(`/produks/${route.params.id}`)
        product.value = response.data
        console.log('✅ Product data loaded')
        console.log('📍 Coordinates from database:', product.value.latitude, product.value.longitude)
      } catch (error) {
        console.error('❌ Error fetching product:', error)
        toast.error('Gagal memuat detail produk')
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      fetchProduct()
    })

    const fetchComments = async () => {
      try {
        const response = await api.get(`/produks/${route.params.id}/komens`)
        comments.value = response.data.data || response.data
      } catch (error) {
        console.error('Error fetching comments:', error)
      }
    }

    const submitComment = async () => {
      try {
        submittingComment.value = true

        const response = await api.post('/komens', {
          product_id: route.params.id,
          comment: newComment.value
        })

        comments.value.unshift(response.data)
        newComment.value = ''
        showCommentForm.value = false
        
        toast.success('Komentar berhasil dikirim!')
      } catch (error) {
        console.error('Error submitting comment:', error)
        toast.error('Gagal mengirim komentar')
      } finally {
        submittingComment.value = false
      }
    }

    const cancelComment = () => {
      newComment.value = ''
      showCommentForm.value = false
    }

    const getStatusText = (status) => {
      const statusMap = {
        'available': 'Tersedia',
        'unavailable': 'Tidak Tersedia',
        'pending': 'Menunggu Verifikasi',
        'processed': 'Sudah Diproses',
        'completed': 'Selesai'
      }
      return statusMap[status] || status
    }

    const getSentimentText = (sentiment) => {
      const sentimentMap = {
        'positive': 'Positif',
        'negative': 'Negatif',
        'neutral': 'Netral'
      }
      return sentimentMap[sentiment] || sentiment
    }

    const formatPrice = (price) => {
      if (!price && price !== 0) return '0'
      const numPrice = typeof price === 'string' ? parseFloat(price) : price
      return new Intl.NumberFormat('id-ID').format(numPrice)
    }

    const formatDate = (dateString) => {
      if (!dateString) return ''
      return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    onMounted(() => {
      fetchProduct()
      fetchComments()
    })

    return {
      loading,
      product,
      comments,
      showCommentForm,
      submittingComment,
      newComment,
      userRole,
      hasCommented,
      hasValidCoordinates,
      formattedLatitude,
      formattedLongitude,
      mapViewRef,
      mapKey,
      getImageUrl,
      handleImageError,
      refreshMapView,
      copyCoordinates,
      submitComment,
      cancelComment,
      getStatusText,
      getSentimentText,
      formatPrice,
      formatDate,
    }
  }
}
</script>