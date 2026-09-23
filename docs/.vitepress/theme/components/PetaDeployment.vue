<script setup>
// Peta deployment peserta.
//
// Menerima nilai turunan dari KitIdentitas, lalu menampilkannya pada dua alur
// yang benar-benar terjadi: alur push dari laptop sampai VM, dan alur
// permintaan dari browser sampai container. Tujuannya supaya peserta melihat
// nama resource miliknya sendiri terpasang di tempatnya, bukan sekadar daftar
// variabel lepas.
//
// Seluruh nilai diterima lewat prop, tidak dihitung ulang di sini. Menghitung
// ulang berarti menyalin aturan penamaannya, dan salinan itu akan menyimpang
// begitu aturannya berubah.
import { computed, ref } from 'vue'

const props = defineProps({
  // Objek nilai turunan dari KitIdentitas, misalnya VM_NAME dan SUBDOMAIN.
  nilai: { type: Object, required: true },
})

const terpilih = ref('')

// Alur push. Setiap langkah menyebut nama resource yang dipakai peserta,
// sehingga terlihat mana yang mengandung nama peserta dan mana yang tidak.
const alurPush = computed(() => [
  {
    kunci: 'push',
    judul: 'Push ke fork Anda',
    nilai: 'branch main',
    unik: false,
    keterangan:
      'Anda mengirim perubahan ke fork repositori peserta di GitHub. Hanya branch main yang diperhatikan.',
  },
  {
    kunci: 'koneksi',
    judul: 'Cloud Build membaca push',
    nilai: props.nilai.CONNECTION_NAME,
    unik: true,
    keterangan:
      'Koneksi GitHub milik Anda. Namanya memuat nama peserta, jadi koneksi Anda tidak bertabrakan dengan milik peserta lain di project yang sama.',
  },
  {
    kunci: 'repo',
    judul: 'Repositori yang dihubungkan',
    nilai: props.nilai.LINKED_REPO_NAME,
    unik: true,
    keterangan:
      'Nama repositori di dalam koneksi itu. Satu koneksi dapat memuat beberapa repositori, dan milik Anda dibedakan lewat nama ini.',
  },
  {
    kunci: 'trigger',
    judul: 'Trigger mulai berjalan',
    nilai: props.nilai.TRIGGER_NAME,
    unik: true,
    keterangan:
      'Trigger yang menyalakan proses build. Satu trigger per peserta, supaya push Anda tidak membangun image milik orang lain.',
  },
  {
    kunci: 'sa',
    judul: 'Service Account build',
    nilai: props.nilai.BUILD_SA,
    unik: true,
    keterangan:
      'Identitas yang dipakai Cloud Build saat berjalan. Alamat inilah yang diperiksa tombol "Periksa nama ini belum dipakai" pada langkah 1, karena alamat yang sudah ada berarti nama itu sudah terpakai.',
  },
  {
    kunci: 'image',
    judul: 'Image disimpan',
    nilai: `${props.nilai.REGION}-docker.pkg.dev/${props.nilai.PROJECT_ID}/${props.nilai.REPOSITORY}/${props.nilai.IMAGE_NAME}`,
    unik: true,
    keterangan:
      'Hasil build disimpan di Artifact Registry milik kelompok. Nama image memuat nama peserta, sehingga image Anda berdampingan dengan image peserta lain tanpa saling menimpa.',
  },
  {
    kunci: 'vm',
    judul: 'VM menarik image',
    nilai: props.nilai.VM_NAME,
    unik: true,
    keterangan:
      'Cloud Build masuk ke VM Anda lewat SSH, memperbarui NEXTJS_IMAGE pada .env, menarik image baru, lalu menyalakan ulang container-nya.',
  },
])

// Alur permintaan, yaitu yang terjadi saat peserta membuka portalnya.
const alurPermintaan = computed(() => [
  {
    kunci: 'browser',
    judul: 'Browser membuka alamat',
    nilai: `https://${props.nilai.SUBDOMAIN}/portal`,
    unik: true,
    keterangan:
      'Alamat yang Anda ketik. Subdomainnya memuat nama peserta, jadi setiap peserta punya alamat sendiri di domain yang sama.',
  },
  {
    kunci: 'dns',
    judul: 'DNS menerjemahkan nama',
    nilai: `${props.nilai.SUBDOMAIN} → IP statis`,
    unik: true,
    keterangan:
      'Record A yang ditambahkan penyelenggara. Ia menunjuk ke IP statis Anda, bukan ke IP sementara yang berubah setiap VM dinyalakan ulang.',
  },
  {
    kunci: 'ip',
    judul: 'IP statis milik Anda',
    nilai: props.nilai.STATIC_IP_NAME,
    unik: true,
    keterangan:
      'Alamat tetap yang dipasang ke VM Anda. Karena tetap, record DNS di atas tidak perlu diubah lagi.',
  },
  {
    kunci: 'firewall',
    judul: 'Firewall VPC mengizinkan',
    nilai: 'port 80 dan 443',
    unik: false,
    keterangan:
      'Aturan firewall tingkat project, dipakai bersama seluruh peserta. Port 80 untuk pengalihan ke HTTPS, port 443 untuk lalu lintas terenkripsi.',
  },
  {
    kunci: 'nginx',
    judul: 'Nginx memilah jalur',
    nilai: 'nginx_proxy  ·  :80 dan :443',
    unik: false,
    keterangan:
      'Container yang pertama menerima permintaan. Ia mengurus sertifikat Let\u2019s Encrypt, lalu meneruskan /portal ke aplikasi dan /geoserver ke GeoServer. Namanya sama untuk semua peserta.',
  },
  {
    kunci: 'nextjs',
    judul: 'Aplikasi melayani halaman',
    nilai: 'nextjs_portal  ·  :3000',
    unik: false,
    keterangan:
      'Container aplikasi Next.js. Isinya image yang baru saja dibangun Cloud Build, dan nama container-nya sama untuk semua peserta.',
  },
  {
    kunci: 'geoserver',
    judul: 'GeoServer menyajikan layer',
    nilai: 'geoserver_app  ·  :8080',
    unik: false,
    keterangan:
      'Container GeoServer, dipanggil lewat jalur /geoserver. Di sinilah layer dari schema gis diterbitkan sebagai WMS dan WFS.',
  },
])

const semua = computed(() => [...alurPush.value, ...alurPermintaan.value])
const rincian = computed(() => semua.value.find((l) => l.kunci === terpilih.value) || null)
const jumlahUnik = computed(() => semua.value.filter((l) => l.unik).length)

function pilih(kunci) {
  terpilih.value = terpilih.value === kunci ? '' : kunci
}
</script>

<template>
  <section class="pd">
    <h3 class="pd-judul">Peta deployment Anda</h3>

    <p class="pd-antar">
      Seluruh nama di bawah dihitung dari nama peserta Anda, lalu dipasang pada
      tempatnya. Yang bertanda <span class="pd-bintang" aria-hidden="true">★</span>
      hanya milik Anda, {{ jumlahUnik }} dari {{ semua.length }} langkah. Sisanya
      dipakai bersama seluruh kelompok.
    </p>

    <p class="pd-antar">
      Klik salah satu langkah untuk melihat gunanya.
    </p>

    <div class="pd-alur" v-for="alur in [
      { judul: 'Alur push, dari laptop sampai VM', langkah: alurPush },
      { judul: 'Alur permintaan, dari browser sampai container', langkah: alurPermintaan },
    ]" :key="alur.judul">
      <h4 class="pd-subjudul">{{ alur.judul }}</h4>

      <ol class="pd-daftar">
        <li v-for="(l, i) in alur.langkah" :key="l.kunci" class="pd-butir">
          <button
            type="button"
            class="pd-langkah"
            :class="{ 'pd-langkah--pilih': terpilih === l.kunci }"
            :aria-expanded="terpilih === l.kunci"
            @click="pilih(l.kunci)"
          >
            <span class="pd-nomor" aria-hidden="true">{{ i + 1 }}</span>
            <span class="pd-isi">
              <span class="pd-nama">
                {{ l.judul }}<span v-if="l.unik" class="pd-bintang" title="Khusus milik Anda">&nbsp;★</span>
              </span>
              <code class="pd-nilai">{{ l.nilai }}</code>
            </span>
          </button>
        </li>
      </ol>
    </div>

    <div v-if="rincian" class="pd-rincian" role="status">
      <p class="pd-rincian-judul">
        {{ rincian.judul }}
        <span v-if="rincian.unik" class="pd-bintang" aria-hidden="true">★</span>
      </p>
      <code class="pd-nilai pd-nilai--besar">{{ rincian.nilai }}</code>
      <p class="pd-rincian-teks">{{ rincian.keterangan }}</p>
    </div>

    <p v-else class="pd-petunjuk">
      Pilih satu langkah di atas untuk melihat keterangannya di sini.
    </p>
  </section>
</template>

<style scoped>
.pd {
  margin: 28px 0 8px;
}

.pd-judul {
  margin: 0 0 8px;
  font-size: 17px;
}

.pd-antar {
  margin: 0 0 8px;
  font-size: 13px;
  line-height: 1.65;
  color: var(--vp-c-text-2);
}

.pd-subjudul {
  margin: 20px 0 10px;
  font-size: 14px;
}

.pd-alur {
  margin: 0;
}

.pd-daftar {
  margin: 0;
  padding: 0;
  list-style: none;
}

.pd-butir {
  margin: 0;
}

/* Garis penghubung antar langkah, dibuat dari batas kiri nomornya. */
.pd-butir + .pd-butir .pd-nomor::before {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 100%;
  width: var(--pelatihan-tebal, 2px);
  height: 10px;
  background: var(--pelatihan-garis, #111111);
  transform: translateX(-50%);
}

.pd-langkah {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  width: 100%;
  padding: 8px 10px;
  margin: 0 0 10px;
  text-align: left;
  background: var(--pelatihan-permukaan, #ffffff);
  border: var(--pelatihan-tebal, 2px) solid var(--pelatihan-garis, #111111);
  border-radius: var(--pelatihan-radius, 3px);
  cursor: pointer;
  font: inherit;
  color: inherit;
}

.pd-langkah:hover {
  background: var(--vp-c-bg-soft);
}

.pd-langkah:focus-visible {
  outline: 3px solid var(--pelatihan-navy, #003060);
  outline-offset: 2px;
}

.pd-langkah--pilih {
  border-color: var(--pelatihan-oranye, #e08000);
  box-shadow: var(--pelatihan-bayangan-jauh, 4px) var(--pelatihan-bayangan-jauh, 4px) 0
    var(--pelatihan-bayangan, #111111);
}

.pd-nomor {
  position: relative;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  font-size: 12px;
  font-weight: 700;
  color: #ffffff;
  background: var(--pelatihan-navy, #003060);
  border-radius: 999px;
}

.pd-isi {
  min-width: 0;
}

.pd-nama {
  display: block;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.4;
}

.pd-bintang {
  color: var(--pelatihan-oranye, #e08000);
}

.pd-nilai {
  display: block;
  margin-top: 4px;
  padding: 2px 6px;
  font-size: 12px;
  line-height: 1.5;
  overflow-wrap: anywhere;
  background: var(--vp-c-bg-soft);
  border-radius: 2px;
}

.pd-nilai--besar {
  margin-top: 8px;
  font-size: 12.5px;
}

.pd-rincian {
  margin-top: 20px;
  padding: 12px 14px;
  background: var(--pelatihan-permukaan, #ffffff);
  border: var(--pelatihan-tebal, 2px) solid var(--pelatihan-garis, #111111);
  border-left: 6px solid var(--pelatihan-oranye, #e08000);
  border-radius: var(--pelatihan-radius, 3px);
  box-shadow: var(--pelatihan-bayangan-jauh, 4px) var(--pelatihan-bayangan-jauh, 4px) 0
    var(--pelatihan-bayangan, #111111);
}

.pd-rincian-judul {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
}

.pd-rincian-teks {
  margin: 8px 0 0;
  font-size: 13px;
  line-height: 1.65;
}

.pd-petunjuk {
  margin: 20px 0 0;
  padding: 12px 14px;
  font-size: 13px;
  color: var(--vp-c-text-2);
  border: var(--pelatihan-tebal, 2px) dashed var(--pelatihan-garis, #111111);
  border-radius: var(--pelatihan-radius, 3px);
}

/* Dua alur berdampingan di layar lebar, bertumpuk di layar sempit. */
@media (min-width: 720px) {
  .pd {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 20px;
    align-items: start;
  }

  .pd-judul,
  .pd-antar,
  .pd-rincian,
  .pd-petunjuk {
    grid-column: 1 / -1;
  }

  .pd-subjudul {
    margin-top: 12px;
  }
}
</style>
