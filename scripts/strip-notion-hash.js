#!/usr/bin/env node
/**
 * strip-notion-hash.js
 *
 * Merapikan hasil export Notion:
 * - Menghapus hash 32 karakter yang Notion tempel di akhir nama file & folder
 *   (contoh: "Modul 2 3d530ca4290780fc830ac41159a47692.md" -> "Modul 2.md")
 * - Otomatis memperbaiki semua link & path gambar di dalam file .md yang
 *   sebelumnya mengacu ke nama lama (dengan hash)
 *
 * Kenapa perlu ini:
 * Hash yang ditempel Notion BERUBAH setiap kali kamu export ulang, padahal
 * judul halamannya sama. Kalau di-strip, nama file jadi konsisten terus
 * setiap update -> link di sidebar/config VitePress kamu nggak perlu
 * diubah-ubah lagi.
 *
 * Cara pakai:
 *   node strip-notion-hash.js "path/ke/folder/hasil-export-notion"
 *
 * Contoh:
 *   node strip-notion-hash.js "docs/Training WebGIS BIG"
 *
 * CATATAN PENTING:
 * - Jalankan ini di FOLDER HASIL EXPORT BARU (sebelum kamu gabungkan/replace
 *   ke folder docs/ VitePress kamu), atau backup dulu foldernya, karena
 *   script ini me-rename file & folder secara langsung (in-place).
 * - Setelah dijalankan, cek beberapa file .md secara acak untuk memastikan
 *   link gambar & antar-halaman sudah benar sebelum kamu commit/deploy.
 */

const fs = require('fs');
const path = require('path');

// Pola hash Notion: spasi + 32 karakter hex, tepat sebelum ekstensi (jika ada)
const HASH_RE = /\s[0-9a-f]{32}(?=(\.[a-zA-Z0-9]+)?$)/;

function stripHash(name) {
  return name.replace(HASH_RE, '');
}

/**
 * Rename semua file & folder secara rekursif (folder anak dulu, baru induk),
 * sambil mencatat mapping "nama lama" -> "nama baru" untuk tiap item yang berubah.
 */
function renameRecursive(dir, mapping) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const oldPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Proses isi folder dulu sebelum rename foldernya sendiri
      renameRecursive(oldPath, mapping);

      const newName = stripHash(entry.name);
      if (newName !== entry.name) {
        const newPath = path.join(dir, newName);
        if (!fs.existsSync(newPath)) {
          fs.renameSync(oldPath, newPath);
        }
        mapping.set(entry.name, newName);
      }
    } else {
      const newName = stripHash(entry.name);
      if (newName !== entry.name) {
        const newPath = path.join(dir, newName);
        if (!fs.existsSync(newPath)) {
          fs.renameSync(oldPath, newPath);
        }
        mapping.set(entry.name, newName);
      }
    }
  }
}

/** Cari semua file .md secara rekursif */
function findMdFiles(dir, list = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findMdFiles(p, list);
    } else if (entry.name.toLowerCase().endsWith('.md')) {
      list.push(p);
    }
  }
  return list;
}

/**
 * Ganti semua kemunculan nama lama (plain & URL-encoded) dengan nama baru
 * di dalam isi sebuah file markdown, berdasarkan mapping hasil rename.
 */
function fixLinksInFile(filePath, mapping) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Urutkan dari nama terpanjang dulu supaya tidak salah gantung
  // (mencegah nama pendek "menabrak" substring dari nama panjang)
  const sortedEntries = [...mapping.entries()].sort(
    (a, b) => b[0].length - a[0].length
  );

  for (const [oldName, newName] of sortedEntries) {
    const oldEncoded = encodeURIComponent(oldName);
    const newEncoded = encodeURIComponent(newName);

    if (content.includes(oldEncoded)) {
      content = content.split(oldEncoded).join(newEncoded);
      changed = true;
    }
    if (content.includes(oldName)) {
      content = content.split(oldName).join(newName);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
  return changed;
}

/**
 * Pembersihan tambahan: hapus SEMUA pola hash Notion yang ketemu di isi
 * file, baik dalam bentuk plain text maupun URL-encoded (%20).
 *
 * Ini menangani kasus di mana link/referensi di dalam teks (misalnya
 * halaman index yang berisi daftar link ke modul lain) punya hash yang
 * BERBEDA dari hash nama file aslinya -- sesuatu yang kadang terjadi pada
 * hasil export Notion. Karena tidak bergantung pada mapping rename, pola
 * ini akan menyapu bersih hash di manapun ditemukan dalam file.
 */
const GLOBAL_HASH_RE = /(%20|\s)[0-9a-f]{32}(?=(\.[A-Za-z0-9]+)?(?=[)\]"'\/]|$))/g;

function stripAllHashesInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const newContent = content.replace(GLOBAL_HASH_RE, '');

  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    return true;
  }
  return false;
}

// ---- main ----
const target = process.argv[2];

if (!target) {
  console.error('Usage: node strip-notion-hash.js <folder-hasil-export-notion>');
  process.exit(1);
}

if (!fs.existsSync(target) || !fs.statSync(target).isDirectory()) {
  console.error(`Folder tidak ditemukan: ${target}`);
  process.exit(1);
}

console.log(`Membersihkan hash di: ${target}\n`);

const mapping = new Map();
renameRecursive(target, mapping);

console.log(`- ${mapping.size} nama file/folder di-rename (hash dihapus)`);

const mdFiles = findMdFiles(target);
let fixedCount = 0;
let globalCleanCount = 0;

for (const file of mdFiles) {
  const changed = fixLinksInFile(file, mapping);
  if (changed) fixedCount++;

  // Sapu bersih sisa hash yang tidak tertangkap oleh mapping rename
  // (misal hash link berbeda dari hash nama file aslinya)
  const cleaned = stripAllHashesInFile(file);
  if (cleaned) globalCleanCount++;
}

console.log(`- ${mdFiles.length} file .md diperiksa`);
console.log(`- ${fixedCount} file .md diperbaiki link/gambarnya (via mapping rename)`);
console.log(`- ${globalCleanCount} file .md dibersihkan dari sisa hash lain (pembersihan global)`);
console.log('\nSelesai. Cek beberapa file secara acak untuk memastikan hasilnya benar.');
