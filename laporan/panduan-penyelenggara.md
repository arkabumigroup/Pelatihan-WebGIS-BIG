# Panduan Penyelenggara

Catatan operasional untuk yang menyelenggarakan pelatihan. Berkas ini tidak
ikut terbit di situs modul, karena isinya bukan untuk peserta.

## Menambahkan record DNS peserta

Satu record untuk setiap peserta. Domain `webgisbig.com` dikelola satu akun
Cloudflare oleh penyelenggara, dan peserta tidak diberi akses ke sana.

Bagian ini untuk penyelenggara, bukan peserta.

Isi record sebagai berikut:

| Kolom | Nilai |
|---|---|
| Type | `A` |
| Name | `PARTICIPANT_ID` saja, tanpa `.webgisbig.com` |
| IPv4 address | Alamat IP statis VM peserta |
| Proxy status | **DNS only**, bukan Proxied |
| TTL | `Auto` |

**Proxy status harus DNS only**, yaitu awan kelabu, bukan awan jingga. Alasannya dijelaskan pada bagian berikut.

Alasan proxy harus dimatikan: bila record diproksikan, permintaan tidak
langsung menuju VM, melainkan melewati Cloudflare lebih dahulu. Cloudflare
kemudian meneruskannya ke VM memakai mode SSL/TLS yang sedang berlaku, dan
beberapa mode yang umum dipakai justru menggagalkan penerbitan sertifikat
pertama. Mode **Full (strict)** adalah contohnya: Cloudflare meminta
sertifikat yang sah dari VM, sedangkan sertifikat itu justru yang sedang
hendak diterbitkan.
