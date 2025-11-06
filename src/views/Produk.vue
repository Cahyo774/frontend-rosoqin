<template>
  <div class="container">
    <router-view @saved="loadData" />
  </div>
</template>

<script>
export default {
  name: "Produk",
};
</script>