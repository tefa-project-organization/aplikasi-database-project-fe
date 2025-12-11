
---

# 📝 **README — Struktur Proyek & Penjelasan Folder**

Dokumentasi ini menjelaskan struktur folder dan alur kerja pada proyek **Aplikasi Manajemen Database Project**.
Tujuannya agar tim dapat memahami bagaimana aplikasi diorganisasi, bagaimana alur aplikasi berjalan, dan apa fungsi setiap folder.

---

# 📦 **Struktur Direktori**

```
src/
 ├─ assets/
 ├─ components/
 │   └─ ui/
 ├─ constants/
 │   └─ api/
 ├─ contexts/
 │   ├─ AuthContext.jsx
 │   ├─ AuthProvider.jsx
 │   ├─ ThemeContext.jsx
 │   └─ misc/
 ├─ hooks/
 ├─ layouts/
 ├─ lib/
 │   ├─ api.js
 │   ├─ utils.js
 │   └─ axios.js
 ├─ mocks/
 ├─ pages/
 ├─ reducers/
 │   └─ ObjectReducer.js
 ├─ router/
 ├─ services/
 ├─ utils/
 ├─ App.jsx
 └─ main.jsx
```

---

# 📁 **Penjelasan Folder**

Berikut adalah penjelasan singkat dan jelas mengenai fungsi masing-masing folder:

---

## **`assets/`**

Folder untuk menyimpan file statis seperti:

* gambar atau ilustrasi
* icon custom
* font
* logo

> Tidak berisi kode JavaScript.

---

## **`components/`**

Berisi komponen UI yang dapat dipakai ulang di banyak halaman.

Contoh:

* Button
* Modal
* Input
* Table
* Pagination

### **`components/ui/`**

Folder otomatis dari **shadcn/ui**.
Jangan diubah manual.

---

## **`constants/`**

Berisi kumpulan nilai tetap yang digunakan seluruh aplikasi.

### **`constants/api/`**

Tempat mendefinisikan seluruh endpoint API, misalnya:

```js
export const GET_USERS = "/users";
export const CREATE_PROJECT = "/projects/create";
```

> Tujuannya agar perubahan API cukup dilakukan di satu tempat.

---

## **`contexts/`**

Berisi seluruh **React Context** untuk state global aplikasi.

Digunakan untuk menyimpan dan mengelola data yang dibutuhkan banyak komponen.

Isi:

* **AuthContext.jsx** → informasi login, token, dan user
* **AuthProvider.jsx** → provider untuk membungkus aplikasi
* **ThemeContext.jsx** → dark mode / light mode
* **misc/** → folder tambahan untuk context lain (sesuai struktur lama di proyek sebelumnya)

> Context membantu menghindari passing props secara berantai.

---

## **`hooks/`**

Tempat membuat custom hooks seperti:

* `useAuth()`
* `useTheme()`
* `useDebounce()`

> Membantu memecah logic menjadi lebih reusable dan rapi.

---

## **`layouts/`**

Berisi layout global yang membungkus halaman, contoh:

* Header
* Sidebar
* Template halaman utama

Layout biasanya digunakan di seluruh aplikasi.

---

## **`lib/`**

Folder untuk utilities tingkat “library”.

### **`api.js`**

Helper untuk request API (GET, POST, PUT, DELETE).

### **`axios.js`**

Axios instance yang sudah memiliki:

* `baseURL`
* interceptors (optional)
* middleware

### **`utils.js`**

Berisi fungsi `cn()` yang digunakan untuk menggabungkan class Tailwind dengan aman.

---

## **`mocks/`**

Berisi data dummy untuk development sebelum backend siap.

Contoh:

* JSON user sample
* Fake response API

---

## **`pages/`**

Berisi semua halaman (route) aplikasi.

Contoh:

```
pages/
 ├─ Dashboard/
 ├─ Projects/
 ├─ Logs/
 └─ Settings/
```

Setiap halaman biasanya memuat:

* UI utama
* komponen pendukung halaman tersebut
* logic routing

---

## **`reducers/`**

Folder untuk menyimpan reducer custom.
Contoh:

### **`ObjectReducer.js`**

Reducer serbaguna untuk mengelola state object yang kompleks.

Mendukung:

* `put` → ganti seluruh state
* `patch` → update sebagian field
* `remove` → hapus beberapa key

> Dibutuhkan untuk form kompleks atau data yang sering berubah.

---

## **`router/`**

Konfigurasi routing aplikasi.

Biasanya berisi:

* daftar route
* protected route
* router utama aplikasi

---

## **`services/`**

Abstraksi untuk memanggil API berdasarkan fitur.

Contoh:

```
services/authService.js
services/projectService.js
```

Kelebihan:

* File API tidak bercampur
* Tiap fitur punya logic terpisah
* Mudah di-maintain

---

## **`utils/`**

Helper umum yang bukan bagian dari library.

Contoh:

* format tanggal
* penyimpanan localStorage
* fungsi validator
* number formatter

---

# 📌 **File Utama**

### **`App.jsx`**

Entry utama komponen aplikasi.
Biasanya berisi:

* wrapper layout
* router
* provider context

### **`main.jsx`**

File paling awal yang dijalankan oleh Vite.
Tugas:

* render App.jsx ke DOM
* memuat provider global

---

# 🚀 **Alur Kerja Aplikasi (Ringkas)**

1. `main.jsx` menjalankan aplikasi dan merender `<App />`.
2. `App.jsx` memuat:

   * Router
   * Layout
   * Context Provider
3. Setiap halaman berada di dalam folder `pages/`.
4. Komponen UI berada di `components/`.
5. Pengambilan data API dilakukan melalui `services/`.
6. Endpoint didefinisikan di `constants/api/`.
7. Axios instance berada di `lib/axios.js`.

---