<template>
  <div class="map-container">
    <div class="map-header">
      <h4>Peta Lokasi</h4>
      <div class="map-actions">
        <button type="button" @click="openInMaps" class="btn small primary">
          <HeroIcon icon="arrow-top-right-on-square" size="xs" />
          Buka di Google Maps
        </button>
      </div>
    </div>

    <div id="map" class="map"></div>

    <div class="map-instruction">
      <HeroIcon icon="information-circle" size="sm" color="primary" />
      <span>Lokasi penjemputan produk</span>
    </div>
  </div>
</template>

<script>
import { onMounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import HeroIcon from './HeroIcon.vue'

// Fix untuk marker icons di Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

export default {
  name: 'MapView',
  components: { HeroIcon },
  props: {
    title: {
      type: String,
      default: 'Lokasi Penjemputan'
    },
    address: {
      type: String,
      default: ''
    },
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    let map = null
    let marker = null

    const initMap = () => {
      // Hapus map lama jika ada
      if (map) {
        map.remove()
      }

      // Inisialisasi peta
      map = L.map('map', {
        zoomControl: true,
        attributionControl: false,
      }).setView([props.latitude, props.longitude], 15)

      // Tambahkan tile layer dari OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        minZoom: 4,
      }).addTo(map)

      // Tambahkan marker dengan popup info
      marker = L.marker([props.latitude, props.longitude])
        .addTo(map)
        .bindPopup(`
          <div style="text-align: center; min-width: 200px;">
            <b>${props.title}</b><br>
            <small>${props.address || 'Lokasi penjemputan produk'}</small>
          </div>
        `)

      // Klik marker → buka popup
      marker.on('click', () => {
        marker.openPopup()
      })

      // Animasi zoom-in saat peta muncul
      setTimeout(() => {
        map.setView([props.latitude, props.longitude], 16, {
          animate: true,
          duration: 1.5,
          easeLinearity: 0.25,
        })
      }, 500)

      // Force resize untuk memastikan peta render dengan benar
      setTimeout(() => {
        map.invalidateSize()
      }, 100)
    }

    const openInMaps = () => {
      if (props.latitude && props.longitude) {
        const url = `https://www.google.com/maps?q=${props.latitude},${props.longitude}`
        window.open(url, '_blank')
      }
    }

    onMounted(() => {
      // Tunggu sedikit untuk memastikan DOM sudah siap
      setTimeout(() => {
        initMap()
      }, 100)
    })

    // Watch untuk perubahan props (jika koordinat berubah)
    watch(() => [props.latitude, props.longitude], () => {
      if (map && marker) {
        // Update marker position
        marker.setLatLng([props.latitude, props.longitude])
        
        // Update popup content
        marker.bindPopup(`
          <div style="text-align: center; min-width: 200px;">
            <b>${props.title}</b><br>
            <small>${props.address || 'Lokasi penjemputan produk'}</small>
          </div>
        `)
        
        // Pan map to new location
        map.setView([props.latitude, props.longitude], 16, {
          animate: true,
          duration: 1,
        })
      }
    })

    return {
      openInMaps
    }
  }
}
</script>
