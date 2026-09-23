# Menyiapkan GeoServer di VM

Halaman ini melanjutkan [Penambahan Subdomain](/hari-4/praktik-11/subdomain). Setelah HTTPS aktif, GeoServer di VM perlu disiapkan sebelum layer 2D dapat diunggah, dan satu folder perlu disiapkan sebelum model 3D dapat disimpan.

Tanpa halaman ini, unggahan layer gagal dengan pesan yang tidak menunjuk penyebabnya, dan model 3D hilang pada deploy berikutnya.

## Prasyarat

- Geoportal berjalan di `https://SUBDOMAIN/portal`, dan HTTPS sudah aktif
- PostGIS terpasang di schema `public` pada database Supabase
- Schema `gis` sudah dibuat pada database yang sama
- Variabel `PROJECT_ID`, `VM_NAME`, `ZONE`, dan `SUBDOMAIN` masih tersedia di Cloud Shell

Bila Cloud Shell sudah berganti, jalankan ulang blok **Tahap 2** pada halaman [Persiapan Repositori dan Identitas](/hari-4/praktik-11/persiapan-repositori) lebih dahulu.

## Tahap 1. Pastikan PostGIS dan schema gis ada

Keduanya sudah dibuat pada langkah 1 halaman [Skema Database](/hari-4/praktik-11/skema-database). Tahap ini memastikan keduanya masih ada, karena GeoServer bergantung penuh pada keduanya.

<p class="dijalankan dijalankan--layanan">Dijalankan di: <strong>SQL Editor Supabase</strong></p>

```sql
-- PostGIS harus berada di schema public
CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;

-- Schema gis menampung tabel spasial yang dibuat aplikasi
CREATE SCHEMA IF NOT EXISTS gis;
```

Keduanya memakai `IF NOT EXISTS`, jadi aman dijalankan ulang walaupun sudah ada.

Periksa hasilnya:

```sql
SELECT extname, extnamespace::regnamespace AS schema
FROM pg_extension
WHERE extname LIKE 'postgis%';

SELECT schema_name FROM information_schema.schemata
WHERE schema_name IN ('public', 'gis', 'extensions')
ORDER BY schema_name;
```
Yang diharapkan:

```text
extname   schema
postgis   public

schema_name
extensions
gis
public
```

::: warning PostGIS ada di public, tabel spasial ada di gis
Keduanya dipakai untuk hal berbeda, dan keduanya diperlukan.

| Schema | Isinya |
|---|---|
| `public` | Extension PostGIS, tempat tipe `geometry` berada |
| `gis` | Tabel spasial yang dibuat aplikasi saat layer diunggah |

Kode aplikasi menulis nama tabelnya lengkap dengan schema, yaitu `"gis"."nama_tabel"`. Jadi tabelnya masuk ke `gis` bukan karena `search_path`, melainkan karena memang ditulis begitu.

Yang bergantung pada `search_path` justru tipe `geometry`-nya, karena kode itu menulis `GEOMETRY(Geometry, 4326)` tanpa awalan schema. Pada Supabase, pooler menetapkan `search_path` sendiri pada tingkat koneksi, dan nilai yang berlaku adalah `"$user", public, extensions`. Perhatikan bahwa `gis` tidak ada di situ, sedangkan `public` ada.

Itulah sebabnya PostGIS harus berada di `public`, bukan di `gis`. Bila PostGIS dipasang di `gis`, tipe `geometry` tidak ditemukan pada jalur yang berlaku, dan pembuatan tabelnya gagal dengan `type "geometry" does not exist`.
:::

## Tahap 1b. Uji koneksi dari VM

Pemeriksaan di atas dikerjakan di SQL Editor Supabase, jadi hasilnya belum membuktikan bahwa VM Anda dapat menjangkau database itu. Uji koneksinya di sini, sebelum workspace dan datastore dibuat, supaya masalah alamat atau kata sandi ketahuan sekarang dan bukan nanti.

<p class="dijalankan dijalankan--server">Dijalankan di: <strong>Terminal VM</strong></p>

```bash
cd /opt/webgis/app
set -a; . ./.env; set +a

sudo -H docker run --rm -e PGPASSWORD="$POSTGIS_PASSWORD" postgres:16-alpine \
  psql -h "$POSTGIS_HOST" -p "$POSTGIS_PORT" -U "$POSTGIS_USER" -d "$POSTGIS_DB" \
  -tAc "SELECT postgis_version()"
```

Perintah itu memakai nilai yang sama persis dengan yang nanti diisi ke datastore, dan menjalankannya dari VM. Image `postgres:16-alpine` diunduh sekali di awal, jadi perintah pertama memang terasa lebih lama.

Yang diharapkan, satu baris berisi versi PostGIS:

```text
3.3 USE_GEOS=1 USE_PROJ=1 USE_STATS=1
```

Angka versinya boleh berbeda. Yang penting keluarannya satu baris dan bukan pesan error.

| Error | Penyebab yang paling sering |
|---|---|
| `could not translate host name` | `POSTGIS_HOST` salah ketik, atau masih memakai bentuk koneksi langsung `db.<ref>.supabase.co` |
| `password authentication failed` | `POSTGIS_PASSWORD` berbeda dari kata sandi database, atau karakter khususnya belum ditulis dalam bentuk persen |
| `Tenant or user not found` | `POSTGIS_USER` belum memakai bentuk `postgres.<project-ref>` |
| `Connection refused` atau waktu habis | Port bukan `5432`, atau keluarganya salah. Untuk pooler, pakai port `5432`, bukan `6543` |

## Tahap 2. Atur alamat publik GeoServer

<p class="dijalankan dijalankan--server">Dijalankan di: <strong>Terminal VM</strong></p>

Langkah ini **wajib**, dan tanpa itu tidak ada yang dapat masuk ke antarmuka GeoServer.

GeoServer menyusun alamat formulir login dari skema permintaan yang diterimanya. Nginx meneruskan permintaan ke GeoServer lewat HTTP di dalam jaringan Docker, sehingga GeoServer menulis `http://` pada formulir loginnya. Karena nginx mengalihkan HTTP ke HTTPS, browser mengirim data login ke alamat HTTP, menerima pengalihan, lalu **membuang isi formulirnya**. GeoServer menerima permintaan tanpa kredensial, dan menjawab:

```text
Invalid username/password combination.
```

Kata sandi yang benar pun ditolak, karena isinya tidak pernah sampai.

Perbaikannya adalah memberi tahu GeoServer alamat publiknya. Antarmuka GeoServer belum dapat dibuka pada tahap ini, jadi pengaturannya dikirim lewat REST API yang memakai header, bukan formulir.

Masuk ke VM:

```bash
gcloud compute ssh "$VM_NAME" \
  --zone="$ZONE" \
  --tunnel-through-iap
```

Lalu jalankan. Ganti `SUBDOMAIN` dengan subdomain Anda:

```bash
cd /opt/webgis/app
SUBDOMAIN="nama01.webgisbig.com"
PASS="$(grep '^GEOSERVER_ADMIN_PASSWORD=' .env | cut -d= -f2-)"

curl -s -u "admin:$PASS" \
  "https://${SUBDOMAIN}/geoserver/rest/settings.json" -o /tmp/s.json

python3 - <<PY
import json
d = json.load(open('/tmp/s.json'))
d['global']['settings']['proxyBaseUrl'] = 'https://${SUBDOMAIN}/geoserver'
json.dump(d, open('/tmp/s2.json', 'w'))
PY

curl -s -o /dev/null -w "%{http_code}\n" -u "admin:$PASS" \
  -X PUT -H 'Content-Type: application/json' \
  --data-binary @/tmp/s2.json \
  "https://${SUBDOMAIN}/geoserver/rest/settings"
```

Perintah terakhir harus menjawab `200`.

::: tip Bila perintah pertama menjawab 401
Berarti kata sandi di `.env` tidak cocok dengan yang dipakai container. Container menetapkan kata sandinya dari `GEOSERVER_ADMIN_PASSWORD` saat pertama kali dijalankan.

Periksa nilainya, lalu buat ulang container:

```bash
grep '^GEOSERVER_ADMIN_PASSWORD=' .env
sudo docker compose up -d --force-recreate geoserver
```

Workspace dan layer Anda tetap aman, karena tersimpan pada volume `./geoserver-data`.
:::

## Tahap 3. Masuk ke antarmuka GeoServer

<p class="dijalankan dijalankan--lokal">Dijalankan di: <strong>Browser</strong></p>

Buka `https://SUBDOMAIN/geoserver/web`, lalu masuk dengan:

| Kolom | Nilai |
|---|---|
| Username | `admin` |
| Password | Isi `GEOSERVER_ADMIN_PASSWORD` pada `.env` |

## Tahap 3b. Izinkan formulir dari subdomain Anda

<p class="dijalankan dijalankan--server">Dijalankan di: <strong>Terminal VM</strong></p>

GeoServer memakai filter CSRF yang menolak formulir yang `Origin`-nya tidak dikenal. Karena permintaan melewati nginx, GeoServer melihat alamat publik Anda, bukan `localhost`, dan alamat itu belum ada pada daftar izin bawaannya.

Errornya muncul saat membuat workspace atau datastore:

```text
HTTP Status 400 - Bad Request
Message: Origin does not correspond to request
```

Perbaikannya adalah satu variabel pada service `geoserver` di `docker-compose.yml`:

```yaml
- CSRF_WHITELIST=webgisbig.com
```

**Baris itu sudah ada di file yang Anda clone**, karena ikut ketika Anda mem-fork repositori peserta. Yang perlu Anda lakukan hanya memastikan barisnya ada, bukan menambahkannya.

::: danger Namanya tanpa awalan GEOSERVER_
Image kartoza membaca variabel bernama `CSRF_WHITELIST`, lalu meneruskannya ke GeoServer sebagai `-DGEOSERVER_CSRF_WHITELIST`. Namanya memang berbeda di kedua sisi, dan di situlah kesalahannya biasa terjadi.

Bila Anda menulisnya dengan awalan, yaitu `GEOSERVER_CSRF_WHITELIST`, compose tetap menerima barisnya, container tetap menyala, dan GeoServer tetap berjalan. Yang terjadi hanya nilainya kosong, sehingga whitelist tidak terpasang dan errornya kembali seperti semula.

Periksa dengan perintah ini, dan pastikan ada nilai di belakang tanda sama dengan:

```bash
sudo docker logs geoserver_app 2>&1 | grep -o -- '-DGEOSERVER_CSRF_WHITELIST=.*' | head -1
```

Yang benar menampilkan `-DGEOSERVER_CSRF_WHITELIST=webgisbig.com`. Bila yang muncul hanya `-DGEOSERVER_CSRF_WHITELIST=`, namanya salah tulis.
:::

Nilai itu mencakup seluruh subdomain `webgisbig.com`, sehingga satu baris berlaku untuk semua peserta.

Periksa dengan perintah ini:

```bash
cd /opt/webgis/app
grep -nE '^[[:space:]]*-[[:space:]]*[A-Z_]*CSRF_WHITELIST=' docker-compose.yml
```

Keluarannya harus tepat satu baris, dan namanya tanpa awalan `GEOSERVER_`:

```text
      - CSRF_WHITELIST=webgisbig.com
```

Bila barisnya tidak ada, atau namanya masih berawalan `GEOSERVER_`, fork Anda belum memuat perbaikan itu. Selaraskan fork lewat **Fetch origin** lalu **Pull origin** di GitHub Desktop, kemudian tarik di VM:

```bash
cd /opt/webgis/app
git pull --ff-only
sudo docker compose up -d --force-recreate geoserver
```

Jangan membetulkannya langsung di VM. Salinan git di sana akan memuat perubahan yang belum di-commit, dan `git pull --ff-only` pada halaman Penambahan Subdomain akan menolak berjalan.

::: tip Alamat IP tidak termasuk daftar izin
Whitelist itu memuat `webgisbig.com` beserta subdomainnya, **tetapi tidak memuat alamat IP VM**.

Mencoba membuat workspace lewat `https://IP_VM/geoserver/web` akan gagal dengan `400` yang sama. Itu tidak menghalangi, karena tahap ini dikerjakan setelah HTTPS aktif sehingga browsernya memakai alamat domain. Namun bila Anda memakai alamat IP, errornya akan membingungkan tanpa keterangan ini.
:::

## Tahap 4. Buat workspace

<p class="dijalankan dijalankan--server">Dijalankan di: <strong>Antarmuka GeoServer</strong></p>

```
Data > Workspaces > Add new workspace
```

| Kolom | Nilai | Catatan |
|---|---|---|
| Name | `geoportal` | Harus sama persis dengan `GEOSERVER_WORKSPACE` pada `.env` |
| Namespace URI | `https://SUBDOMAIN/geoserver/geoportal` | Ganti `SUBDOMAIN` dengan subdomain Anda |

Isi kedua kolomnya, lalu klik **Submit**. Kolom lain di formulir itu tidak perlu diubah.

::: tip Namespace URI hanya penanda, bukan alamat yang dibuka
Isinya tidak pernah dipanggil siapa pun, jadi tidak perlu dapat dibuka di browser dan tidak perlu cocok dengan alamat sungguhan. GeoServer memakainya untuk membedakan satu workspace dari workspace lain. Aplikasi Anda juga tidak membacanya.

Isi dengan subdomain Anda supaya mudah dikenali, dan jangan dikosongkan.

Yang menentukan nama layer justru kolom **Name**, karena layer Anda nanti bernama `geoportal:nama_tabel`. Nama itulah yang harus sama persis dengan `GEOSERVER_WORKSPACE` pada `.env`. Bila berbeda, aplikasi mencari workspace yang tidak ada, dan unggahan layer gagal.
:::

## Tahap 5. Buat datastore PostGIS

<p class="dijalankan dijalankan--server">Dijalankan di: <strong>Antarmuka GeoServer</strong></p>

```
Stores > Add new Store > PostGIS
```

Tabel berikut memakai nama kolom yang tertulis pada formulir GeoServer. Isi kedelapan baris pertama, lalu **Save**.

| Kolom pada formulir | Nilai |
|---|---|
| Workspace | `geoportal` |
| Data Source Name | `postgis_geoportal` |
| host | Isi `POSTGIS_HOST` pada `.env` |
| port | Isi `POSTGIS_PORT` pada `.env` |
| database | Isi `POSTGIS_DB` pada `.env` |
| schema | `gis` |
| user | Isi `POSTGIS_USER` pada `.env` |
| Kata sandi (`passwd`) | Isi `POSTGIS_PASSWORD` pada `.env` |
| `namespace` | Biarkan sesuai bawaan, yaitu `geoportal` |

Baris terakhir jarang perlu disentuh. Kolom `namespace` pada datastore sudah terisi sendiri dari workspace yang dipilih, sehingga layer Anda otomatis masuk ke namespace `geoportal`.

**Seluruh nilai diambil dari `.env`, jangan dikarang.** Untuk Supabase, `POSTGIS_HOST` berbentuk `aws-0-<region>.pooler.supabase.com`, dan `POSTGIS_USER` berbentuk `postgres.<project-ref>`. Keduanya berbeda dari susunan PostgreSQL lokal.

::: warning Kolom schema diisi gis, dan extension-nya tetap di public
Dua schema terlibat di sini, dan perannya berbeda. Keduanya benar sekaligus: **tabelnya dibaca dari `gis`, fungsinya diambil dari `public`**.

| Schema | Isinya | Diisi di mana |
|---|---|---|
| `gis` | Tabel layer, dibuat aplikasi saat Anda mengunggah | Kolom `schema` pada datastore ini |
| `public` | Extension PostGIS: tipe `geometry` beserta fungsinya | Menu Extensions Supabase, pada langkah 1 halaman [Skema Database](/hari-4/praktik-11/skema-database) |

Kolom `schema` di sini **wajib diisi `gis`**, karena di sanalah tabel layernya berada. Bila diisi `public`, GeoServer hanya menemukan tabel katalog dan `spatial_ref_sys`, lalu tidak ada satu pun layer yang dapat diterbitkan.

Sebaliknya, extension PostGIS **wajib berada di `public`**, bukan di `gis`. Tipe dan fungsi PostGIS dipanggil tanpa awalan schema, sehingga dicari lewat jalur pencarian. Pada koneksi Supabase, jalur yang berlaku adalah `"$user", public, extensions`: `public` ada di situ, `gis` tidak.
:::

Menampilkan nilainya:

```bash
cd /opt/webgis/app
grep -E '^POSTGIS_(HOST|PORT|DB|USER|PASSWORD)=' .env
```

::: warning Nama datastore harus sama persis
Nilai `Data Source Name` harus sama persis dengan `GEOSERVER_POSTGIS_DATASTORE` pada `.env`. Bila berbeda, unggahan layer gagal dengan pesan `Could not find datastore`.
:::

## Tahap 6. Uji koneksi datastore

<p class="dijalankan dijalankan--server">Dijalankan di: <strong>Antarmuka GeoServer</strong></p>

```
Stores > postgis_geoportal > Edit > Test Connection
```

Harus menjawab **`Connection successful`**.

::: danger Bila koneksi pernah gagal, hapus lalu buat ulang datastore-nya
GeoServer menyimpan kegagalan koneksi pertamanya. Memperbaiki database saja tidak cukup, karena datastore tetap memakai hasil pemeriksaan yang lama.

Hapus datastore itu, lalu buat ulang dengan nilai yang sudah benar.
:::

## Tahap 6b. Periksa kecocokan dengan .env

<p class="dijalankan dijalankan--cloud">Dijalankan di: <strong>Cloud Shell</strong></p>

Enam nilai di GeoServer harus sama persis dengan `.env`. Kerjakan pemeriksaan ini sebelum mengunggah layer, karena bila salah satunya berbeda, gejalanya bermacam-macam dan tidak selalu menyebut penyebabnya: unggahan layer gagal dengan `Could not find datastore`, portal tampil tanpa satu pun layer 2D, atau GeoServer membalas `401`.

| Di GeoServer | Variabel `.env` | Nilainya |
|---|---|---|
| Name workspace, Tahap 4 | `GEOSERVER_WORKSPACE` | `geoportal` |
| Data Source Name, Tahap 5 | `GEOSERVER_POSTGIS_DATASTORE` | `postgis_geoportal` |
| Kolom `schema` pada datastore, Tahap 5 | `POSTGIS_SCHEMA` | `gis` |
| host, port, database, user, kata sandi pada datastore | `POSTGIS_HOST`, `POSTGIS_PORT`, `POSTGIS_DB`, `POSTGIS_USER`, `POSTGIS_PASSWORD` | sama, kelimanya |
| Kata sandi admin, Tahap 3 | `GEOSERVER_ADMIN_PASSWORD` dan `GEOSERVER_PASSWORD` | sama, keduanya |
| Alamat internal, tidak diisi di GeoServer | `GEOSERVER_URL` | `http://geoserver:8080/geoserver` |

Periksa nilainya di VM:

```bash
cd /opt/webgis/app
grep -E '^(GEOSERVER_|POSTGIS_)' .env
```

Bandingkan hasilnya dengan tabel di atas satu per satu. Yang paling sering terlewat adalah `GEOSERVER_POSTGIS_DATASTORE`, karena variabel itu sengaja dibiarkan kosong di laptop dan baru diisi di VM.

::: warning `GEOSERVER_PUBLIC_URL` tidak dibaca aplikasi
`GEOSERVER_PUBLIC_URL` tetap diminta pada [Tahap 18 halaman Menyiapkan Aplikasi di VM](/hari-4/praktik-11/aplikasi-di-vm#tahap-18-isi-file-env) dan diganti ke alamat HTTPS pada [Tahap 13 halaman Penambahan Subdomain](/hari-4/praktik-11/subdomain#tahap-13-ubah-alamat-aplikasi-di-env), tetapi **tidak ada satu pun kode aplikasi yang membacanya**. Layer 2D tidak lagi disajikan langsung dari GeoServer, melainkan lewat proxy milik aplikasi sendiri di `/portal/api/katalog-data-2d/proxy`, dan proxy itu memakai `GEOSERVER_URL` dari dalam jaringan Docker.

Akibatnya, membiarkan `GEOSERVER_PUBLIC_URL` kosong atau salah tidak menggagalkan unggahan layer. Yang benar-benar menentukan portal dapat terhubung ke GeoServer adalah enam nilai pada tabel di atas.
:::

## Tahap 7. Unggah layer dari Geoportal

<p class="dijalankan dijalankan--lokal">Dijalankan di: <strong>Browser</strong></p>

Buka `https://SUBDOMAIN/portal`, masuk, lalu unggah layer 2D dari menu **Katalog Data 2D**.

Yang terjadi di balik layar: aplikasi membuat tabel baru di schema `gis`, mengisinya dengan geometri, lalu menerbitkannya ke GeoServer memakai workspace dan datastore yang baru saja dibuat.

Periksa hasilnya:

| Yang diperiksa | Di mana |
|---|---|
| Tabel baru di schema `gis` | SQL Editor Supabase: `SELECT table_name FROM information_schema.tables WHERE table_schema='gis';` |
| Layer terbit | GeoServer: `Data > Layers` |
| Layer tampil di Geoportal | Halaman Katalog Data 2D |

## Tahap 8. Siapkan folder penyimpanan model 3D

<p class="dijalankan dijalankan--server">Dijalankan di: <strong>Terminal VM</strong></p>

Model 3D disimpan sebagai file di VM, bukan di database. Baris katalognya ada di Supabase, tetapi filenya ada di folder `data/models` pada VM.

Pada `docker-compose.yml`, folder itu dipasang sebagai volume:

```yaml
  nextjs:
    volumes:
      - ./data:/app/data
```

Volume itu perlu satu langkah tambahan, dan tanpa langkah ini unggahan model 3D gagal walaupun volumenya sudah ada.

### Mengapa perlu langkah tambahan

Aplikasi berjalan sebagai pengguna `nextjs` di dalam container, dengan uid **1001**. Itu ditetapkan pada `Dockerfile`:

```dockerfile
RUN adduser --system --uid 1001 nextjs
...
USER nextjs
```

Bila folder `data` belum ada, Docker membuatnya sendiri sebagai `root:root` dengan mode `755`, sama seperti yang terjadi pada folder `tls` di halaman Subdomain. Pada mode itu, uid 1001 bukan pemiliknya dan hanya mendapat hak baca, sehingga penulisan file ditolak.

### Membuat dan menyesuaikan pemiliknya

```bash
cd /opt/webgis/app
mkdir -p data
sudo chown -R 1001:1001 data
ls -ld data
```

Yang diharapkan, pemiliknya bukan `root`:

```text
drwxr-xr-x 2 1001 1001 4096 ... data
```

Nama pemiliknya boleh tampil sebagai angka `1001`, atau sebagai nama grup yang kebetulan memakai angka itu di VM Anda. Yang penting **bukan `root`**, karena hanya pemiliknya yang dapat menulis ke folder itu.

::: warning Jangan memakai chown "$USER":"$USER" di sini
Halaman Subdomain memakai `chown -R "$USER:$USER"` untuk folder `tls` dan `certbot-webroot`, dan itu benar karena kedua folder itu dibaca oleh proses nginx yang berjalan sebagai root.

Folder `data` berbeda: yang menulis ke sana adalah proses aplikasi sebagai uid **1001**, sedangkan akun VM Anda biasanya uid **1000**. Memakai `"$USER":"$USER"` di sini menghasilkan folder yang tetap tidak dapat ditulisi container.
:::

Setelah itu buat ulang container supaya volume barunya terpasang:

```bash
sudo docker compose up -d
```

### Memeriksa hasilnya

Unggah satu model 3D dari Geoportal, lalu periksa filenya di VM:

```bash
ls -la /opt/webgis/app/data/models/
```

Filenya harus muncul, dengan pemilik `1001`.

::: danger Tanpa folder ini, model 3D hilang pada setiap deploy
File yang ditulis ke dalam container, bukan ke volume, akan hilang setiap kali container dibuat ulang. Cloud Build menjalankan `docker compose up -d` pada setiap push ke branch `main`, sehingga setiap deploy menghapus seluruh model yang pernah diunggah.

Errornya menyesatkan: katalog tetap menampilkan modelnya, karena barisnya masih ada di Supabase, tetapi filenya sudah tidak ada sehingga modelnya gagal dibuka.
:::

## Bila Ada yang Gagal

| Error | Penyebab yang paling sering |
|---|---|
| `Invalid username/password combination`, padahal kata sandi benar | Formulir login masih memakai `http://`. Kerjakan Tahap 2 |
| `type "geometry" does not exist` | PostGIS belum terpasang, atau tidak berada di schema `public` |
| `schema "gis" does not exist` | Schema `gis` belum dibuat. Kerjakan Tahap 1 |
| `Could not find datastore` | Nama datastore tidak sama dengan `GEOSERVER_POSTGIS_DATASTORE` pada `.env` |
| `Test Connection` gagal | Nilai `POSTGIS_*` pada datastore berbeda dari `.env`, atau datastore dibuat sebelum PostGIS aktif |
| Unggahan berhasil tetapi layer tidak muncul | Layer belum diterbitkan. Periksa `Data > Layers` pada GeoServer |
| Halaman `https://SUBDOMAIN/geoserver/web` berputar tanpa henti | `proxy_redirect` belum ada pada `nginx.conf`. Periksa halaman [Penambahan Subdomain](/hari-4/praktik-11/subdomain) |
| Unggah model 3D gagal, atau filenya tidak muncul di `data/models` | Pemilik folder `data` bukan uid 1001. Kerjakan Tahap 8 |
| Model 3D yang dulu ada kini tidak dapat dibuka | Filenya hilang karena ditulis ke dalam container, bukan ke volume. Kerjakan Tahap 8 |
| `Unexpected token '<', "<html> ..." is not valid JSON` saat menyimpan data | Nginx menolak unggahannya dan membalas halaman HTML, bukan JSON. Periksa `client_max_body_size` pada `nginx.conf` seperti pada Tahap 4 halaman Periksa File Konfigurasi, lalu buat ulang container `nginx` dengan `sudo docker compose up -d --force-recreate nginx`. Memuat ulang saja tidak cukup, karena file yang di-mount satu per satu mengikuti inode lama setelah `git pull` menggantinya |
| `File melebihi batas 1024 MB` padahal filenya lebih kecil | Batas pada route lebih kecil daripada `client_max_body_size`. Samakan keduanya seperti pada Tahap 4 halaman Periksa File Konfigurasi |
| Unggahan berhenti di tengah pada file besar | `client_body_timeout`, `proxy_send_timeout`, atau `proxy_read_timeout` masih pada nilai bawaan 60 detik. Kerjakan Tahap 4 halaman Periksa File Konfigurasi |
| Bilah kemajuan berhenti di 100 persen dan lama tidak berubah | Bukan macet. Setelah pengiriman selesai, server masih menulis filenya ke disk dan menyimpan barisnya ke database. Keterangan pada dialog berganti menjadi "Server sedang menyimpan file" selama tahap itu |
| Disk VM hampir penuh setelah beberapa kali unggah | Model tersimpan di `data/models` dan tidak ikut terhapus saat baris katalognya dihapus. Periksa dengan `du -sh /opt/webgis/app/data/models`, lalu hapus file yang tidak dipakai |

## Hasil Akhir

Layer 2D yang diunggah dari Geoportal tersimpan sebagai tabel di schema `gis`, terbit sebagai layer pada GeoServer, dan dapat dibuka kembali dari halaman katalog maupun dari QGIS memakai alamat WMS atau WFS yang tercantum.
