# 🧪 Panduan Testing Database Sync

## Masalah yang Sudah Diperbaiki ✅

**ProjectsPage tidak menampilkan data dari Neon database** - FIXED!

### Yang Sudah Diperbaiki:
1. ✅ ProjectsPage sekarang fetch data real dari Neon database
2. ✅ Tambah loading state untuk UX yang lebih baik
3. ✅ Error handling yang proper
4. ✅ Date handling yang benar dari API
5. ✅ Performance optimization dengan useMemo

---

## 🚀 Cara Test Database Sync

### Option 1: Automated Test (RECOMMENDED)

```bash
# 1. Seed database dengan data demo
test-sync.bat

# 2. Test koneksi API dan database
# (buka terminal baru setelah server running)
powershell -ExecutionPolicy Bypass -File test-connection.ps1
```

### Option 2: Manual Steps

#### Step 1: Setup Database
```bash
# Validate schema
npx prisma validate

# Run migrations ke Neon
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# Seed database dengan data demo
npm run server:seed
```

#### Step 2: Start Development Servers
```bash
# Terminal 1 - Start backend
npm run server

# Terminal 2 - Start frontend
npm run dev
```

#### Step 3: Test di Browser
1. Buka http://localhost:5173
2. Login dengan:
   - Email: `admin@designflow.com`
   - Password: `password123`
3. Cek halaman **Semua Proyek** - seharusnya tampil 5 projects dari database
4. Cek halaman **Dashboard** - seharusnya tampil statistics real-time

---

## 👥 Demo Accounts

Setelah seeding, tersedia akun-akun ini:

### Admin
- **Email:** admin@designflow.com
- **Password:** password123
- **Akses:** Full access ke semua fitur

### Requester
- **Email:** hasan@al-ihsan.sch.id
- **Password:** password123
- **Akses:** Bisa request dan track projects

### Designer (Internal)
- **Email:** ahmad@designflow.com
- **Password:** password123
- **Akses:** Design projects yang di-assign

### Designer (External)
- **Email:** dewi@designflow.com
- **Password:** password123
- **Akses:** Design + print queue

### Reviewer
- **Email:** siti@designflow.com
- **Password:** password123
- **Akses:** Review submitted designs

### Approver
- **Email:** budi@designflow.com
- **Password:** password123
- **Akses:** Final approval

---

## ✅ Checklist Testing

### Database Sync
- [ ] Backend server berjalan di port 5175
- [ ] Database berhasil di-migrate
- [ ] Data berhasil di-seed (5 projects, 7 users, 3 institutions)
- [ ] API endpoint `/api/projects` return data

### Frontend Display
- [ ] Login berhasil dengan demo account
- [ ] Dashboard menampilkan statistics real
- [ ] Halaman "Semua Proyek" menampilkan projects dari database
- [ ] Projects bisa di-search dan filter
- [ ] Detail project bisa dibuka
- [ ] No mock data / dummy data

### Real-time Sync
- [ ] Create project baru → langsung muncul di list
- [ ] Update project → langsung update di UI
- [ ] Delete project → langsung hilang dari list
- [ ] Activities log ter-update real-time

---

## 🐛 Troubleshooting

### Problem: "Cannot connect to server"
**Solution:**
```bash
# Check apakah backend running
curl http://localhost:5175/health

# Kalau tidak, start server:
npm run server
```

### Problem: "No projects found"
**Solution:**
```bash
# Seed database dengan data demo
npm run server:seed
```

### Problem: "Prisma Client not found"
**Solution:**
```bash
# Generate Prisma Client
npx prisma generate
```

### Problem: "Migration error"
**Solution:**
```bash
# Reset database (WARNING: deletes all data!)
npx prisma migrate reset

# Then seed again
npm run server:seed
```

### Problem: "JWT token invalid"
**Solution:**
- Logout dan login lagi
- Clear localStorage di browser console:
  ```js
  localStorage.clear()
  ```

---

## 📊 Expected Data After Seeding

### Projects (5 total):
1. **Spanduk Kegiatan Ramadhan 2024** (draft)
2. **Poster Penerimaan Siswa Baru 2025** (designing)
3. **Brosur Program Beasiswa** (ready_for_review)
4. **Banner Website Sekolah** (approved)
5. **Kartu Nama Staff Pengajar** (in_print)

### Institutions (3 total):
1. Pondok Pesantren Al-Ihsan
2. SMA Negeri 1 Jakarta
3. Yayasan Pendidikan Maju Bersama

### Users (7 total):
- 1 Admin
- 1 Approver
- 1 Reviewer
- 2 Designers (1 internal, 1 external)
- 2 Requesters

---

## 🎯 Production Checklist

Sebelum production, pastikan:
- [ ] Change JWT_SECRET di .env
- [ ] Verify DATABASE_URL pointing to production Neon DB
- [ ] Remove seed data
- [ ] Enable CORS only for production domain
- [ ] Set NODE_ENV=production
- [ ] Enable rate limiting
- [ ] Setup proper logging
- [ ] Configure error monitoring (Sentry, etc)
- [ ] Setup backup strategy untuk database

---

## 🔗 Helpful Links

- **Neon Console:** https://console.neon.tech/
- **Database URL:** Check `.env` file
- **API Docs:** http://localhost:5175/health (when server running)

---

**Last Updated:** 2025-10-24
**Status:** ✅ Ready for Testing
