<script setup>
// Kit identitas peserta untuk Deployment Project.
//
// Menyelesaikan dua masalah sekaligus:
//
// 1. Tahap 2 pada halaman Persiapan Repositori meminta peserta mengetik dua
//    nilai dari tabel peserta, lalu menurunkan tiga belas variabel darinya.
//    Di sini Project ID ikut terisi setelah nama peserta dipilih, sehingga
//    tidak ada nilai yang perlu diketik ulang atau disalin dari halaman lain.
//
// 2. Variabel shell hanya bertahan selama sesi Cloud Shell terbuka, sedangkan
//    Cloud Shell menutup sesinya sendiri setelah menganggur sekitar dua puluh
//    menit. Nilai yang sudah dipilih disimpan di peramban peserta, sehingga
//    dapat dibuka kembali kapan saja tanpa mencari ulang di tabel peserta.

import { ref, computed, watch, onMounted } from 'vue'
import { kelompokPeserta } from '../data/peserta'

const props = defineProps({
  // Judul halaman yang memuat alat ini. Dipakai sebagai tingkat judul bagian,
  // supaya daftar isi halaman tetap menampilkan ketiga langkahnya.
  judul: { type: String, default: 'Kit Identitas Peserta' },
})

const KUNCI_SIMPAN = 'webgisbig.kit-identitas.v1'
const NAMA_COOKIE = 'webgisbig_kit'
const UMUR_COOKIE_HARI = 180

// Nilai tetap yang sama untuk seluruh peserta, disalin dari blok Tahap 2.
const ZONE = 'asia-southeast2-b'
const REPOSITORY = 'katalog-images'
const APP_DIR = '/opt/webgis/app'

const namaTerpilih = ref('')
const projectId = ref('')
const modeManual = ref(false)
const waktuSimpan = ref(0)

// Nilai acak yang dibuat peserta. Keempatnya dipakai pada halaman berikutnya,
// jadi disimpan di sini bersama identitas supaya tidak perlu dicari di tempat
// lain setelah Cloud Shell tertutup.
//
// `GEOSERVER_PASSWORD` dan `GEOSERVER_ADMIN_PASSWORD` sengaja hanya satu
// kunci. Keduanya harus bernilai sama, karena satu dipakai container GeoServer
// untuk membuat akun admin dan satu lagi dipakai aplikasi untuk login ke REST
// API-nya. Dua nilai berbeda membuat unggahan layer gagal dengan pesan kosong.
const nilaiAcak = ref({
  JWT_SECRET: '',
  NEXTAUTH_SECRET: '',
  'GEOSERVER_PASSWORD|GEOSERVER_ADMIN_PASSWORD': '',
  NILAI_ACAK_4: '',
})

// Empat baris yang dapat dibuat. Dua di antaranya dipakai di laptop, dua di
// antaranya di VM, jadi penandanya mengikuti halaman tempat nilainya diisi.
const paket = [
  {
    label: 'JWT_SECRET',
    jenis: 'kunci',
    tempat: 'Tahap 5 halaman Konfigurasi Project',
    tautan: '/hari-4/praktik-11/konfigurasi-project#tahap-5-isi-berkas-env',
  },
  {
    label: 'NEXTAUTH_SECRET',
    jenis: 'kunci',
    tempat: 'Tahap 5 halaman Konfigurasi Project',
    tautan: '/hari-4/praktik-11/konfigurasi-project#tahap-5-isi-berkas-env',
  },
  {
    label: 'GEOSERVER_PASSWORD|GEOSERVER_ADMIN_PASSWORD',
    jenis: 'sandi',
    tempat: 'Tahap 18 halaman Menyiapkan Aplikasi di VM',
    tautan: '/hari-4/praktik-11/aplikasi-di-vm#tahap-18-isi-berkas-env',
  },
  {
    label: 'NILAI_ACAK_4',
    jenis: 'kunci',
    tempat: 'Tahap 5 halaman Konfigurasi Project, bila ada variabel rahasia lain',
    tautan: '/hari-4/praktik-11/konfigurasi-project#tahap-5-isi-berkas-env',
  },
]

const daftarPeserta = kelompokPeserta.flatMap((k) =>
  k.peserta.map((p) => ({
    nama: p.nama,
    namaPeserta: p.namaPeserta,
    email: p.email,
    master: k.master,
    bagian: p.bagian,
    batch: p.batch,
    projectId: k.project[p.bagian],
  }))
)

const pesertaTerpilih = computed(
  () => daftarPeserta.find((p) => p.namaPeserta === namaTerpilih.value) || null
)

// Nama peserta yang salah menghasilkan nama resource yang panjangnya melewati
// batas Google Cloud, dan pesan galatnya menyebut nama resource, bukan nama
// variabel. Batasnya diperiksa di sini supaya ketahuan sebelum ke Cloud Shell.
const pesanNama = computed(() => {
  const n = namaTerpilih.value.trim()
  if (!n) return ''
  if (!/^[a-z0-9]+$/.test(n)) return 'Nama peserta hanya boleh huruf kecil dan angka, tanpa spasi dan tanpa tanda hubung.'
  if (n.length < 3) return 'Nama peserta minimal 3 karakter.'
  if (n.length > 12) return 'Nama peserta maksimal 12 karakter.'
  return ''
})

const pesertaId = computed(() => namaTerpilih.value.trim())

const terisi = computed(
  () => pesertaId.value !== '' && projectId.value.trim() !== '' && !pesanNama.value
)

const bentrok = ref(false)
const memeriksa = ref(false)

async function periksaBentrok() {
  if (!terisi.value) return
  memeriksa.value = true
  const project = projectId.value.trim()
  const akun = `projects/${project}/serviceAccounts/cb-${pesertaId.value}@${project}.iam.gserviceaccount.com`
  try {
    // Alamat Service Account yang tidak ada dibalas 404. Alamat yang ada
    // dibalas 401 atau 403, karena halaman ini tidak memakai kredensial.
    // Keduanya tetap berarti nama itu sudah terpakai.
    const respon = await fetch(
      'https://iam.googleapis.com/v1/' + akun + '?fields=name',
      { method: 'GET' }
    )
    bentrok.value = respon.status !== 404
  } catch (e) {
    // Tidak ada jawaban berarti tidak dapat dipastikan. Pemeriksaannya
    // diserahkan ke perintah `gcloud` pada Tahap 2.
    bentrok.value = false
  } finally {
    memeriksa.value = false
  }
}

// Seluruh nilai turunan dihitung, bukan disimpan. Satu-satunya sumbernya
// adalah nama peserta dan Project ID, sehingga tidak ada nilai yang dapat
// tertinggal saat salah satunya diubah.
const nilai = computed(() => {
  const id = pesertaId.value
  const project = projectId.value.trim()
  return {
    PROJECT_ID: project,
    NAMA_PESERTA: id,
    PARTICIPANT_ID: id,
    ZONE: ZONE,
    REGION: ZONE.replace(/-[a-z]$/, ''),
    REPOSITORY: REPOSITORY,
    APP_DIR: APP_DIR,
    VM_NAME: `webgis-${id}`,
    STATIC_IP_NAME: `webgis-ip-${id}`,
    BUILD_SA_NAME: `cb-${id}`,
    BUILD_SA: `cb-${id}@${project}.iam.gserviceaccount.com`,
    CONNECTION_NAME: `github-${id}`,
    LINKED_REPO_NAME: `repo-${id}`,
    TRIGGER_NAME: `deploy-${id}`,
    IMAGE_NAME: `nextjs-${id}`,
    SUBDOMAIN: `${id}.webgisbig.com`,
    VM_REGION: ZONE.replace(/-[a-z]$/, ''),
  }
})

// Keterangan satu baris per variabel. Ditulis di sini, bukan di halaman,
// supaya tabelnya tetap dapat dibaca saat komponen ini dipakai di halaman
// lain tanpa membawa keterangannya.
const keterangan = {
  PROJECT_ID: 'Project kelompok Anda di Google Cloud.',
  NAMA_PESERTA: 'Nama pendek Anda dari tabel peserta. Dasar penamaan seluruh resource.',
  PARTICIPANT_ID: 'Nama yang sama, dipakai blok Tahap 2 untuk menurunkan nama resource.',
  ZONE: 'Zona VM. Sama untuk seluruh peserta.',
  REGION: 'Wilayah yang diturunkan dari zona. Dipakai Artifact Registry.',
  REPOSITORY: 'Artifact Registry milik kelompok. Dibuat koordinator, peserta hanya memakai.',
  APP_DIR: 'Folder aplikasi di dalam VM. Sama untuk seluruh peserta.',
  VM_NAME: 'Nama Virtual Machine Anda.',
  STATIC_IP_NAME: 'Nama IP statis yang dipasang ke VM Anda.',
  BUILD_SA_NAME: 'Nama pendek Service Account Cloud Build Anda.',
  BUILD_SA: 'Alamat lengkap Service Account Cloud Build Anda.',
  CONNECTION_NAME: 'Nama koneksi GitHub pada Cloud Build.',
  LINKED_REPO_NAME: 'Nama repositori yang dihubungkan ke Cloud Build.',
  TRIGGER_NAME: 'Nama trigger yang membangun aplikasi setiap kali Anda push.',
  IMAGE_NAME: 'Nama image aplikasi Anda di Artifact Registry.',
  SUBDOMAIN: 'Alamat Geoportal Anda nanti. Record DNS-nya ditambahkan penyelenggara.',
  VM_REGION: 'Wilayah tempat VM berada, dipakai perintah yang memerlukan region.',
}

// Judul bagian di dalam komponen. Tingkatnya satu di bawah judul halaman,
// sehingga daftar isi menampilkan keempat langkahnya tanpa menambah lapisan
// yang tidak ada isinya. Halaman yang sudah menulis judulnya sendiri dapat
// mengosongkan prop ini supaya judulnya tidak muncul dua kali.
const tingkatJudul = computed(() => (props.judul ? 'h2' : 'h3'))

const baris = computed(() =>
  Object.keys(nilai.value).map((kunci, urutan) => ({
    kunci,
    isi: nilai.value[kunci],
    terang: keterangan[kunci] || '',
    // Nomor barisnya di blok siap tempel. Dua baris pertama adalah
    // PROJECT_ID dan NAMA_PESERTA, lalu satu baris kosong.
    letak: urutan + 4,
  }))
)

// Blok siap tempel. Bentuknya sengaja sama persis dengan blok Tahap 2 pada
// halaman Persiapan Repositori, termasuk urutan barisnya, supaya peserta yang
// sudah menjalankan blok itu dari materi tidak menemukan bentuk yang berbeda.
const blok = computed(() => {
  const v = nilai.value
  return `PROJECT_ID="${v.PROJECT_ID}"
NAMA_PESERTA="${v.NAMA_PESERTA}"

set -euo pipefail

PARTICIPANT_ID="$NAMA_PESERTA"
ZONE="${v.ZONE}"
REGION="${v.REGION}"
REPOSITORY="${v.REPOSITORY}"
APP_DIR="${v.APP_DIR}"
VM_NAME="webgis-\${PARTICIPANT_ID}"
STATIC_IP_NAME="webgis-ip-\${PARTICIPANT_ID}"
BUILD_SA_NAME="cb-\${PARTICIPANT_ID}"
BUILD_SA="\${BUILD_SA_NAME}@\${PROJECT_ID}.iam.gserviceaccount.com"
CONNECTION_NAME="github-\${PARTICIPANT_ID}"
LINKED_REPO_NAME="repo-\${PARTICIPANT_ID}"
TRIGGER_NAME="deploy-\${PARTICIPANT_ID}"
IMAGE_NAME="nextjs-\${PARTICIPANT_ID}"
SUBDOMAIN="\${PARTICIPANT_ID}.webgisbig.com"
VM_REGION="\${ZONE%-*}"

gcloud config set project "$PROJECT_ID" >/dev/null
echo "Siap. VM_NAME=$VM_NAME  SUBDOMAIN=$SUBDOMAIN"`
})

const jumlahBaris = computed(() => blok.value.split('\n').length)

const pesan = ref('')
const pesanGalat = ref(false)
let timerPesan = null
let timerBlok = null

// Umpan balik penyalinan blok ditampilkan di sebelah tombolnya, bukan di bawah
// halaman. Tombolnya berada jauh di atas, sehingga pesan yang muncul di bawah
// tidak akan terlihat oleh peserta yang baru menekannya.
const blokTersalin = ref(false)

function kabari(teks, galat = false) {
  pesan.value = teks
  pesanGalat.value = galat
  if (timerPesan) clearTimeout(timerPesan)
  timerPesan = setTimeout(() => {
    pesan.value = ''
  }, 4000)
}

// Penyalinan dua lapis. `navigator.clipboard` hanya tersedia pada konteks
// aman, sedangkan situs ini juga dibuka dari alamat IP VM pada Tahap 18.
// Lapis kedua memakai pemilihan teks, sehingga peserta masih dapat menyalin
// dengan Ctrl+C saat penyalinan otomatis tidak tersedia.
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

const barisTersalin = ref('')
let timerBaris = null

async function salinNilai(entri) {
  const berhasil = await salinTeks(entri.isi)
  if (!berhasil) {
    kabari('Nilai tidak dapat disalin otomatis. Pilih teksnya, lalu tekan Ctrl+C.', true)
    return
  }
  // Nilai diumumkan lewat `role="status"`, karena pada layar sempit nilai
  // disalin dengan menekan nilainya sendiri. Tanpa pengumuman itu, pembaca
  // layar tidak mendapat bukti apa pun bahwa penekanannya berhasil.
  kabari(`Nilai ${entri.kunci} tersalin.`)
  barisTersalin.value = entri.kunci
  if (timerBaris) clearTimeout(timerBaris)
  timerBaris = setTimeout(() => {
    barisTersalin.value = ''
  }, 2000)
}

async function salinBlok() {
  if (!terisi.value) return
  const berhasil = await salinTeks(blok.value)
  if (berhasil) {
    blokTersalin.value = true
    if (timerBlok) clearTimeout(timerBlok)
    timerBlok = setTimeout(() => {
      blokTersalin.value = false
    }, 4000)
  } else {
    kabari('Blok tidak dapat disalin otomatis. Klik blok di atas, lalu tekan Ctrl+A dan Ctrl+C.', true)
  }
}

// Wadah blok dibuat dapat difokuskan supaya peserta yang penyalinan otomatis
// nya gagal dapat menekan Tab ke sini, menekan Ctrl+A, lalu Ctrl+C.
const wadahBlok = ref(null)

function pilihSemua() {
  if (!wadahBlok.value) return
  const pilihan = window.getSelection()
  const rentang = document.createRange()
  rentang.selectNodeContents(wadahBlok.value)
  pilihan.removeAllRanges()
  pilihan.addRange(rentang)
  wadahBlok.value.focus()
}

// --- Penyimpanan di peramban -------------------------------------------
//
// Nilainya disimpan di localStorage, lalu dicerminkan ke cookie. Cookie
// dipakai sebagai cadangan karena localStorage dapat kosong pada mode
// penyamaran tertentu dan pada peramban yang membersihkan penyimpanan lokal
// antar sesi. Isinya hanya nama peserta dan Project ID: keduanya sudah
// tercantum pada tabel peserta yang terbuka untuk umum, jadi tidak ada
// kredensial yang disimpan di komputer peserta.

function keCookie(isi) {
  // Isi kosong berarti menghapus. Cookie tidak hilang hanya karena nilainya
  // kosong, jadi masa berlakunya harus dimundurkan ke tanggal yang sudah lewat
  // supaya peramban membuangnya. Tanpa itu, cookie kosong tetap tertinggal dan
  // tetap terkirim pada setiap permintaan ke situs ini.
  const kadaluarsa = isi
    ? new Date(Date.now() + UMUR_COOKIE_HARI * 24 * 60 * 60 * 1000)
    : new Date(0)
  document.cookie =
    NAMA_COOKIE +
    '=' +
    encodeURIComponent(isi) +
    '; expires=' +
    kadaluarsa.toUTCString() +
    '; path=/; SameSite=Lax'
}

function dariCookie() {
  const cocok = document.cookie.match(
    new RegExp('(?:^|; )' + NAMA_COOKIE.replace(/\./g, '\\.') + '=([^;]*)')
  )
  return cocok ? decodeURIComponent(cocok[1]) : ''
}

function simpan() {
  if (!terisi.value) return
  // Hanya nilai acak yang sudah dibuat yang ikut disimpan. Kunci bernilai
  // kosong hanya akan menambah panjang catatan tanpa ada isinya.
  const acak = {}
  for (const kunci in nilaiAcak.value) {
    if (nilaiAcak.value[kunci]) acak[kunci] = nilaiAcak.value[kunci]
  }

  const catatan = {
    namaPeserta: pesertaId.value,
    projectId: projectId.value.trim(),
    nilaiAcak: acak,
    waktu: Date.now(),
  }
  const isi = JSON.stringify(catatan)
  waktuSimpan.value = catatan.waktu

  try {
    localStorage.setItem(KUNCI_SIMPAN, isi)
  } catch (e) {
    // Penyimpanan lokal penuh atau diblokir. Cookie di bawah tetap dicoba.
  }

  try {
    keCookie(isi)
  } catch (e) {
    // Cookie diblokir. Penyimpanan lokal sudah cukup bila berhasil.
  }
}

function lupakan() {
  namaTerpilih.value = ''
  projectId.value = ''
  modeManual.value = false
  waktuSimpan.value = 0
  bentrok.value = false
  for (const kunci in nilaiAcak.value) nilaiAcak.value[kunci] = ''
  try {
    localStorage.removeItem(KUNCI_SIMPAN)
  } catch (e) {
    // Tidak ada yang perlu diberitahukan: tujuannya menghapus, dan bila
    // penyimpanan tidak dapat diakses berarti memang tidak ada isinya.
  }
  try {
    keCookie('')
  } catch (e) {
    // Sama seperti di atas.
  }
  kabari('Data yang tersimpan di peramban ini sudah dihapus.')
}

function pulihkan() {
  let isi = ''
  try {
    isi = localStorage.getItem(KUNCI_SIMPAN) || ''
  } catch (e) {
    isi = ''
  }
  if (!isi) {
    try {
      isi = dariCookie()
    } catch (e) {
      isi = ''
    }
  }
  if (!isi) return

  try {
    const catatan = JSON.parse(isi)
    if (!catatan) return
    sedangMemulihkan = true
    if (catatan.namaPeserta) {
      namaTerpilih.value = catatan.namaPeserta
      projectId.value = catatan.projectId || ''
      modeManual.value = !daftarPeserta.some((p) => p.namaPeserta === catatan.namaPeserta)
    }
    if (catatan.nilaiAcak && typeof catatan.nilaiAcak === 'object') {
      for (const kunci in catatan.nilaiAcak) {
        // Kunci yang tidak dikenal diabaikan, sehingga versi halaman yang
        // lebih baru tidak menyuntikkan variabel asing ke dalam catatan.
        if (kunci in nilaiAcak.value) nilaiAcak.value[kunci] = catatan.nilaiAcak[kunci] || ''
      }
    }
    waktuSimpan.value = catatan.waktu || 0
  } catch (e) {
    // Catatan lama yang bentuknya tidak dikenali diabaikan, bukan dihapus,
    // supaya versi halaman yang lebih baru tetap dapat memulihkannya.
  } finally {
    // Dikosongkan pada giliran berikutnya, bukan seketika. Pengamat di Vue
    // berjalan setelah kode ini selesai, jadi penanda harus masih terpasang
    // pada saat itu.
    setTimeout(() => {
      sedangMemulihkan = false
    }, 0)
  }
}

const waktuSimpanTeks = computed(() => {
  if (!waktuSimpan.value) return ''
  try {
    return new Date(waktuSimpan.value).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch (e) {
    return ''
  }
})

// Project ID diisi saat peserta memilih namanya, bukan lewat pengamat.
//
// Pengamat tidak dipakai di sini karena pengamat tidak dapat membedakan
// "Project ID berubah karena peserta baru dipilih" dari "Project ID diubah
// tangan". Keduanya terlihat sama, sehingga peserta yang memilih ulang namanya
// akan kehilangan Project ID yang sudah dikoreksinya.
function pilihPeserta() {
  const ketemu = daftarPeserta.find((p) => p.namaPeserta === namaTerpilih.value)
  if (ketemu) projectId.value = ketemu.projectId
}

// Pemulihan mengubah isian satu per satu, dan setiap perubahan itu memicu
// kedua pengamat di bawah. Penanda ini mencegah catatan ditulis ulang
// berkali-kali saat halaman baru dibuka, sehingga waktu simpannya tetap yang
// asli dan bukan waktu halaman dibuka.
//
// Diletakkan di sini, sebelum pengamat yang memakainya. `let` tidak dapat
// dibaca sebelum barisnya dijalankan, dan pengamat yang membaca penanda ini
// akan menghentikan seluruh komponen bila urutannya terbalik.
let sedangMemulihkan = false

// Pengamat hanya menyimpan dan membersihkan peringatan, tidak pernah menulis
// balik ke isian. Dengan begitu tidak ada perubahan yang berputar.
watch([pesertaId, projectId], () => {
  bentrok.value = false
  if (terisi.value && !sedangMemulihkan) simpan()
})

// Nilai acak disimpan lewat pengamat, bukan lewat satu peristiwa dari panel.
// Alasannya, nilai acak dapat berubah dari dua arah: dibuat peserta, dan
// dipulihkan dari penyimpanan peramban. Pengamat menangkap keduanya, sehingga
// tidak ada jalur yang dapat terlewat.
watch(
  nilaiAcak,
  () => {
    if (terisi.value && !sedangMemulihkan) simpan()
  },
  { deep: true }
)

// Dipulihkan setelah komponen terpasang di peramban, bukan saat render.
// Situs ini dibangun menjadi berkas statis terlebih dahulu, dan membaca
// penyimpanan peramban saat render menghasilkan HTML yang berbeda antara
// hasil build dan hasil di layar.
onMounted(() => {
  pulihkan()
})
</script>

<template>
  <div class="ki">
    <!-- Judul di dalam komponen, bukan di halaman, supaya daftar isi halaman
         menampilkan keempat langkahnya tanpa perlu menulis judul berkali-kali. -->
    <h2 v-if="judul" class="ki-judul-halaman">{{ judul }}</h2>

    <!-- Langkah 1. Pemilihan peserta. -->
    <section class="ki-bagian">
      <component :is="tingkatJudul" class="ki-judul">1. Pilih nama Anda</component>
      <p class="ki-antar">
        Daftarnya sama dengan tabel pada halaman
        <a href="./peserta-project">Peserta dan Project</a>. Setelah nama dipilih,
        Project ID ikut terisi dan seluruh nilai di bawahnya dihitung sendiri.
      </p>

      <div class="ki-isian">
        <label class="ki-label">
          <span>Nama peserta</span>
          <select v-model="namaTerpilih" @change="pilihPeserta">
            <option value="">Pilih nama Anda</option>
            <option v-for="p in daftarPeserta" :key="p.namaPeserta" :value="p.namaPeserta">
              Batch {{ p.batch }} - {{ p.nama }} ({{ p.namaPeserta }}) - Kelompok {{ p.bagian.toUpperCase() }}
            </option>
          </select>
        </label>

        <label class="ki-label">
          <span>Project ID</span>
          <input
            v-model="projectId"
            type="text"
            spellcheck="false"
            autocomplete="off"
            placeholder="geoportal-kelompok-a-xxxxx"
          />
        </label>
      </div>

      <p v-if="pesertaTerpilih" class="ki-catatan">
        Batch {{ pesertaTerpilih.batch }}, kelompok
        {{ pesertaTerpilih.bagian.toUpperCase() }}, di akun master
        {{ pesertaTerpilih.master }}.
      </p>

      <button v-if="!modeManual" type="button" class="ki-tautan" @click="modeManual = true">
        Nama saya tidak ada di daftar
      </button>

      <div v-if="modeManual" class="ki-isian ki-isian--manual">
        <label class="ki-label">
          <span>Nama peserta pilihan sendiri</span>
          <input
            v-model="namaTerpilih"
            type="text"
            spellcheck="false"
            autocomplete="off"
            placeholder="misalnya: nama01"
          />
        </label>
      </div>

      <p v-if="pesanNama" class="ki-galat" role="alert">{{ pesanNama }}</p>

      <p v-else-if="bentrok" class="ki-galat" role="alert">
        Nama ini tampaknya sudah dipakai di project ini. Lapor ke koordinator dan
        minta identitas pengganti. Memakai nama milik peserta lain membuat
        Cloud Build Anda men-deploy ke VM orang itu.
      </p>

      <p v-else-if="terisi" class="ki-catatan">
        Nilai di bawah sudah siap. Periksa sekali lagi sebelum disalin.
        <button
          v-if="projectId"
          type="button"
          class="ki-tautan ki-tautan--dalam"
          :disabled="memeriksa"
          @click="periksaBentrok"
        >
          {{ memeriksa ? 'Memeriksa...' : 'Periksa nama ini belum dipakai' }}
        </button>
      </p>
    </section>

    <!-- Langkah 2. Blok siap tempel. -->
    <section class="ki-bagian">
      <component :is="tingkatJudul" class="ki-judul">2. Salin blok identitas</component>

      <template v-if="terisi">
        <p class="ki-antar">
          Blok ini menggantikan blok pada Tahap 2 halaman Persiapan Repositori.
          Tempel seluruhnya di Cloud Shell, satu kali.
        </p>

        <div
          ref="wadahBlok"
          class="ki-blok"
          tabindex="0"
          role="group"
          aria-label="Blok identitas peserta siap tempel"
          @click="pilihSemua"
        >
          <pre><code>{{ blok }}</code></pre>
        </div>

        <div class="ki-aksi">
          <button type="button" class="ki-tombol ki-tombol--utama" @click="salinBlok">
            Salin {{ jumlahBaris }} baris
          </button>
          <span v-if="blokTersalin" class="ki-ket ki-ket--berhasil" role="status">
            Tersalin. Tempel di Cloud Shell.
          </span>
          <span v-else class="ki-ket">atau klik blok di atas, lalu Ctrl+C</span>
        </div>
      </template>

      <p v-else class="ki-kosong">
        Pilih nama peserta lebih dahulu. Setelah itu blok lengkap dengan nilai
        Anda muncul di sini.
      </p>
    </section>

    <!-- Langkah 3. Tabel rujukan. -->
    <section class="ki-bagian">
      <component :is="tingkatJudul" class="ki-judul">3. Buat nilai acak</component>

      <p class="ki-antar">
        Empat nilai yang pada materi sebelumnya dibuat dengan perintah
        <code>openssl</code> di terminal. Nilainya dibuat di peramban Anda,
        lalu disimpan di halaman ini, jadi tetap sama setelah halaman dimuat
        ulang. Sumber acaknya sama dengan yang dipakai <code>openssl</code>,
        yaitu sumber acak sistem.
      </p>

      <!-- Tanpa peristiwa dari panel. Keempat nilai acaknya disimpan oleh
           pengamat pada `nilaiAcak`, sehingga hanya ada satu jalur
           penyimpanan yang perlu dijaga. -->
      <PanelAcak :isian="nilaiAcak" :paket="paket" />
    </section>

    <!-- Langkah 4. Tabel rujukan. -->
    <section class="ki-bagian">
      <component :is="tingkatJudul" class="ki-judul">4. Daftar nilainya</component>

      <p class="ki-antar">
        Dipakai bila hanya satu nilai yang dibutuhkan, misalnya saat mengisi
        substitution variable pada trigger Cloud Build. Nilainya dapat diklik
        untuk disalin.
      </p>

      <div class="ki-tabel-bungkus">
        <table class="ki-tabel">
          <thead>
            <tr>
              <th scope="col" class="ki-kolom-variabel">Variabel</th>
              <th scope="col">Nilai</th>
              <th scope="col" class="ki-kolom-baris">Baris</th>
              <th scope="col" class="ki-kolom-salin">Salin</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="b in baris" :key="b.kunci">
              <th scope="row"><code>{{ b.kunci }}</code></th>
              <td>
                <!-- Nilainya sendiri yang dapat diklik, bukan hanya tombol di
                     kolom terakhir. Alasannya, kolom terakhir itu pindah ke
                     luar layar pada lebar ponsel, sedangkan nilainya selalu
                     terlihat. -->
                <button
                  type="button"
                  class="ki-nilai"
                  :disabled="!terisi"
                  :title="'Salin nilai ' + b.kunci"
                  @click="salinNilai(b)"
                >
                  {{ b.isi || 'terisi setelah nama dipilih' }}
                </button>
                <span v-if="b.terang" class="ki-terang">{{ b.terang }}</span>
              </td>
              <!-- Nomor barisnya di blok siap tempel. Berguna saat peserta
                   perlu memeriksa satu nilai di dalam blok yang sudah ditempel
                   di Cloud Shell, tanpa menghitung barisnya sendiri. -->
              <td class="ki-baris">{{ b.letak }}</td>
              <td class="ki-salin">
                <button
                  type="button"
                  class="ki-tombol ki-tombol--kecil"
                  :disabled="!terisi"
                  @click="salinNilai(b)"
                >
                  {{ barisTersalin === b.kunci ? 'Tersalin' : 'Salin' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Keadaan tersimpan. Ditampilkan hanya bila ada catatan yang dipulihkan. -->
    <p v-if="waktuSimpan" class="ki-simpan" role="status">
      <span>
        Tersimpan di peramban ini{{ waktuSimpanTeks ? ' sejak ' + waktuSimpanTeks : '' }}.
        Nilai yang sama akan muncul lagi saat halaman ini dibuka kembali.
      </span>
      <button type="button" class="ki-tautan ki-tautan--dalam" @click="lupakan">
        Hapus data tersimpan
      </button>
    </p>

    <!-- Umpan balik penyalinan. Diumumkan pembaca layar lewat role status. -->
    <p v-if="pesan" class="ki-pesan" :class="{ 'ki-pesan--galat': pesanGalat }" role="status">
      {{ pesan }}
    </p>
  </div>
</template>

<style scoped>
/* Judul halaman. Diberi jarak bawah yang sama dengan judul bagian halaman
   lain, sehingga halaman ini terbaca sebagai halaman materi biasa. */
.ki-judul-halaman {
  margin: 0 0 20px;
  padding-top: 0;
  font-size: 24px;
  line-height: 1.3;
  border-top: none;
}

.ki-bagian {
  margin: 0 0 28px;
  padding: 16px;
  border: var(--pelatihan-tebal, 2px) solid var(--pelatihan-garis, #111111);
  border-radius: var(--pelatihan-radius, 3px);
  box-shadow: var(--pelatihan-bayangan-jauh, 4px) var(--pelatihan-bayangan-jauh, 4px) 0
    var(--pelatihan-bayangan, #111111);
  background: var(--pelatihan-permukaan, #ffffff);
}

.ki-judul {
  margin: 0 0 8px;
  padding-top: 0;
  font-size: 15px;
  border-top: none;
}

.ki-antar {
  margin: 0 0 14px;
  font-size: 13.5px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

.ki-isian {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.ki-isian--manual {
  margin-top: 12px;
}

.ki-label {
  display: flex;
  flex: 1 1 240px;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.ki-label input,
.ki-label select {
  width: 100%;
  min-height: 44px;
  padding: 8px 10px;
  font-size: 14px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
}

.ki-label input:focus-visible,
.ki-label select:focus-visible,
.ki-blok:focus-visible,
.ki-tombol:focus-visible,
.ki-tautan:focus-visible {
  outline: 2px solid var(--pelatihan-aksen, #b45309);
  outline-offset: 2px;
}

.ki-catatan {
  margin: 12px 0 0;
  font-size: 13px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

.ki-galat {
  margin: 12px 0 0;
  font-size: 13px;
  line-height: 1.6;
  color: var(--pelatihan-status-danger, #a3231c);
}

.ki-tautan {
  margin-top: 12px;
  padding: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  background: none;
  border: none;
  text-decoration: underline;
  cursor: pointer;
}

.ki-tautan--dalam {
  display: inline;
  margin: 0 0 0 6px;
}

.ki-tautan:disabled {
  color: var(--vp-c-text-3);
  cursor: default;
  text-decoration: none;
}

/* Blok siap tempel. Warnanya sengaja sama dengan blok kode pada materi,
   karena isinya memang akan ditempel ke terminal. */
.ki-blok {
  overflow-x: auto;
  max-width: 100%;
  padding: 12px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--pelatihan-radius, 3px);
  background: var(--vp-c-bg-soft);
  cursor: text;
}

.ki-blok pre {
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
}

.ki-aksi {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-top: 14px;
}

.ki-tombol {
  min-height: 44px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  background: var(--pelatihan-permukaan, #ffffff);
  border: var(--pelatihan-tebal, 2px) solid var(--pelatihan-garis, #111111);
  border-radius: var(--pelatihan-radius, 3px);
  cursor: pointer;
}

/* Tombol utama menyatakan tekan dengan bergerak ke arah bayangannya, sama
   seperti tombol pada materi. Ini satu-satunya tombol di halaman ini yang
   diberi gerakan, karena hanya tombol ini yang ditekan berulang kali. */
.ki-tombol--utama {
  color: var(--vp-button-brand-text);
  background: var(--vp-button-brand-bg);
  box-shadow: var(--pelatihan-bayangan-jauh, 4px) var(--pelatihan-bayangan-jauh, 4px) 0
    var(--pelatihan-bayangan, #111111);
  transition: transform 120ms ease, box-shadow 120ms ease, background-color 120ms ease;
}

.ki-tombol--utama:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--pelatihan-bayangan-jauh-besar, 6px)
    var(--pelatihan-bayangan-jauh-besar, 6px) 0 var(--pelatihan-bayangan, #111111);
}

.ki-tombol--utama:active {
  transform: translate(var(--pelatihan-bayangan-jauh, 4px), var(--pelatihan-bayangan-jauh, 4px));
  box-shadow: 0 0 0 var(--pelatihan-bayangan, #111111);
}

.ki-tombol--kecil {
  padding: 6px 10px;
  font-size: 12.5px;
  font-weight: 600;
}

.ki-tombol--kecil:hover:not(:disabled) {
  background: var(--pelatihan-kertas, #f4f1ea);
}

.ki-tombol:disabled {
  color: var(--vp-c-text-3);
  border-color: var(--vp-c-divider);
  cursor: default;
}

.ki-ket {
  font-size: 12.5px;
  color: var(--vp-c-text-2);
}

.ki-ket--berhasil {
  font-weight: 700;
  color: var(--pelatihan-status-tip, #1f6f43);
}

.ki-kosong {
  margin: 0;
  padding: 20px;
  font-size: 13.5px;
  text-align: center;
  color: var(--vp-c-text-2);
  border: 1px dashed var(--vp-c-divider);
  border-radius: var(--pelatihan-radius, 3px);
}

/* Tabel digulir di dalam wadahnya sendiri, sehingga halaman tidak ikut
   melebar pada layar sempit. */
.ki-tabel-bungkus {
  overflow-x: auto;
  max-width: 100%;
}

.ki-tabel {
  width: 100%;
  margin: 0;
  font-size: 13.5px;
  border-collapse: collapse;
}

.ki-tabel th,
.ki-tabel td {
  padding: 8px 10px;
  text-align: left;
  vertical-align: top;
  border-bottom: 1px solid var(--vp-c-divider);
}

.ki-tabel thead th {
  position: sticky;
  top: 0;
  z-index: 1;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: var(--vp-c-text-2);
  /* Latar harus pekat, bukan transparan. Baris yang tergulir di bawahnya
     akan terlihat menembus kepala tabel bila latarnya tembus pandang. */
  background: var(--vp-c-bg-soft);
  border-bottom: var(--pelatihan-tebal, 2px) solid var(--vp-c-divider);
}

.ki-tabel tbody th {
  font-weight: 600;
  white-space: nowrap;
}

/* Lebar tetap pada kolom pendek membuat kolom Nilai mendapat sisa lebarnya.
   Kolom Variabel juga dibatasi, karena nama variabel terpanjang
   (GEOSERVER_ADMIN_PASSWORD) akan memakan seluruh lebar tabel pada layar
   sempit bila tidak dibatasi. */
.ki-kolom-variabel {
  width: 30%;
}
.ki-kolom-baris,
.ki-baris {
  width: 44px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12.5px;
  color: var(--vp-c-text-2);
}

.ki-kolom-salin {
  width: 78px;
}

/* Nilai ditampilkan sebagai tombol, bukan teks biasa, karena nilai itulah yang
   disalin. Bentuknya sengaja tidak seperti tombol: tanpa batas dan tanpa latar,
   supaya tabelnya tetap terbaca sebagai tabel dan bukan deretan tombol. */
.ki-nilai {
  display: block;
  width: 100%;
  padding: 0;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12.5px;
  line-height: 1.5;
  text-align: left;
  overflow-wrap: anywhere;
  color: var(--vp-c-text-1);
  background: none;
  border: none;
  cursor: copy;
}

.ki-nilai:hover:not(:disabled) {
  text-decoration: underline;
}

.ki-nilai:disabled {
  cursor: default;
}

.ki-terang {
  display: block;
  margin-top: 2px;
  font-size: 12px;
  line-height: 1.5;
  color: var(--vp-c-text-2);
}

.ki-simpan {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px;
  margin: 0 0 12px;
  padding: 12px 14px;
  font-size: 13px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--pelatihan-radius, 3px);
  background: var(--vp-c-bg-soft);
}

.ki-pesan {
  margin: 0;
  padding: 12px 14px;
  font-size: 13px;
  font-weight: 600;
  color: var(--pelatihan-status-tip, #1f6f43);
  border: var(--pelatihan-tebal, 2px) solid var(--pelatihan-status-tip, #1f6f43);
  border-radius: var(--pelatihan-radius, 3px);
}

.ki-pesan--galat {
  color: var(--pelatihan-status-danger, #a3231c);
  border-color: var(--pelatihan-status-danger, #a3231c);
}

@media (max-width: 640px) {
  .ki-bagian {
    padding: 14px;
  }

  .ki-aksi .ki-tombol--utama {
    width: 100%;
  }

  /* Di bawah 640px tabel rujukan berubah menjadi kartu bertumpuk.
     Alasannya terukur: pada lebar 360px, empat kolom menyisakan sekitar 95px
     untuk kolom Nilai, sehingga nilai seperti nama Service Account terpotong
     menjadi satu kata per baris dan kolom Salin terdorong ke luar layar.
     Sebagai kartu, nama variabel menjadi kepala, nilainya selebar layar, dan
     penyalinan dilakukan dengan menekan nilainya. */
  .ki-tabel-bungkus {
    overflow-x: visible;
  }

  .ki-tabel,
  .ki-tabel tbody,
  .ki-tabel tr,
  .ki-tabel th,
  .ki-tabel td {
    display: block;
    width: auto;
  }

  /* Kepala tabel tidak berguna lagi sebagai kepala kolom, dan nama kolomnya
     sudah diwakili oleh susunan kartunya. */
  .ki-tabel thead {
    display: none;
  }

  .ki-tabel tbody tr {
    margin-bottom: 10px;
    padding: 10px 12px;
    border: 1px solid var(--vp-c-divider);
    border-radius: var(--pelatihan-radius, 3px);
  }

  .ki-tabel tbody tr:last-child {
    margin-bottom: 0;
  }

  .ki-tabel th,
  .ki-tabel td {
    padding: 0;
    border-bottom: none;
  }

  /* Kaki baris menampung nomor baris dan tombol salin dalam satu baris,
     keduanya di bawah nilainya. */
  .ki-tabel .ki-baris {
    display: inline-block;
    width: auto;
    margin-top: 6px;
  }

  .ki-tabel .ki-baris::after {
    content: ' di blok';
  }

  .ki-tabel .ki-salin {
    display: inline-block;
    width: auto;
    margin: 8px 0 0 10px;
    vertical-align: top;
  }

  .ki-tabel .ki-terang {
    margin-top: 6px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ki-tombol--utama {
    transition: none;
  }

  .ki-tombol--utama:hover,
  .ki-tombol--utama:active {
    transform: none;
    box-shadow: var(--pelatihan-bayangan-jauh, 4px) var(--pelatihan-bayangan-jauh, 4px) 0
      var(--pelatihan-bayangan, #111111);
  }
}
</style>
