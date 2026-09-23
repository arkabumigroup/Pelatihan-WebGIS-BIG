<script setup>
// Pilihan tunggal yang dapat dicari, dengan motif neo-brutalism situs ini.
//
// Menggantikan <select> bawaan pada tiga tempat: daftar peserta di Kit
// Identitas (82 nama), saringan akun master dan batch di Tabel Peserta, dan
// pemilih panjang nilai acak di Panel Acak.
//
// Dua alasan memakai komponen ini, bukan <select>:
//
// 1. <select> bawaan tidak dapat dicari. Pada daftar 82 nama, peserta harus
//    menggulir puluhan baris untuk menemukan namanya.
// 2. Daftar pilihan pada <select> digambar oleh sistem operasi, bukan oleh
//    halaman, sehingga tidak dapat diberi garis tegas dan bayangan padat
//    seperti blok lain di situs ini. Yang tampak sebelum dibuka bergaya
//    neo-brutalism, tetapi setelah dibuka berubah menjadi daftar bawaan
//    browser, dan itu terbaca sebagai dua antarmuka yang berbeda.
//
// Papan ketik: Enter atau Space membuka, panah atas dan bawah memilih, Enter
// menetapkan, Escape menutup tanpa mengubah, dan Tab menutup lalu berpindah.
// Fokus tidak dikurung di dalam daftar, karena isian pencarian di dalamnya
// sudah menjadi tempat fokus yang jelas.

import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  // Nilai terpilih. Dipakai lewat v-model.
  modelValue: { type: [String, Number], default: '' },
  // Daftar pilihan: { nilai, label, cari }. `cari` adalah teks tambahan yang
  // ikut dicocokkan, misalnya nama akun atau email yang tidak ditampilkan.
  pilihan: { type: Array, required: true },
  label: { type: String, default: '' },
  // Teks pada tombol selama belum ada yang dipilih.
  kosong: { type: String, default: 'Pilih satu' },
  // Tulisan di dalam isian pencarian.
  petunjukCari: { type: String, default: 'Ketik untuk mencari' },
  // Pilihan dengan sedikit anggota tidak perlu isian pencarian. Menampilkan
  // isian yang tidak berguna hanya menambah satu langkah sebelum memilih.
  bisaDicari: { type: Boolean, default: true },
  // Ditampilkan di bawah pilihan, misalnya keterangan batch peserta.
  keterangan: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'pilih'])

const terbuka = ref(false)
const cari = ref('')
const sorot = ref(0)

const idDaftar = `pc-${Math.random().toString(36).slice(2, 9)}`

const terpilih = computed(
  () => props.pilihan.find((p) => p.nilai === props.modelValue) || null
)

const tampil = computed(() => {
  const k = cari.value.trim().toLowerCase()
  if (!k) return props.pilihan
  return props.pilihan.filter((p) =>
    (p.label + ' ' + (p.cari || '')).toLowerCase().includes(k)
  )
})

// Saat daftar berubah karena pencarian, sorotannya dikembalikan ke pilihan
// pertama. Tanpa itu, sorotan dapat menunjuk baris yang sudah tidak ada.
watch(tampil, () => {
  sorot.value = 0
})

function pilih(p) {
  emit('update:modelValue', p.nilai)
  emit('pilih', p)
  tutupSetelahPilih()
}

function buka() {
  if (terbuka.value) return
  cari.value = ''
  sorot.value = Math.max(
    0,
    tampil.value.findIndex((p) => p.nilai === props.modelValue)
  )
  terbuka.value = true
  nextTick(() => {
    // Isian pencarian disembunyikan dari papan ketik sampai daftarnya dibuka,
    // jadi fokusnya diarahkan setelah daftarnya benar-benar ada.
    const el = wadah.value?.querySelector('.pc-cari input')
    if (el) el.focus()
  })
}

// Menutup selalu mengembalikan fokus ke pemicunya. Tanpa itu, pengguna papan
// ketik yang menekan Escape kehilangan tempatnya dan fokusnya kembali ke awal
// halaman, sehingga harus menelusuri ulang dari atas.
function tutup() {
  if (!terbuka.value) return
  terbuka.value = false
  cari.value = ''
  nextTick(() => pemicu.value?.focus())
}

// Sama seperti tutup, tetapi dipakai saat opsi sudah dipilih. Fokus tetap
// dikembalikan ke pemicu supaya Tab berikutnya melanjutkan dari tempat yang
// benar, bukan dari isian pencarian yang sudah dibuang.
function tutupSetelahPilih() {
  terbuka.value = false
  cari.value = ''
  nextTick(() => pemicu.value?.focus())
}

function alihkan() {
  if (terbuka.value) tutup()
  else buka()
}

function geser(langkah) {
  if (!terbuka.value) {
    buka()
    return
  }
  const n = tampil.value.length
  if (n === 0) return
  sorot.value = (sorot.value + langkah + n) % n
}

function pakaiSorotan() {
  if (!terbuka.value || tampil.value.length === 0) return
  pilih(tampil.value[sorot.value])
}

const wadah = ref(null)
const pemicu = ref(null)

// Klik di luar menutup daftar. Pendengarnya dipasang di dokumen karena
// daftarnya mengambang di atas isi halaman, sehingga klik pada isi halaman
// bukan lagi peristiwa di dalam komponen ini.
function diLuar(e) {
  if (wadah.value && !wadah.value.contains(e.target)) tutup()
}

onMounted(() => document.addEventListener('pointerdown', diLuar))
onBeforeUnmount(() => document.removeEventListener('pointerdown', diLuar))
</script>

<template>
  <div ref="wadah" class="pc">
    <p v-if="label" class="pc-label">{{ label }}</p>

    <div class="pc-kendali">
      <button
        ref="pemicu"
        type="button"
        class="pc-pemicu"
        :class="{ 'pc-pemicu--isi': terpilih }"
        role="combobox"
        :aria-expanded="terbuka"
        :aria-controls="idDaftar"
        aria-haspopup="listbox"
        @click="alihkan"
        @keydown.down.prevent="geser(1)"
        @keydown.up.prevent="geser(-1)"
        @keydown.enter.prevent="terbuka ? pakaiSorotan() : buka()"
        @keydown.space.prevent="terbuka ? pakaiSorotan() : buka()"
        @keydown.esc="tutup"
      >
        <span class="pc-nilai">{{ terpilih ? terpilih.label : kosong }}</span>
        <!-- Tanda buka dan tutup digambar sendiri, bukan karakter panah,
             supaya bentuknya sama di semua browser dan dapat diputar. -->
        <svg class="pc-panah" :class="{ 'pc-panah--buka': terbuka }" viewBox="0 0 12 8" aria-hidden="true">
          <path d="M1 1.5 6 6.5 11 1.5" fill="none" stroke="currentColor" stroke-width="2" />
        </svg>
      </button>

      <div v-if="terbuka" class="pc-daftar-bungkus">
        <div class="pc-cari">
          <input
            v-if="bisaDicari"
            v-model="cari"
            type="text"
            :placeholder="petunjukCari"
            autocomplete="off"
            spellcheck="false"
            :aria-activedescendant="`${idDaftar}-${sorot}`"
            :aria-controls="idDaftar"
            @keydown.down.prevent="geser(1)"
            @keydown.up.prevent="geser(-1)"
            @keydown.enter.prevent="pakaiSorotan"
            @keydown.esc.prevent="tutup"
          />

          <div
            :id="idDaftar"
            class="pc-daftar"
            role="listbox"
            :aria-label="label || kosong"
          >
            <p v-if="tampil.length === 0" class="pc-tidakada">
              Tidak ada yang cocok. Hapus kata pencariannya untuk melihat semua pilihan.
            </p>

            <button
              v-for="(p, i) in tampil"
              :id="`${idDaftar}-${i}`"
              :key="p.nilai"
              type="button"
              class="pc-opsi"
              :class="{ 'pc-opsi--sorot': i === sorot, 'pc-opsi--dipilih': p.nilai === modelValue }"
              role="option"
              :aria-selected="p.nilai === modelValue"
              @click="pilih(p)"
              @mouseenter="sorot = i"
            >
              <span class="pc-opsi-label">{{ p.label }}</span>
              <span v-if="p.keterangan" class="pc-opsi-ket">{{ p.keterangan }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <p v-if="keterangan" class="pc-bawah">{{ keterangan }}</p>
  </div>
</template>

<style scoped>
.pc {
  position: relative;
  width: 100%;
}

.pc-label {
  margin: 0 0 4px;
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

/* Baris status ditempatkan sebagai elemen pertama yang dibaca pembaca layar
   setelah pemilihan berubah, tanpa menggeser tata letaknya. */
.pc-kendali {
  position: relative;
}

/* Tombol pemicu memakai motif situs: garis tegas 2px, sudut 3px, dan bayangan
   padat tanpa blur. Sebelumnya kontrol formulir memakai garis 1px dan sudut
   6px, sehingga terbaca sebagai antarmuka yang berbeda dari blok lain. */
.pc-pemicu {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  min-height: 44px;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 600;
  text-align: left;
  color: var(--vp-c-text-2);
  background: var(--pelatihan-permukaan, #ffffff);
  border: var(--pelatihan-tebal, 2px) solid var(--pelatihan-garis, #111111);
  border-radius: var(--pelatihan-radius, 3px);
  box-shadow: var(--pelatihan-bayangan-jauh, 4px) var(--pelatihan-bayangan-jauh, 4px) 0
    var(--pelatihan-bayangan, #111111);
  cursor: pointer;
}

/* Satu-satunya gerakan pada komponen ini: tombolnya bergerak ke arah
   bayangannya, sama seperti tombol lain di situs. */
.pc-pemicu:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--pelatihan-bayangan-jauh-besar, 6px)
    var(--pelatihan-bayangan-jauh-besar, 6px) 0 var(--pelatihan-bayangan, #111111);
}

.pc-pemicu:active {
  transform: translate(var(--pelatihan-bayangan-jauh, 4px), var(--pelatihan-bayangan-jauh, 4px));
  box-shadow: 0 0 0 var(--pelatihan-bayangan, #111111);
}

.pc-pemicu:focus-visible {
  outline: 2px solid var(--pelatihan-aksen, #b45309);
  outline-offset: 2px;
}

/* Nilai yang sudah dipilih ditulis dengan tinta pekat, sedangkan teks ajakan
   memakai warna kedua. Bedanya menandai apakah isian ini sudah terisi. */
.pc-pemicu--isi .pc-nilai {
  color: var(--vp-c-text-1);
}

.pc-nilai {
  overflow-wrap: anywhere;
}

.pc-panah {
  width: 12px;
  height: 8px;
  flex: none;
  color: var(--vp-c-text-2);
  transition: transform 140ms ease;
}

.pc-panah--buka {
  transform: rotate(180deg);
}

/* Daftar mengambang di atas isi halaman, jadi tidak mendorong tata letak di
   bawahnya saat dibuka. */
.pc-daftar-bungkus {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 30;
  width: 100%;
  min-width: 240px;
  padding: 10px;
  background: var(--pelatihan-permukaan, #ffffff);
  border: var(--pelatihan-tebal, 2px) solid var(--pelatihan-garis, #111111);
  border-radius: var(--pelatihan-radius, 3px);
  box-shadow: var(--pelatihan-bayangan-jauh-besar, 6px)
    var(--pelatihan-bayangan-jauh-besar, 6px) 0 var(--pelatihan-bayangan, #111111);
}

.pc-cari input {
  width: 100%;
  min-height: 44px;
  margin-bottom: 8px;
  padding: 8px 10px;
  font-size: 14px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  border: var(--pelatihan-tebal, 2px) solid var(--pelatihan-garis, #111111);
  border-radius: var(--pelatihan-radius, 3px);
}

.pc-cari input:focus-visible {
  outline: 2px solid var(--pelatihan-aksen, #b45309);
  outline-offset: 2px;
}

/* Daftar panjang digulir di dalam wadahnya sendiri, bukan di halaman, supaya
   pemicunya tetap terlihat saat peserta menelusuri 82 nama. */
.pc-daftar {
  max-height: 300px;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.pc-opsi {
  display: block;
  width: 100%;
  min-height: 44px;
  padding: 8px 10px;
  font-size: 14px;
  text-align: left;
  color: var(--vp-c-text-1);
  background: none;
  border: none;
  border-radius: var(--pelatihan-radius, 3px);
  cursor: pointer;
}

/* Sorotan baris memakai latar lembut, bukan warna aksen, karena aksen oranye
   hanya dipakai untuk penanda posisi di sidebar. Baris yang sedang disorot
   juga digarisbawahi, sehingga sorotannya tidak hanya dibedakan warna. */
.pc-opsi--sorot {
  background: var(--vp-c-bg-soft);
  text-decoration: underline;
}

.pc-opsi--dipilih .pc-opsi-label {
  font-weight: 700;
}

/* Baris yang sedang tersorot dan sudah dipilih tetap perlu penanda sendiri,
   karena sorotan saja tidak memberi tahu mana yang terpasang. */
.pc-opsi--dipilih::before {
  content: "✓ ";
  font-weight: 700;
  color: var(--pelatihan-status-tip, #1f6f43);
}

.pc-opsi-label {
  display: block;
}

.pc-opsi-ket {
  display: block;
  margin-top: 2px;
  font-size: 12px;
  line-height: 1.5;
  color: var(--vp-c-text-2);
}

.pc-tidakada {
  margin: 0;
  padding: 16px 12px;
  font-size: 13px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

.pc-bawah {
  margin: 10px 0 0;
  font-size: 12.5px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

@media (max-width: 640px) {
  /* Pada layar sempit daftar selebar pemicunya, dan tingginya dibatasi supaya
     masih tersisa ruang untuk pemicunya di layar. */
  .pc-daftar-bungkus {
    min-width: 0;
  }

  .pc-daftar {
    max-height: 240px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .pc-pemicu,
  .pc-panah {
    transition: none;
  }

  .pc-pemicu:hover,
  .pc-pemicu:active {
    transform: none;
    box-shadow: var(--pelatihan-bayangan-jauh, 4px) var(--pelatihan-bayangan-jauh, 4px) 0
      var(--pelatihan-bayangan, #111111);
  }
}
</style>
