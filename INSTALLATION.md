# Panduan Instalasi (singkat)

Dokumen ini menjelaskan cara menyiapkan proyek frontend secara lokal (development) dan daftar screenshot yang perlu diambil untuk handover. Perintah contoh ditujukan untuk Windows PowerShell.

## Persyaratan

- Node.js LTS (>=16, direkomendasikan 18+)
- npm (terpasang bersama Node.js)
- Git (opsional jika clone dari repo)
- Backend API berjalan atau alamat API yang dapat diakses

## Langkah cepat

1. Clone repo dan masuk folder
   - git clone <repo-url>
   - cd aplikasi-database-project-fe

2. Pasang dependensi
   - powershell: npm install

3. Buat file environment
   - Buat `.env.local` di root (JANGAN commit).
   - Contoh `.env.local`:

```env
VITE_BASE_URL_API_LOCAL=http://localhost:8000
VITE_BASE_URL_API_DOMAIN=https://api.example.com
# tambahkan variabel lain bila perlu
```

4. Jalankan dev server
   - powershell: npm run dev
   - Buka URL yang muncul (biasanya http://localhost:5173)

5. Build untuk production (opsional)
   - npm run build
   - npm run preview

## Troubleshooting umum

- CORS / credentials: jika API pakai cookie HTTP-only, backend harus mengizinkan CORS dengan credentials dan origin yang benar.
- Salah BASE URL: periksa variabel di `.env.local` lalu restart dev server.
- Error Node/npm: gunakan versi Node LTS; jika perlu hapus `node_modules` dan jalankan `npm install` ulang.

## Verifikasi singkat

- Buka aplikasi di browser, lakukan login (jika ada) dan navigasi ke Dashboard / User Management untuk memastikan koneksi API.
- Buka DevTools → Network untuk memastikan request API berhasil (status 200).