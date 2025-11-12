<template>
  <div>
    <label class="block text-gray-700 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <div 
      class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-gray-400"
      @click="triggerFileInput"
      @drop="handleDrop"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
    >
      <template v-if="previewUrl">
        <img :src="previewUrl" :alt="label" class="max-h-48 mx-auto mb-4 rounded-lg">
        <p class="text-gray-600">Klik untuk mengganti foto</p>
      </template>
      <template v-else>
        <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2"></i>
        <p class="text-gray-600">Klik untuk upload foto atau drag & drop</p>
        <p class="text-gray-500 text-sm mt-1">Format: JPG, PNG (Max 2MB)</p>
      </template>
      
      <input 
        type="file" 
        class="hidden" 
        ref="fileInput"
        :accept="accept"
        @change="handleFileSelect"
      >
    </div>
    
    <!-- Error Message -->
    <p v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</p>
  </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'ImageUpload',
  props: {
    label: {
      type: String,
      default: 'Foto'
    },
    required: {
      type: Boolean,
      default: false
    },
    accept: {
      type: String,
      default: 'image/*'
    },
    modelValue: {
      type: [File, String, null],
      default: null
    },
    existingImage: {
      type: String,
      default: null
    }
  },
  emits: ['update:modelValue', 'error'],
  setup(props, { emit }) {
    const fileInput = ref(null)
    const previewUrl = ref(null)
    const error = ref(null)
    const isDragging = ref(false)

    // Watch for existing image changes
    watch(() => props.existingImage, (newVal) => {
      if (newVal && !props.modelValue) {
        previewUrl.value = newVal
      }
    }, { immediate: true })

    const triggerFileInput = () => {
      fileInput.value?.click()
    }

    const handleFileSelect = (event) => {
      const file = event.target.files[0]
      if (file) {
        validateAndSetFile(file)
      }
    }

    const handleDrop = (event) => {
      event.preventDefault()
      isDragging.value = false
      
      const files = event.dataTransfer.files
      if (files.length > 0) {
        validateAndSetFile(files[0])
      }
    }

    const handleDragOver = (event) => {
      event.preventDefault()
      isDragging.value = true
    }

    const handleDragLeave = () => {
      isDragging.value = false
    }

    const validateAndSetFile = (file) => {
      error.value = null

      // Validate file type
      if (!file.type.startsWith('image/')) {
        error.value = 'File harus berupa gambar'
        return
      }

      // Validate file size (2MB)
      if (file.size > 2 * 1024 * 1024) {
        error.value = 'Ukuran file maksimal 2MB'
        return
      }

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        previewUrl.value = e.target.result
      }
      reader.readAsDataURL(file)

      // Emit the file
      emit('update:modelValue', file)
    }

    return {
      fileInput,
      previewUrl,
      error,
      isDragging,
      triggerFileInput,
      handleFileSelect,
      handleDrop,
      handleDragOver,
      handleDragLeave
    }
  }
}
</script>