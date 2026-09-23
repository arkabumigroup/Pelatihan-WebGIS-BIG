// Mengisi nilai identitas peserta ke blok kode di seluruh modul.
//
// Kit Identitas menyimpan nama peserta dan Project ID di browser. Halaman lain
// membaca simpanan yang sama, lalu menggantikan bentuk contoh pada blok kode
// dengan nilai peserta itu ketika halamannya dibuka. Peserta yang belum mengisi
// kit tidak melihat perubahan apa pun.
//
// Ekspor PDF tetap memakai bentuk contoh, karena ekspornya berjalan di browser
// yang bersih dan satu PDF dipakai seluruh peserta.

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
const POLA = new RegExp('(' + Object.keys(BENTUK).join('|') + ')(?!@)', 'g')

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

function gantikan(teks, identitas) {
  return teks.replace(POLA, (cocok) =>
    BENTUK[cocok] === 'project' ? identitas.project : identitas.nama
  )
}

function isiBlok(blok, identitas) {
  let berubah = false
  const jalan = document.createTreeWalker(blok, NodeFilter.SHOW_TEXT)

  // Simpulnya dikumpulkan lebih dahulu. Mengubah isi simpul ketika penelusuran
  // masih berjalan dapat membuat simpul berikutnya terlewat.
  const simpul = []
  while (jalan.nextNode()) simpul.push(jalan.currentNode)

  for (const n of simpul) {
    const baru = gantikan(n.nodeValue, identitas)
    if (baru !== n.nodeValue) {
      n.nodeValue = baru
      berubah = true
    }
  }
  return berubah
}

export function isiOtomatis() {
  if (typeof document === 'undefined') return

  const identitas = bacaIdentitas()

  // Kelasnya dipasang dan dicabut, bukan hanya dipasang. Elemen html bertahan
  // ketika halaman berganti, sedangkan simpanannya dapat dihapus peserta dari
  // halaman Kit Identitas.
  document.documentElement.classList.toggle('kit-terisi', Boolean(identitas))
  if (!identitas) return

  document
    .querySelectorAll('.vp-doc div[class*="language-"] code')
    .forEach((blok) => {
      if (!isiBlok(blok, identitas)) return
      // Isinya sudah benar, jadi tidak ada lagi yang perlu diganti sendiri dan
      // tombol salinnya boleh dipakai kembali.
      const bungkus = blok.closest('.tanpa-salin')
      if (bungkus) bungkus.classList.remove('tanpa-salin')
    })
}
