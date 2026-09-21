import DefaultTheme from 'vitepress/theme'
import mediumZoom from 'medium-zoom'
import { onMounted, watch, nextTick, h } from 'vue'
import { useRoute } from 'vitepress'
import TabelPeserta from './components/TabelPeserta.vue'
import './custom.css'
import './semesta.css'
import './print.css'

// Ikon tombol hero disisipkan lewat DOM, karena VitePress tidak menyediakannya
// dan mengganti komponen VPHero berarti menyalin ulang komponen bawaan.
// Ikonnya digambar sendiri mengikuti bentuk logo Arkabumi, bukan diambil dari
// pustaka ikon yang akan membuat situs ini tampak seperti situs lain.

const IKON_UNDUH = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
  fill="none" stroke="currentColor" stroke-width="2.2"
  stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true">
  <path d="M4 3h11l5 5v4" />
  <path d="M15 3v5h5" />
  <path d="M12 11v8" />
  <path d="M8.5 15.5 12 19l3.5-3.5" />
  <path d="M4 21h16" />
</svg>`

// Aksi yang diberi ikon, dicocokkan dengan alamat tujuannya. Hanya aksi
// yang membuka sesuatu di luar situs yang diberi ikon, karena ikon itu
// menjelaskan bahwa tautannya keluar dari situs.
const AKSI_BERIKON = [
  {
    cocok: (href) => href.includes('drive.google.com'),
    keterangan: 'Folder berkas pelatihan. Terbuka di tab baru.',
  },
]

function beriIkonAksi() {
  // Hanya di beranda. Halaman lain tidak memuat tombol aksi.
  document.querySelectorAll('.VPHero .action').forEach((aksi) => {
    const tautan = aksi.querySelector('a.VPButton')
    if (!tautan) return
    // Lewati bila ikonnya sudah terpasang, supaya tidak menumpuk
    // ketika fungsi ini dipanggil lagi setelah pindah halaman.
    if (tautan.querySelector('.pelatihan-ikon-tombol')) return

    const aturan = AKSI_BERIKON.find((a) => a.cocok(tautan.getAttribute('href') || ''))
    if (!aturan) return

    const wadah = document.createElement('span')
    wadah.className = 'pelatihan-ikon-tombol'
    wadah.innerHTML = IKON_UNDUH
    // Keterangan dibaca pembaca layar. Teks tombolnya sendiri terlalu
    // singkat untuk menjelaskan bahwa tautannya menuju luar situs.
    wadah.setAttribute('role', 'img')
    wadah.setAttribute('aria-label', aturan.keterangan)
    tautan.prepend(wadah)
  })
}

// Gaya untuk baris logo di beranda. Ditaruh di sini, bukan di custom.css,
// karena hanya dipakai oleh beranda dan berkas ini yang merendernya.
const GAYA_LOGO = `
.logo-row {
  display: flex;
  align-items: center;
  gap: 24px;
  margin: 24px 0;
}
.logo-row a {
  display: flex;
  align-items: center;
}
.logo-row a[target="_blank"]::after {
  content: none;
}
.logo-row img {
  display: block;
  height: 56px;
  width: auto;
  object-fit: contain;
}
`

export default {
  extends: DefaultTheme,

  // Komponen harus didaftarkan sendiri. VitePress TIDAK memuat folder
  // theme/components secara otomatis, dan komponen yang tidak terdaftar
  // dihilangkan dari keluaran tanpa pesan galat, sehingga halamannya kosong
  // tanpa penjelasan.
  enhanceApp({ app }) {
    app.component('TabelPeserta', TabelPeserta)
  },

  // Kaki halaman ditambahkan lewat slot layout-bottom, satu-satunya slot
  // yang tersedia pada tema bawaan untuk isi di bawah dokumen.
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'layout-bottom': () =>
        h('div', { class: 'my-footer' }, [
          h('p', 'Pelatihan WebGIS Tingkat Dasar Hingga Lanjutan'),
          h('p', [
            '© 2026 ',
            h(
              'a',
              { href: 'https://arkabumi.id', target: '_blank', rel: 'noreferrer' },
              'Arkabumi'
            ),
            ' & PPKIG BIG',
          ]),
        ]),
    })
  },

  setup() {
    const route = useRoute()

    // Materi bergantung pada tangkapan layar antarmuka. Banyak yang berisi
    // teks kecil, jadi gambar harus dapat diperbesar. Lapisan zoom dipasang
    // ulang setiap kali halaman berganti, karena gambar lama ikut diganti.
    const initZoom = () => {
      mediumZoom('.main img', { background: 'var(--vp-c-bg)' })
    }

    const pasangGayaLogo = () => {
      if (document.getElementById('pelatihan-gaya-logo')) return
      const gaya = document.createElement('style')
      gaya.id = 'pelatihan-gaya-logo'
      gaya.textContent = GAYA_LOGO
      document.head.appendChild(gaya)
    }

    onMounted(() => {
      initZoom()
      beriIkonAksi()
      pasangGayaLogo()
    })

    watch(
      () => route.path,
      () => nextTick(() => {
        initZoom()
        beriIkonAksi()
      })
    )
  },
}
