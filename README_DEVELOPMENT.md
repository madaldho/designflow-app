# DesignFlow Development Guide

## 🚀 Quick Start

### 1. Hapus Environment Variable Sistem (PENTING!)

Ada environment variable `DATABASE_URL` yang di-set di sistem Windows. Ini harus dihapus:

1. Tekan `Win + R`, ketik `sysdm.cpl`, Enter
2. Tab **Advanced** → **Environment Variables**
3. Cari `DATABASE_URL` di **User variables** atau **System variables**
4. **Delete** variable tersebut
5. Restart terminal/VS Code

### 2. Start Backend Server

```bash
# Windows
start-dev.bat

# Atau manual dengan npm
npm run server
```

Server akan jalan di `http://localhost:5175`

### 3. Start Frontend (Terminal Baru)

```bash
npm run dev
```

Frontend akan jalan di `http://localhost:5173`

### 4. Test API

Buka browser dan tes:
- Health check: http://localhost:5175/health
- Login dengan akun demo (lihat AKUN_DEMO.md)

## 📦 Database Setup

Database sudah di-setup di Neon PostgreSQL. Jika ingin reset data demo:

```bash
npm run server:seed
```

## 🔐 Akun Demo

Lihat file `AKUN_DEMO.md` untuk daftar akun demo yang bisa digunakan untuk testing.

Password semua akun: `password123`

## 🛠️ Troubleshooting

### Server tidak bisa connect ke database

1. Pastikan environment variable sistem `DATABASE_URL` sudah dihapus
2. Check file `.env` di root project
3. Restart terminal

### Frontend tidak bisa connect ke backend

1. Pastikan backend server sudah jalan (check http://localhost:5175/health)
2. Check console browser untuk error messages
3. Pastikan CORS sudah di-enable di backend

### Build Error

```bash
# Clear cache
rm -rf node_modules
rm package-lock.json
npm install
```

## 📁 Struktur Project

```
designflow-app/
├── server/                 # Backend Express API
│   ├── config/            # Database config
│   ├── middleware/        # Auth middleware
│   ├── routes/            # API routes
│   ├── index.ts           # Server entry point
│   └── seed.ts            # Database seeder
├── src/                   # Frontend React
│   ├── components/        # React components
│   ├── contexts/          # Context providers
│   ├── hooks/             # Custom hooks
│   ├── pages/             # Page components
│   ├── services/          # API services
│   └── types/             # TypeScript types
├── prisma/                # Database schema
│   └── schema.prisma
└── .env                   # Environment variables
```

## 🔧 Development Scripts

```bash
npm run dev            # Start frontend only
npm run server         # Start backend only
npm run server:seed    # Seed database with demo data
npm run build          # Build frontend for production
```

## 🎨 UI/UX Guidelines

- Gunakan Tailwind CSS untuk styling
- Komponen reusable ada di `src/components/ui`
- Gunakan design system yang consistent
- Mobile-first responsive design
- Loading states dan error handling untuk semua actions

## 📝 Development Workflow

1. Start backend server dengan `start-dev.bat` atau `npm run server`
2. Start frontend dengan `npm run dev` di terminal baru
3. Test fitur dengan akun demo
4. Check console untuk errors
5. Commit changes dengan message yang jelas

## 🐛 Known Issues

1. Environment variable sistem `DATABASE_URL` conflict - **harus dihapus secara manual**
2. First time connection ke Neon bisa lambat - tunggu beberapa detik
3. Hot reload kadang perlu manual refresh browser

## 📮 Support

Check dokumentasi lengkap di `dokumntasi.md` untuk detail fitur dan requirements.
