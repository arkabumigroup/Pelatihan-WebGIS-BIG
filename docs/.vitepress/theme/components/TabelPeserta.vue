<script setup>
// Tabel pemetaan peserta ke project, dikelompokkan per akun master.
//
// Pencarian dan saringan dikerjakan di sisi browser, bukan di server, karena
// datanya hanya 82 baris dan halaman ini statis. Tidak ada permintaan jaringan
// saat peserta mengetik, sehingga hasilnya muncul seketika.

import { ref, computed } from 'vue'
import { kelompokPeserta } from '../data/peserta'

const kataKunci = ref('')
const masterTerpilih = ref('semua')
const batchTerpilih = ref('semua')

// Daftar akun master untuk saringan. Dihitung sekali, bukan tiap render.
const daftarMaster = kelompokPeserta.map((k) => k.master)

// Seluruh peserta dari kedua batch, dipakai untuk menghitung jumlah dan untuk
// menyusun saringan batch.
const semuaPeserta = computed(() => kelompokPeserta.flatMap((k) => k.peserta))

const jumlahPeserta = computed(() => semuaPeserta.value.length)

const jumlahPerBatch = computed(() => {
  const n = {}
  for (const p of semuaPeserta.value) n[p.batch] = (n[p.batch] || 0) + 1
  return n
})

const daftarBatch = computed(() =>
  Object.keys(jumlahPerBatch.value)
    .map(Number)
    .sort((a, b) => a - b)
)

// Hanya kelompok yang dipilih yang disaring isinya. Bila "semua" dipilih,
// pencarian tetap berlaku untuk seluruh kelompok.
const hasil = computed(() => {
  const cari = kataKunci.value.trim().toLowerCase()
  const batch = batchTerpilih.value

  return kelompokPeserta
    .filter((k) => masterTerpilih.value === 'semua' || k.master === masterTerpilih.value)
    .map((k) => {
      const peserta = k.peserta.filter((p) => {
        if (batch !== 'semua' && p.batch !== Number(batch)) return false
        if (!cari) return true
        return (
          p.nama.toLowerCase().includes(cari) ||
          p.namaPeserta.toLowerCase().includes(cari) ||
          p.email.toLowerCase().includes(cari) ||
          k.master.toLowerCase().includes(cari)
        )
      })
      return { ...k, peserta, semuaPeserta: k.peserta }
    })
})

const adaHasil = computed(() => hasil.value.some((k) => k.peserta.length > 0))

const jumlahTampil = computed(() =>
  hasil.value.reduce((n, k) => n + k.peserta.length, 0)
)

function bersihkan() {
  kataKunci.value = ''
  masterTerpilih.value = 'semua'
  batchTerpilih.value = 'semua'
}
</script>

<template>
  <div class="tp">
    <!-- Kendali. Ditaruh di atas dan lengket saat menggulir, karena daftarnya
         panjang dan peserta biasanya mencari namanya sendiri. -->
    <div class="tp-kendali">
      <label class="tp-cari">
        <span class="tp-label">Cari nama atau email</span>
        <input
          v-model="kataKunci"
          type="search"
          placeholder="misalnya: fajar, atau supraptofajaragung"
          autocomplete="off"
          spellcheck="false"
        />
      </label>

      <label class="tp-saring">
        <span class="tp-label">Batch</span>
        <select v-model="batchTerpilih">
          <option value="semua">Semua batch</option>
          <option v-for="b in daftarBatch" :key="b" :value="b">
            Batch {{ b }} ({{ jumlahPerBatch[b] }} peserta)
          </option>
        </select>
      </label>

      <label class="tp-saring">
        <span class="tp-label">Akun master</span>
        <select v-model="masterTerpilih">
          <option value="semua">Semua akun master</option>
          <option v-for="m in daftarMaster" :key="m" :value="m">{{ m }}</option>
        </select>
      </label>

      <button
        v-if="kataKunci || masterTerpilih !== 'semua' || batchTerpilih !== 'semua'"
        class="tp-bersih"
        type="button"
        @click="bersihkan"
      >
        Bersihkan
      </button>
    </div>

    <p class="tp-ringkas" role="status">
      <template v-if="adaHasil">
        Menampilkan <strong>{{ jumlahTampil }}</strong>
        dari {{ jumlahPeserta }} peserta.
      </template>
      <template v-else>
        Tidak ada peserta yang cocok dengan <strong>{{ kataKunci }}</strong>.
      </template>
    </p>

    <!-- Hasil kosong. Diberi jalan keluar, bukan hanya pemberitahuan. -->
    <div v-if="!adaHasil" class="tp-kosong">
      <p>Periksa ejaan nama atau email Anda, lalu coba lagi.</p>
      <button type="button" class="tp-bersih" @click="bersihkan">Tampilkan semua peserta</button>
    </div>

    <!-- Satu bagian per akun master -->
    <section v-for="k in hasil" :id="'master-' + k.akun" :key="k.master" class="tp-grup">
      <h3 class="tp-judul">
        {{ k.master }}
        <span class="tp-jumlah">{{ k.semuaPeserta.length }} peserta</span>
      </h3>

      <dl class="tp-project">
        <div v-for="(pid, bagian) in k.project" :key="bagian">
          <dt>Kelompok {{ bagian.toUpperCase() }}</dt>
          <dd><code>{{ pid }}</code></dd>
        </div>
      </dl>

      <p v-if="k.peserta.length === 0" class="tp-tidakada">
        Tidak ada peserta pada akun master ini yang cocok dengan pencarian.
      </p>

      <!-- Tabel digulir mendatar di dalam wadahnya sendiri pada layar sempit,
           supaya halaman tidak ikut melebar. -->
      <div v-else class="tp-tabel-bungkus">
        <table class="tp-tabel">
          <thead>
            <tr>
              <th scope="col">Nama</th>
              <th scope="col">Nama Peserta</th>
              <th scope="col">Email</th>
              <th scope="col" class="tp-kolom-pendek">Batch</th>
              <th scope="col" class="tp-kolom-pendek">Kelompok</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in k.peserta" :key="p.email">
              <td>{{ p.nama }}</td>
              <td><code>{{ p.namaPeserta }}</code></td>
              <td>
                <!-- Tanda @ dipisah sebagai elemen tersendiri. Tujuannya
                     supaya alamatnya tidak mudah dipanen bot pengumpul email,
                     tanpa mengurangi keterbacaan bagi peserta. -->
                <span class="tp-email">{{ p.email.split('@')[0] }}<span class="tp-at">@</span>{{ p.email.split('@')[1] }}</span>
              </td>
              <td>{{ p.batch }}</td>
              <td>{{ p.bagian.toUpperCase() }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<style scoped>
.tp-kendali {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: flex-end;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.tp-cari,
.tp-saring {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* Pencarian diberi ruang paling lebar, karena itu kendali yang paling sering
   dipakai peserta. Kedua saringan di sampingnya cukup selebar isinya. */
.tp-cari {
  flex: 1 1 240px;
}

.tp-saring {
  flex: 0 1 190px;
}

.tp-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.tp input,
.tp select {
  width: 100%;
  min-height: 44px;
  padding: 8px 10px;
  font-size: 14px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
}

.tp input:focus-visible,
.tp select:focus-visible {
  outline: 2px solid var(--pelatihan-aksen, #b45309);
  outline-offset: 2px;
}

.tp-bersih {
  min-height: 44px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  background: transparent;
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 6px;
  cursor: pointer;
}

.tp-bersih:hover {
  color: var(--vp-c-bg);
  background: var(--vp-c-brand-1);
}

.tp-ringkas {
  margin: 0 0 20px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.tp-kosong {
  padding: 24px;
  text-align: center;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 8px;
}

.tp-kosong p {
  margin: 0 0 12px;
  color: var(--vp-c-text-2);
}

.tp-grup {
  margin-bottom: 32px;
}

.tp-judul {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 10px;
  margin: 0 0 12px;
  padding-bottom: 8px;
  font-size: 17px;
  border-bottom: 2px solid var(--vp-c-divider);
}

.tp-jumlah {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  border-radius: 999px;
}

.tp-project {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin: 0 0 16px;
}

.tp-project > div {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tp-project dt {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
}

.tp-project dd {
  margin: 0;
}

.tp-project code {
  font-size: 12.5px;
}

.tp-tidakada {
  font-size: 13px;
  color: var(--vp-c-text-2);
}

/* Tabel digulir di dalam wadahnya sendiri, sehingga halaman tidak melebar. */
.tp-tabel-bungkus {
  overflow-x: auto;
}

.tp-tabel {
  width: 100%;
  margin: 0;
  font-size: 14px;
  border-collapse: collapse;
}

.tp-tabel th,
.tp-tabel td {
  padding: 8px 12px;
  text-align: left;
  border-bottom: 1px solid var(--vp-c-divider);
}

.tp-tabel th {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.03em;
  color: var(--vp-c-text-2);
  text-transform: uppercase;
  background: var(--vp-c-bg-soft);
}

/* Kolom Batch dan Kelompok isinya satu karakter, jadi lebarnya tidak perlu
   ikut melebar. Tanpa batas ini, keduanya memakan ruang kolom Nama. */
.tp-kolom-pendek {
  width: 84px;
}

.tp-tabel tbody tr:hover {
  background: var(--vp-c-bg-soft);
}

.tp-email {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 13px;
}

/* Lebar tetap pada tanda @ membuat alamat tetap terbaca sebagai satu kesatuan
   meskipun elemennya dipisah. */
.tp-at {
  display: inline-block;
  width: 0.75em;
  text-align: center;
}

@media (max-width: 640px) {
  .tp-cari,
  .tp-saring {
    flex: 1 1 100%;
  }

  .tp-tabel th,
  .tp-tabel td {
    padding: 8px 10px;
  }
}
</style>
