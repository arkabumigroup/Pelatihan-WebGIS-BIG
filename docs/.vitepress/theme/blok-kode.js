// Menyiapkan blok kode di seluruh modul: mengisi nilai identitas peserta, lalu
// menandai nilai contoh yang tetap harus diganti sendiri.
//
// Kit Identitas menyimpan nama peserta dan Project ID di browser. Halaman lain
// membaca simpanan yang sama, lalu menggantikan bentuk contoh pada blok kode
// dengan nilai peserta itu ketika halamannya dibuka. Peserta yang belum mengisi
// kit tidak melihat perubahan apa pun, dan bentuk contohnya justru ditandai
// merah supaya terlihat harus diganti.
//
// Ekspor PDF tetap memakai bentuk contoh, karena ekspornya berjalan di browser
// yang bersih dan satu PDF dipakai seluruh peserta. Penandaannya tetap muncul
// di PDF, karena penandaan tidak bergantung pada identitas.

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

const escapePola = (teks) => teks.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const POLA_GANTI = new RegExp(HARUS_DIGANTI.map(escapePola).join('|'), 'g')
// Salinan tanpa bendera g, karena `test` pada pola berg bendera menyimpan
// posisi terakhir dan akan melewati potongan pada pemanggilan berikutnya.
const ADA_GANTI = new RegExp(POLA_GANTI.source)

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

function isiBlok(blok, identitas) {
  let berubah = false
  for (const n of simpulTeks(blok)) {
    const baru = n.nodeValue.replace(POLA_ISI, (cocok) =>
      BENTUK[cocok] === 'project' ? identitas.project : identitas.nama
    )
    if (baru !== n.nodeValue) {
      n.nodeValue = baru
      berubah = true
    }
  }
  return berubah
}

function tandaiBlok(blok) {
  for (const n of simpulTeks(blok)) {
    // Isi yang sudah ditandai dilewati, supaya penandaan tidak menumpuk bila
    // fungsi ini dijalankan lagi pada halaman yang sama.
    if (n.parentElement?.classList.contains('harus-diganti')) continue

    const teks = n.nodeValue
    if (!ADA_GANTI.test(teks)) continue

    POLA_GANTI.lastIndex = 0
    const potongan = document.createDocumentFragment()
    let akhir = 0
    let cocok
    while ((cocok = POLA_GANTI.exec(teks)) !== null) {
      if (cocok.index > akhir) {
        potongan.appendChild(document.createTextNode(teks.slice(akhir, cocok.index)))
      }
      const tanda = document.createElement('span')
      tanda.className = 'harus-diganti'
      tanda.textContent = cocok[0]
      potongan.appendChild(tanda)
      akhir = cocok.index + cocok[0].length
    }
    if (akhir < teks.length) {
      potongan.appendChild(document.createTextNode(teks.slice(akhir)))
    }
    n.parentNode.replaceChild(potongan, n)
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
  // karena itu tidak ikut ditandai, sedangkan bentuk contoh yang tersisa
  // ditandai karena memang harus diganti.
  daftarBlok.forEach(tandaiBlok)
}
