<template>
  <div class="container">
    <h1 class="Judol">Rosoq<span>in</span></h1>
    <div class="card">
      <h1 style="text-align: center;">Selamat Datang</h1>
      <p style="text-align: center; margin: 2vh 0; color: #666;">
        Platform terbaik untuk berbagi produk dan pengalaman. 
        Temukan produk berkualitas dan berikan testimoni Anda.
      </p>
      <hr>

      <div class="btn">
        <router-link to="/login" class="second">Masuk</router-link>
        <router-link to="/register" class="primary">Daftar</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WelcomePage'
}
</script>