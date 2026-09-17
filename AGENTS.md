# antislop:start
## antislop
For UI, copy, people, mobile layout, or code comments work, read `antislop.md` (core) and then the skill for the task:
- UI / visual: `skills/antislop-ui/SKILL.md`
- Copy & text: `skills/antislop-copywriting/SKILL.md`
- People: `skills/antislop-human/SKILL.md`
- Mobile / responsive: `skills/antislop-layoutmobile/SKILL.md`
- Code comments: `skills/antislop-code/SKILL.md`
Before starting, ask the user when antislop applies: during the work, or after it is done.
<!-- antislop:end -->

# Panduan Repositori

Repositori ini adalah situs VitePress berisi materi Pelatihan WebGIS tingkat dasar sampai lanjutan yang diselenggarakan Arkabumi dan PPKIG BIG.

## Struktur

```
docs/
  index.md                 halaman depan
  materi-pelatihan.md      daftar materi per hari
  hari-1/ ... hari-4/      materi menurut hari pelaksanaan
  public/unduhan/          berkas yang bisa diunduh peserta
  .vitepress/config.mjs    sidebar dan pengaturan situs
```

Materi disusun **per hari**, mengikuti susunan acara pelatihan. Setiap folder hari punya `index.md` berisi jadwal sesi dan daftar materi.

Satu halaman berisi satu berkas `.md` dengan folder gambar bernama sama di sebelahnya. Rujukan gambar selalu relatif, misalnya `![alt](peta-awal/image2.png)`. Kalau berkas `.md` atau foldernya diubah namanya, rujukan di dalamnya harus ikut diubah.

## Mengubah Isi

Beberapa aturan yang perlu dipegang:

- Satu halaman `.md` berpasangan dengan satu folder gambar seusai nama berkasnya. Jangan memisahkan keduanya.
- Berkas pendukung yang bisa diunduh diletakkan di `docs/public/unduhan/`. Jangan taruh berkas `.yml` atau `.conf` di folder gambar halaman, karena VitePress menyajikannya sebagai halaman, bukan sebagai berkas.
- Bagian yang belum punya materi ditandai dengan blok `::: warning` yang menjelaskan statusnya. Jangan mengosongkan bagian tanpa keterangan.
- Sebutkan di mana perintah dijalankan (Cloud Shell, terminal VM, terminal laptop) pada setiap tahap yang memakainya.

## Perintah

```bash
npm install          # memasang dependensi
npm run docs:dev     # menjalankan server pengembangan
npm run docs:build   # membangun situs; gagal bila ada tautan mati
npm run docs:preview # melihat hasil build
```

`npm run docs:build` memeriksa tautan mati dan akan berhenti dengan galat. Jalankan perintah itu sebelum mengirim perubahan.

## Gaya Penulisan

Materi ditulis dalam bahasa Indonesia, memakai istilah teknis apa adanya tanpa diterjemahkan paksa. Nada penulisannya instruktif dan tenang: jelaskan apa yang dilakukan, mengapa, dan apa yang terjadi bila salah. Hindari kata pemasaran seperti "canggih", "mudah", atau "powerful".
