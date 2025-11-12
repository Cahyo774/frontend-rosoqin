<script setup>
import axios from '../service/api.js'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const email = ref('')
const password = ref('')
const loading = ref(false)
const currentStep = ref(1)

const router = useRouter()
const toast = useToast()

// Validasi email sederhana
const isEmailValid = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.value)
})

// Validasi password
const isPasswordValid = computed(() => {
  return password.value.length >= 6
})

// Navigasi antar step
const nextStep = () => {
  if (currentStep.value === 1 && isEmailValid.value) {
    currentStep.value = 2
  }
}

const prevStep = () => {
  if (currentStep.value === 2) {
    currentStep.value = 1
  }
}

const login = async () => {
  // Validasi akhir sebelum login
  if (!isEmailValid.value || !isPasswordValid.value) {
    toast.error('Harap periksa kembali email dan password Anda!', {
      timeout: 2500,
    })
    return
  }

  loading.value = true
  
  try {
    const response = await axios.post('/login', {
      email: email.value,
      password: password.value,
    })

    // Simpan token & user
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))

    // ✅ Notifikasi sukses
    toast.success('Login berhasil! Selamat datang!', {
      timeout: 2500,
    })

    // Redirect ke halaman home
    setTimeout(() => router.push('/home'), 1000)
  } catch (error) {
    console.error(error)
    // ❌ Notifikasi gagal
    toast.error('Email atau password salah!', {
      timeout: 2500,
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
    <!-- Brand Logo -->
    <h1 class="text-4xl font-bold mb-8">
      <span class="text-[#D00C1C]">Rosoq</span>
      <span class="text-[#323232]">in</span>
    </h1>

    <!-- Login Card -->
    <div class="w-full max-w-md border border-gray-300 rounded-[4vh] bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-2">
      <h1 class="text-2xl font-semibold text-center text-[#323232] mb-4">Login Form</h1>
      <hr class="border-gray-300 mb-6">

      <!-- Stepper -->
      <div class="flex justify-between items-center mb-8">
        <div class="flex flex-col items-center">
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium transition-all duration-300"
               :class="currentStep >= 1 ? 'bg-[#D00C1C]' : 'bg-gray-300'">
            1
          </div>
          <span class="text-xs mt-1 text-gray-600">Email</span>
        </div>
        <div class="flex-1 h-1 mx-2 transition-all duration-300"
             :class="currentStep >= 2 ? 'bg-[#D00C1C]' : 'bg-gray-300'"></div>
        <div class="flex flex-col items-center">
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium transition-all duration-300"
               :class="currentStep >= 2 ? 'bg-[#D00C1C]' : 'bg-gray-300'">
            2
          </div>
          <span class="text-xs mt-1 text-gray-600">Password</span>
        </div>
      </div>

      <!-- Step 1: Email Input -->
      <div v-if="currentStep === 1" class="space-y-4">
        <div class="flex flex-col">
          <label for="email" class="text-[#323232] font-medium mb-2">Email</label>
          <input
            v-model="email"
            type="email"
            id="email"
            placeholder="Masukkan email"
            class="bg-white px-4 py-3 border border-gray-300 rounded-[5vh] transition-all duration-300 focus:border-[#323232] focus:outline-none text-[#323232] placeholder-gray-500"
            :class="email && !isEmailValid ? 'border-red-500' : ''"
            @keyup.enter="nextStep"
          />
          <p v-if="email && !isEmailValid" class="text-red-500 text-sm mt-1">
            Format email tidak valid
          </p>
        </div>

        <div class="flex justify-end mt-6">
          <button 
            @click="nextStep"
            class="px-6 py-3 bg-[#D00C1C] text-white rounded-[5vh] font-medium transition-all duration-300 hover:bg-[#ad0c1a] hover:-translate-y-1 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
            :disabled="!isEmailValid"
          >
            Lanjut
          </button>
        </div>
      </div>

      <!-- Step 2: Password Input -->
      <div v-if="currentStep === 2" class="space-y-4">
        <div class="flex flex-col">
          <label for="password" class="text-[#323232] font-medium mb-2">Password</label>
          <input
            v-model="password"
            type="password"
            id="password"
            placeholder="Masukkan password"
            class="bg-white px-4 py-3 border border-gray-300 rounded-[5vh] transition-all duration-300 focus:border-[#323232] focus:outline-none text-[#323232] placeholder-gray-500"
            :class="password && !isPasswordValid ? 'border-red-500' : ''"
            @keyup.enter="login"
          />
          <p v-if="password && !isPasswordValid" class="text-red-500 text-sm mt-1">
            Password minimal 6 karakter
          </p>
        </div>

        <div class="flex justify-between mt-6">
          <button 
            @click="prevStep"
            class="px-6 py-3 bg-white border border-gray-300 text-[#323232] rounded-[5vh] font-medium transition-all duration-300 hover:bg-gray-50 hover:-translate-y-1"
          >
            Kembali
          </button>
          <button 
            @click="login" 
            class="px-6 py-3 bg-[#D00C1C] text-white rounded-[5vh] font-medium transition-all duration-300 hover:bg-[#ad0c1a] hover:-translate-y-1 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
            :disabled="loading || !isPasswordValid"
          >
            {{ loading ? 'Loading...' : 'Login' }}
          </button>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-between items-center mt-8 pt-4 border-t border-gray-300">
        <router-link 
          to="/register" 
          class="px-6 py-3 bg-white border border-gray-300 text-[#323232] rounded-[5vh] font-medium transition-all duration-300 hover:bg-gray-50 hover:-translate-y-1 text-center"
        >
          Sign Up
        </router-link>
        
        <p class="text-gray-600 text-sm">
          Belum punya akun?
        </p>
      </div>
    </div>

    <!-- Additional Info -->
    <p class="text-gray-500 text-sm mt-8 text-center max-w-md">
      Dengan login, Anda menyetujui syarat dan ketentuan yang berlaku.
    </p>
  </div>
</template>