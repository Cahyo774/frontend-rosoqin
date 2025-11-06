<script>
export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true
    },
    showActions: {
      type: Boolean,
      default: true
    },
    status: {
      type: String,
      default: 'active'
    }
  },
  methods: {
    handleAction() {
      this.$emit('action', this.product.id)
    },
    handleDetail() {
      if (this.product.id) {
        this.$router.push(`/product/${this.product.id}`)
      } else {
        console.warn('Product ID tidak tersedia')
      }
    },
    // Method untuk mendapatkan image URL yang aman
    getImageUrl() {
      // Prioritaskan photo dari backend
      if (this.product.photo) {
        // Jika photo sudah full URL
        if (this.product.photo.startsWith('http')) {
          return this.product.photo;
        }
        // Jika photo hanya nama file, tambahkan base path
        return `http://127.0.0.1:8000/storage/${this.product.photo}`;
      }
      // Fallback ke photo_url
      if (this.product.photo_url) {
        return this.product.photo_url;
      }
      // Fallback ke image dari prop
      if (this.product.image) {
        return this.product.image;
      }
    },
    // Method untuk mendapatkan lokasi
    getLocation() {
      return this.product.location || this.product.address || 'Lokasi tidak tersedia';
    },
    // Method untuk mendapatkan deskripsi singkat
    getShortDescription() {
      const desc = this.product.description || '';
      if (desc.length > 100) {
        return desc.substring(0, 100) + '...';
      }
      return desc;
    },
    // Handle image error
    handleImageError(event) {
      console.warn('Gambar tidak dapat dimuat:', event.target.src);
      // Fallback ke base64 placeholder atau path yang benar
      event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik04MCA2MEgxMjBNODAgODBIMTIwTTgwIDEwMEgxMjBNNjAgNzBWOTBNNjAgOTBWNzBNMTQwIDcwVjkwTTE0MCA5MFY3MCIgc3Ryb2tlPSIjQ0NDQ0NDIiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+';
    }
  }
}
</script>

<template>
  <div class="card" :class="{ 'card-inactive': status === 'inactive' }">
    <img 
      :src="getImageUrl()" 
      :alt="product.title"
      @error="handleImageError"
      loading="lazy"
    >
    <h2>{{ product.title || 'Judul tidak tersedia' }}</h2>
    <p class="location">{{ getLocation() }}</p>
    <p class="description">{{ getShortDescription() }}</p>
    
    <div class="btn">
      <a href="#" class="second" @click.prevent="handleDetail">Lihat selengkapnya</a>
      <a 
        v-if="showActions && status === 'active'" 
        href="#" 
        class="primary" 
        @click.prevent="handleAction"
      >
        {{ product.actionText || 'Terima' }}
      </a>
    </div>
  </div>
</template>

<script setup>
const formatPrice = (price) => {
  if (!price && price !== 0) return '0'
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('id-ID').format(numPrice)
}
</script>