# 🚀 Quick Start DesignFlow

## ⚠️ LANGKAH PENTING SEBELUM MULAI

### 1. Hapus Environment Variable Sistem Windows

Ada bug di Windows environment variable yang harus diperbaiki terlebih dahulu:

**Cara Menghapus:**
```
1. Tekan Win + R
2. Ketik: sysdm.cpl
3. Enter
4. Klik tab "Advanced"
5. Klik "Environment Variables"
6. Cari variabel bernama "DATABASE_URL"
7. Hapus variabel tersebut (baik di User maupun System variables)
8. Klik OK semua dialog
9. RESTART Terminal/CMD/PowerShell Anda
10. RESTART VS Code jika sedang terbuka
```

## 📦 Install Dependencies

```bash
npm install
```

## 🗄️ Setup Database

Database sudah auto-configured ke Neon PostgreSQL. Data demo sudah ter-seed dengan 7 users dan 5 projects.

## ▶️ Menjalankan Aplikasi

### Cara 1: Start Backend + Frontend Bersamaan (Windows)

Klik 2x file `start-dev.bat` atau:

```bash
start-dev.bat
```

Atau di terminal lain:
```bash
npm run dev
```

### Cara 2: Start Manual (2 Terminal)

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## ✅ Verifikasi

1. **Backend API**: http://localhost:5175/health
   - Harus return: `{"status": "ok"}`

2. **Frontend**: http://localhost:5173
   - Login page harus muncul

## 🔐 Login dengan Akun Demo

Semua password: `password123`

| Role | Email | Akses |
|------|-------|-------|
| Admin | admin@designflow.com | Full access |
| Approver | budi@designflow.com | Approve designs |
| Reviewer | siti@designflow.com | Review designs |
| Designer Internal | ahmad@designflow.com | Create designs |
| Designer External | dewi@designflow.com | Create designs + Print |
| Requester | hasan@al-ihsan.sch.id | Request designs |
| Requester | rina@sman1jkt.sch.id | Request designs |

## 🐛 Troubleshooting

### Error: "Cannot connect to server"

✅ Pastikan backend sudah jalan di port 5175
✅ Check: http://localhost:5175/health

### Error: "Database connection failed"

✅ Pastikan environment variable `DATABASE_URL` di sistem Windows sudah dihapus
✅ Restart terminal after deleting environment variable
✅ Check file `.env` di root project ada dan benar

### Error: "Invalid token" atau "Session expired"

✅ Logout dan login kembali
✅ Clear browser localStorage
✅ Restart backend server

### Port 5175 atau 5173 sudah digunakan

```bash
# Windows - Kill process by port
netstat -ano | findstr :5175
taskkill /PID [PID_NUMBER] /F

netstat -ano | findstr :5173
taskkill /PID [PID_NUMBER] /F
```

## 📁 Struktur Project

```
designflow-app/
├── server/              # Backend Express + Prisma
│   ├── config/
│   ├── middleware/
│   ├── routes/
│   ├── index.ts        # Server entry
│   └── seed.ts         # Database seeder
├── src/                # Frontend React
│   ├── components/
│   ├── contexts/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   │   └── api.service.ts  # API client
│   └── types/
├── prisma/
│   └── schema.prisma
├── .env                # Environment variables
└── start-dev.bat       # Quick start script
```

## 🔧 NPM Scripts

```bash
npm run dev          # Start frontend only (Vite)
npm run server       # Start backend only (Express API)
npm run server:seed  # Re-seed database with demo data
npm run build        # Build frontend for production
```

## 📖 Dokumentasi Lengkap

- `dokumntasi.md` - Spesifikasi lengkap aplikasi
- `AKUN_DEMO.md` - Info akun demo
- `README_DEVELOPMENT.md` - Development guide

## 🎯 Next Steps

1. Login dengan akun admin atau designer
2. Explore dashboard dan projects
3. Create project baru dari menu "Request Design"
4. Test workflow: Draft → Designing → Review → Approve → Print

Selamat menggunakan DesignFlow! 🎨
