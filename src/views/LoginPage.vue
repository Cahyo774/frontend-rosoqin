<script setup>
import axios from '../service/api.js'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const email = ref('')
const password = ref('')
const loading = ref(false)

const router = useRouter()
const toast = useToast()

const login = async () => {
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
    toast.error('email atau password salah!', {
      timeout: 2500,
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="container">
    <h1 class="Judol">Rosoq<span>in</span></h1>
    <div class="card">
      <h1 style="text-align: center;">Login Form</h1>
      <hr>

      <div class="inp">
        <label for="email">Email</label>
        <input
          v-model="email"
          type="email"
          id="email"
          placeholder="Masukkan email"
        />
      </div>

      <div class="inp">
        <label for="password">Password</label>
        <input
          v-model="password"
          type="password"
          id="password"
          placeholder="Masukkan password"
        />
      </div>

      <div class="btn">
        <router-link to="/register" class="second">Sign Up</router-link>
        <button @click="login" class="primary" :disabled="loading">
          {{ loading ? 'Loading...' : 'Sign In' }}
        </button>
      </div>
    </div>
  </div>
</template>