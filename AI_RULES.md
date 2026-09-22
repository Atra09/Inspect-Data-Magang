# MANDATORY AI AGENT EXECUTION RULES (CALOKAPAL PROJECT)

> **⚠️ RULES UTAMA BAGI SELURUH AI AGENT & DEVELOPER:**  
> Sebelum membaca, mengedit, atau menambahkan kode di dalam repositori `CaloKapal`, Anda **WAJIB** membaca dan mematuhi seluruh aturan di file ini, `PROJECT_BLUEPRINT.md`, dan `README.md`.

---

## 1. ATURAN WAJIB SEBELUM MENGEDIT KODE (ANALISA DAHULU)

1. **ANALISA KODE LAMA SEBELUM EDIT**:
   - Dilarang keras menimpa (*overwrite*) file secara serampangan tanpa membaca dan menganalisis kode yang sudah ada terlebih dahulu.
   - Setiap perubahan harus diawali dengan membaca isi file terkait (`view_file`), memahami alur kerja kode lama, lalu melakukan perbaikan (*refactoring*) secara presisi.
2. **JANGAN BUAT KODE PARALEL / DUPLIKASI**:
   - Dilarang membuat file baru jika fungsi tersebut sudah ada atau bisa digabungkan ke dalam file/komponen yang sudah ada.
   - Utamakan memperbarui dan memperbagus file yang sudah ada (*refactor & enhance*).

---

## 2. ATURAN BEBAS SPAGHETTI CODE (ANTI-SPAGHETTI ARCHITECTURE) & MODULAR KAMPUS/CLEARANCE STANDARD

1. **RANCANG DAHULU DI FOLDER `component/`**:
   - Apapun fitur atau komponen UI yang akan dibangun/digunakan di banyak halaman (atau berpotensi dipakai ulang), **WAJIB dirancang dan dipecah-pecah terlebih dahulu di dalam folder `src/component/`** (misal: `component/layout/`, `component/dashboard/`, `component/ui/`, `component/form/`, dll) sebelum dipasang pada file `pages/`.
   - **Pemecahan Komponen secara Atomik**: Setiap file komponen harus difokuskan pada satu tugas spesifik (ringan, modular, dan berdiri sendiri). Halaman di `pages/` hanya bertugas menyusun (*assemble*) komponen-komponen kecil dari folder `component/`.
   - **Direct Import (Tanpa Barrel `index.js`)**: Diimpor secara langsung per file komponen (`import SearchBar from '../../component/common/SearchBar'`) mengikuti standar `Manajemen-Clearance-Kapal-Tradisional-main`.
   - **Penulisan Kode Ringan & Sederhana**: Penulisan sintaks React & Tailwind CSS harus tetap sederhana, bersih, ringan tanpa dependensi berlebih, dan mudah dipahami.
2. **Single Responsibility Principle (SRP) & Standard Backend**:
   - **Controller (Backend)**: HANYA menerima Request, memanggil Service/Helper, dan mengembalikan Response. Dilarang menumpuk logika SQL/Algoritma kompleks di dalam file controller.
   - **Screen/Widget (Flutter Mobile / React Web)**: HANYA mengurus Tampilan UI & Event Handling. Logika State, OCR, dan API Call HARUS dipisah ke `context/`, `services/`, atau `api/`.
3. **Prinsip Reusable Components (DRY - Don't Repeat Yourself)**:
   - Semua fungsi pembentuk respon API (`ApiResponse`), pengolah JWT, error handler, string matcher, dan UI widget/komponen HARUS ditaruh di folder komponen terpusat (`src/component/`, `src/utils/`, `src/api/`) agar **bisa dipakai ulang di banyak halaman/route**.
4. **Pemisahan Modul Terisolasi**:
   - Dilarang mencampur logika Frontend dan Backend dalam satu file. Folder `mobile/`, `backend/`, dan `frontend/` wajib terpisah sempurna.

---

## 3. PERFORMA TINGGI, KODE BACKEND RINGAN, DAN JANGKA PANJANG (LONG-TERM MAINTAINABILITY)

1. **Mobile (Flutter)**:
   - **Edge AI OCR (Native & Offline)**: Menggunakan `google_mlkit_text_recognition` yang berjalan di mesin C++ bawaan Android/iOS.
   - **Bebas Lag Kamera**: Dilarang menggunakan loop deteksi 30 FPS terus-menerus (seperti YOLO). Gunakan *snapshot-based / trigger-based capture* saat KTP berada di kotak kamera agar HP tidak panas dan RAM hemat.
2. **Backend (Node.js Express & Database - Ultra-Ringan & Jangka Panjang)**:
   - **Penulisan Kode Backend Ringan & Sederhana**: Seluruh kode backend (Express JS, Controllers, Services, Route) HARUS ditulis secara ultra-ringan, ringkas, sederhana, dan bersih tanpa *over-engineering* atau abstraksi berlebihan.
   - **Desain Jangka Panjang (*Long-Term Maintainability*)**:
     - Membawa arsitektur MVC yang rapi dan mudah dirawat oleh pengembang lain di masa depan.
     - Indeks basis data presisi pada kolom kunci (seperti `nik`, `trip_id`, `kapal_id`).
     - Penggunaan async/await non-blocking I/O dengan penanganan error (*try-catch & centralized error handler*) yang konsisten.
     - Payload respon JSON yang hemat dan terstruktur (`{ success: true, data: ..., message: ... }`).
3. **Frontend React Web App (Sesuai Standar `Manajemen-Clearance-Kapal-Tradisional-main`)**:
   - Berbasis **Vite + React** (Modul ES Native, ultra-cepat, ringan, tanpa overhead).
   - Penggayaan berbasis **Tailwind CSS + Vanilla CSS Custom Sculpting** untuk performa render 60–120 FPS.
   - Struktur komponen terpisah secara modular (`src/component/`, `src/pages/`, `src/context/`, `src/api/`).
   - Komunikasi API menggunakan `axios` (`axiosInstance.js`) dengan *interceptor* otomatis ke Backend `PORT 3003`.
   - Menggunakan Vektor `lucide-react` / `react-icons` yang *lightweight* tanpa beban memori tinggi.
   - Desain **Mobile-First Responsive** (Responsif penuh dari HP Android/iOS Petugas hingga Monitor PC Syahbandar).

---

## 4. STANDAR KEAMANAN TINGGI (HIGH SECURITY & DATA PROTECTION)

1. **Perlindungan Data Pribadi (UU PDP)**:
   - File foto KTP dan data NIK dispesifikasikan sebagai Data Pribadi Spesifik.
   - Foto KTP wajib diberi **Watermark Otomatis**:  
     `"ARSIP INSPEKSI KSOP - KAPAL: [NAMA_KAPAL] - TANGGAL: [DATE]"`
   - Folder upload foto KTP di server (`public/uploads/`) wajib dilindungi dari akses publik langsung tanpa token autentikasi.
2. **Keamanan Server & API**:
   - Wajib menggunakan **JWT (JSON Web Token)** untuk autentikasi endpoint terproteksi.
   - Sanitasi & Validasi ketat pada melempar `req.body` dan `req.params` untuk mencegah SQL Injection & XSS.
   - Gunakan CORS terkonfigurasi dan header keamanan (Helmet/Rate Limiting).

---

## 5. REKAP CHECKLIST UNTUK AI AGENT

Sebelum mengeksekusi perintah koding dari user:
- [ ] Apakah saya sudah membaca file lama sebelum mengeditnya?
- [ ] Apakah fitur UI yang dibangun sudah dirancang dan dipecah terlebih dahulu di dalam folder `src/component/`?
- [ ] Apakah pengimporan komponen menggunakan *Direct Import* tanpa `index.js` sesuai standar `Manajemen-Clearance-Kapal-Tradisional-main`?
- [ ] Apakah penulisan kode backend ultra-ringan, sederhana, dan ramah untuk pemeliharaan jangka panjang (*long-term maintainability*)?
- [ ] Apakah perbaikan kode tetap menjaga aplikasi kencang, aman (JWT & PDP), dan hemat memori?
