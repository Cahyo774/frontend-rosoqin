<template>
  <div class="form-produk">
    <h2>{{ isEdit ? "Edit Produk" : "Tambah Produk" }}</h2>

    <form @submit.prevent="submitForm">
      <div>
        <label>Judul</label>
        <input v-model="form.title" required />
      </div>

      <div>
        <label>Deskripsi</label>
        <textarea v-model="form.description"></textarea>
      </div>

      <div>
        <label>Harga</label>
        <input type="number" v-model="form.price" required />
      </div>

      <div>
        <label>Status</label>
        <select v-model="form.status" required>
          <option value="available">Tersedia</option>
          <option value="unavailable">Tidak Tersedia</option>
        </select>
      </div>

      <div>
        <label>Foto</label>
        <input type="file" @change="onFileChange" accept="image/*" />
        <div v-if="preview" style="margin-top: 10px;">
          <img :src="preview" alt="Preview" width="100" />
        </div>
      </div>

      <button type="submit">{{ isEdit ? "Update" : "Simpan" }}</button>
      <button type="button" @click="kembali">Batal</button>
    </form>
  </div>
</template>

<script>
import api from "../service/api.js";

export default {
  name: "FormProduk",
  props: {
    id: { type: [Number, String], default: null },
  },
  data() {
    return {
      form: {
        title: "",
        description: "",
        price: "",
        status: "available",
        photo: null,
      },
      preview: null,
      isEdit: false,
    };
  },
  async mounted() {
    if (this.id) {
      this.isEdit = true;
      await this.loadProduk();
    }
  },
  methods: {
    async loadProduk() {
      try {
        const res = await api.get(`/produks/${this.id}`);
        this.form = {
          title: res.data.title,
          description: res.data.description,
          price: res.data.price,
          status: res.data.status,
          photo: null,
        };
        if (res.data.photo) {
          this.preview = `http://127.0.0.1:8000/storage/${res.data.photo}`;
        }
      } catch (err) {
        console.error("Gagal memuat produk:", err);
      }
    },
    onFileChange(e) {
      const file = e.target.files[0];
      this.form.photo = file;
      this.preview = URL.createObjectURL(file);
    },
    async submitForm() {
      try {
        const formData = new FormData();
        Object.entries(this.form).forEach(([key, value]) => {
          if (value !== null) formData.append(key, value);
        });

        if (this.isEdit) {
          await api.post(`/produks/${this.id}?_method=PUT`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          alert("Produk berhasil diperbarui!");
        } else {
          await api.post("/produks", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          alert("Produk berhasil ditambahkan!");
        }

        this.$router.push("/produk");
      } catch (err) {
        console.error("Gagal menyimpan produk:", err);
        alert("Terjadi kesalahan saat menyimpan produk.");
      }
    },
    kembali() {
      this.$router.push("/produk");
    },
  },
};
</script>
