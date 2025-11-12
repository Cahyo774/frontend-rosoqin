import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useToast } from 'vue-toastification'

export function useProducts() {
  const userStore = useUserStore()
  const toast = useToast()
  const loading = ref(false)

  const loadProducts = async () => {
    loading.value = true
    try {
      await userStore.fetchProducts()
    } catch (error) {
      toast.error('Gagal memuat produk')
    } finally {
      loading.value = false
    }
  }

  const createProduct = async (productData) => {
    loading.value = true
    try {
      await userStore.addProduct(productData)
      toast.success('Produk berhasil ditambahkan')
      return true
    } catch (error) {
      toast.error('Gagal menambahkan produk')
      return false
    } finally {
      loading.value = false
    }
  }

  const editProduct = async (id, productData) => {
    loading.value = true
    try {
      await userStore.updateProduct(id, productData)
      toast.success('Produk berhasil diperbarui')
      return true
    } catch (error) {
      toast.error('Gagal memperbarui produk')
      return false
    } finally {
      loading.value = false
    }
  }

  const removeProduct = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      return false
    }

    loading.value = true
    try {
      await userStore.deleteProduct(id)
      toast.success('Produk berhasil dihapus')
      return true
    } catch (error) {
      toast.error('Gagal menghapus produk')
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    loadProducts,
    createProduct,
    editProduct,
    removeProduct
  }
}