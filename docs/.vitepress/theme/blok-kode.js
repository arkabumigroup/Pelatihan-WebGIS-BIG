// Menyiapkan blok kode di seluruh modul: mengisi nilai identitas peserta, lalu
// menandai nilai contoh yang tetap harus diganti sendiri.
//
// Kit Identitas menyimpan nama peserta dan Project ID di browser. Halaman lain
// membaca simpanan yang sama, lalu menggantikan bentuk contoh pada blok kode
// dengan nilai peserta itu ketika halamannya dibuka.
//
// Keduanya ditandai merah, karena keduanya adalah bagian yang berbeda dari
// contoh. Bedanya ada pada garis bawah. Nilai yang terisi dari kit ditandai
// garis bawah penuh, sehingga peserta dapat melihat bagian mana yang berubah.
// Nilai yang masih berbentuk contoh ditandai garis bawah titik-titik, karena
// masih harus diganti sendiri. Keterangannya ada di halaman Kit Identitas.
//
// Ekspor PDF tetap memakai bentuk contoh, karena ekspornya berjalan di browser
// yang bersih dan satu PDF dipakai seluruh peserta. Penandaan nilai yang harus
// diganti tetap muncul di PDF, karena tidak bergantung pada identitas.

const KUNCI_SIMPAN = 'webgisbig.kit-identitas.v1'
const NAMA_COOKIE = 'webgisbig_kit'

// Cukup dua bentuk yang perlu digantikan. Seluruh nama turunan, seperti
// `webgis-nama01`, `nextjs-nama01`, `nama01.webgisbig.com`, dan
// `cadangan-webgis-nama01-geoportal-kelompok-a-xxxxx`, memuat salah satunya
// sebagai potongan, sehingga hasilnya sudah benar tanpa aturan tambahan.
const BENTUK = {
  'geoportal-kelompok-a-xxxxx': 'project',
  nama01: 'nama',
}

// `(?!@)` melewati `nama01@example.com`. Alamat itu dipakai Let's Encrypt
// untuk mengirim pemberitahuan kedaluwarsa sertifikat, dan alamat contoh yang
// terlihat seperti milik peserta akan dipakai apa adanya, sehingga
// pemberitahuannya tidak sampai ke siapa pun.
const POLA_ISI = new RegExp('(' + Object.keys(BENTUK).join('|') + ')(?!@)', 'g')

// Nilai yang harus diganti peserta sendiri karena tidak dapat diisi dari kit.
// Daftarnya diperiksa satu per satu pada seluruh blok kode di modul ini.
//
// Yang sengaja TIDAK masuk daftar, karena bukan nilai yang harus diganti:
//   - `<nomor-project>` dan `<token>`, keduanya bagian dari contoh pesan galat
//     dan contoh komentar, bukan sesuatu yang diketik peserta.
//   - `nama-anda@cloudshell` dan `nama-anda@webgis-nama01`, keduanya contoh
//     prompt terminal untuk menjelaskan bedanya sesi.
//   - `webgisbig.com`, karena itu domain sungguhan yang dipakai bersama.
const HARUS_DIGANTI = [
  '<ISI_EMAIL_DI_SINI>',
  '<ISI_HASH_DI_SINI>',
  // Bentuk pendeknya dipakai pada pola LIKE di dalam berkas SQL yang sama.
  '<ISI_EMAIL',
  '<ISI_HASH',
  'IP_EKSTERNAL_VM',
  'USERNAME_GITHUB_PESERTA',
  'HASH_DARI_LANGKAH_1',
  'EMAIL_DARI_LANGKAH_2',
  'EMAIL_ANDA',
  '[YOUR-PASSWORD]',
  'alamat-email-anda@contoh.com',
  'nama01@example.com',
  // Akhiran contoh pada nama uptime check. Bagian depannya terisi dari kit,
  // tetapi ekornya dibuat Google saat check-nya dibuat.
  'AbCdEf12345',
  'geoportal-kelompok-a-xxxxx',
  // Ditaruh paling akhir. Bentuk yang lebih panjang di atas memuatnya sebagai
  // potongan, dan alternatif pertama yang cocok yang dipakai.
  'nama01',
]

// Nilai yang muncul di dalam kode sebaris pada kalimat dan tabel. Keduanya
// juga nama variabel shell yang sah, sehingga tidak boleh ditandai di dalam
// blok kode: pada blok, `SUBDOMAIN` dan `PARTICIPANT_ID` adalah nama variabel
// yang memang dipakai apa adanya, sedangkan pada prosa keduanya berarti "isi
// dengan milik Anda".
const HARUS_DIGANTI_SEBARIS = ['SUBDOMAIN', 'PARTICIPANT_ID']

const escapePola = (teks) => teks.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const POLA_GANTI = new RegExp(HARUS_DIGANTI.map(escapePola).join('|'), 'g')
const POLA_SEBARIS = new RegExp(
  HARUS_DIGANTI.concat(HARUS_DIGANTI_SEBARIS).map(escapePola).join('|'),
  'g'
)

// Pada kode sebaris, `$SUBDOMAIN` dan `${PARTICIPANT_ID}` adalah variabel shell
// yang sah, jadi yang didahului tanda dolar tidak ikut ditandai.
const bukanVariabelShell = (cocok, asal) => {
  const sebelum = asal[cocok.index - 1]
  return sebelum !== '$' && sebelum !== '{'
}

function bacaSimpanan() {
  try {
    const isi = localStorage.getItem(KUNCI_SIMPAN)
    if (isi) return isi
  } catch (e) {
    // Penyimpanan lokal dapat diblokir. Cookie di bawah tetap dicoba.
  }
  const cocok = document.cookie.match(
    new RegExp('(?:^|; )' + NAMA_COOKIE + '=([^;]*)')
  )
  return cocok ? decodeURIComponent(cocok[1]) : ''
}

function bacaIdentitas() {
  const isi = bacaSimpanan()
  if (!isi) return null
  try {
    const catatan = JSON.parse(isi)
    const nama = String(catatan.namaPeserta || '').trim()
    const project = String(catatan.projectId || '').trim()
    // Keduanya wajib ada. Satu saja yang kosong menghasilkan nama resource
    // yang rusak, dan itu lebih membingungkan daripada bentuk contoh.
    return nama && project ? { nama, project } : null
  } catch (e) {
    return null
  }
}

function simpulTeks(blok) {
  const jalan = document.createTreeWalker(blok, NodeFilter.SHOW_TEXT)
  // Simpulnya dikumpulkan lebih dahulu. Mengubah isi simpul ketika penelusuran
  // masih berjalan dapat membuat simpul berikutnya terlewat.
  const simpul = []
  while (jalan.nextNode()) simpul.push(jalan.currentNode)
  return simpul
}

// Simpul yang sudah pernah diproses dilewati. Tanpa ini, penandaan dapat
// menumpuk di dalam penanda yang sudah ada bila fungsinya dijalankan lagi.
function sudahDitandai(simpul) {
  const kelas = simpul.parentElement?.classList
  return Boolean(
    kelas && (kelas.contains('dari-kit') || kelas.contains('harus-diganti'))
  )
}

// Mengganti setiap potongan yang cocok pada satu simpul teks dengan satu span.
// Dipakai dua kali: sekali untuk mengisi nilai dari kit, sekali untuk menandai
// nilai yang tersisa. Menambahkan span tidak mengubah textContent bloknya,
// sehingga teks yang disalin tombol salin tetap sama.
//
// `boleh` menyaring potongan yang tidak ingin ditandai tanpa mengubah posisi
// pencariannya pada teks asal.
function bungkusCocok(simpul, pola, kelas, ambilTeks, boleh) {
  const asal = simpul.nodeValue
  const potongan = document.createDocumentFragment()
  let akhir = 0
  let ada = false
  let cocok

  pola.lastIndex = 0
  while ((cocok = pola.exec(asal)) !== null) {
    if (boleh && !boleh(cocok, asal)) {
      // Bagian yang ditolak tetap disalin apa adanya ke keluaran.
      potongan.appendChild(document.createTextNode(asal.slice(akhir, cocok.index)))
      potongan.appendChild(document.createTextNode(cocok[0]))
      akhir = cocok.index + cocok[0].length
      ada = true
      continue
    }
    ada = true
    if (cocok.index > akhir) {
      potongan.appendChild(document.createTextNode(asal.slice(akhir, cocok.index)))
    }
    const tanda = document.createElement('span')
    tanda.className = kelas
    tanda.textContent = ambilTeks(cocok)
    potongan.appendChild(tanda)
    akhir = cocok.index + cocok[0].length
  }

  if (!ada) return
  if (akhir < asal.length) {
    potongan.appendChild(document.createTextNode(asal.slice(akhir)))
  }
  simpul.parentNode.replaceChild(potongan, simpul)
}

function isiBlok(blok, identitas) {
  let berubah = false
  for (const simpul of simpulTeks(blok)) {
    if (sudahDitandai(simpul)) continue
    const sebelum = simpul.nodeValue
    bungkusCocok(simpul, POLA_ISI, 'dari-kit', (cocok) =>
      BENTUK[cocok[1]] === 'project' ? identitas.project : identitas.nama
    )
    if (simpul.nodeValue !== sebelum) berubah = true
  }
  return berubah
}

// `sebaris` menandai kode di dalam kalimat dan tabel, yang memakai daftar
// tambahan dan tidak boleh menyentuh nama variabel shell.
function tandaiBlok(blok, sebaris = false) {
  const pola = sebaris ? POLA_SEBARIS : POLA_GANTI
  const saring = sebaris ? bukanVariabelShell : undefined
  for (const simpul of simpulTeks(blok)) {
    if (sudahDitandai(simpul)) continue
    bungkusCocok(simpul, pola, 'harus-diganti', (cocok) => cocok[0], saring)
  }
}

function isiIdentitas(daftarBlok) {
  const identitas = bacaIdentitas()

  // Kelasnya dipasang dan dicabut, bukan hanya dipasang. Elemen html bertahan
  // ketika halaman berganti, sedangkan simpanannya dapat dihapus peserta dari
  // halaman Kit Identitas.
  document.documentElement.classList.toggle('kit-terisi', Boolean(identitas))
  if (!identitas) return

  daftarBlok.forEach((blok) => {
    if (!isiBlok(blok, identitas)) return
    // Isinya sudah benar, jadi tidak ada lagi yang perlu diganti sendiri dan
    // tombol salinnya boleh dipakai kembali.
    blok.closest('.tanpa-salin')?.classList.remove('tanpa-salin')
  })
}

export function siapkanBlokKode() {
  if (typeof document === 'undefined') return

  const daftarBlok = document.querySelectorAll(
    '.vp-doc div[class*="language-"] code'
  )

  isiIdentitas(daftarBlok)

  // Penandaan berjalan setelah pengisian. Nilai identitas yang sudah terisi
  // karena itu tidak ikut ditandai sebagai "harus diganti", sedangkan bentuk
  // contoh yang tersisa ditandai karena memang harus diganti.
  daftarBlok.forEach((blok) => tandaiBlok(blok))

  // Kode sebaris di dalam kalimat dan tabel ikut ditandai, karena peserta juga
  // dapat menyalin nilai dari sana, misalnya `https://SUBDOMAIN/geoserver/web`.
  // Pemilihnya hanya mencocokkan <code> yang tidak berada di dalam <pre>,
  // sehingga blok kode tidak diproses dua kali.
  document
    .querySelectorAll('.vp-doc :not(pre) > code')
    .forEach((kode) => tandaiBlok(kode, true))
}
