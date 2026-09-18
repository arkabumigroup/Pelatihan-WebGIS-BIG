# Menyiapkan GeoServer di VM

Halaman ini melanjutkan [Penambahan Subdomain](/hari-3/deployment-project/subdomain). Setelah HTTPS aktif, GeoServer di VM perlu disiapkan sebelum layer 2D dapat diunggah dari Geoportal.

Tanpa halaman ini, unggahan layer gagal dengan pesan yang tidak menunjuk penyebabnya.

## Prasyarat

- Geoportal berjalan di `https://SUBDOMAIN/portal`, dan HTTPS sudah aktif
- PostGIS terpasang di schema `public` pada database Supabase
- Schema `gis` sudah dibuat pada database yang sama
- Variabel `PROJECT_ID`, `VM_NAME`, `ZONE`, dan `SUBDOMAIN` masih tersedia di Cloud Shell

Bila Cloud Shell sudah berganti, jalankan blok **Muat ulang variabel** pada halaman [Google Cloud Platform](/hari-3/deployment-project/google-cloud-platform) lebih dahulu.

## Tahap 1. Pastikan PostGIS dan schema gis ada

Keduanya dibuat di SQL Editor Supabase, dan keduanya wajib ada.

```sql
-- PostGIS harus berada di schema public
CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;

-- Schema gis menampung tabel spasial yang dibuat aplikasi
CREATE SCHEMA IF NOT EXISTS gis;
```

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

Aplikasi menghubungi database dengan `search_path=gis,public,extensions`, sehingga tipe `geometry` ditemukan dari `public` dan tabelnya dibuat di `gis`.

Bila PostGIS tidak ada di salah satu schema itu, unggahan layer gagal dengan pesan `type "geometry" does not exist`.
:::

## Tahap 2. Atur alamat publik GeoServer

Dijalankan di: Terminal VM

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

Dijalankan di: Browser

Buka `https://SUBDOMAIN/geoserver/web`, lalu masuk dengan:

| Kolom | Nilai |
|---|---|
| Username | `admin` |
| Password | Isi `GEOSERVER_ADMIN_PASSWORD` pada `.env` |

## Tahap 4. Buat workspace

Dijalankan di: Antarmuka GeoServer

```
Data > Workspaces > Add new workspace
```

| Kolom | Nilai |
|---|---|
| Name | `geoportal` |
| Namespace URI | `https://SUBDOMAIN/geoserver/geoportal` |

Nama `geoportal` harus sama persis dengan `GEOSERVER_WORKSPACE` pada `.env`.

## Tahap 5. Buat datastore PostGIS

Dijalankan di: Antarmuka GeoServer

```
Stores > Add new Store > PostGIS
```

| Kolom | Nilai |
|---|---|
| Workspace | `geoportal` |
| Data Source Name | `postgis_geoportal` |
| host | Isi `POSTGIS_HOST` pada `.env` |
| port | Isi `POSTGIS_PORT` pada `.env` |
| database | Isi `POSTGIS_DB` pada `.env` |
| schema | `gis` |
| user | Isi `POSTGIS_USER` pada `.env` |
| password | Isi `POSTGIS_PASSWORD` pada `.env` |

**Seluruh nilai diambil dari `.env`, jangan dikarang.** Untuk Supabase, `POSTGIS_HOST` berbentuk `aws-0-<region>.pooler.supabase.com`, dan `POSTGIS_USER` berbentuk `postgres.<project-ref>`. Keduanya berbeda dari susunan PostgreSQL lokal.

Menampilkan nilainya:

```bash
cd /opt/webgis/app
grep -E '^POSTGIS_(HOST|PORT|DB|USER|PASSWORD)=' .env
```

::: warning Nama datastore harus sama persis
Nilai `Data Source Name` harus sama persis dengan `GEOSERVER_POSTGIS_DATASTORE` pada `.env`. Bila berbeda, unggahan layer gagal dengan pesan `Could not find datastore`.
:::

## Tahap 6. Uji koneksi datastore

Dijalankan di: Antarmuka GeoServer

```
Stores > postgis_geoportal > Edit > Test Connection
```

Harus menjawab **`Connection successful`**.

::: danger Bila koneksi pernah gagal, hapus lalu buat ulang datastore-nya
GeoServer menyimpan kegagalan koneksi pertamanya. Memperbaiki database saja tidak cukup, karena datastore tetap memakai hasil pemeriksaan yang lama.

Hapus datastore itu, lalu buat ulang dengan nilai yang sudah benar.
:::

## Tahap 7. Unggah layer dari Geoportal

Dijalankan di: Browser

Buka `https://SUBDOMAIN/portal`, masuk, lalu unggah layer 2D dari menu **Katalog Data 2D**.

Yang terjadi di balik layar: aplikasi membuat tabel baru di schema `gis`, mengisinya dengan geometri, lalu menerbitkannya ke GeoServer memakai workspace dan datastore yang baru saja dibuat.

Periksa hasilnya:

| Yang diperiksa | Di mana |
|---|---|
| Tabel baru di schema `gis` | SQL Editor Supabase: `SELECT table_name FROM information_schema.tables WHERE table_schema='gis';` |
| Layer terbit | GeoServer: `Data > Layers` |
| Layer tampil di Geoportal | Halaman Katalog Data 2D |

## Bila Ada yang Gagal

| Gejala | Penyebab yang paling sering |
|---|---|
| `Invalid username/password combination`, padahal kata sandi benar | Formulir login masih memakai `http://`. Kerjakan Tahap 2 |
| `type "geometry" does not exist` | PostGIS belum terpasang, atau tidak berada di `public` maupun `gis` |
| `schema "gis" does not exist` | Schema `gis` belum dibuat. Kerjakan Tahap 1 |
| `Could not find datastore` | Nama datastore tidak sama dengan `GEOSERVER_POSTGIS_DATASTORE` pada `.env` |
| `Test Connection` gagal | Nilai `POSTGIS_*` pada datastore berbeda dari `.env`, atau datastore dibuat sebelum PostGIS aktif |
| Unggahan berhasil tetapi layer tidak muncul | Layer belum diterbitkan. Periksa `Data > Layers` pada GeoServer |
| Halaman `https://SUBDOMAIN/geoserver/web` berputar tanpa henti | `proxy_redirect` belum ada pada `nginx.conf`. Periksa halaman [Penambahan Subdomain](/hari-3/deployment-project/subdomain) |

## Hasil Akhir

Layer 2D yang diunggah dari Geoportal tersimpan sebagai tabel di schema `gis`, terbit sebagai layer pada GeoServer, dan dapat dibuka kembali dari halaman katalog maupun dari QGIS memakai alamat WMS atau WFS yang tercantum.
