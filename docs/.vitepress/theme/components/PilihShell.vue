<script setup>
// Pengalih tempat menjalankan perintah: Cloud Shell atau terminal laptop.
//
// Sebagian perintah pada modul Deployment Project dapat dijalankan di dua
// tempat. Perintah gcloud-nya sama persis, tetapi perintah pemeriksaan seperti
// `dig` dan `curl` berbeda, dan di laptop ada satu langkah tambahan yaitu
// `gcloud auth login`.
//
// Cara kerjanya: tombol di sini hanya menulis satu atribut pada elemen <html>,
// yaitu data-shell. Gaya pada custom.css yang menyembunyikan salah satu versi
// blok. Dengan begitu isi halaman tetap satu file, dan halaman yang tidak
// memuat pengalih ini tidak terpengaruh.
//
// Pilihannya disimpan di localStorage, sehingga tetap terpakai saat peserta
// berpindah halaman atau kembali keesokan harinya. Bila penyimpanan diblokir,
// halamannya tetap bekerja dengan nilai bawaan Cloud Shell.

import { ref, onMounted } from 'vue'

const pilihan = ref('cloud')

const KUNCI = 'webgisbig.shell'

const OPSI = [
  {
    nilai: 'cloud',
    judul: 'Cloud Shell',
    keterangan: 'Peramban. Tidak perlu memasang apa pun.',
  },
  {
    nilai: 'local',
    judul: 'Terminal laptop',
    keterangan: 'gcloud CLI dipasang sendiri. Variabelnya tersimpan di disk.',
  },
]

function pasang(nilai) {
  pilihan.value = nilai
  document.documentElement.dataset.shell = nilai
  try {
    localStorage.setItem(KUNCI, nilai)
  } catch (e) {
    // Penyimpanan diblokir, misalnya mode penyamaran. Pilihannya tetap berlaku
    // sampai halaman ditutup, dan tidak ada yang perlu diberitahukan.
  }
}

onMounted(() => {
  // Nilai dari penyimpanan dibaca di sini, bukan saat render. Situs ini dibangun
  // menjadi file statis lebih dahulu, dan membaca penyimpanan browser saat
  // render menghasilkan HTML yang berbeda antara hasil build dan hasil di layar.
  let tersimpan = ''
  try {
    tersimpan = localStorage.getItem(KUNCI) || ''
  } catch (e) {
    tersimpan = ''
  }
  const sah = OPSI.some((o) => o.nilai === tersimpan)
  pasang(sah ? tersimpan : 'cloud')
})
</script>

<template>
  <div class="ps">
    <p class="ps-label" id="ps-label">Perintah di halaman ini dijalankan dari:</p>

    <div class="ps-tombol" role="group" aria-labelledby="ps-label">
      <button
        v-for="o in OPSI"
        :key="o.nilai"
        type="button"
        class="ps-opsi"
        :class="{ 'ps-opsi--aktif': pilihan === o.nilai }"
        :aria-pressed="pilihan === o.nilai"
        @click="pasang(o.nilai)"
      >
        <span class="ps-judul">{{ o.judul }}</span>
        <span class="ps-ket">{{ o.keterangan }}</span>
      </button>
    </div>

    <p class="ps-catatan">
      Perintah yang dijalankan <strong>di dalam VM</strong> tidak terpengaruh
      pilihan ini, karena perintah itu selalu dijalankan lewat SSH, baik dari
      Cloud Shell maupun dari laptop. Penanda
      <span class="ps-contoh">Dijalankan di</span> pada tiap tahap tetap
      menunjukkan tempatnya.
    </p>
  </div>
</template>

<style scoped>
/* Seluruh kontrol di sini memakai motif situs: garis tegas 2px, sudut 3px, dan
   bayangan padat tanpa blur. */
.ps {
  margin: 0 0 28px;
  padding: 16px;
  border: var(--pelatihan-tebal, 2px) solid var(--pelatihan-garis, #111111);
  border-radius: var(--pelatihan-radius, 3px);
  box-shadow: var(--pelatihan-bayangan-jauh, 4px) var(--pelatihan-bayangan-jauh, 4px) 0
    var(--pelatihan-bayangan, #111111);
  background: var(--pelatihan-permukaan, #ffffff);
}

.ps-label {
  margin: 0 0 10px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: var(--vp-c-text-2);
}

.ps-tombol {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

/* Tinggi minimum 44px mengikuti batas sasaran sentuh. */
.ps-opsi {
  flex: 1 1 240px;
  min-height: 44px;
  padding: 10px 14px;
  text-align: left;
  color: var(--vp-c-text-1);
  background: var(--pelatihan-permukaan, #ffffff);
  border: var(--pelatihan-tebal, 2px) solid var(--pelatihan-garis, #111111);
  border-radius: var(--pelatihan-radius, 3px);
  box-shadow: var(--pelatihan-bayangan-jauh, 4px) var(--pelatihan-bayangan-jauh, 4px) 0
    var(--pelatihan-bayangan, #111111);
  cursor: pointer;
  transition: transform 120ms ease, box-shadow 120ms ease, background-color 120ms ease;
}

.ps-opsi:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--pelatihan-bayangan-jauh-besar, 6px)
    var(--pelatihan-bayangan-jauh-besar, 6px) 0 var(--pelatihan-bayangan, #111111);
}

.ps-opsi:active {
  transform: translate(var(--pelatihan-bayangan-jauh, 4px), var(--pelatihan-bayangan-jauh, 4px));
  box-shadow: 0 0 0 var(--pelatihan-bayangan, #111111);
}

.ps-opsi:focus-visible {
  outline: 2px solid var(--pelatihan-aksen, #b45309);
  outline-offset: 2px;
}

/* Pilihan yang sedang berlaku dibedakan oleh tiga hal sekaligus, bukan warna
   saja: latar navy, teks putih, dan bayangannya hilang sehingga tombolnya
   terlihat tertekan. */
.ps-opsi--aktif {
  color: #ffffff;
  background: var(--pelatihan-navy, #003060);
  box-shadow: none;
}

.dark .ps-opsi--aktif {
  color: #0d1116;
  background: var(--vp-c-brand-1);
}

.ps-judul {
  display: block;
  font-size: 14px;
  font-weight: 700;
}

.ps-ket {
  display: block;
  margin-top: 2px;
  font-size: 12px;
  line-height: 1.5;
  opacity: 0.85;
}

.ps-catatan {
  margin: 12px 0 0;
  font-size: 12.5px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

.ps-contoh {
  display: inline-block;
  padding: 1px 6px;
  font-size: 11px;
  font-weight: 700;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--pelatihan-radius, 3px);
  background: var(--vp-c-bg);
}

@media (max-width: 640px) {
  .ps-opsi {
    flex: 1 1 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ps-opsi {
    transition: none;
  }

  .ps-opsi:hover,
  .ps-opsi:active {
    transform: none;
    box-shadow: var(--pelatihan-bayangan-jauh, 4px) var(--pelatihan-bayangan-jauh, 4px) 0
      var(--pelatihan-bayangan, #111111);
  }
}
</style>
