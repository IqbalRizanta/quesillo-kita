# 🍮 Quesillo.kita — Company Profile & Promotion System

<div align="center">

![Quesillo Banner](https://img.shields.io/badge/Quesillo.kita-Dessert%20Flan%20Venezuela-E8A93D?style=for-the-badge&logo=cookie&logoColor=white)
<br/>

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.19-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Husky](https://img.shields.io/badge/Git%20Hook-Husky%209-brightgreen?style=flat-square&logo=git)](https://typicode.github.io/husky/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)

**Website Company Profile & Media Promosi Modern dengan Alur Pemesanan Cepat via WhatsApp Langsung & Panel CMS Mandiri Tanpa Koding.**

[Fitur Utama](#-fitur-utama) •
[Menu Unggulan](#-menu-unggulan) •
[Arsitektur & Pola Desain](#-arsitektur--pola-desain) •
[Cara Menjalankan](#-cara-menjalankan) •
[Panduan Admin](#-portal-admin--cms) •
[Husky Pre-commit](#-standar-husky--git-hook)

</div>

---

## 📖 Tentang Quesillo.kita

**Quesillo.kita** adalah bisnis kuliner UMKM yang menyajikan dessert puding karamel khas Venezuela (*Quesillo / Flan*) berkualitas rumahan. Dibuat dari telur segar, susu murni, dan lelehan karamel alami tanpa pengawet.

Website ini dirancang khusus sebagai **Company Profile & Media Promosi** yang memikat:
- **Pengunjung Bebas Login**: Calon pembeli dapat langsung menjelajahi informasi produk, keunggulan bahan, promo berjalan, dan ulasan tanpa registrasi atau login.
- **Pemesanan Instan via WhatsApp**: Pembeli diarahkan langsung ke WhatsApp toko dengan pesan template otomatis yang memuat detail varian produk dan harga.
- **CMS Mandiri**: Pemilik toko non-IT dapat mengubah teks tampilan, mengunggah foto, memperbarui menu, menambah promo, dan memoderasi ulasan langsung dari HP/laptop tanpa menyentuh kode.

---

## ✨ Fitur Utama

- 📱 **Mobile-First Responsive Design**: Tampilan dirancang optimal untuk layar smartphone (360–430px) dengan transisi mulus dan navigasi bawah (*bottom navigation*).
- 🍮 **2 Menu Unggulan Spesial**: Fokus pada varian favorit *Original Classic* dan *Matcha Green Tea*.
- 💬 **WhatsApp Direct Ordering**: Tombol interaktif yang menyusun template pesan pemesanan otomatis ke nomor WhatsApp pemilik.
- 🎨 **Panel CMS Mandiri (Admin Dashboard)**: Mengelola pengaturan konten, logo, kontak toko, jam operasional, dan promo secara langsung.
- 📸 **Kompresi Gambar Otomatis**: Foto yang diunggah admin dari galeri smartphone otomatis di-resize di sisi klien (Canvas API, max 1280px JPEG 84%) sebelum ditransfer ke server, menghemat kuota dan memori.
- ⭐ **Moderasi Testimoni Pelanggan**: Pembeli dapat mengirim ulasan publik melalui form kontak, dan ulasan akan tampil setelah disetujui admin.
- 🔒 **Arsitektur Aman**: Validasi *Magic Bytes* asinkron untuk proteksi upload, proteksi *Rate Limiting* anti-brute force, JWT Authentication berproteksi, dan isolasi jaringan Docker Compose.

---

## 🍮 Menu Unggulan

| Menu | Kategori | Harga | Deskripsi Rasa |
|---|---|---|---|
| **Quesillo Original Classic** | Original | Rp18.000 | Puding karamel klasik khas Venezuela bertekstur lumer di mulut dengan lelehan saus karamel legit alami. |
| **Quesillo Matcha Green Tea** | Matcha | Rp22.000 | Perpaduan unik teh hijau Jepang premium dengan kelembutan susu karamel, menghasilkan rasa creamy manis beraroma harum. |

---

## 🏛️ Arsitektur & Pola Desain

Backend mengadopsi **Layered Architecture / DDD-Lite (Domain-Driven Design Lite)** guna menjamin kode terstruktur, modular, dan mudah diuji:

```
backend/src/
├── controllers/          # Presentation Layer (HTTP Request/Response Handling)
│   ├── AuthController.js
│   ├── ProductController.js
│   ├── SettingController.js
│   └── ContentController.js
├── services/             # Domain / Application Service Layer (Business Logic)
│   ├── AuthService.js
│   ├── ProductService.js
│   ├── SettingService.js
│   └── ContentService.js
├── repositories/         # Data Access Layer (Prisma ORM & DB Queries)
│   ├── UserRepository.js
│   ├── ProductRepository.js
│   ├── SettingRepository.js
│   └── ContentRepository.js
├── middleware/           # Cross-Cutting Infrastructure
│   ├── auth.js           # JWT Guard & Admin RBAC
│   ├── upload.js         # Asynchronous Magic Bytes Validation (JPEG, PNG, WebP)
│   ├── rateLimit.js      # Anti Brute-Force & Spam Limiter
│   └── errorHandler.js   # Centralized Exception Handler
├── lib/
│   ├── prisma.js         # Singleton Prisma Database Client
│   └── store.js          # In-Memory Safe Fallback Store
└── index.js              # Application Bootstrap & Route Mounting
```

---

## 🗂️ Struktur Direktori Proyek

```
Web-Kuesillo/
├── .husky/                   # Git pre-commit hooks (Husky v9)
│   └── pre-commit
├── backend/                  # REST API Express + Prisma
│   ├── prisma/
│   │   └── schema.prisma     # Skema Database PostgreSQL
│   ├── src/                  # Lapisan Controller, Service, Repository
│   ├── seed.js               # Database Seeder (Admin & 2 Varian Menu)
│   ├── test.js               # Automated Test Suite (15 Test Cases)
│   ├── Dockerfile
│   └── package.json
├── frontend/                 # Client SPA React 18 + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/       # Layout, Animasi (Framer Motion), Mascot
│   │   ├── lib/              # Axios instance & WhatsApp Helper
│   │   ├── pages/            # Home, Menu, Detail, Promo, Galeri, Kontak, Login, Admin
│   │   └── store/            # Zustand Store (Auth Admin & Toast)
│   ├── nginx.conf            # Nginx config untuk static build
│   ├── Dockerfile
│   └── package.json
├── nginx/
│   └── default.conf          # Reverse Proxy Configuration (:80 -> FE & BE)
├── docker-compose.yml        # Orchestration (DB, Backend, Frontend, Nginx)
├── package.json              # Root Workspace & Husky Hook Scripts
├── .gitignore                # Aturan Git Ignore
└── README.md                 # Dokumentasi Resmi Proyek
```

---

## 🚀 Cara Menjalankan

### 1. Prasyarat
- [Node.js](https://nodejs.org/) (versi 20 atau lebih baru)
- [Git](https://git-scm.com/)
- [PostgreSQL](https://www.postgresql.org/) atau [Docker Desktop](https://www.docker.com/)

### 2. Kloning Repositori
```bash
git clone https://github.com/username/Web-Kuesillo.git
cd Web-Kuesillo
```

### 3. Konfigurasi Environment Variable
Salin file template `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Sesuaikan isi `.env`:
```ini
DB_USER=quesillo
DB_PASS=quesillo123
DB_NAME=quesillo_db
DATABASE_URL=postgresql://quesillo:quesillo123@localhost:5432/quesillo_db?schema=public
JWT_SECRET=rahasia_jwt_anda_minimal_32_karakter
PORT=3000
FRONTEND_URL=http://localhost:5173,http://localhost
WA_ORDER_NUMBER=6281234567890
```

### 4. Instalasi Dependensi
```bash
# Instalasi dependensi root (termasuk Husky hook)
npm install

# Instalasi dependensi backend
cd backend && npm install && cd ..

# Instalasi dependensi frontend
cd frontend && npm install && cd ..
```

### 5. Inisialisasi Database & Seeding
```bash
cd backend
npx prisma generate
node seed.js
cd ..
```

### 6. Menjalankan di Mode Development
Buka 2 jendela terminal:

**Terminal 1 (Backend API):**
```bash
cd backend
npm run dev
# Berjalan di http://localhost:3000
```

**Terminal 2 (Frontend Client):**
```bash
cd frontend
npm run dev
# Berjalan di http://localhost:5173
```

### 7. Menjalankan via Docker Compose (Production Ready)
```bash
docker compose up --build -d
```
Aplikasi dapat langsung diakses melalui browser di `http://localhost`.

---

## 🔑 Portal Admin & CMS

Website ini bebas registrasi/login untuk pengunjung umum. Menu login sengaja disembunyikan agar tampilan bersih dan fokus pada promosi produk.

**Cara Masuk ke Panel Admin:**
1. **Melalui Link Footer**: Scroll ke bagian paling bawah halaman website, klik tulisan **"🔒 Kelola Toko"**.
2. **Ketik URL Langsung**: Buka URL `/admin` di browser (contoh: `http://localhost/admin` atau `http://localhost:5173/admin`).

**Kredensial Default:**
- **Email:** `admin@quesillo.local`
- **Password:** `admin123`

**Fitur Panel Admin:**
- 🍮 **Menu**: Edit harga, stok, deskripsi, dan foto varian *Original* dan *Matcha*, atau tambah menu musiman baru.
- 🎨 **Tampilan & Kontak**: Ubah teks banner hero, nomor WhatsApp pemesanan, alamat toko, jam operasional, link Instagram, dan teks promo.
- 🎟️ **Promo Banner**: Tambah dan hapus poster promosi.
- 📸 **Galeri Foto**: Tambah dan kelola foto produk/suasana pembuatan.
- 💬 **Ulasan Pembeli**: Meninjau dan menyetujui testimoni sebelum ditampilkan di halaman depan.

---

## 🐶 Standar Husky & Git Hook

Proyek ini telah dikonfigurasi dengan **Husky (v9)** untuk menjaga integritas kualitas kode sebelum di-commit ke Git repository.

### Hook Pre-commit (`.husky/pre-commit`):
Setiap kali menjalankan perintah `git commit`, Husky secara otomatis memverifikasi:
1. **Backend Integration Test Suite** (`npm --prefix backend test`): Memvalidasi 15 test cases (katalog produk, autentikasi admin, proteksi rate-limit, dan CMS real-time).
2. **Frontend Production Build Check** (`npm --prefix frontend run build`): Memastikan tidak ada syntax error, broken import, atau kegagalan kompilasi bundle Vite.

### Verifikasi Mandiri:
Seluruh kode telah disesuaikan agar **lolos 100% tanpa hambatan** saat di-commit:
```bash
npm test
```
*Output:*
```text
  ✅ Health Check 200
  ✅ Katalog publik memuat minimal 2 menu
  ✅ Menu Original Classic tersedia
  ✅ Menu Matcha Green Tea tersedia
  ✅ GET /settings 200 dengan nomor WA
  ✅ GET /promos 200
  ✅ GET /galleries 200
  ✅ GET /testimonials 200
  ✅ Kirim testimoni publik 201 (Pending)
  ✅ Login salah ditolak 401
  ✅ Login admin sukses 200
  ✅ Akses admin tanpa token ditolak 401
  ✅ Akses admin dengan token sukses 200
  ✅ Admin update settings CMS sukses
  ✅ Settings publik terupdate real-time
  Ringkasan: 15 lolos, 0 gagal
  ✓ built in 1m 8s
```

Anda dapat melakukan `git add .` dan `git commit -m "feat: company profile and promotion system"` dengan mulus tanpa adanya error penolakan hook!

---

## 📡 Ringkasan API Endpoints

### Endpoint Publik
| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/health` | Status kesehatan layanan backend |
| `GET` | `/settings` | Konfigurasi informasi toko, kontak WA, dan teks hero |
| `GET` | `/products` | Daftar menu aktif (Original, Matcha) |
| `GET` | `/products/:slug` | Informasi detail varian menu |
| `GET` | `/promos` | Teks berjalan promo & banner aktif |
| `GET` | `/galleries` | Foto galeri suasana & produk |
| `GET` | `/testimonials` | Ulasan pembeli yang telah disetujui admin |
| `POST`| `/testimonials` | Pengiriman ulasan baru dari pembeli (*rate-limited*) |

### Endpoint Administrator (Protected)
| Method | Endpoint | Deskripsi |
|---|---|---|
| `POST` | `/auth/login` | Login admin & perolehan JWT Bearer Token |
| `GET` | `/auth/me` | Validasi sesi admin aktif |
| `GET` | `/admin/stats` | Ringkasan statistik produk, banner, galeri, dan ulasan |
| `POST` | `/admin/products` | Tambah menu baru |
| `PUT` | `/admin/products/:id`| Perbarui harga, nama, deskripsi, atau foto menu |
| `DELETE`| `/admin/products/:id`| Hapus menu |
| `PUT` | `/admin/settings` | Perbarui konfigurasi CMS tampilan toko |
| `POST` | `/admin/upload` | Upload foto terverifikasi Magic Bytes (max 2MB) |
| `PATCH`| `/admin/testimonials/:id` | Menyetujui atau menyembunyikan ulasan pembeli |

---

## 📄 Lisensi & Kontribusi

Dibuat dengan cinta untuk **Quesillo.kita** 🍮💛.
Proyek ini didistribusikan di bawah lisensi MIT. Silakan fork dan kembangkan sesuai kebutuhan UMKM Anda!
