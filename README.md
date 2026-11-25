# Task Management Board

Aplikasi papan tugas (Kanban) untuk mengelola pekerjaan tim, dibuat dengan **Ionic + Vue 3 + TypeScript**.

Aplikasi berjalan sepenuhnya di browser, **tanpa backend/API**. Semua data disimpan di _localStorage_ melalui state management Pinia.

**🔗 Demo:** [https://task-board-26.vercel.app](https://task-board-26.vercel.app)

---

## Daftar Isi

- [Fitur](#fitur)
- [Teknologi](#teknologi)
- [Menjalankan di Komputer Lokal](#menjalankan-di-komputer-lokal)
- [Cara Menggunakan Aplikasi](#cara-menggunakan-aplikasi)
- [Penyimpanan Data](#penyimpanan-data)
- [Struktur Folder](#struktur-folder)
- [Keputusan Arsitektur](#keputusan-arsitektur)
- [Pengujian](#pengujian)
- [Deploy ke Vercel](#deploy-ke-vercel)
- [Catatan](#catatan)

---

## Fitur

### Fitur utama

| No  | Fitur                   | Implementasi                                                                                                                       |
| --- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Tampilan board & column | Kolom **To do, Doing, Review, Done, Rework**. Setiap kolom bisa berisi banyak task card                                            |
| 2   | Task card               | Judul, deskripsi, assignee (avatar), due date, label (Feature / Bug / Issue / Undefined), priority, checklist, dan attachment      |
| 3   | Filtering & searching   | Cari berdasarkan judul, deskripsi, label, nama assignee, dan subtask. Filter berdasarkan **assignee**, **label**, dan **due date** |
| 4   | CRUD task               | **Create** lewat tombol `+` di kolom, **Read** berupa card, **Update** dan **Delete** lewat modal detail                           |
| 5   | Drag & drop             | Pindahkan card antar kolom maupun ubah urutan dalam satu kolom. Bisa di desktop (mouse) dan HP (sentuh)                            |
| 6   | Checklist (subtask)     | Tambah, centang/batal centang, dan hapus subtask. Progress bar menyesuaikan otomatis                                               |
| 7   | Penyimpanan data        | Pinia + localStorage, data tetap ada setelah halaman di-refresh                                                                    |

### Fitur tambahan

- **Cover image** pada task (unggah gambar dari perangkat).
- **Toast notification** saat membuat, mengubah, dan menghapus task.
- **Animasi & interaksi**: efek drag, transisi kolom, hover card, dan animasi daftar.
- **Activity log**: setiap perubahan task tercatat (misalnya "moved this task from To do to Done").
- **Export / Import JSON**: simpan data ke file dan muat kembali di browser lain.
- **Kelola kolom**: tambah kolom (_Add new List_), ganti nama, hapus, dan ciutkan (_collapse_).
- **Beberapa board**: pindah antar board lewat dropdown di kiri atas.
- **Responsif**: tampilan desktop sesuai desain, dan tampilan khusus untuk tablet & HP.

---

## Teknologi

| Teknologi                                                                     | Versi | Kegunaan                                                               |
| ----------------------------------------------------------------------------- | ----- | ---------------------------------------------------------------------- |
| [Ionic Vue](https://ionicframework.com/docs/vue/overview)                     | 9     | Komponen UI (modal, popover, select, datetime, checkbox, toast, alert) |
| [Vue](https://vuejs.org/)                                                     | 3.5   | Framework frontend (Composition API, `<script setup>`)                 |
| [TypeScript](https://www.typescriptlang.org/)                                 | 6     | Type safety di seluruh kode                                            |
| [Pinia](https://pinia.vuejs.org/)                                             | 4     | State management                                                       |
| [Vuedraggable](https://github.com/SortableJS/vue.draggable.next) (SortableJS) | 4     | Drag & drop                                                            |
| [Vite](https://vite.dev/)                                                     | 8     | Build tool & dev server                                                |
| [Vitest](https://vitest.dev/)                                                 | 5     | Unit test                                                              |
| ESLint + Prettier                                                             | —     | Menjaga kualitas dan kerapian kode                                     |

---

## Menjalankan di Komputer Lokal

### Prasyarat

- **Node.js 22.12 atau lebih baru** (disarankan versi LTS terbaru). Cek dengan `node -v`.
- **npm** (sudah termasuk saat memasang Node.js).

### Langkah-langkah

```bash
# 1. Clone repository
git clone https://github.com/mamanglikeyou/Management-Board.git
cd Management-Board

# 2. Pasang dependensi
npm install

# 3. Jalankan mode development
npm run dev
```

Buka **http://localhost:5173** di browser.

### Daftar perintah

| Perintah             | Fungsi                                                                     |
| -------------------- | -------------------------------------------------------------------------- |
| `npm run dev`        | Menjalankan aplikasi mode development (perubahan kode langsung terlihat)   |
| `npm run build`      | Cek tipe TypeScript, lalu membuat versi produksi di folder `dist/`         |
| `npm run preview`    | Menjalankan hasil build produksi di http://localhost:4173                  |
| `npm test`           | Menjalankan semua unit test                                                |
| `npm run test:watch` | Menjalankan unit test dalam mode pantau (otomatis ulang saat kode berubah) |
| `npm run lint`       | Mengecek kualitas kode dengan ESLint                                       |
| `npm run typecheck`  | Mengecek tipe TypeScript saja                                              |
| `npm run avatars`    | Membuat ulang gambar avatar anggota tim di `public/avatars/`               |

---

## Cara Menggunakan Aplikasi

| Aksi                        | Caranya                                                                                                                                                                     |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Membuat task**            | Klik tombol **`+`** di samping nama kolom, isi data, lalu klik **Create**                                                                                                   |
| **Melihat / mengubah task** | Klik card untuk membuka detail, ubah data, lalu klik **Save**                                                                                                               |
| **Membatalkan perubahan**   | Klik **Discard** atau **✕**. Jika ada perubahan yang belum disimpan, akan muncul konfirmasi                                                                                 |
| **Menghapus task**          | Buka detail task, lalu klik ikon **tong sampah** di kanan atas                                                                                                              |
| **Menandai selesai**        | Buka detail task, lalu klik **Mark Complete**. Progress bar di card berubah hijau                                                                                           |
| **Memindahkan task**        | Seret card ke kolom lain. Di HP, **tekan agak lama** dulu sebelum menggeser. Bisa juga lewat field **Column** di detail task                                                |
| **Checklist**               | Di detail task, klik **Add subtask**, ketik judul, lalu tekan **Enter**. Centang untuk menandai selesai                                                                     |
| **Cover image**             | Di detail task, klik **Add Cover Image** dan pilih gambar                                                                                                                   |
| **Attachment**              | Seret file ke kotak **Attachments** atau klik **browse from device** (hanya nama & ukuran file yang disimpan)                                                               |
| **Mencari task**            | Ketik di kolom **Search Tasks**                                                                                                                                             |
| **Filter task**             | Klik **Filter**, lalu pilih assignee, label, atau due date. Klik **Clear all** untuk menghapus filter                                                                       |
| **Kelola kolom**            | Klik ikon **⋮** di kolom untuk menambah task, mengganti nama, atau menghapus kolom. Ikon panah di kanan kolom untuk menciutkan kolom. **Add new List** untuk menambah kolom |
| **Pindah board**            | Klik nama board di kiri atas                                                                                                                                                |
| **Export / Import / Reset** | Klik **Export / Import**, lalu pilih _Export as JSON_, _Import from JSON_, atau _Reset demo data_                                                                           |

---

## Penyimpanan Data

Karena tidak memakai backend, data disimpan di **localStorage browser** dengan dua kunci:

| Kunci                | Isi                                                        |
| -------------------- | ---------------------------------------------------------- |
| `adhivasindo:boards` | Daftar board, kolom, dan board yang sedang aktif           |
| `adhivasindo:tasks`  | Semua task beserta checklist, attachment, dan activity log |

Hal yang perlu diketahui:

- Data **tersimpan per browser dan per alamat**. Data di `localhost` berbeda dengan data di situs yang sudah di-deploy.
- Data akan **hilang** jika _site data_ browser dihapus atau memakai mode Incognito. Aplikasi lalu otomatis kembali ke data contoh.
- Data bisa dipindahkan ke browser lain lewat **Export / Import JSON**.
- Data tersimpan memiliki **nomor versi**. Jika struktur data berubah, data lama yang tidak cocok diabaikan agar aplikasi tidak rusak.

Untuk melihat datanya: tekan **F12**, buka tab **Application**, lalu pilih **Local Storage**.

---

## Struktur Folder

Kode disusun **per fitur** (_feature-based_), bukan per jenis file, agar setiap fitur mudah dikembangkan secara terpisah.

```
src/
├── core/                  Fondasi yang tidak bergantung pada fitur tertentu
│   ├── storage/           Antarmuka penyimpanan (StorageDriver) + plugin persist Pinia
│   └── utils/             Helper umum: tanggal, file, id, clone
├── theme/                 Design tokens (warna, ukuran, radius) + tema Ionic
├── shared/                Bagian yang dipakai ulang di banyak tempat
│   ├── components/        Komponen UI reusable: AvatarStack, LabelBadge, ProgressBar,
│   │                      DateChip, FieldSelect, ActionMenu, InlineInput, tombol, dll.
│   ├── composables/       useToast (notifikasi), useConfirm (dialog konfirmasi)
│   └── icons/             Satu tempat untuk semua ikon (Ionicons + ikon custom dari desain)
├── features/
│   ├── board/             Store board & kolom, header, kolom, halaman board
│   ├── task/              Store task, card, modal detail, logika form, activity log
│   ├── filter/            Store filter + fungsi pencarian/filter (matchTask)
│   ├── members/           Data anggota tim & tombol Invite
│   └── transfer/          Export, import, dan reset data
├── data/                  Data contoh (seed) yang meniru isi desain
├── router/                Konfigurasi routing
└── main.ts                Titik awal aplikasi

tests/                     Unit test
public/avatars/            Gambar avatar anggota tim
scripts/                   Script pendukung (pembuat avatar)
```

---

## Keputusan Arsitektur

- **Logika dipisah dari tampilan.** Pencarian & filter (`matchTask`), perhitungan progress checklist, pengurutan card (`positionBetween`), dan pencatatan activity log ditulis sebagai fungsi murni dan diuji dengan unit test. Komponen hanya menampilkan data dan mengirim event.
- **Penyimpanan bisa diganti.** Store tidak mengakses localStorage secara langsung, melainkan lewat `StorageDriver`. Untuk pindah ke IndexedDB, Ionic Storage, atau REST API, cukup buat driver baru tanpa mengubah store maupun komponen.
- **Edit berbasis draf.** Modal detail mengedit salinan data (`useTaskForm`). Data baru tersimpan ke store saat **Save** ditekan, sedangkan **Discard** membuang salinan tersebut.
- **Pengurutan fraksional.** Setiap task memiliki nilai `position`. Saat drag & drop, hanya card yang dipindah yang diperbarui. Pola ini siap dipakai jika nanti terhubung ke API.
- **Logika lintas store di composable.** Contohnya, menghapus kolom sekaligus menghapus task di dalamnya ditangani `useBoardActions`, sehingga setiap store tetap punya satu tanggung jawab.
- **Design tokens.** Warna, ukuran, dan radius didefinisikan sebagai CSS variable di `src/theme/tokens.css`. Nilainya diukur langsung dari gambar desain referensi, sehingga mengubah tema cukup di satu file.
- **Responsif.** Desktop mengikuti desain. Di tablet tombol header menjadi ikon. Di HP setiap kolom memenuhi layar dengan _snap scrolling_ dan modal detail tampil layar penuh.

---

## Pengujian

```bash
npm test
```

Unit test (Vitest) mencakup:

- **Pencarian & filter**: berdasarkan judul, deskripsi, assignee, label, subtask, dan berbagai filter due date.
- **Store task**: membuat, mengubah (termasuk activity log), memindahkan (drag & drop), dan menghapus task.
- **Utilitas**: perhitungan progress checklist dan posisi card.
- **Export / Import**: validasi file, penolakan file yang tidak valid, dan penyimpanan data.

---

## Deploy ke Vercel

Project ini sudah siap di-deploy ke Vercel. File `vercel.json` sudah mengatur perintah build, folder output, dan _rewrite_ agar semua URL diarahkan ke aplikasi.

1. Login ke [vercel.com](https://vercel.com) dengan akun GitHub.
2. Klik **Add New → Project**, lalu pilih repository ini dan klik **Import**.
3. Framework akan terdeteksi sebagai **Vite**. Pengaturan lain tidak perlu diubah.
4. Klik **Deploy**.

Setiap kali ada push ke branch `main`, Vercel otomatis melakukan deploy ulang.

---

## Catatan

- Gambar cover task adalah gambar dummy dari [Unsplash](https://unsplash.com).
- Avatar anggota tim dibuat dengan [DiceBear](https://www.dicebear.com/) (gaya _Notionists_) dan disimpan sebagai file statis di `public/avatars/`.
- Nama dan email anggota tim adalah data contoh.
- Attachment bersifat dummy: hanya nama, ukuran, dan jenis file yang disimpan, bukan isi file.
