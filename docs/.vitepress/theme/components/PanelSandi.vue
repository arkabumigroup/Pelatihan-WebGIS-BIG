<script setup>
// Panel kata sandi super admin untuk Kit Identitas.
//
// Salah satu dari dua cara membuat hash kata sandi super admin. Cara lainnya
// adalah `node scripts/hash-password.mjs` di terminal, yang tetap berlaku dan
// tetap disebut pada halaman Skema Database. Panel ini dipakai peserta yang
// belum memasang Node.js, atau yang lebih suka seluruh nilainya tersimpan di
// browser sehingga tidak perlu dicatat ulang.
//
// Dua nilai yang dihasilkan di sini berbeda sifatnya:
//
//   1. Kata sandi asli. Diperlukan untuk masuk ke portal, dan hanya ada di
//      halaman ini. Bcrypt bersifat satu arah, jadi kata sandi yang terlupa
//      tidak dapat dibaca kembali dari kolom `password` di database.
//   2. Hash bcrypt-nya. Itu yang ditempel ke `<ISI_HASH_DI_SINI>` pada
//      `sql/02-seed-super-admin.sql`.
//
// Hash dihitung di browser. Pustakanya sengaja tidak dimuat saat halaman
// dibuka, melainkan saat tombolnya ditekan, supaya halaman identitas tetap
// ringan bagi peserta yang tidak memerlukan bagian ini.

import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { withBase } from 'vitepress'

// Halaman yang dituju ditulis dengan `withBase`, bukan sebagai alamat biasa.
// Situs ini dipasang pada subfolder `/Pelatihan-WebGIS-BIG/`, dan alamat yang
// ditulis apa adanya akan kehilangan subfolder itu sehingga tautannya mati.
const TAUTAN_SKEMA = withBase('/hari-4/praktik-11/skema-database#membuat-akun-super-admin')
const TAUTAN_UJI = withBase('/hari-4/praktik-11/konfigurasi-project#tahap-8-uji-seluruh-file-di-laptop')

const KUNCI_SIMPAN = 'webgisbig.kit-sandi.v1'

// Biaya bcrypt. Dua belas, sama dengan bawaan `scripts/hash-password.mjs` dan
// dengan awalan `$2b$12$` yang disebut halaman Skema Database. Nilai ini juga
// yang ditulis ke dalam hash, sehingga hash lama tetap dapat diverifikasi
// setelah nilai di sini berubah.
const BIAYA = 12

// Panjang kata sandi. Tiga puluh dua karakter heksadesimal, sama dengan nilai
// acak pada langkah sebelumnya, sehingga seluruh sandi di kit ini seragam
// bentuknya dan jauh melewati batas delapan karakter pada skrip lama.
const PANJANG = 32

// Sumber acaknya `crypto.getRandomValues`, bukan `Math.random`. Nilai ini
// dipakai untuk masuk ke portal, jadi kelemahannya berakibat langsung.
function acakHex() {
  const buffer = new Uint8Array(PANJANG / 2)
  if (typeof crypto === 'undefined' || !crypto.getRandomValues) return ''
  crypto.getRandomValues(buffer)
  return Array.from(buffer)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

const email = ref('')
const sandi = ref('')
const hash = ref('')
const sedangHitung = ref(false)
const tampilSandi = ref(false)
const konfirmasi = ref(false)
const galat = ref('')
const terpakai = ref('')
// Kata sandinya berasal dari penyimpanan browser, bukan baru dibuat pada
// kunjungan ini. Bedanya dipakai untuk memberi tahu peserta bahwa yang
// terlihat bukan kata sandi baru, melainkan yang sudah tersimpan.
const dariSimpanan = ref(false)

let timerTerpakai = null
let timerGalat = null

// Email diperiksa dengan pola yang sama seperti `02-seed-super-admin.sql`,
// jadi nilai yang lolos di sini juga lolos di SQL Editor. Tanpa ini, file
// SQL berhenti dengan pengecualian setelah hash terlanjur dihitung.
const pesanEmail = computed(() => {
  const e = email.value.trim()
  if (!e) return ''
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) return 'Email belum berbentuk alamat yang sah.'
  return ''
})

// Panel disebut terisi bila kata sandinya ada, bukan bila hash-nya ada.
// Hash sengaja tidak disimpan, jadi setelah halaman dimuat ulang hanya kata
// sandinya yang kembali. Menjadikan hash sebagai syarat akan menyembunyikan
// kata sandi yang sudah tersimpan, dan peserta akan membuat yang baru padahal
// akunnya sudah memakai yang lama.
const siap = computed(() => sandi.value !== '')

function kabari(teks) {
  galat.value = teks
  if (timerGalat) clearTimeout(timerGalat)
  timerGalat = setTimeout(() => {
    galat.value = ''
  }, 6000)
}

// Nilai yang ditampilkan disamarkan sampai peserta memintanya. Halaman ini
// sering dibuka di ruang kelas dan diproyeksikan ke layar.
const sandiTampil = computed(() =>
  tampilSandi.value ? sandi.value : '•'.repeat(sandi.value.length)
)

async function hitung(sandiPilihan) {
  if (sedangHitung.value) return
  const sandiBaru = sandiPilihan || acakHex()
  if (!sandiBaru || sandiBaru.length < 8) {
    kabari(
      'Kata sandi tidak dibuat karena sumber acaknya tidak tersedia atau terlalu pendek. Isi kata sandi pilihan Anda sendiri minimal 8 karakter, lalu tekan Hitung hash.'
    )
    return
  }
  await hitungHash(sandiBaru, sandiBaru)
}

// Menghitung ulang hash dari kata sandi yang sudah ada. Diperlukan setelah
// halaman dimuat ulang, karena hash-nya tidak ikut disimpan: yang tersimpan
// hanya kata sandinya, dan bcrypt tidak dapat dibalik dari hash ke kata sandi.
async function hitungUlangHash() {
  if (sedangHitung.value || !sandi.value) return
  await hitungHash(sandi.value, null)
}

// `ganti` bernilai null berarti kata sandinya tidak diubah, hanya hash-nya
// yang dihitung ulang. Pemisahan ini menjaga agar kata sandi yang sudah
// tercatat di tempat lain tidak tergantikan tanpa sengaja.
async function hitungHash(sandiUntukHash, ganti) {
  sedangHitung.value = true
  galat.value = ''
  try {
    // Pustaka bcryptjs dimuat saat dibutuhkan. Modulnya sudah dipakai aplikasi
    // Next.js pada `scripts/hash-password.mjs`, jadi hash yang dihasilkan di
    // sini dapat diverifikasi oleh `bcrypt.compare` pada aplikasi itu.
    const modul = await import('bcryptjs')
    const bcrypt = modul.default || modul
    hash.value = await bcrypt.hash(sandiUntukHash, BIAYA)
    if (ganti !== null) {
      sandi.value = ganti
      tampilSandi.value = true
      dariSimpanan.value = false
      konfirmasi.value = false
      simpan()
    }
  } catch (e) {
    // Pesan aslinya tidak ditampilkan: isinya menyebut nama file di dalam
    // bundel situs, yang tidak berguna bagi peserta.
    kabari(
      'Hash gagal dihitung di browser ini. Buat hash-nya dengan node scripts/hash-password.mjs di folder proyek, lalu tempel hasilnya ke file SQL.'
    )
  } finally {
    sedangHitung.value = false
  }
}

// Kata sandi yang sudah dipakai untuk membuat akun tidak diganti begitu saja.
// Menggantinya setelah akunnya ada berarti hash di database harus diperbarui
// lewat SQL Editor; bila tidak, login gagal dengan pesan yang tidak menyebut
// sebabnya.
function mintaKonfirmasi() {
  if (siap.value) {
    sandiTertunda.value = ''
    konfirmasi.value = true
    return
  }
  hitung()
}

// Kata sandi pilihan sendiri. Selalu tersedia, bukan hanya saat sumber acak
// tidak ada, karena sebagian peserta lebih memilih kata sandi yang mudah
// mereka ingat daripada rangkaian acak sepanjang 32 karakter.
//
// Nilainya tidak disimpan sampai hash-nya berhasil dihitung, sehingga tidak
// ada kata sandi setengah jadi yang tertinggal di penyimpanan.
const sandiManual = ref('')

// Kata sandi manual yang menunggu konfirmasi. Terisi hanya bila peserta
// mengganti kata sandi yang sudah ada dengan pilihannya sendiri.
const sandiTertunda = ref('')

function hitungManual() {
  const nilai = sandiManual.value.trim()
  if (nilai.length < 8) return
  if (sandi.value) {
    sandiTertunda.value = nilai
    konfirmasi.value = true
    return
  }
  hitung(nilai)
  sandiManual.value = ''
}

// Dipanggil tombol pada kotak konfirmasi. Memakai kata sandi manual yang
// sedang menunggu bila ada, dan membuat yang acak bila tidak.
function gantiSandi() {
  hitung(sandiTertunda.value || undefined)
  sandiTertunda.value = ''
  sandiManual.value = ''
}

function batalGanti() {
  konfirmasi.value = false
  sandiTertunda.value = ''
}

// Memblok kotak nilainya lalu menekan Ctrl+C menghasilkan pemisah antar blok,
// karena flex item diperlakukan browser sebagai blok. Pada hash, pemisah itu
// merusak berkas SQL tempatnya ditempel, dan tidak terlihat bahwa ada yang
// salah. Handler ini mengganti isi papan klip dengan nilai aslinya.
//
// Pada kata sandi yang sedang disamarkan, handler ini sengaja tidak dipasang:
// yang terlihat hanya titik-titik, dan menyalinnya tidak boleh mengeluarkan
// kata sandi yang justru sedang disembunyikan dari layar kelas.
function salinBersih(peristiwa, nilai) {
  if (!peristiwa.clipboardData || !nilai) return
  peristiwa.clipboardData.setData('text/plain', nilai)
  peristiwa.preventDefault()
}

async function salin(teks, tanda) {
  const berhasil = await salinTeks(teks)
  if (!berhasil) {
    kabari('Nilai tidak dapat disalin otomatis. Pilih teksnya, lalu tekan Ctrl+C.')
    return
  }
  terpakai.value = tanda
  if (timerTerpakai) clearTimeout(timerTerpakai)
  timerTerpakai = setTimeout(() => {
    terpakai.value = ''
  }, 2000)
}

// Penyalinan dua lapis. `navigator.clipboard` hanya tersedia pada konteks
// aman, sedangkan situs ini juga dibuka dari alamat IP VM pada Tahap 18.
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

// --- Penyimpanan di browser -------------------------------------------
//
// Berbeda dari identitas peserta yang boleh terbaca siapa saja, isi panel ini
// adalah kredensial. Yang disimpan hanya kata sandi dan emailnya, di
// localStorage, supaya peserta tidak kehilangan kata sandi yang sudah dipakai
// membuat akun. Hash-nya tidak ikut disimpan: nilainya panjang, hanya dipakai
// sekali saat mengisi file SQL, dan dapat dihitung ulang kapan saja.
function simpan() {
  if (!sandi.value) return
  try {
    localStorage.setItem(
      KUNCI_SIMPAN,
      JSON.stringify({ email: email.value.trim(), sandi: sandi.value, waktu: Date.now() })
    )
  } catch (e) {
    // Penyimpanan lokal diblokir atau penuh. Nilainya tetap tampil di layar
    // dan masih dapat disalin, hanya saja tidak bertahan setelah halaman
    // ditutup.
  }
}

function pulihkan() {
  let isi = ''
  try {
    isi = localStorage.getItem(KUNCI_SIMPAN) || ''
  } catch (e) {
    isi = ''
  }
  if (!isi) return
  try {
    const catatan = JSON.parse(isi)
    if (catatan && typeof catatan === 'object') {
      if (catatan.email) email.value = catatan.email
      if (catatan.sandi) {
        sandi.value = catatan.sandi
        dariSimpanan.value = true
      }
    }
  } catch (e) {
    // Catatan lama yang bentuknya tidak dikenali diabaikan, bukan dihapus.
  }
}

function hapus() {
  email.value = ''
  sandi.value = ''
  hash.value = ''
  konfirmasi.value = false
  tampilSandi.value = false
  try {
    localStorage.removeItem(KUNCI_SIMPAN)
  } catch (e) {
    // Tujuannya menghapus, jadi penyimpanan yang tidak dapat diakses berarti
    // memang tidak ada yang perlu dihapus.
  }
}

// Email disimpan mengikuti ketikan, karena peserta dapat mengisinya sebelum
// kata sandinya dibuat.
function perbaruiEmail() {
  if (sandi.value) simpan()
}

onMounted(pulihkan)
onBeforeUnmount(() => {
  if (timerTerpakai) clearTimeout(timerTerpakai)
  if (timerGalat) clearTimeout(timerGalat)
})
</script>

<template>
  <div class="ps">
    <div class="ps-kepala">
      <h4 class="ps-nama">Kata sandi super admin</h4>
      <span class="ps-jenis">Bcrypt, biaya {{ BIAYA }}</span>
    </div>

    <p class="ps-keterangan">
      Dipakai untuk membuat akun super admin pada
      <a :href="TAUTAN_SKEMA">Skema Database</a>. Hash-nya dihitung di browser
      Anda, jadi Node.js tidak perlu dipasang di laptop. Perintah
      <code>node scripts/hash-password.mjs</code> tetap dapat dipakai sebagai
      cara lain; hasil keduanya sama-sama sah.
    </p>

    <label class="ps-label">
      <span>Email super admin</span>
      <input
        v-model="email"
        type="email"
        spellcheck="false"
        autocomplete="off"
        placeholder="nama@email.com"
        @change="perbaruiEmail"
      />
    </label>
    <p v-if="pesanEmail" class="ps-galat" role="alert">{{ pesanEmail }}</p>

    <template v-if="siap">
      <div class="ps-kotak">
        <div class="ps-baris">
          <span class="ps-tanda">Kata sandi</span>
          <output
            class="ps-nilai"
            :class="{ 'ps-nilai--sandi': !tampilSandi }"
            aria-label="Kata sandi super admin"
            @copy="tampilSandi ? salinBersih($event, sandi) : null"
          >{{ sandiTampil }}</output>
        </div>
        <div class="ps-aksi">
          <button type="button" class="ps-tombol" @click="salin(sandi, 'sandi')">
            {{ terpakai === 'sandi' ? 'Tersalin' : 'Salin kata sandi' }}
          </button>
          <label class="ps-centang">
            <input v-model="tampilSandi" type="checkbox" />
            <span>Tampilkan di layar</span>
          </label>
        </div>
        <p v-if="dariSimpanan && !tampilSandi" class="ps-catatan ps-catatan--rapat">
          Ini kata sandi yang tersimpan di browser ini, bukan yang baru dibuat.
          Centang <strong>Tampilkan di layar</strong> untuk membacanya lagi.
        </p>
      </div>

      <div v-if="hash" class="ps-kotak">
        <div class="ps-baris">
          <span class="ps-tanda">Hash untuk <code>&lt;ISI_HASH_DI_SINI&gt;</code></span>
          <output
            class="ps-nilai"
            aria-label="Hash bcrypt kata sandi super admin"
            @copy="salinBersih($event, hash)"
          >{{ hash }}</output>
        </div>
        <div class="ps-aksi">
          <button type="button" class="ps-tombol ps-tombol--utama" @click="salin(hash, 'hash')">
            {{ terpakai === 'hash' ? 'Tersalin' : 'Salin hash' }}
          </button>
          <span class="ps-ket">Panjang {{ hash.length }} karakter, berawalan {{ hash.slice(0, 7) }}</span>
        </div>
      </div>

      <!-- Hash tidak ikut disimpan, jadi setelah halaman dimuat ulang hanya
           kata sandinya yang kembali. Hash-nya dihitung ulang dari kata sandi
           itu, dan hasilnya berbeda dari yang lama walaupun kata sandinya sama:
           bcrypt memakai salt baru setiap kali. -->
      <div v-else class="ps-kotak ps-kotak--kosong">
        <p class="ps-catatan ps-catatan--rapat">
          Hash-nya belum dihitung pada pembukaan halaman ini. Hash tidak
          disimpan, karena hanya dipakai sekali saat mengisi file SQL.
        </p>
        <div class="ps-aksi">
          <button
            type="button"
            class="ps-tombol ps-tombol--utama"
            :disabled="sedangHitung"
            @click="hitungUlangHash"
          >
            {{ sedangHitung ? 'Menghitung hash...' : 'Hitung ulang hash' }}
          </button>
          <span class="ps-ket">Dari kata sandi di atas, tanpa menggantinya</span>
        </div>
      </div>

      <p class="ps-catatan">
        Email dan hash di atas menggantikan kedua penanda pada
        <code>sql/02-seed-super-admin.sql</code>. Kata sandinya dipakai untuk
        masuk ke portal pada <a :href="TAUTAN_UJI">Tahap 8 halaman Konfigurasi Project</a>.
      </p>

      <div v-if="konfirmasi" class="ps-konfirmasi">
        <p>
          <template v-if="sandiTertunda">
            Kata sandi di atas akan diganti dengan kata sandi pilihan Anda.
          </template>
          <template v-else>
            Kata sandi lama akan hilang dan diganti dengan yang baru.
          </template>
          Kata sandi lama tidak dapat dikembalikan. Bila akun super adminnya
          sudah dibuat, kata sandi di database harus diganti lebih dahulu lewat
          SQL Editor; tanpa itu, login gagal tanpa pesan yang menyebut sebabnya.
        </p>
        <div class="ps-aksi">
          <button type="button" class="ps-tombol ps-tombol--bahaya" @click="gantiSandi()">
            {{ sandiTertunda ? 'Ya, pakai kata sandi saya' : 'Ya, buat yang baru' }}
          </button>
          <button type="button" class="ps-tombol" @click="batalGanti()">Batal</button>
        </div>
      </div>

      <div v-else class="ps-aksi">
        <button type="button" class="ps-tombol" :disabled="sedangHitung" @click="mintaKonfirmasi">
          {{ sedangHitung ? 'Menghitung hash...' : 'Buat ulang kata sandi' }}
        </button>
        <button type="button" class="ps-tombol" @click="hapus">Hapus dari browser ini</button>
      </div>
    </template>

    <div v-else class="ps-aksi">
      <button
        type="button"
        class="ps-tombol ps-tombol--utama"
        :disabled="sedangHitung"
        @click="hitung()"
      >
        {{ sedangHitung ? 'Menghitung hash...' : 'Buat kata sandi dan hash' }}
      </button>
      <span class="ps-ket">Sekitar setengah detik, karena bcrypt memang lambat</span>
    </div>

    <!-- Kata sandi pilihan sendiri selalu tersedia, bukan hanya saat tombol
         di atas gagal. Sebagian peserta lebih memilih kata sandi yang mudah
         mereka ingat daripada rangkaian acak sepanjang 32 karakter. -->
    <div class="ps-manual">
      <label class="ps-label">
        <span>{{ siap ? 'Ganti dengan kata sandi Anda sendiri' : 'Pakai kata sandi Anda sendiri' }}</span>
        <input
          v-model="sandiManual"
          type="password"
          spellcheck="false"
          autocomplete="new-password"
          placeholder="Minimal 8 karakter"
          @keyup.enter="hitungManual"
        />
      </label>
      <button
        type="button"
        class="ps-tombol"
        :disabled="sedangHitung || sandiManual.trim().length < 8"
        @click="hitungManual"
      >
        Hitung hash
      </button>
    </div>

    <p v-if="sedangHitung" class="ps-catatan" role="status">
      Sedang menghitung hash bcrypt. Jangan tutup halaman ini.
    </p>

    <p v-if="galat" class="ps-galat" role="alert">{{ galat }}</p>

    <p v-if="siap" class="ps-catatan" role="status">
      Kata sandi dan email disimpan di browser ini saja, sehingga muncul lagi
      saat halaman dibuka kembali. Hash-nya tidak disimpan, karena hanya dipakai
      sekali pada file SQL. Bcrypt satu arah, jadi kata sandi yang terlupa
      tidak dapat dibaca kembali dari database.
    </p>

    <p v-else class="ps-catatan">
      Hash dihitung memakai pustaka bcryptjs di browser Anda, bukan dikirim ke
      server mana pun. Pustaka itu sama dengan yang dipakai aplikasi Next.js,
      jadi hash yang dihasilkan pasti dapat diverifikasi saat Anda masuk ke portal.
    </p>
  </div>
</template>

<style scoped>
.ps-kepala {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}

.ps-nama {
  margin: 0;
  padding: 0;
  font-size: 14px;
  border-top: none;
}

.ps-jenis {
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.ps-keterangan {
  margin: 6px 0 10px;
  font-size: 12.5px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

.ps-label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 360px;
  margin-bottom: 4px;
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.ps-label input {
  width: 100%;
  min-height: 44px;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  background: var(--pelatihan-permukaan, #ffffff);
  border: var(--pelatihan-tebal, 2px) solid var(--pelatihan-garis, #111111);
  border-radius: var(--pelatihan-radius, 3px);
  box-shadow: var(--pelatihan-bayangan-jauh, 4px) var(--pelatihan-bayangan-jauh, 4px) 0
    var(--pelatihan-bayangan, #111111);
}

.ps-label input::placeholder {
  font-weight: 400;
  color: var(--vp-c-text-3);
}

.ps-kotak {
  margin-top: 12px;
  padding: 12px;
  border: var(--pelatihan-tebal, 2px) solid var(--pelatihan-garis, #111111);
  border-radius: var(--pelatihan-radius, 3px);
}

/* Tombol di dalam kotak diberi jarak lebih besar daripada tombol di luar.
   Alasannya terukur: tombolnya berbayang padat 4px dan bergerak 2px saat
   disorot, sedangkan nilai di atasnya berupa teks yang dapat membungkus
   menjadi dua baris. Dengan jarak 12px, baris terakhir nilai terlihat
   bersinggungan dengan sisi atas tombol. */
.ps-kotak .ps-aksi {
  margin-top: 18px;
}

/* Kotak hash yang belum dihitung ditandai garis putus-putus, sama seperti
   keadaan kosong pada panel nilai acak. Bedanya harus terlihat, karena isinya
   bukan nilai yang siap disalin. */
.ps-kotak--kosong {
  border-style: dashed;
  border-width: 1px;
}

.ps-baris {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ps-tanda {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: var(--vp-c-text-2);
}

/* Kata sandi dan hash ditampilkan apa adanya, tanpa dikelompokkan, supaya yang
   terlihat persis sama dengan yang tersalin. Sebelumnya keduanya dipecah
   menjadi potongan, dan jarak antar potongan itu terbaca sebagai spasi
   sehingga peserta menduga nilainya memuat spasi. */
.ps-nilai {
  display: block;
  min-height: 20px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 13px;
  line-height: 1.5;
  overflow-wrap: anywhere;
  color: var(--vp-c-text-1);
  cursor: text;
  user-select: all;
}

/* Kata sandi yang disamarkan ditulis lebih rapat dan lebih pudar, karena
   isinya hanya titik-titik penanda panjang. */
.ps-nilai--sandi {
  letter-spacing: 0.04em;
  color: var(--vp-c-text-2);
}

.ps-aksi {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
}

.ps-manual {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 10px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--vp-c-divider);
}

.ps-manual .ps-label {
  flex: 1 1 240px;
  margin-bottom: 0;
}

.ps-centang {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  font-size: 12.5px;
  color: var(--vp-c-text-2);
  cursor: pointer;
}

.ps-centang input {
  width: 18px;
  height: 18px;
  accent-color: var(--vp-c-brand-1);
  cursor: pointer;
}

/* Tinggi minimum 44px mengikuti batas sasaran sentuh, dan bayangan padatnya
   mengikuti DESIGN.md, sama seperti tombol pada panel nilai acak. */
.ps-tombol {
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

.ps-tombol:hover:not(:disabled) {
  background: var(--pelatihan-kertas, #f4f1ea);
  transform: translate(-2px, -2px);
  box-shadow: var(--pelatihan-bayangan-jauh-besar, 6px)
    var(--pelatihan-bayangan-jauh-besar, 6px) 0 var(--pelatihan-bayangan, #111111);
}

.ps-tombol:active:not(:disabled) {
  transform: translate(var(--pelatihan-bayangan-jauh, 4px), var(--pelatihan-bayangan-jauh, 4px));
  box-shadow: 0 0 0 var(--pelatihan-bayangan, #111111);
}

.ps-tombol--utama {
  color: var(--vp-button-brand-text);
  background: var(--vp-button-brand-bg);
}

.ps-tombol--utama:hover:not(:disabled) {
  background: var(--vp-c-brand-2);
}

.ps-tombol--bahaya {
  color: #ffffff;
  background: var(--pelatihan-status-danger, #a3231c);
}

.ps-tombol--bahaya:hover:not(:disabled) {
  background: #7d1a15;
}

.ps-tombol:disabled {
  color: var(--vp-c-text-3);
  border-color: var(--vp-c-divider);
  box-shadow: none;
  cursor: default;
}

.ps-tombol:focus-visible,
.ps-label input:focus-visible,
.ps-centang input:focus-visible {
  outline: 2px solid var(--pelatihan-aksen, #b45309);
  outline-offset: 2px;
}

.ps-konfirmasi {
  margin-top: 12px;
  padding: 10px 12px;
  border: var(--pelatihan-tebal, 2px) solid var(--pelatihan-status-warning, #8a5a00);
  border-radius: var(--pelatihan-radius, 3px);
}

.ps-konfirmasi p {
  margin: 0;
  font-size: 12.5px;
  line-height: 1.6;
  color: var(--vp-c-text-1);
}

.ps-konfirmasi .ps-aksi {
  margin-top: 10px;
}

.ps-catatan {
  margin: 10px 0 0;
  font-size: 12.5px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

.ps-catatan--rapat {
  margin: 0;
}

.ps-ket {
  font-size: 12.5px;
  color: var(--vp-c-text-2);
}

.ps-galat {
  margin: 10px 0 0;
  font-size: 12.5px;
  line-height: 1.6;
  color: var(--pelatihan-status-danger, #a3231c);
}

@media (prefers-reduced-motion: reduce) {
  .ps-tombol {
    transition: none;
  }

  .ps-tombol:hover,
  .ps-tombol:active {
    transform: none;
    box-shadow: var(--pelatihan-bayangan-jauh, 4px) var(--pelatihan-bayangan-jauh, 4px) 0
      var(--pelatihan-bayangan, #111111);
  }
}
</style>
