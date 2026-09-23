# Impor dan Pengelolaan Aset 3D dan 3D Tiles

## **Pembuatan Akun Cesium**

1. Buka tautan halaman cesium melalui [https://ion.cesium.com/signin/](https://ion.cesium.com/signin/) kemudian buat akun terlebih dahlu, jika sudah memiliki akun klik **sign in.**
    
![Halaman Sign in Cesium ion dengan tombol masuk lewat Bentley, Epic, GitHub, Google, dan Sketchfab di atas kolom username atau email](aset-3d-tiles/image1.png)
    
2. Berikut in merupakan tampilan awal halaman cesium. Tahap berikutnya buka menu **access token** yang akan digunakan untuk mendapatkan token cesium untuk proses pengembangan kedepannya.
    
![Halaman Stories ion.cesium.com dengan menu Access Tokens disorot kotak kuning pada bilah navigasi](aset-3d-tiles/image2.png)
    
3. Tahap berikutnya klik C**reate token** lalu input **name** dan pilih **expiration** untuk menentukan berapa lama token ini dapat digunakan, lalu klik **create**.
    
![Halaman Access Tokens dengan panel Create token berisi nama latihan 3D, masa berlaku 1 year, dan pilihan public scopes](aset-3d-tiles/image3.png)
    
4. Berikut ini merupakan hasil token yang sudah dibuat, kemudian simpan token ini dan gunakan pada pengembangan web cesium ditahap berikutnya.
    
![Halaman Access Tokens Cesium ion dengan panel detail di kanan berisi nama latihan 3D, token, masa berlaku 20 Apr 2027, serta scope assets dan geocode](aset-3d-tiles/image.png)
    

## **Menambahkan Model 3D ke Peta CesiumJS**

1. Pada tahap pertama buat file baru didalam folder **components** dengan nama **addModel3D.jsx**.
    
![Berkas addModel3D.jsx yang baru dibuat di dalam folder components peta3d-latihan-2 pada Explorer Visual Studio Code](aset-3d-tiles/image5.png)
    
2. Tahap kedua buat fungsi addModel3D yang digunakan untuk menambahkan dan mengatur model 3D pada Cesium Viewer. Kemudian tambahkan parameter berupa **viewer** dan **opsi**.
    
![Baris export default function addModel3D(viewer, opsi) dengan badan fungsi yang masih kosong](aset-3d-tiles/image6.png)
    
3. Tahap ketiga didalam fungsi tersebut, buat variabel **const Cesium = window.Cesium;** yang digunakan untuk mengambil library Cesium yang telah dimuat pada browser.
    
![Variabel const Cesium = window.Cesium di dalam fungsi addModel3D](aset-3d-tiles/image7.png)
    
4. Kemudian pada tahap keempat buat fungsi untuk mengambil data konfigurasi model 3D dari parameter opsi, seperti lokasi file model, koordinat, ketinggian, skala, arah hadap, dan nama model, sekaligus menetapkan nilai bawaan apabila beberapa konfigurasi tidak diberikan.
    
![Destrukturisasi opsi berisi url, latitude, longitude, ketinggian, skala, heading, dan nama beserta nilai bawaannya](aset-3d-tiles/image8.png)
    
5. Selanjutnya pada tahap kelima, buat fungsi untuk posisi model berdasarkan koordinat geografis dengan merubah menjadi koordinat kartersian menggunakan fungsi **Cesium.Cartesian3.fromDegrees()** untuk mengubah koordinat longitude, latitude, dan ketinggian menjadi posisi yang dapat digunakan untuk menempatkan model pada peta 3D.
    
![Baris const posisi memakai Cesium.Cartesian3.fromDegrees disorot kuning di tengah berkas](aset-3d-tiles/image9.png)
    
6. Pada tahap keenam buat fungsi untuk membuat pengaturan orientasi atau arah model 3D agar posisi hadap model dapat ditentukan pada peta.
    
![Baris const orientasi memakai Cesium.Transforms.headingPitchRollQuaternion yang argumennya masih kosong](aset-3d-tiles/image10.png)
    
7. Selanjutnya pada tahap ketujuh didalam fungsi sebelumnya yaitu fungsi **Cesium.Transforms.headingPitchRollQuaternion** tambahkan parameter untuk menentukan posisi dan arah hadap model 3D berdasarkan lokasi model serta nilai heading yang telah diatur sebelumnya.
    
![Isi orientasi berupa posisi dan new Cesium.HeadingPitchRoll dengan heading yang diubah ke radian, disorot kuning](aset-3d-tiles/image11.png)
    
8. Pada tahap kedelapan buat fungsi berupa **return viewer.entities.add** untuk menambahkan objek atau model 3D ke dalam Cesium Viewer agar dapat ditampilkan pada peta 3D.
    
![Baris return viewer.entities.add yang masih kosong disorot kuning](aset-3d-tiles/image12.png)
    
9. Tahap terakhir, pada fungsi kedelapan tambahkan parameter untuk melakukan konfigurasi properti model 3D yang digunakan untuk mengatur nama, posisi, arah hadap, tampilan, lokasi file, ukuran, dan ukuran minimum model saat ditampilkan pada Cesium Viewer.
    
![Properti entities.add berisi name, position, orientation, show, dan model dengan uri, scale, serta minimumPixelSize disorot kuning](aset-3d-tiles/image13.png)
    

### addModel3D.jsx, kode lengkap

```jsx
export default function addModel3D(viewer, opsi) {
  const Cesium = window.Cesium;

   const {
    url,
    latitude,
    longitude,
    ketinggian = 0,
    skala = 1,
    heading = 0,
    nama = 'Model 3D',
  } = opsi;

  const posisi = Cesium.Cartesian3.fromDegrees(longitude, latitude, ketinggian);  

  const orientasi = Cesium.Transforms.headingPitchRollQuaternion(
    posisi,
    new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(heading), 0, 0)
  );

   return viewer.entities.add({
    name: nama,
    position: posisi,
    orientation: orientasi,
    show: true,
    model: {
      uri: url,
      scale: skala,
      minimumPixelSize: 64,
    },
  });

}
```

## **Menambahkan Model 3D Tiles ke Peta CesiumJS**

1. Tahap pertama buat file baru pada folder **components** dengan nama **ad3DTileset.jsx** untuk menambahkan data 3D Tiles ke dalam Cesium Viewer. Selanjutnya tambahkan parameter **viewer, opsi** dan **selesai.**
    
![Berkas add3DTileset.jsx di folder components dengan baris export default function add3DTileset(viewer, opsi, selesai)](aset-3d-tiles/image14.png)
    
2. Selanjutnya buat fungsi **const Cesium = window.Cesium;** yang digunakan untuk mengambil library Cesium yang telah dimuat pada browser.
    
![Berkas add3DTileset.jsx berisi baris export default function add3DTileset(viewer, opsi, selesai) dan const Cesium = window.Cesium](aset-3d-tiles/image%201.png)
    
3. Pada tahap ketiga buat fungsi untuk mengambil konfigurasi 3D tiles berupa URL, Asset ID, nama layer, dan pengaturan zoom otomatis dari parameter opsi.
    
![Destrukturisasi opsi berisi url, assetId, nama 3D Tiles, dan otomatisZoom true disorot kuning](aset-3d-tiles/image%202.png)
    
4. Selanjutnya pada tahap kelima buat variabel **let proses;** yang digunakan untuk menyimpan proses pemuatan data 3D Tiles sebelum hasilnya ditampilkan.
    
![Destrukturisasi opsi berisi url, assetId, nama, dan otomatisZoom serta baris let proses disorot kuning](aset-3d-tiles/image17.png)
    
5. Pada tahap keenam buat kondisi menggunakan **if** untuk memeriksa apakah terdapat **assetId**, kemudian memuat data 3D Tiles dari Cesium ion menggunakan Asset ID yang telah diberikan.
    
![Blok if (assetId) yang memanggil Cesium.Cesium3DTileset.fromIonAssetId disorot kuning di bawah baris let proses](aset-3d-tiles/image%203.png)
    
6. Selanjutnya pada tahap ketujuh buat kondisi **else if** memeriksa apakah terdapat url, kemudian memuat data 3D Tiles dari alamat URL yang telah ditentukan menggunakan **Cesium.Cesium3DTileset.fromUrl()**.
    
![Blok if (assetId) dan else if (url) yang memakai fromIonAssetId dan fromUrl disorot kuning](aset-3d-tiles/image19.png)
    
7. Kemudian pada tahap kedelapan buat kondisi **if (selesai)** untuk menghentikan proses pemuatan dan mengembalikan nilai null melalui fungsi selesai apabila sumber data 3D Tiles tidak tersedia.
    
![Blok else yang memanggil selesai(null) lalu return saat sumber data tidak tersedia, disorot kuning](aset-3d-tiles/image20.png)
    
8. Tahap kesembilan buat fungsi untuk menjalankan proses berikutnya setelah data 3D Tiles berhasil dimuat, kemudian menerima hasil data dalam variabel tileset.
    
![Baris proses.then(function (tileset) dengan badan fungsi yang masih kosong, disorot kuning](aset-3d-tiles/image21.png)
    
9. Selanjutnya didalam fungsi tersebut tambahkan variabel **tileset.show** untuk mengatur agar data 3D dapat diproses pada peta.
    
![Baris tileset.show = true di dalam callback proses.then](aset-3d-tiles/image22.png)
    
10. Selanjutnya buat fungsi untuk menambahkan data 3D Tiles ke dalam Cesium Viewer agar dapat ditampilkan pada peta.
    
![Baris viewer.scene.primitives.add(tileset) di dalam callback proses.then disorot kuning](aset-3d-tiles/image23.png)
    
11. Tahap berikutnya lanjutkan dengan membuat kondisi **if (otomatisZoom)** untuk mengarahkan kamera secara otomatis ke lokasi 3D Tiles apabila fitur otomatis zoom diaktifkan.
    
![Blok if (otomatisZoom) yang memanggil viewer.zoomTo(tileset) disorot kuning](aset-3d-tiles/image24.png)
    
12. Kemudian tahap terakhir buat kondisi **if (selesai)** untuk menjalankan fungsi selesai dan mengirimkan objek tileset setelah data 3D Tiles berhasil dimuat.
    
![Berkas add3DTileset.jsx lengkap dengan blok proses.then berisi tileset.show, primitives.add, otomatisZoom, dan selesai(tileset) disorot kuning](aset-3d-tiles/image%204.png)
    

### add3DTileset.jsx, kode lengkap

```jsx
export default function add3DTileset(viewer, opsi, selesai) {
  const Cesium = window.Cesium;

   const {
    url,
    assetId,
    nama = '3D Tiles',
    otomatisZoom = true,
   } = opsi;
  
   let proses; 

   if (assetId) {
    proses = Cesium.Cesium3DTileset.fromIonAssetId(assetId);
   } else if (url) {
     proses = Cesium.Cesium3DTileset.fromUrl(url);
   } else {
     if (selesai) selesai(null);
     return;
   }

   proses.then(function (tileset) {
      tileset.show = true;
      viewer.scene.primitives.add(tileset);

      if (otomatisZoom) {
        viewer.zoomTo(tileset);
      }

      if (selesai) selesai(tileset); 
    })
    
}
```

## **Pembuatan Panel 3D Aset**

1. Tahap pertama buat fungsi untuk menampilkan panel layer dengan membuat fungsi **addPanelLayer3D** serta tambahkan parameter **viewer** dan **daftarLayer**.
    
![Berkas PanelLayer3D.jsx baru berisi export default function addPanelLayer3D(viewer, daftarLayer) yang badannya masih kosong](aset-3d-tiles/image%205.png)
    
2. Kemudian tahap kedua buat elemen **div** menggunakan JavaScript.
    
![Berkas PanelLayer3D.jsx dengan baris const panel = document.createElement('div') disorot kuning](aset-3d-tiles/image27.png)
    
3. Selanjutnya pada tahap ketiga buat fungsi untuk mengatur posisi dan tampilan panel dengan menggunakan styling css meliputi **position: absolut** untuk membuat posisi panel bebas. Kemudian **top: 50px** merupakan jarak dari atas, **right: 50px** merupakan jarak dari kanan. Lalu **background: white** merupakan **Warna latar putih**, kemudian **padding** untuk memberikan jarak isi panel. Selanjutnya buat **border-radius** untuk membuat sudut panel melengkung serta **min-width** untuk menentukan lebar minimum panel.
    
![Blok panel.style.cssText berisi position absolute, top, right, background putih, padding, border-radius, dan min-width disorot kuning](aset-3d-tiles/image28.png)
    
4. Tahap keempat buat panel menggunakan properti innerHTML. Pada tahap ini, elemen `<div>` digunakan untuk menampilkan teks "Layer 3D", kemudian diberikan styling agar judul terlihat lebih tegas dan memiliki jarak dengan daftar layer yang akan ditampilkan di bawahnya.
    
![Blok panel.innerHTML berisi div bergaya bold dengan teks Layer 3D disorot kuning di bawah panel.style.cssText](aset-3d-tiles/image%206.png)
    
5. Pada tahap kelima buat fungsi untuk melakukan perulangan pada setiap data layer menggunakan Object.entries() dan forEach(), kemudian ambil nama serta objek dari masing-masing layer untuk digunakan dalam proses pembuatan kontrol layer secara otomatis.
    
![Blok panel.innerHTML untuk judul Layer 3D dan baris Object.entries(daftarLayer).forEach disorot kuning](aset-3d-tiles/image30.png)
    
6. Tahap ketujuh buat fungsi **if** untuk periksa terlebih dahulu apakah objek layer tersedia, kemudian jika layer tersedia buat elemen label sebagai wadah untuk menampilkan kontrol checkbox dan nama dari setiap layer.
    
![Baris if (!objek) return dan const baris = document.createElement('label') disorot kuning](aset-3d-tiles/image31.png)
    
7. Selanjutnya pada tahap kedelapan buat fungsi untuk mengatur tampilan elemen baris menggunakan css agar checkbox dan nama layer tersusun secara horizontal, sejajar, memiliki jarak antar elemen, serta memberikan tampilan yang lebih interaktif ketika pengguna mengarahkan kursor ke kontrol layer.
    
![Blok baris.style.cssText dengan display flex, align-items center, gap 8px, dan cursor pointer disorot kuning](aset-3d-tiles/image%207.png)
    
8. Pada tahap kesembilan buat fungsi menggunakan properti **innerHTML** untuk menambahkan isi HTML ke dalam elemen baris. Isi tersebut berupa checkbox yang digunakan untuk mengontrol visibilitas layer dan nama layer.
    
![Blok baris.innerHTML berisi input checkbox checked dan span nama layer disorot kuning di bawah baris.style.cssText](aset-3d-tiles/image%208.png)
    
9. Selanjutnya tambahkan tambahkan fungsi pada checkbox untuk mengatur tampilan layer. Script **querySelector('input')** digunakan untuk memilih elemen checkbox, sedangkan **addEventListener('change')** digunakan untuk mendeteksi perubahan saat pengguna mencentang atau menghilangkan centang. Nilai **e.target.checked** kemudian digunakan untuk mengatur properti **objek.show,** sehingga layer akan ditampilkan ketika checkbox aktif dan disembunyikan ketika checkbox tidak aktif.
    
![Blok baris.querySelector('input').addEventListener('change') dengan objek.show = e.target.checked disorot kuning](aset-3d-tiles/image34.png)
    
10. Tahap berikutnya buat fungsi untuk menambahkan kontrol layer kedalam panel dengan menggunakan **appendChild()** untuk menambahkan elemen baris yang berisi checkbox dan nama layer.
    
![Baris panel.appendChild(baris) di akhir perulangan Object.entries daftarLayer disorot kuning](aset-3d-tiles/image%209.png)
    
11. Pada tahap terakhir, tambahkan elemen panel ke dalam container Cesium Viewer menggunakan **appendChild().** Dengan cara ini, panel kontrol layer akan tampil di atas peta. Selanjutnya, return panel digunakan untuk mengembalikan elemen panel agar dapat digunakan kembali jika diperlukan.
    
![Baris viewer.container.appendChild(panel) dan return panel di akhir fungsi PanelLayer3D disorot kuning](aset-3d-tiles/image36.png)
    
12. Berikut ini keseluruhan script untuk panelLayer3D.
    
![Berkas PanelLayer3D.jsx di editor VS Code memuat panel.style.cssText, panel.innerHTML judul Layer 3D, dan awal Object.entries(daftarLayer)](aset-3d-tiles/image%2010.png)
    

### PanelLayer3D.jsx, kode lengkap

```jsx
export default function addPanelLayer3D(viewer, daftarLayer) {

  const panel = document.createElement('div');

  panel.style.cssText = `
    position:absolute;
    top:50px;
    right:50px;
    z-index:999;
    background:white;
    padding:10px 14px;
    border-radius:6px;
    font-family:sans-serif;
    font-size:13px;
    box-shadow:0 1px 6px rgba(0,0,0,0.3);
    min-width:180px;
    color:#111;
  `;

  panel.innerHTML = `
    <div style="font-weight:bold;margin-bottom:8px;color:#111;">
      Layer 3D
    </div>
  `;

  Object.entries(daftarLayer).forEach(([nama, objek]) => {

    if (!objek) return;

    const baris = document.createElement('label');

    baris.style.cssText = `
      display:flex;
      align-items:center;
      gap:8px;
      margin-bottom:6px;
      cursor:pointer;
      color:#111;
    `;

    baris.innerHTML = `
      <input type="checkbox" checked />
      <span style="color:#111;">${nama}</span>
    `;

    baris.querySelector('input').addEventListener('change', (e) => {
      objek.show = e.target.checked;
    });

    panel.appendChild(baris);
  });

  viewer.container.appendChild(panel);

  return panel;
}
```

## **Pemanggilan Data 3D Dalam Peta**

1. Tahap pertama buka file **CesiumViewer.jsx** lalu tambahkan Cesium Ion Access Token dibawah **const CESIUM_STYLE_URL** dengan menggunakan token yang sebelumnya telah dibuat pada poin A.
    
![Berkas CesiumViewer.jsx dengan baris const CESIUM_ION_TOKEN berisi token yang disorot kuning](aset-3d-tiles/image38.png)
    
2. Tahap kedua pada fungsi **function createViewerCesium(container) {** tambahkan Cesium Ion Access Token untuk menghubungkan aplikasi dengan layanan Cesium Ion.
    
![Baris Cesium.Ion.defaultAccessToken = CESIUM_ION_TOKEN di dalam createViewerCesium disorot kuning](aset-3d-tiles/image39.png)
    
3. Tahap beirkutnya dibawah fungsi **function createViewerCesium(container)** buat fungsi baru yaitu **function addContent3D(viewer)** yang digunakan sebagai wadah untuk mengatur seluruh proses penambahan data dan objek 3D ke dalam Cesium Viewer.
    
![Fungsi addContent3D(viewer) yang masih kosong di bawah createViewerCesium disorot kuning](aset-3d-tiles/image40.png)
    
4. Selanjutnya tambahkan data 3D Tileset ke dalam Cesium Viewer menggunakan fungsi **add3DTileset()**, kemudian tentukan **assetId** sebagai sumber data 3D, berikan nama layer, dan atur opsi **otomatisZoom** agar kamera tidak berpindah secara otomatis saat layer dimuat.
    
![Pemanggilan add3DTileset dengan assetId 96188, nama Gedung 3D (OSM Buildings), dan otomatisZoom false disorot kuning](aset-3d-tiles/image41.png)
    
5. Pada tahap berikutnya setelah data 3D Tileset berhasil dimuat, gunakan fungsi callback untuk menerima objek **gedung3D** sehingga objek tersebut dapat digunakan pada proses selanjutnya, seperti menambahkan model 3D atau membuat kontrol layer.
    
![Callback function (gedung3D) yang masih kosong di dalam add3DTileset disorot kuning](aset-3d-tiles/image42.png)
    
6. Selanjutnya pada **function (gedung3D)** buat fungsi untuk menambahkan model 3D berformat GLB menggunakan fungsi **addModel3D()** dengan menentukan sumber file, lokasi, ketinggian, ukuran, arah, dan nama model sebelum digunakan pada tahap berikutnya.
    
![Pemanggilan addModel3D untuk model GLB Bangunan Kotak dengan ketinggian 30, skala 20, dan heading 0 disorot kuning](aset-3d-tiles/image43.png)
    
7. Tahap terakhir dalam **function (gedung3D)** buat fungsi **addPanelLayer3D()**, kemudian masukkan objek Gedung 3D dan model GLB ke dalam daftar layer melalui checkbox pada panel.
    
![Pemanggilan addPanelLayer3D dengan daftar layer Gedung 3D dan Bangunan Kotak disorot kuning](aset-3d-tiles/image44.png)
    
8. Selanjutnya pada tahap terakhir pada fungsi **useEffect(() => {if (status !== 'siap' || viewerRef.current) return;** panggil fungsi **addContent3D()** dengan mengirimkan objek **viewerRef.current** untuk menambahkan berbagai konten dan objek 3D ke dalam peta.
    
![Baris addContent3D(viewerRef.current) di dalam blok try useEffect pada CesiumViewer.jsx disorot kuning](aset-3d-tiles/image%2011.png)
    
9. Hasil tampilan objek 3D dalam peta dengan format tileset.
    
![Peta 3D menampilkan gedung OSM Buildings dengan panel Layer 3D yang kedua checkboxnya tercentang](aset-3d-tiles/image%2012.png)
    
10. Hasil tampilan objek 3D dengan menggunakan model data glb.
    
![Peta jalan OSM dengan satu model GLB berbentuk kotak merah di tengah, sementara layer Gedung 3D tidak dicentang pada panel Layer 3D](aset-3d-tiles/image%2013.png)

### CesiumViewer.jsx, kode lengkap

```jsx
'use client';

import { useEffect, useRef, useState } from 'react';
import addLayerBasemap from './Basemap';
import add3DTileset from './add3DTileset';
import addPanelLayer3D from './PanelLayer3D';
import addModel3D from './addModel3D';
import addTerrain from './addTerrain';
import addCameraNav from './addCameraNav';
import addDataVektor2D from './addDataVektor2D';
import addInteraksiPengguna from './addInteraksiPengguna';

const CESIUM_VERSION = '1.120';
const CESIUM_BASE_URL = `https://cesium.com/downloads/cesiumjs/releases/${CESIUM_VERSION}/Build/Cesium/`;
const CESIUM_SCRIPT_URL = `${CESIUM_BASE_URL}Cesium.js`;
const CESIUM_STYLE_URL = `${CESIUM_BASE_URL}Widgets/widgets.css`;

const CESIUM_ION_TOKEN = process.env.CESIUM_ION_TOKEN;

const LOKASI_AWAL = {
  latitude: -6.2432495,
  longitude: 106.7979208,
  ketinggian: 2000,
  heading: 20,
  pitch: -35,
};

const VIEWER_OPTIONS = {
  timeline: false,
  animation: false,
  baseLayerPicker: false,
  geocoder: false,
  homeButton: true,
  navigationHelpButton: false,
  sceneModePicker: false,
  infoBox: false,
  selectionIndicator: false,
  shadows: true,
};

function LoadCesium(onBerhasil, onGagal) {
  if (window.Cesium) {
    onBerhasil();
    return;
  }

  const cssTag = document.createElement('link');
  cssTag.rel = 'stylesheet';
  cssTag.href = CESIUM_STYLE_URL;
  document.head.appendChild(cssTag);

  const scriptTag = document.createElement('script');
  scriptTag.src = CESIUM_SCRIPT_URL;
  scriptTag.async = true;
  scriptTag.onload = onBerhasil;
  scriptTag.onerror = () => onGagal('Gagal memuat CesiumJS dari CDN. Cek koneksi internet.');
  document.body.appendChild(scriptTag);
}

function createViewerCesium(container) {
  const Cesium = window.Cesium;
  Cesium.buildModuleUrl.setBaseUrl(CESIUM_BASE_URL);
  Cesium.Ion.defaultAccessToken = CESIUM_ION_TOKEN;

  const viewer = new Cesium.Viewer(container, {
    ...VIEWER_OPTIONS,
    terrainProvider: new Cesium.EllipsoidTerrainProvider(),
    imageryProvider: false,
  });

  addLayerBasemap(viewer);
  viewer.scene.globe.depthTestAgainstTerrain = true;
  viewer.scene.globe.enableLighting = true;
  viewer.scene.light = new Cesium.SunLight();

  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(
      LOKASI_AWAL.longitude,
      LOKASI_AWAL.latitude,
      LOKASI_AWAL.ketinggian
    ),
    orientation: {
      heading: Cesium.Math.toRadians(LOKASI_AWAL.heading),
      pitch: Cesium.Math.toRadians(LOKASI_AWAL.pitch),
      roll: 0,
    },
  });

  return viewer;
}

function addContent3D(viewer) {
  const Cesium = window.Cesium;

  const kontrolTerrain = addTerrain(viewer, {
    aktifTerrainAwal: true,
  });

  const kontrolKamera = addCameraNav(viewer, {
    lokasiAwal: LOKASI_AWAL,
    tampilkanPanel: true,
  });

  add3DTileset(
    viewer,
    {
      assetId: 96188,
      nama: 'Gedung 3D (OSM Buildings)',
      otomatisZoom: false,
    },
    function (gedung3D) {
      const modelBox = addModel3D(viewer, {
        url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/Box/glTF-Binary/Box.glb',
        latitude: LOKASI_AWAL.latitude,
        longitude: LOKASI_AWAL.longitude,
        ketinggian: 30,
        skala: 20,
        heading: 0,
        nama: 'Bangunan Kotak (Contoh GLB)',
      });

    addDataVektor2D(
      viewer,
      {
        url: '/portal/data/jalan.geojson',
        nama: 'Jaringan Jalan',
        warnaGaris: Cesium.Color.YELLOW,
        lebarGaris: 4,
        otomatisZoom: false,
      },
      function (jaringanJalan) {
        addDataVektor2D(
          viewer,
          {
            url: '/portal/data/batas_admin.geojson',
            nama: 'Batas Administrasi',
            warnaArea: Cesium.Color.CYAN.withAlpha(0.4),
            otomatisZoom: false,
          },
      function (batasAdmin) {
        const kontrolInteraksi = addInteraksiPengguna(viewer);
        addPanelLayer3D(
            viewer,
            {
              'Gedung 3D (OSM Buildings)': gedung3D,
              'Bangunan Kotak (Contoh GLB)': modelBox,
              'Jaringan Jalan': jaringanJalan,
              'Batas Administrasi': batasAdmin,
            },
            kontrolTerrain,
            kontrolInteraksi
            );

            kontrolKamera.terbangKe(
              LOKASI_AWAL.latitude,
              LOKASI_AWAL.longitude,
              800,
              20,
              -40
            );
          }
        );

      }
    );
    }
  );

  return { kontrolTerrain, kontrolKamera };
}

export default function CesiumViewer() {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const [status, setStatus] = useState('memuat');

  useEffect(() => {
    LoadCesium(
      () => setStatus('siap'),
      (pesan) => {
        setPesanError(pesan);
        setStatus('error');
      }
    );
  }, []);

  useEffect(() => {
    if (status !== 'siap' || viewerRef.current) return;

    try {
      viewerRef.current = createViewerCesium(containerRef.current);

      addContent3D(viewerRef.current);

    } catch (err) {
      console.error('Cesium init error:', err);
      setPesanError('Gagal membuat peta. Cek console untuk detail.');
      setStatus('error');
    }

    return () => {
      viewerRef.current?.destroy();
      viewerRef.current = null;
    };
  }, [status]);
return <div ref={containerRef} style={{ width: '100%', height: '100vh' }} />;
}
```
