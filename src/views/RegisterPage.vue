<script>
import axios from '../service/api.js'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'


export default {
  setup() {
    const username = ref('')
    const email = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const loading = ref(false)
    const router = useRouter()
    const toast = useToast()

    const register = async () => {

      if (password.value !== confirmPassword.value) {
        toast.error('Password dan konfirmasi tidak cocok', { timeout: 2500 }) 
        return
      }

      try {
        loading.value = true
        const response = await axios.post('/register', {
          name: username.value,
          email: email.value,
          password: password.value,
        })

        // Simpan token dan user (opsional)
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))

        toast.success('Registrasi berhasil Silakan login.', { timeout: 2500 })

        router.push('/login') // arahkan ke login setelah register sukses
      } catch (error) {
        console.error(error)
        toast.error('Gagal mendaftar. Periksa kembali data Anda', { timeout: 2500 })
      } finally {
        loading.value = false
      }
    }

    return {
      username,
      email,
      password,
      confirmPassword,
      // errorMsg,
      toast,
      loading,
      register,
    }
  },


}
</script>

<template>
  
  <div class="container">
    <h1 class="Judol">Rosoq<span>in</span></h1>
    <div class="card">
      <h1 style="text-align: center;">Register Form</h1>
      <hr>


      <div class="inp">
        <label for="username">Username</label>
        <input v-model="username" type="text" id="username" placeholder="Masukkan username" />
      </div>

      <div class="inp">
        <label for="email">Email</label>
        <input v-model="email" type="email" id="email" placeholder="Masukkan email" />
      </div>

      <div class="inp">
        <label for="password">Password</label>
        <input v-model="password" type="password" id="password" placeholder="Masukkan password" />
      </div>

      <div class="inp">
        <label for="confirmPassword">Konfirmasi Password</label>
        <input v-model="confirmPassword" type="password" id="confirmPassword" placeholder="Ulangi password" />
      </div>

      <div class="btn">
        <router-link to="/login" class="second">Sign in</router-link>
        <button @click="register" class="primary" :disabled="loading">
          {{ loading ? 'Mendaftar...' : 'Sign Up' }}
        </button>
      </div>
    </div>
  </div>
  
</template>