# 🚀 Portfolio Fullstack — Mohammad Faris Al Fatih

Portfolio website dengan admin panel berbasis database. Dibangun dengan **React + Vite**, **Express.js**, dan **PostgreSQL**, dijalankan dengan **Docker Compose**.

---

## 📦 Struktur Project

```
portfolio-fullstack/
├── backend/                  # Express.js API
│   ├── src/
│   │   ├── db/
│   │   │   ├── init.sql      # Schema + seed data
│   │   │   └── pool.js       # Koneksi PostgreSQL
│   │   ├── middleware/
│   │   │   └── auth.js       # JWT middleware
│   │   ├── routes/           # auth, hero, about, skills, projects, contact, blog
│   │   └── index.js          # Entry point Express
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                 # React + Vite
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/   # Navbar, Hero, About, Skills, Portfolio, Contact, Footer
│   │   │   └── pages/
│   │   │       └── master/   # Admin panel semua halaman
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   └── lib/
│   │       └── api.js        # Centralized API calls
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## ⚡ Cara Menjalankan (Docker)

### 1. Clone & Setup Environment

```bash
# Copy file env
cp .env.example .env

# Edit sesuai kebutuhan (opsional)
nano .env
```

### 2. Jalankan dengan Docker Compose

```bash
docker-compose up --build
```

Tunggu sampai semua container siap (sekitar 1-2 menit pertama kali).

### 3. Akses Aplikasi

| Layanan       | URL                           |
|---------------|-------------------------------|
| Portfolio     | http://localhost:3000         |
| Admin Panel   | http://localhost:3000/master  |
| Backend API   | http://localhost:5000         |

---

## 🔐 Login Admin

Default credentials:

```
Username : admin
Password : admin123
```

> ⚠️ **Segera ganti password** setelah pertama login melalui menu **Pengaturan** di admin panel!

---

## 🎛️ Fitur Admin Panel (`/master`)

| Halaman         | Fungsi                                              |
|-----------------|-----------------------------------------------------|
| Dashboard       | Overview statistik konten                           |
| Hero & Profil   | Edit nama, tagline, quote, link sosial & CV         |
| Tentang Saya    | Edit 3 paragraf biografi                            |
| Keahlian        | CRUD kategori skill + skill items                   |
| Proyek          | CRUD proyek dengan filter tipe, tech stack, dll     |
| Kontak          | Edit email, telepon, lokasi, WhatsApp, Maps         |
| Blog            | CRUD artikel + toggle publish/draft                 |
| Pengaturan      | Ganti password admin                                |

---

## 🌐 API Endpoints

### Public (tanpa token)
```
GET  /api/hero
GET  /api/about
GET  /api/skills
GET  /api/projects
GET  /api/contact
GET  /api/blog
GET  /api/health
```

### Protected (butuh Bearer JWT token)
```
POST /api/auth/login
GET  /api/auth/me
PUT  /api/auth/change-password

PUT  /api/hero
PUT  /api/about
PUT  /api/contact

POST /api/skills/categories
PUT  /api/skills/categories/:id
DELETE /api/skills/categories/:id
POST /api/skills
PUT  /api/skills/:id
DELETE /api/skills/:id

POST /api/projects
PUT  /api/projects/:id
DELETE /api/projects/:id

GET  /api/blog/all
POST /api/blog
PUT  /api/blog/:id
DELETE /api/blog/:id
```

---

## 🛠️ Menjalankan Tanpa Docker (Development)

### Backend
```bash
cd backend
npm install
# Buat file .env dengan DATABASE_URL, JWT_SECRET
npm run dev   # Jalankan dengan nodemon
```

### Frontend
```bash
cd frontend
npm install
# Buat file .env.local dengan VITE_API_URL=http://localhost:5000
npm run dev
```

---

## 🗄️ Database

PostgreSQL di-seed otomatis saat pertama kali dijalankan melalui `backend/src/db/init.sql`.

Untuk reset database:
```bash
docker-compose down -v     # Hapus volume
docker-compose up --build  # Rebuild dari awal
```

---

## 📝 Catatan

- Foto profil (`profile.png`) ada di `frontend/src/assets/images/`
- Untuk ganti foto, replace file tersebut lalu rebuild container frontend
- Password di-hash menggunakan bcrypt (tidak tersimpan plaintext)
- Token JWT berlaku 7 hari (bisa diubah di `.env`)
