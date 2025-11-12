<template>
  <div class="add-product-container">
    <div class="page-header">
      <h1>Tambah Produk Rosokan</h1>
      <p>Unggah foto dan informasi rosokan Anda</p>
    </div>

    <div class="form-container">
      <form @submit.prevent="submitProduct" class="product-form">
        <!-- Upload Foto -->
        <div class="form-section">
          <h3>Foto Produk</h3>
          <div class="upload-area" @click="triggerFileInput" :class="{ 'has-image': productData.photo }">
            <input 
              type="file" 
              ref="fileInput"
              @change="handleFileUpload" 
              accept="image/*"
              class="file-input"
            />
            <div v-if="!productData.photo" class="upload-placeholder">
              <HeroIcon icon="camera" size="xl" color="secondary" />
              <p>Klik untuk upload foto rosokan</p>
              <span>Format: JPG, PNG (Maks. 2MB)</span>
            </div>
            <div v-else class="image-preview">
              <img :src="productData.photoPreview" alt="Preview" />
              <button type="button" @click.stop="removeImage" class="remove-image-btn">
                <HeroIcon icon="x-mark" size="sm" color="white" />
              </button>
            </div>
          </div>
        </div>

        <!-- Informasi Produk -->
        <div class="form-section">
          <h3>Informasi Produk</h3>
          <div class="inp">
            <label for="title">Judul Produk *</label>
            <input 
              v-model="productData.title" 
              type="text" 
              id="title" 
              placeholder="Contoh: Kardus Bekas Ukuran Sedang"
              required
            />
          </div>

          <div class="inp">
            <label for="description">Deskripsi *</label>
            <textarea 
              v-model="productData.description" 
              id="description" 
              rows="4"
              placeholder="Jelaskan kondisi dan jenis rosokan Anda..."
              required
            ></textarea>
          </div>

          <!-- Jenis Barang Bekas - Pill Style -->
          <div class="inp">
            <label>Jenis Barang Bekas *</label>
            <div class="category-pills">
              <button
                v-for="category in categories"
                :key="category.id"
                type="button"
                class="category-pill"
                :class="{ active: productData.category === category.id }"
                @click="selectCategory(category.id)"
              >
                <span class="pill-icon">
                  <HeroIcon :icon="getCategoryIcon(category.id)" size="sm" />
                </span>
                <span class="pill-text">{{ category.name }}</span>
              </button>
            </div>
            <div class="category-validation" v-if="!productData.category">
              <HeroIcon icon="exclamation" size="xs" color="warning" />
              <span>Pilih salah satu jenis barang bekas</span>
            </div>
          </div>
        </div>

        <!-- Lokasi -->
        <div class="form-section">
          <h3>Lokasi Penjemputan</h3>
          
          <div class="location-input">
            <div class="inp">
              <label for="address">Alamat Lengkap *</label>
              <input 
                v-model="productData.address" 
                type="text" 
                id="address" 
                placeholder="Masukkan alamat lengkap penjemputan"
                required
                @input="onAddressManualInput"
              />
              <div class="input-hint" v-if="productData.address">
                <HeroIcon icon="information-circle" size="xs" color="primary" />
                <span>Alamat akan digunakan untuk verifikasi koordinat</span>
              </div>
            </div>

            <div class="location-buttons">
              <button 
                type="button" 
                @click="getCurrentLocation" 
                class="btn secondary" 
                :disabled="isGettingLocation"
              >
                <HeroIcon 
                  v-if="isGettingLocation" 
                  icon="arrow-path" 
                  size="sm" 
                  class="loading-spinner" 
                />
                <HeroIcon v-else icon="map-pin" size="sm" />
                {{ isGettingLocation ? 'Mendeteksi...' : 'Gunakan Lokasi Saat Ini' }}
              </button>
              <button type="button" @click="toggleMap" class="btn secondary">
                <HeroIcon icon="map" size="sm" />
                {{ showMap ? 'Sembunyikan Peta' : 'Tampilkan Peta' }}
              </button>
            </div>

            <!-- Koordinat yang Dipilih -->
            <div class="coordinates-info" v-if="hasValidCoordinates">
              <HeroIcon icon="check-circle" size="sm" color="success" />
              <span>
                Koordinat terpilih: 
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
            </div>
            <div v-else class="coordinates-warning">
              <HeroIcon icon="exclamation" size="sm" color="warning" />
              <span>
                <strong>Koordinat belum dipilih.</strong> 
                Gunakan "Gunakan Lokasi Saat Ini" atau pilih di peta untuk menentukan lokasi penjemputan.
              </span>
            </div>

              
              <MapView
                v-if="showMap"
                :key="mapKey"
                :title="productData.title || 'Lokasi Penjemputan'"
                :address="productData.address"
                :latitude="productData.latitude"
                :longitude="productData.longitude"
                :selectable="true"
                @location-selected="onLocationSelected"
                class="selectable-map"
              />
              
              <div class="map-instruction">
                <HeroIcon icon="information-circle" size="sm" color="primary" />
                <span>Klik di peta untuk memilih lokasi penjemputan</span>
              </div>
            </div>
          </div>

        <!-- Validation Summary -->
        <div class="validation-summary" v-if="!isFormValid">
          <HeroIcon icon="exclamation" size="sm" color="danger" />
          <span>Harap lengkapi semua field wajib dan pastikan koordinat lokasi sudah dipilih</span>
        </div>

        <!-- Submit Button -->
        <div class="form-actions">
          <router-link to="/user-dashboard" class="btn second">
            <HeroIcon icon="arrow-left" size="sm" />
            Kembali
          </router-link>
          <button 
            type="submit" 
            class="btn primary" 
            :disabled="loading || !isFormValid"
            :title="!isFormValid ? 'Lengkapi semua field wajib' : 'Unggah produk'"
          >
            <HeroIcon v-if="loading" icon="arrow-path" size="sm" class="loading-spinner" />
            <HeroIcon v-else icon="cloud-arrow-up" size="sm" />
            {{ loading ? 'Mengunggah...' : 'Unggah Produk' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
// import api from '@/service/api'
import HeroIcon from '@/components/HeroIcon.vue'
import MapView from '@/components/MapView.vue'

export default {
  name: 'AddProduct',
  components: {
    HeroIcon,
    MapView
  },
  setup() {
    const router = useRouter()
    const toast = useToast()
    const fileInput = ref(null)
    
    const loading = ref(false)
    const showMap = ref(false)
    const isGettingLocation = ref(false)
    const mapKey = ref(0)
    
    const categories = ref([
      { id: 'Kardus', name: 'Kardus' },
      { id: 'Plastik', name: 'Plastik' },
      { id: 'Kertas', name: 'Kertas' },
      { id: 'Logam', name: 'Logam' },
      { id: 'Elektronik', name: 'Elektronik' },
      { id: 'Kaca', name: 'Kaca' },
      { id: 'Tekstil', name: 'Tekstil' },
      { id: 'Lainnya', name: 'Lainnya' }
    ])

    const productData = reactive({
      title: '',
      description: '',
      category: '',
      address: '',
      latitude: null,
      longitude: null,
      photo: null,
      photoPreview: null
    })

    // Computed properties
    const hasValidCoordinates = computed(() => {
      return validateCoordinates(productData.latitude, productData.longitude)
    })

    const formattedLatitude = computed(() => {
      if (!hasValidCoordinates.value) return 'N/A'
      return productData.latitude.toFixed(6)
    })

    const formattedLongitude = computed(() => {
      if (!hasValidCoordinates.value) return 'N/A'
      return productData.longitude.toFixed(6)
    })

    const isFormValid = computed(() => {
      return (
        productData.photo &&
        productData.title.trim() &&
        productData.description.trim() &&
        productData.category &&
        productData.address.trim() &&
        hasValidCoordinates.value
      )
    })

    // Methods
    const validateCoordinates = (lat, lng) => {
      return (
        lat !== null && 
        lng !== null &&
        !isNaN(lat) && 
        !isNaN(lng) &&
        lat >= -90 && lat <= 90 &&
        lng >= -180 && lng <= 180
      )
    }

    const getCategoryIcon = (categoryId) => {
      const iconMap = {
        'Kardus': 'box',
        'Plastik': 'cube',
        'Kertas': 'document',
        'Logam': 'wrench',
        'Elektronik': 'computer',
        'Kaca': 'window',
        'Tekstil': 'shirt',
        'Lainnya': 'question-mark'
      }
      return iconMap[categoryId] || 'question-mark'
    }

    const selectCategory = (categoryId) => {
      productData.category = categoryId
    }

    const triggerFileInput = () => {
      fileInput.value?.click()
    }

    const handleFileUpload = (event) => {
      const file = event.target.files[0]
      if (file) {
        if (file.size > 2 * 1024 * 1024) {
          toast.error('Ukuran file maksimal 2MB')
          return
        }

        if (!file.type.startsWith('image/')) {
          toast.error('File harus berupa gambar (JPG, PNG)')
          return
        }

        productData.photo = file
        productData.photoPreview = URL.createObjectURL(file)
        toast.success('Foto berhasil diunggah')
      }
    }

    const removeImage = () => {
      productData.photo = null
      productData.photoPreview = null
      if (fileInput.value) {
        fileInput.value.value = ''
      }
      toast.info('Foto dihapus')
    }

    // Location methods
    const toggleMap = () => {
      showMap.value = !showMap.value
      if (showMap.value) {
        mapKey.value += 1 // Force re-render map
      }
    }

    const resetMap = () => {
      // Reset ke koordinat default Jakarta
      const defaultLat = -6.2088
      const defaultLng = 106.8456
      
      productData.latitude = defaultLat
      productData.longitude = defaultLng
      mapKey.value += 1 // Force re-render map
      
      toast.info('Peta direset ke lokasi default')
    }

    const getCurrentLocation = async () => {
      if (!navigator.geolocation) {
        toast.error('Browser tidak mendukung geolocation')
        return
      }

      if (isGettingLocation.value) return

      isGettingLocation.value = true
      toast.info('Mendeteksi lokasi Anda...')

      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10000,
            enableHighAccuracy: true
          })
        })

        const lat = position.coords.latitude
        const lng = position.coords.longitude
        
        if (!validateCoordinates(lat, lng)) {
          throw new Error('Koordinat tidak valid')
        }
        
        // Update coordinates
        productData.latitude = lat
        productData.longitude = lng
        
        // Update address from coordinates
        await updateAddressFromCoordinates(lat, lng)
        
        // Show map if not already shown
        if (!showMap.value) {
          showMap.value = true
          mapKey.value += 1
        }
        
        toast.success('Lokasi berhasil didapatkan!')
        
      } catch (error) {
        console.error('Error geolocation:', error)
        let errorMessage = 'Gagal mendapatkan lokasi'
        
        switch(error.code) {
          case 1:
            errorMessage = 'Izin lokasi ditolak. Izinkan akses lokasi di browser Anda.'
            break
          case 2:
            errorMessage = 'Informasi lokasi tidak tersedia'
            break
          case 3:
            errorMessage = 'Timeout saat mengambil lokasi'
            break
        }
        
        toast.error(errorMessage)
      } finally {
        isGettingLocation.value = false
      }
    }

    const updateAddressFromCoordinates = async (lat, lng) => {
      if (!validateCoordinates(lat, lng)) return

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16`
        )
        
        if (response.ok) {
          const data = await response.json()
          if (data && data.display_name) {
            productData.address = data.display_name
            return
          }
        }
        
        // Fallback
        productData.address = `Lokasi di ${lat.toFixed(6)}, ${lng.toFixed(6)}`
        
      } catch (error) {
        console.warn('Tidak bisa mendapatkan alamat otomatis:', error)
        productData.address = `Lokasi di ${lat.toFixed(6)}, ${lng.toFixed(6)}`
      }
    }

    const onLocationSelected = (location) => {
      console.log('📍 Lokasi dipilih dari peta:', location)
      productData.latitude = location.latitude
      productData.longitude = location.longitude
      
      // Update address jika tidak ada alamat yang diisi manual
      if (!productData.address || productData.address.startsWith('Lokasi di')) {
        updateAddressFromCoordinates(location.latitude, location.longitude)
      }
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
        // Fallback
        const textArea = document.createElement('textarea')
        textArea.value = coords
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        toast.success('Koordinat berhasil disalin!')
      }
    }

    const onAddressManualInput = () => {
      console.log('Alamat diinput manual:', productData.address)
    }

    // Form validation
    const validateForm = () => {
      const errors = []
      if (!productData.photo) errors.push('Foto produk wajib diunggah')
      if (!productData.title.trim()) errors.push('Judul produk wajib diisi')
      if (!productData.description.trim()) errors.push('Deskripsi produk wajib diisi')
      if (!productData.category) errors.push('Kategori produk wajib dipilih')
      if (!productData.address.trim()) errors.push('Alamat wajib diisi')
      if (!hasValidCoordinates.value) {
        errors.push('Koordinat lokasi tidak valid')
      }
      return errors
    }

    const submitProduct = async () => {
      const errors = validateForm()
      if (errors.length > 0) {
        errors.forEach(error => toast.error(error))
        return
      }

      try {
        loading.value = true

        const formData = new FormData()
        formData.append('title', productData.title.trim())
        formData.append('description', productData.description.trim())
        formData.append('category', productData.category)
        formData.append('address', productData.address.trim())
        formData.append('latitude', productData.latitude.toString())
        formData.append('longitude', productData.longitude.toString())
        formData.append('price', '0.00')
        formData.append('status', 'available')
        formData.append('photo', productData.photo)

        const response = await api.post('/produks', formData, {
          headers: { 
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000
        })

        toast.success('Produk berhasil ditambahkan!')
        
        // Reset form
        Object.assign(productData, {
          title: '',
          description: '',
          category: '',
          address: '',
          latitude: null,
          longitude: null,
          photo: null,
          photoPreview: null
        })
        
        if (fileInput.value) fileInput.value.value = ''
        
        setTimeout(() => router.push('/user-dashboard'), 1500)
        
      } catch (error) {
        console.error('Error submit produk:', error)
        const errorMessage = error.response?.data?.message 
          || error.response?.data?.error 
          || error.message 
          || 'Gagal menambahkan produk'
        toast.error(errorMessage)
      } finally {
        loading.value = false
      }
    }

    onUnmounted(() => {
      // Cleanup jika diperlukan
    })

    return {
      fileInput,
      loading,
      showMap,
      isGettingLocation,
      categories,
      productData,
      isFormValid,
      hasValidCoordinates,
      formattedLatitude,
      formattedLongitude,
      mapKey,
      getCategoryIcon,
      selectCategory,
      triggerFileInput,
      handleFileUpload,
      removeImage,
      getCurrentLocation,
      toggleMap,
      resetMap,
      submitProduct,
      copyCoordinates,
      onAddressManualInput,
      onLocationSelected
    }
  }
}
</script>

<style scoped>
.add-product-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2vh;
}

.input-hint {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: #666;
}

.validation-summary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #ffebee;
  border: 1px solid #f44336;
  border-radius: 0.5rem;
  color: #c62828;
  margin: 1rem 0;
}

.btn.text {
  background: transparent;
  border: none;
  color: inherit;
  padding: 0.25rem 0.5rem;
}

.btn.text:hover {
  background: rgba(0,0,0,0.1);
}

.coordinates-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.75rem;
  background: #e8f5e9;
  border: 1px solid #4caf50;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  color: #2e7d32;
}

.coordinates-warning {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.75rem;
  background: #fff3e0;
  border: 1px solid #ff9800;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  color: #ef6c00;
}

.page-header {
  text-align: center;
  margin-bottom: 3vh;
}

.page-header h1 {
  color: #333;
  margin-bottom: 1vh;
}

.page-header p {
  color: #666;
}

.form-container {
  background: white;
  border: 0.5px solid #bbbbbb;
  border-radius: 4vh;
  padding: 3vh;
  position: relative; 
  overflow: visible; 
}

.form-section {
  margin-bottom: 3vh;
}

.form-section h3 {
  color: #333;
  margin-bottom: 2vh;
  font-size: 1.2rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 1vh;
}

/* Upload Area */
.upload-area {
  border: 2px dashed #bbbbbb;
  border-radius: 2vh;
  padding: 3vh;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-area:hover {
  border-color: #D00C1C;
}

.upload-area.has-image {
  border-style: solid;
  padding: 1vh;
}

.file-input {
  display: none;
}

.upload-placeholder {
  color: #666;
}

.upload-placeholder p {
  margin: 1vh 0;
  font-weight: 500;
}

.upload-placeholder span {
  font-size: 0.9rem;
  color: #999;
}

.image-preview {
  position: relative;
  display: inline-block;
}

.image-preview img {
  width: 200px;
  height: 150px;
  object-fit: cover;
  border-radius: 1vh;
}

.remove-image-btn {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 30px;
  height: 30px;
  background: #D00C1C;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
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
  font-family: inherit;
}

.inp textarea {
  border-radius: 2vh;
  resize: vertical;
  min-height: 100px;
}

.inp input:focus,
.inp textarea:focus {
  border-color: #757575;
  outline: none;
}

/* Category Pills */
.category-pills {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1vh;
  margin-top: 1vh;
}

.category-pill {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5vh;
  padding: 1.5vh 1vh;
  border: 2px solid #e0e0e0;
  border-radius: 2vh;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.category-pill:hover {
  border-color: #D00C1C;
  transform: translateY(-2px);
}

.category-pill.active {
  border-color: #D00C1C;
  background: #D00C1C;
  color: white;
}

.category-pill.active .pill-icon {
  color: white;
}

.pill-icon {
  color: #666;
  transition: color 0.3s ease;
}

.pill-text {
  font-size: 0.9rem;
  font-weight: 500;
}

.category-validation {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: #fff3e0;
  border: 1px solid #ffd54f;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  color: #ef6c00;
}

/* Map Container */
.map-container {
  margin-top: 2vh;
  border: 1px solid #bbbbbb;
  border-radius: 2vh;
  overflow: hidden;
  position: relative;
}

.map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1vh 2vh;
  background: #f8f9fa;
  border-bottom: 1px solid #bbbbbb;
}

.map-header h4 {
  margin: 0;
  color: #333;
}

.map-actions {
  display: flex;
  gap: 0.5rem;
}

.btn.small {
  padding: 0.5vh 1vh;
  font-size: 0.8rem;
}

.selectable-map {
  height: 300px;
  width: 100%;
  position: relative;
}

.map-instruction {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1vh 2vh;
  background: #f8f9fa;
  color: #666;
  font-size: 0.9rem;
  border-top: 1px solid #bbbbbb;
}

/* Location Info */
.coordinates-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.5rem;
  background: #e8f5e9;
  border: 1px solid #c8e6c9;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  color: #2e7d32;
}

.coordinates-warning {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.5rem;
  background: #fff3e0;
  border: 1px solid #ffd54f;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  color: #ef6c00;
}

/* Location Buttons */
.location-buttons {
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
  flex-wrap: wrap;
}

.location-buttons .btn {
  flex: 1;
  min-width: 200px;
  justify-content: center;
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
  background-color: #f5f5f5;
}

.secondary {
  background-color: #f8f9fa;
  border-color: #ddd;
  color: #333;
}

.secondary:hover {
  background-color: #e9ecef;
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Responsive design */
@media (max-width: 768px) {
  .add-product-container {
    padding: 1vh;
  }
  
  .form-container {
    padding: 2vh;
  }

  .map-container {
    margin-top: 1vh;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .upload-area {
    padding: 2vh;
  }
  
  .location-buttons {
    flex-direction: column;
  }
  
  .location-buttons .btn {
    min-width: auto;
  }
  
  .selectable-map {
    height: 250px;
  }

  .category-pills {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 0.8vh;
  }

  .category-pill {
    padding: 1.2vh 0.8vh;
  }

  .pill-text {
    font-size: 0.8rem;
  }

  .add-product-container,
  .form-container {
    transform: none !important;
  }
}

@media (max-width: 480px) {
  .category-pills {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>