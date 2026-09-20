# Menyiapkan GeoServer di VM

Halaman ini melanjutkan [Penambahan Subdomain](/hari-3/deployment-project/subdomain). Setelah HTTPS aktif, GeoServer di VM perlu disiapkan sebelum layer 2D dapat diunggah, dan satu folder perlu disiapkan sebelum model 3D dapat disimpan.

Tanpa halaman ini, unggahan layer gagal dengan pesan yang tidak menunjuk penyebabnya, dan model 3D hilang pada deploy berikutnya.

## Prasyarat

- Geoportal berjalan di `https://SUBDOMAIN/portal`, dan HTTPS sudah aktif
- PostGIS terpasang di schema `public` pada database Supabase
- Schema `gis` sudah dibuat pada database yang sama
- Variabel `PROJECT_ID`, `VM_NAME`, `ZONE`, dan `SUBDOMAIN` masih tersedia di Cloud Shell

Bila Cloud Shell sudah berganti, jalankan ulang blok **Tahap 2** pada halaman [Persiapan Repositori dan Identitas](/hari-3/deployment-project/persiapan-repositori) lebih dahulu.

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

## Tahap 3b. Izinkan formulir dari subdomain Anda

Dijalankan di: Terminal VM

GeoServer memakai filter CSRF yang menolak formulir yang `Origin`-nya tidak dikenal. Karena permintaan melewati nginx, GeoServer melihat alamat publik Anda, bukan `localhost`, dan alamat itu belum ada pada daftar izin bawaannya.

Gejalanya muncul saat membuat workspace atau datastore:

```text
HTTP Status 400 - Bad Request
Message: Origin does not correspond to request
```

Perbaikannya adalah menambahkan satu variabel pada service `geoserver` di `docker-compose.yml`:

```yaml
- GEOSERVER_CSRF_WHITELIST=webgisbig.com
```

Nilai itu mencakup seluruh subdomain `webgisbig.com`, sehingga satu baris berlaku untuk semua peserta. Diuji pada GeoServer 2.24.1:

| `Origin` pengirim | Hasil |
|---|---|
| `https://dhanypedia.webgisbig.com` | diterima |
| `https://andi.webgisbig.com` | diterima |
| `https://webgisbig.com` | diterima |
| `https://jahat.com` | ditolak, `400` |

Menerapkannya:

```bash
cd /opt/webgis/app
cp docker-compose.yml docker-compose.yml.bak
python3 - <<'PY2'
p = 'docker-compose.yml'
baris = open(p).read().split('\n')
baris = [b for b in baris if 'GEOSERVER_CSRF_WHITELIST' not in b]
i = next(k for k, b in enumerate(baris) if 'GEOSERVER_CORS_ALLOWED_ORIGINS' in b)
indent = ' ' * (len(baris[i]) - len(baris[i].lstrip()))
baris.insert(i + 1, f'{indent}- GEOSERVER_CSRF_WHITELIST=webgisbig.com')
open(p, 'w').write('\n'.join(baris))
PY2

sudo docker compose up -d --force-recreate geoserver
```

::: warning Perhatikan posisi barisnya
Di YAML, arti sebuah baris ditentukan oleh induknya. Baris `- sesuatu` di bawah `environment:` adalah variabel lingkungan, sedangkan di bawah `volumes:` adalah folder yang di-mount. Bentuknya sama, hanya beda induk.

Bila baris itu masuk ke bagian `volumes:`, pembuatan ulang container gagal dengan:

```text
invalid mount path: 'GEOSERVER_CSRF_WHITELIST=webgisbig.com' mount path must be absolute
```

Periksa dengan `sed -n '/^  geoserver:/,/^  nginx:/p' docker-compose.yml`, dan pastikan barisnya berada di bawah `environment:`.
:::

::: tip Alamat IP tidak termasuk daftar izin
Whitelist itu memuat `webgisbig.com` beserta subdomainnya, **tetapi tidak memuat alamat IP VM**.

Mencoba membuat workspace lewat `https://IP_VM/geoserver/web` akan gagal dengan `400` yang sama. Itu tidak menghalangi, karena tahap ini dikerjakan setelah HTTPS aktif sehingga browsernya memakai alamat domain. Namun bila Anda memakai alamat IP, gejalanya akan membingungkan tanpa keterangan ini.
:::

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

## Tahap 8. Siapkan folder penyimpanan model 3D

Dijalankan di: Terminal VM

Model 3D disimpan sebagai berkas di VM, bukan di database. Baris katalognya ada di Supabase, tetapi berkasnya ada di folder `data/models` pada VM.

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

Bila folder `data` belum ada, Docker membuatnya sendiri sebagai `root:root` dengan mode `755`, sama seperti yang terjadi pada folder `tls` di halaman Subdomain. Pada mode itu, uid 1001 bukan pemiliknya dan hanya memperoleh hak baca, sehingga penulisan berkas ditolak.

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

::: warning Jangan memakai chown "$USER":"$USER" di sini
Halaman Subdomain memakai `chown -R "$USER:$USER"` untuk folder `tls` dan `certbot-webroot`, dan itu benar karena kedua folder itu dibaca oleh proses nginx yang berjalan sebagai root.

Folder `data` berbeda: yang menulis ke sana adalah proses aplikasi sebagai uid **1001**, sedangkan akun VM Anda biasanya uid **1000**. Memakai `"$USER":"$USER"` di sini menghasilkan folder yang tetap tidak dapat ditulisi container.
:::

Setelah itu buat ulang container supaya volume barunya terpasang:

```bash
sudo docker compose up -d
```

### Memeriksa hasilnya

Unggah satu model 3D dari Geoportal, lalu periksa berkasnya di VM:

```bash
ls -la /opt/webgis/app/data/models/
```

Berkasnya harus muncul, dengan pemilik `1001`.

::: danger Tanpa folder ini, model 3D hilang pada setiap deploy
Berkas yang ditulis ke dalam container, bukan ke volume, akan hilang setiap kali container dibuat ulang. Cloud Build menjalankan `docker compose up -d` pada setiap push ke branch `main`, sehingga setiap deploy menghapus seluruh model yang pernah diunggah.

Gejalanya menyesatkan: katalog tetap menampilkan modelnya, karena barisnya masih ada di Supabase, tetapi berkasnya sudah tidak ada sehingga modelnya gagal dibuka.
:::

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
| Unggah model 3D gagal, atau berkasnya tidak muncul di `data/models` | Pemilik folder `data` bukan uid 1001. Kerjakan Tahap 8 |
| Model 3D yang dulu ada kini tidak dapat dibuka | Berkasnya hilang karena ditulis ke dalam container, bukan ke volume. Kerjakan Tahap 8 |

## Hasil Akhir

Layer 2D yang diunggah dari Geoportal tersimpan sebagai tabel di schema `gis`, terbit sebagai layer pada GeoServer, dan dapat dibuka kembali dari halaman katalog maupun dari QGIS memakai alamat WMS atau WFS yang tercantum.
