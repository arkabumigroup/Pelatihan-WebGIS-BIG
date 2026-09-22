<script setup>
// Panel nilai acak heksadesimal untuk Kit Identitas.
//
// Menggantikan perintah `openssl rand -hex 16` dan `openssl rand -hex 32`
// yang sebelumnya diketik di terminal, baik di laptop maupun di dalam VM,
// serta `node -e "crypto.randomBytes(32)"` yang dipakai pada Windows. Sumber
// acaknya `crypto.getRandomValues`, bukan `Math.random`, karena nilainya
// dipakai sebagai kata sandi GeoServer dan kunci penanda tangan sesi.
//
// Nilai disimpan di penyimpanan browser oleh halaman. Tanpa itu, memuat
// ulang halaman akan mengganti nilainya, sedangkan nilai yang sudah disalin
// ke `.env` akan berbeda dengan yang tertulis di halaman ini.

import { ref, computed } from 'vue'

const props = defineProps({
  // Seluruh isian kit: nama peserta, Project ID, dan nilai acaknya. Pemiliknya
  // halaman, supaya nilai acak ikut tersimpan bersama identitas.
  //
  // Kuncinya adalah nama variabel pada `.env`, jadi nilai untuk dua baris yang
  // memang harus sama cukup disimpan satu kali.
  isian: { type: Object, required: true },
  // Baris yang dapat dibuat, lengkap dengan panjang dan tempat pengisiannya.
  paket: { type: Array, required: true },
})

const JENIS = {
  kunci: {
    panjang: 32,
    judul: '64 karakter',
    untuk: 'JWT_SECRET, NEXTAUTH_SECRET',
  },
  sandi: {
    panjang: 16,
    judul: '32 karakter',
    untuk: 'GEOSERVER_PASSWORD dan GEOSERVER_ADMIN_PASSWORD, yang harus sama',
  },
}

const terpakai = ref('')
const konfirmasi = ref('')
const acakLemah = ref('')
const galat = ref('')
let timerTerpakai = null

// Nama variabel pada `.env` yang dibaca bersama-sama, misalnya
// `GEOSERVER_PASSWORD|GEOSERVER_ADMIN_PASSWORD`. Nilainya diambil dari
// kepingan pertama, karena di situlah hasilnya disimpan.
function kunci(baris) {
  return baris.label.split('|')[0]
}

function namaTampil(baris) {
  return baris.label.replace(/\|/g, ' dan ')
}

function jenis(baris) {
  return JENIS[baris.jenis] || JENIS.kunci
}

function buat(baris) {
  const n = jenis(baris).panjang
  const k = kunci(baris)
  try {
    const buffer = new Uint8Array(n)
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(buffer)
      if (acakLemah.value === k) acakLemah.value = ''
    } else {
      // Browser tanpa sumber acak yang layak tetap dapat memakai halaman ini,
      // tetapi hasilnya tidak layak dipakai sebagai kata sandi. Peserta diberi
      // tahu alih-alih dibiarkan memakai nilai yang lemah tanpa sadar.
      for (let i = 0; i < n; i += 1) buffer[i] = Math.floor(Math.random() * 256)
      acakLemah.value = k
    }
    props.isian[k] = Array.from(buffer)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
    konfirmasi.value = ''
    galat.value = ''
  } catch (e) {
    galat.value = k
  }
}

// Nilai yang sudah ada tidak diganti begitu saja. Peserta yang menekan tombol
// ini dua kali karena ragu akan kehilangan nilai yang mungkin sudah disalin ke
// `.env`, dan gejalanya baru muncul jauh kemudian sebagai kegagalan login.
function mintaKonfirmasi(baris) {
  if (props.isian[kunci(baris)]) {
    konfirmasi.value = kunci(baris)
    return
  }
  buat(baris)
}

// Penyalinan dua lapis. `navigator.clipboard` hanya tersedia pada konteks
// aman (HTTPS atau localhost), sedangkan situs ini juga dibuka dari alamat IP
// VM pada Tahap 18.
async function salinTeks(teks) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(teks)
      return true
    } catch (e) {
      // Dilanjutkan ke lapis kedua.
    }
  }

  try {
    const kotak = document.createElement('textarea')
    kotak.value = teks
    kotak.setAttribute('readonly', '')
    kotak.style.position = 'fixed'
    kotak.style.opacity = '0'
    document.body.appendChild(kotak)
    kotak.select()
    const berhasil = document.execCommand('copy')
    document.body.removeChild(kotak)
    return berhasil
  } catch (e) {
    return false
  }
}

async function salin(baris) {
  const berhasil = await salinTeks(props.isian[kunci(baris)])
  if (!berhasil) {
    galat.value = kunci(baris) + ':tidak'
    return
  }
  terpakai.value = kunci(baris)
  if (timerTerpakai) clearTimeout(timerTerpakai)
  timerTerpakai = setTimeout(() => {
    terpakai.value = ''
  }, 2000)
}

const jumlahTerisi = computed(
  () => props.paket.filter((b) => props.isian[kunci(b)]).length
)

// Nilai dipecah menjadi blok delapan karakter supaya 64 karakter dapat
// diperiksa mata tanpa dihitung satu per satu. Yang disalin dan disimpan tetap
// satu kesatuan tanpa spasi.
function potong(nilai) {
  if (!nilai) return []
  return nilai.match(/.{1,8}/g) || []
}
</script>

<template>
  <div class="pr">
    <div
      v-for="b in paket"
      :key="kunci(b)"
      class="pr-baris"
      :class="{ 'pr-baris--terisi': isian[kunci(b)] }"
    >
      <div class="pr-kepala">
        <h4 class="pr-nama"><code>{{ namaTampil(b) }}</code></h4>
        <span class="pr-jenis">{{ jenis(b).judul }}</span>
      </div>

      <p class="pr-keterangan">
        {{ jenis(b).untuk }}. Diisikan pada <a :href="b.tautan">{{ b.tempat }}</a>.
      </p>

      <output v-if="isian[kunci(b)]" class="pr-nilai">
        <span v-for="(bagian, i) in potong(isian[kunci(b)])" :key="i" class="pr-bagian">{{ bagian }}</span>
      </output>
      <p v-else class="pr-kosong">Belum dibuat.</p>

      <!-- Konfirmasi hanya muncul pada nilai yang sudah ada, karena hanya
           nilai itu yang dapat hilang bila tertimpa. -->
      <div v-if="konfirmasi === kunci(b)" class="pr-konfirmasi">
        <p>
          Nilai lama akan hilang dan tidak dapat dikembalikan. Bila nilainya
          sudah disalin ke file <code>.env</code>, file itu harus diubah
          lagi supaya cocok.
        </p>
        <div class="pr-aksi">
          <button type="button" class="pr-tombol pr-tombol--bahaya" @click="buat(b)">
            Ya, ganti nilainya
          </button>
          <button type="button" class="pr-tombol" @click="konfirmasi = ''">Batal</button>
        </div>
      </div>

      <div v-else class="pr-aksi">
        <button
          type="button"
          class="pr-tombol"
          :class="{ 'pr-tombol--utama': !isian[kunci(b)] }"
          @click="mintaKonfirmasi(b)"
        >
          {{ isian[kunci(b)] ? 'Buat ulang' : 'Buat nilai acak' }}
        </button>
        <button
          v-if="isian[kunci(b)]"
          type="button"
          class="pr-tombol"
          @click="salin(b)"
        >
          {{ terpakai === kunci(b) ? 'Tersalin' : 'Salin' }}
        </button>
      </div>

      <p v-if="galat === kunci(b)" class="pr-galat" role="alert">
        Nilai acak gagal dibuat. Muat ulang halaman ini, lalu coba lagi.
      </p>

      <p v-if="galat === kunci(b) + ':tidak'" class="pr-galat" role="alert">
        Nilai tidak dapat disalin otomatis. Pilih teksnya, lalu tekan Ctrl+C.
      </p>

      <p v-if="acakLemah === kunci(b)" class="pr-galat" role="alert">
        Browser ini tidak menyediakan sumber acak yang layak untuk kata sandi,
        sehingga nilainya dibuat dengan cara yang lemah. Jangan pakai nilai ini.
        Jalankan <code>openssl rand -hex {{ jenis(b).panjang }}</code> di
        terminal sebagai gantinya.
      </p>
    </div>

    <p class="pr-ringkas" role="status">
      <template v-if="jumlahTerisi === 0">
        Belum ada nilai yang dibuat.
      </template>
      <template v-else>
        {{ jumlahTerisi }} dari {{ paket.length }} nilai sudah dibuat.
      </template>
    </p>
  </div>
</template>

<style scoped>
.pr-baris {
  padding: 14px;
  margin: 0 0 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--pelatihan-radius, 3px);
  background: var(--vp-c-bg-soft);
}

/* Nilai yang sudah dibuat diberi batas tebal, bukan warna berbeda. Warna
   identitas di halaman ini sudah dipakai penanda tempat menjalankan. */
.pr-baris--terisi {
  border: var(--pelatihan-tebal, 2px) solid var(--pelatihan-garis, #111111);
}

.pr-kepala {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}

.pr-nama {
  margin: 0;
  padding: 0;
  font-size: 14px;
  border-top: none;
}

.pr-jenis {
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.pr-keterangan {
  margin: 6px 0 10px;
  font-size: 12.5px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

/* Nilai dipecah menjadi blok delapan karakter, sehingga 64 karakter selesai
   dibaca dalam dua baris pendek alih-alih satu baris panjang yang sulit
   diperiksa. */
.pr-nilai {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 8px;
  padding: 10px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--pelatihan-radius, 3px);
  background: var(--vp-c-bg);
  cursor: text;
  user-select: all;
}

.pr-bagian {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 13px;
  line-height: 1.5;
  color: var(--vp-c-text-1);
}

.pr-kosong {
  margin: 0;
  padding: 10px 12px;
  font-size: 13px;
  color: var(--vp-c-text-2);
  border: 1px dashed var(--vp-c-divider);
  border-radius: var(--pelatihan-radius, 3px);
}

.pr-konfirmasi {
  padding: 10px 12px;
  border: var(--pelatihan-tebal, 2px) solid var(--pelatihan-status-warning, #8a5a00);
  border-radius: var(--pelatihan-radius, 3px);
}

.pr-konfirmasi p {
  margin: 0;
  font-size: 12.5px;
  line-height: 1.6;
  color: var(--vp-c-text-1);
}

.pr-aksi {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.pr-konfirmasi .pr-aksi {
  margin-top: 10px;
}

/* Tinggi minimum 44px mengikuti batas sasaran sentuh, karena halaman ini
   juga dibuka dari ponsel saat peserta menyalin nilai ke terminal.

   Bayangan padatnya mengikuti DESIGN.md, yang menyebut tombol sebagai salah
   satu blok bergaris tegas dengan bayangan tanpa blur. Sebelumnya tombol di
   panel ini hanya bergaris, sehingga terlihat lebih datar daripada tombol di
   bagian lain halaman yang sama. */
.pr-tombol {
  min-height: 44px;
  padding: 10px 16px;
  font-size: 13.5px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  background: var(--pelatihan-permukaan, #ffffff);
  border: var(--pelatihan-tebal, 2px) solid var(--pelatihan-garis, #111111);
  border-radius: var(--pelatihan-radius, 3px);
  box-shadow: var(--pelatihan-bayangan-jauh, 4px) var(--pelatihan-bayangan-jauh, 4px) 0
    var(--pelatihan-bayangan, #111111);
  cursor: pointer;
  transition: transform 120ms ease, box-shadow 120ms ease, background-color 120ms ease;
}

.pr-tombol:hover {
  background: var(--pelatihan-kertas, #f4f1ea);
  transform: translate(-2px, -2px);
  box-shadow: var(--pelatihan-bayangan-jauh-besar, 6px)
    var(--pelatihan-bayangan-jauh-besar, 6px) 0 var(--pelatihan-bayangan, #111111);
}

.pr-tombol:active {
  transform: translate(var(--pelatihan-bayangan-jauh, 4px), var(--pelatihan-bayangan-jauh, 4px));
  box-shadow: 0 0 0 var(--pelatihan-bayangan, #111111);
}

.pr-tombol--utama {
  color: var(--vp-button-brand-text);
  background: var(--vp-button-brand-bg);
}

.pr-tombol--utama:hover {
  background: var(--vp-c-brand-2);
}

.pr-tombol--bahaya {
  color: #ffffff;
  background: var(--pelatihan-status-danger, #a3231c);
}

.pr-tombol--bahaya:hover {
  background: #7d1a15;
}

.pr-tombol:focus-visible {
  outline: 2px solid var(--pelatihan-aksen, #b45309);
  outline-offset: 2px;
}

.pr-galat {
  margin: 10px 0 0;
  font-size: 12.5px;
  line-height: 1.6;
  color: var(--pelatihan-status-danger, #a3231c);
}

.pr-ringkas {
  margin: 0;
  font-size: 12.5px;
  color: var(--vp-c-text-2);
}

@media (prefers-reduced-motion: reduce) {
  .pr-tombol {
    transition: none;
  }

  .pr-tombol:hover,
  .pr-tombol:active {
    transform: none;
    box-shadow: var(--pelatihan-bayangan-jauh, 4px) var(--pelatihan-bayangan-jauh, 4px) 0
      var(--pelatihan-bayangan, #111111);
  }
}
</style>
