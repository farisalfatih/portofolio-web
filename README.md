# Portfolio Fullstack — farisalfatih.my.id

## Cara 1: Docker Compose (Paling mudah)

Tidak perlu install Node.js atau PostgreSQL manual.

```bash
# 1. Masuk folder project
cd portfolio-final

# 2. Jalankan (tidak perlu buat .env untuk localhost)
docker compose up -d --build

# 3. Cek status
docker compose ps
```

| Alamat | Keterangan |
|---|---|
| http://localhost:3000 | Portfolio |
| http://localhost:3000/master/login | Admin Panel |

Login: **admin** / **admin123**

---

## Cara 2: Manual tanpa Docker

### Syarat
- Node.js v18+
- PostgreSQL (jalankan `init.sql` dulu)

### Backend

```bash
cd backend

# Buat file .env dari contoh
cp .env.example .env

# Edit DATABASE_URL jika user/password PostgreSQL berbeda
# Secara default: postgresql://portfolio_user:portfolio_pass@localhost:5432/portfolio_db

npm install
npm run dev
# Backend jalan di http://localhost:5000
```

### Frontend (terminal baru)

```bash
cd frontend
npm install
npm run dev
# Frontend jalan di http://localhost:5173
```

Buka: **http://localhost:5173/master/login**

> Tidak perlu buat frontend/.env karena Vite sudah proxy /api → localhost:5000 otomatis.

---

## Deploy ke VPS (farisalfatih.my.id)

```bash
# 1. Buat .env dan isi
cp .env.example .env
nano .env

# 2. Build dan jalankan
docker compose up -d --build
```

Pastikan port 3000 terbuka di firewall, atau pasang Caddy/Nginx sebagai reverse proxy ke port 3000.

---

## Struktur Folder

```
portfolio-final/
├── backend/
│   ├── src/
│   │   ├── db/        ← pool.js, init.sql
│   │   ├── middleware/ ← auth.js
│   │   └── routes/    ← auth, hero, about, skills, projects, contact, blog, upload
│   ├── uploads/       ← foto & CV tersimpan di sini
│   ├── .env.example
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/  ← Hero, About, Skills, Portfolio, Contact, Footer, Navbar
│   │   │   └── pages/master/ ← admin panel pages
│   │   ├── context/  ← AuthContext
│   │   └── lib/      ← api.js
│   ├── nginx.conf
│   └── Dockerfile
├── docker-compose.yml
└── .env.example
```
