# 🎯 PANDUAN LENGKAP DATABASE DESIGNFLOW

## ✅ STATUS KONEKSI DATABASE

**Database Type**: PostgreSQL (Neon.tech)  
**Status**: ✅ TERHUBUNG DAN BERFUNGSI  
**Region**: ap-southeast-1  
**SSL**: Required  

**Test Connection**: ✅ PASSED
- Total Users: 7
- Total Projects: 5
- Total Institutions: 3

---

## 🔐 AKUN DEMO YANG TERSEDIA

| Role | Email | Password | Akses |
|------|-------|----------|-------|
| **Admin** | admin@designflow.com | password123 | Full access ke semua fitur |
| **Approver** | budi@designflow.com | password123 | Approve projects |
| **Reviewer** | siti@designflow.com | password123 | Review designs |
| **Designer Internal** | ahmad@designflow.com | password123 | Create designs (internal) |
| **Designer External** | dewi@designflow.com | password123 | Create designs (vendor) |
| **Requester 1** | hasan@al-ihsan.sch.id | password123 | Request designs |
| **Requester 2** | rina@sman1jkt.sch.id | password123 | Request designs |

---

## 🚀 CARA MENJALANKAN

### 1. Jalankan Frontend + Backend

Buka **2 terminal** terpisah:

**Terminal 1 - Backend API:**
```bash
npm run server
```
Output:
```
✅ Database connected successfully
🚀 Server running on http://localhost:5175
📦 Environment: development
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```
Output:
```
VITE v5.4.21  ready in XXX ms
➜  Local:   http://localhost:5173/
```

### 2. Test API Berfungsi

```powershell
# Test health endpoint
curl http://localhost:5175/health

# Expected: {"status":"ok","timestamp":"..."}
```

### 3. Login dan Test CRUD

```powershell
# Jalankan test script otomatis
.\test-api-simple.ps1
```

---

## 📝 CRUD OPERATIONS - LENGKAP

### 🔐 AUTHENTICATION

#### 1. Register User Baru
```bash
POST http://localhost:5175/api/auth/register
Content-Type: application/json

{
  "name": "Nama User",
  "email": "email@example.com",
  "password": "password123",
  "phone": "081234567890",
  "role": "requester"
}
```

**PowerShell:**
```powershell
$body = @{
    name = "Test User"
    email = "test@example.com"
    password = "password123"
    role = "requester"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5175/api/auth/register" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

#### 2. Login
```bash
POST http://localhost:5175/api/auth/login
Content-Type: application/json

{
  "email": "admin@designflow.com",
  "password": "password123"
}
```

**PowerShell:**
```powershell
$body = @{
    email = "admin@designflow.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5175/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body

# Simpan token
$token = $response.token
```

#### 3. Get Current User
```bash
GET http://localhost:5175/api/auth/me
Authorization: Bearer YOUR_TOKEN
```

---

### 👥 USERS - CRUD

**PENTING**: Create user menggunakan `/api/auth/register`, bukan `/api/users`

#### Get All Users (Admin only)
```powershell
$headers = @{
    Authorization = "Bearer $token"
}

$users = Invoke-RestMethod -Uri "http://localhost:5175/api/users" -Headers $headers
$users.users | Format-Table
```

#### Get User by ID
```powershell
$userId = "USER_ID_HERE"
$user = Invoke-RestMethod -Uri "http://localhost:5175/api/users/$userId" -Headers $headers
$user.user
```

#### Update User
```powershell
$updateData = @{
    name = "New Name"
    phone = "081234567890"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5175/api/users/$userId" `
  -Method PATCH `
  -Headers $headers `
  -Body $updateData
```

#### Delete User (Admin only)
```powershell
Invoke-RestMethod -Uri "http://localhost:5175/api/users/$userId" `
  -Method DELETE `
  -Headers $headers
```

---

### 📁 PROJECTS - CRUD

#### Get All Projects
```powershell
$projects = Invoke-RestMethod -Uri "http://localhost:5175/api/projects" -Headers $headers
$projects | Format-Table title, status, type
```

#### Get Project by ID
```powershell
$projectId = "PROJECT_ID_HERE"
$project = Invoke-RestMethod -Uri "http://localhost:5175/api/projects/$projectId" -Headers $headers
```

#### Create Project
```powershell
# Dapatkan institution ID dulu
$institutions = Invoke-RestMethod -Uri "http://localhost:5175/api/institutions" -Headers $headers
$instId = $institutions[0].id

$newProject = @{
    title = "Banner Acara Tahunan"
    description = "Banner untuk acara tahunan sekolah"
    type = "banner"
    size = "3m x 1m"
    quantity = 1
    deadline = "2025-12-31T00:00:00.000Z"
    institutionId = $instId
} | ConvertTo-Json

$created = Invoke-RestMethod -Uri "http://localhost:5175/api/projects" `
  -Method POST `
  -Headers $headers `
  -Body $newProject
```

#### Update Project
```powershell
$updateProject = @{
    status = "designing"
    title = "Updated Title"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5175/api/projects/$projectId" `
  -Method PATCH `
  -Headers $headers `
  -Body $updateProject
```

#### Delete Project
```powershell
Invoke-RestMethod -Uri "http://localhost:5175/api/projects/$projectId" `
  -Method DELETE `
  -Headers $headers
```

---

### 🏢 INSTITUTIONS - CRUD

#### Get All Institutions
```powershell
$institutions = Invoke-RestMethod -Uri "http://localhost:5175/api/institutions" -Headers $headers
$institutions | Format-Table name, type, phone
```

#### Create Institution
```powershell
$newInst = @{
    name = "SMA Negeri 2 Jakarta"
    type = "sma"
    address = "Jl. Contoh No. 123"
    phone = "021-1234567"
    email = "info@sman2jkt.sch.id"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5175/api/institutions" `
  -Method POST `
  -Headers $headers `
  -Body $newInst
```

---

## 🔒 KEAMANAN DATABASE

### ✅ Yang Sudah Aman:

1. **Password Hashing**
   - Semua password di-hash dengan bcryptjs (salt rounds: 10)
   - Password TIDAK pernah disimpan plain text
   - Password TIDAK dikembalikan di response API

2. **JWT Authentication**
   - Token expire dalam 7 hari
   - Token berisi: user id, email, role
   - Token wajib untuk semua protected endpoints

3. **Authorization**
   - Role-based access control (RBAC)
   - Admin memiliki akses penuh
   - User biasa hanya bisa edit data sendiri
   - Validasi permission per endpoint

4. **SQL Injection Prevention**
   - Prisma ORM menggunakan prepared statements
   - Otomatis escape input berbahaya
   - Type-safe queries

5. **Input Validation**
   - Validasi format email
   - Validasi required fields
   - Error handling yang proper

---

## 🛠️ MAINTENANCE DATABASE

### Reset Database (Hapus Semua Data)
```bash
npx prisma migrate reset
```
⚠️ **WARNING**: Ini akan menghapus SEMUA data!

### Seed Ulang Database
```bash
npm run server:seed
```

### Lihat Database dengan GUI
```bash
npx prisma studio
```
Buka browser di: http://localhost:5555

### Update Schema
```bash
# Jika mengubah prisma/schema.prisma
npx prisma db push
npx prisma generate
```

---

## 📊 MONITORING & LOGGING

### Cek Logs Backend
Backend menampilkan semua query Prisma di console:
```
prisma:query SELECT ... FROM "public"."User" ...
```

### Test Koneksi Database
```bash
npx tsx test-db.ts
```

Output:
```
✅ Connected to database successfully
📊 Total users: 7
📊 Total projects: 5
📊 Total institutions: 3
```

---

## 🐛 TROUBLESHOOTING

### Problem: "Cannot connect to database"
**Solusi:**
1. Cek internet connection
2. Verify DATABASE_URL di .env.local
3. Test: `npx prisma db pull`

### Problem: "Invalid email or password"
**Solusi:**
- Pastikan database sudah di-seed: `npm run server:seed`
- Gunakan password: `password123` (bukan admin123)
- Cek email yang benar dari daftar akun demo

### Problem: "Prisma Client not found"
**Solusi:**
```bash
npx prisma generate
```

### Problem: "Port 5175 already in use"
**Solusi:**
```powershell
# Kill process di port 5175
netstat -ano | findstr :5175
taskkill /PID <PID_NUMBER> /F
```

### Problem: "401 Unauthorized"
**Solusi:**
- Login dulu untuk dapat token
- Pastikan header Authorization benar: `Bearer YOUR_TOKEN`
- Token mungkin expire (7 hari), login ulang

### Problem: "403 Forbidden"
**Solusi:**
- User tidak punya permission untuk action tersebut
- Gunakan akun admin untuk operasi admin
- Cek role user Anda

---

## 📚 FILE PENTING

| File | Deskripsi |
|------|-----------|
| `.env.local` | Database connection string dan env vars |
| `prisma/schema.prisma` | Database schema definition |
| `server/config/database.ts` | Prisma client setup |
| `server/seed.ts` | Demo data seeder |
| `server/routes/*.routes.ts` | API endpoints |
| `test-db.ts` | Test database connection |
| `test-api-simple.ps1` | Test all API endpoints |
| `PANDUAN_DATABASE.md` | Dokumentasi lengkap (this file) |

---

## ✅ CHECKLIST DEPLOYMENT

- [x] Database PostgreSQL terhubung (Neon)
- [x] Prisma Client ter-generate
- [x] Database schema synchronized
- [x] Demo data ter-seed (7 users, 5 projects, 3 institutions)
- [x] Backend API running (port 5175)
- [x] Frontend running (port 5173)
- [x] Authentication berfungsi (JWT)
- [x] CRUD operations tested
- [x] Password hashing aman
- [x] SQL injection prevention
- [x] Role-based authorization

---

## 🎉 KESIMPULAN

✅ **Database sudah AMAN dan BERFUNGSI dengan baik!**

- Koneksi ke PostgreSQL (Neon): ✅ BERHASIL
- CRUD Operations: ✅ BERFUNGSI
- Authentication: ✅ AMAN
- Authorization: ✅ TERKONTROL
- Password Security: ✅ HASHED
- SQL Injection: ✅ PROTECTED

**Cara Menjalankan:**
1. Terminal 1: `npm run server`
2. Terminal 2: `npm run dev`
3. Test: `.\test-api-simple.ps1`
4. Login: admin@designflow.com / password123

---

*Dokumentasi dibuat: October 24, 2025*  
*Status: Production Ready ✅*
