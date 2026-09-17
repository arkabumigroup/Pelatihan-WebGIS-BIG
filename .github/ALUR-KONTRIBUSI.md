# Alur Kontribusi

Catatan ini disimpan karena satu kesalahan pernah terjadi berulang: commit baru
dimasukkan ke branch yang PR-nya **sudah di-merge**.

Push ke branch yang PR-nya sudah ditutup **tidak memperbarui PR itu**. Commit
baru itu menggantung tanpa PR, tidak terlihat dalam tinjauan, dan tidak masuk
`main`. Akibatnya perbaikan dianggap selesai padahal belum sampai ke mana pun.

## Aturan

Satu branch baru untuk setiap kumpulan perubahan.

```bash
# 1. Mulai dari main terbaru
git checkout main
git pull

# 2. Branch baru, namanya bebas
git checkout -b perbaikan-halaman-skema

# 3. Kerjakan SELURUH perubahan kumpulan ini di branch tersebut
git add -A
git commit -m "..."

# 4. Push dan buka PR
git push -u origin perbaikan-halaman-skema
gh pr create --base main --head perbaikan-halaman-skema

# 5. Periksa sebelum menyatakan selesai
git status --short                 # harus kosong
git log origin/main..HEAD --oneline # harus sama dengan isi PR
gh pr list --state open            # PR-nya harus muncul
```

## Empat hal yang diperiksa sebelum menyatakan selesai

| Pemeriksaan | Perintah | Harapan |
|---|---|---|
| Tidak ada berkas menggantung | `git status --short` | kosong |
| Semua commit sudah di-push | `git log @{u}..HEAD --oneline` | kosong |
| PR benar-benar ada | `gh pr list --state open` | PR muncul |
| Isi PR sesuai judul | `gh pr view --json commits` | tidak ada commit asing |

Pemeriksaan ketiga itu yang paling sering terlewat. Commit yang sudah di-push
**belum tentu** punya PR, dan commit tanpa PR tidak akan pernah masuk `main`.

## Setelah PR di-merge

Branch itu selesai. Jangan dipakai lagi. Kumpulan perubahan berikutnya dimulai
dari branch baru pada langkah 1.

## Repositori peserta

Repositori peserta berada di repositori terpisah, `personal-geoportal-peserta`,
dan memakai aturan yang sama. Bila satu perubahan menyentuh keduanya, buat satu
branch di **masing-masing** repositori, dan buka dua PR.
