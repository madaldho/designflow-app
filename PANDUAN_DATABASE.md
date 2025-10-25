# 🗄️ Panduan Database DesignFlow

## 📋 Daftar Isi
1. [Arsitektur Database](#arsitektur-database)
2. [Setup Database](#setup-database)
3. [Cara Menjalankan](#cara-menjalankan)
4. [CRUD Operations](#crud-operations)
5. [Testing Database](#testing-database)
6. [Troubleshooting](#troubleshooting)

---

## 🏗️ Arsitektur Database

Aplikasi DesignFlow menggunakan **2 sistem database**:

### 1. **PostgreSQL (Neon) - Production Database**
- **Provider**: Neon.tech (Serverless PostgreSQL)
- **ORM**: Prisma
- **Lokasi**: Cloud (ap-southeast-1)
- **Kegunaan**: Production & Development dengan data persistent

### 2. **localStorage - Demo/Fallback**
- **Provider**: Browser localStorage
- **Kegunaan**: Demo mode tanpa koneksi backend

---

## 🔧 Setup Database

### Langkah 1: Verifikasi Koneksi Database

**File `.env.local`** sudah berisi connection string:
```bash
DATABASE_URL=postgresql://neondb_owner:npg_W3x2BuqLFAGd@ep-odd-dust-a1q95qjy-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
VITE_API_URL=http://localhost:5175
```

✅ **Status**: Database sudah terhubung ke Neon PostgreSQL

### Langkah 2: Generate Prisma Client

```bash
npx prisma generate
```

**Output yang diharapkan**:
```
✔ Generated Prisma Client
```

### Langkah 3: Sinkronisasi Schema

Jika Anda membuat perubahan di `prisma/schema.prisma`:

```bash
# Push schema ke database (development)
npx prisma db push

# Atau buat migration (production)
npx prisma migrate dev --name nama_migration
```

### Langkah 4: Seed Database dengan Data Demo

```bash
npm run server:seed
```

**Output yang diharapkan**:
```
🌱 Starting database seed...
✅ Created 6 users
✅ Created 3 institutions
✅ Created 5 projects
✅ Database seeded successfully!
```

---

## 🚀 Cara Menjalankan

### Opsi A: Jalankan Frontend + Backend Bersamaan

```bash
npm run dev:all
```

Ini akan menjalankan:
- ✅ Vite Dev Server (Frontend) di **http://localhost:5173**
- ✅ Express API Server (Backend) di **http://localhost:5175**

### Opsi B: Jalankan Terpisah

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
npm run server
```

### Verifikasi Server Berjalan

**Test Backend API:**
```bash
# Windows PowerShell
Invoke-WebRequest http://localhost:5175/health

# Atau buka di browser:
# http://localhost:5175/health
```

**Response yang diharapkan:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-24T..."
}
```

---

## 📝 CRUD Operations

### 1. **Authentication (Register & Login)**

#### Register User Baru
```bash
POST http://localhost:5175/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "081234567890",
  "role": "requester"
}
```

**Response:**
```json
{
  "user": {
    "id": "clx...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "requester",
    ...
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login
```bash
POST http://localhost:5175/api/auth/login
Content-Type: application/json

{
  "email": "admin@designflow.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. **Users - CRUD**

#### Get All Users
```bash
GET http://localhost:5175/api/users
Authorization: Bearer YOUR_TOKEN
```

#### Get User by ID
```bash
GET http://localhost:5175/api/users/:id
Authorization: Bearer YOUR_TOKEN
```

#### Create User
```bash
POST http://localhost:5175/api/users
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "role": "designer_internal"
}
```

#### Update User
```bash
PUT http://localhost:5175/api/users/:id
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "Jane Smith",
  "phone": "081234567890"
}
```

#### Delete User
```bash
DELETE http://localhost:5175/api/users/:id
Authorization: Bearer YOUR_TOKEN
```

### 3. **Projects - CRUD**

#### Get All Projects
```bash
GET http://localhost:5175/api/projects
Authorization: Bearer YOUR_TOKEN
```

#### Get Project by ID
```bash
GET http://localhost:5175/api/projects/:id
Authorization: Bearer YOUR_TOKEN
```

#### Create Project
```bash
POST http://localhost:5175/api/projects
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "title": "Banner Acara Tahunan",
  "description": "Banner untuk acara tahunan sekolah",
  "type": "banner",
  "size": "3m x 1m",
  "quantity": 1,
  "deadline": "2025-11-01T00:00:00.000Z",
  "institutionId": "inst-id-here"
}
```

#### Update Project
```bash
PUT http://localhost:5175/api/projects/:id
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "status": "designing",
  "assigneeId": "designer-user-id"
}
```

#### Delete Project
```bash
DELETE http://localhost:5175/api/projects/:id
Authorization: Bearer YOUR_TOKEN
```

### 4. **Institutions - CRUD**

#### Get All Institutions
```bash
GET http://localhost:5175/api/institutions
Authorization: Bearer YOUR_TOKEN
```

#### Create Institution
```bash
POST http://localhost:5175/api/institutions
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "SMA Negeri 1",
  "type": "sma",
  "address": "Jl. Sudirman No. 1",
  "phone": "021-1234567",
  "email": "sma1@example.com"
}
```

---

## 🧪 Testing Database

### 1. **Test dengan Prisma Studio**

Prisma Studio adalah GUI untuk melihat dan mengedit data:

```bash
npx prisma studio
```

Akan membuka browser di **http://localhost:5555**

### 2. **Test dengan cURL atau Postman**

#### Windows PowerShell:
```powershell
# Test Login
$body = @{
    email = "admin@designflow.com"
    password = "admin123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5175/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

#### Atau gunakan Postman / Thunder Client / REST Client

### 3. **Test dengan Code**

Buat file test sederhana `test-db.ts`:

```typescript
import prisma from './server/config/database';

async function testConnection() {
  try {
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected');

    // Count users
    const userCount = await prisma.user.count();
    console.log(`📊 Total users: ${userCount}`);

    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      }
    });
    console.table(users);

    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testConnection();
```

Jalankan:
```bash
npx tsx test-db.ts
```

---

## 🔒 Keamanan CRUD

### 1. **Password Hashing**
- ✅ Password di-hash menggunakan **bcryptjs** dengan salt rounds 10
- ✅ Password tidak pernah disimpan dalam bentuk plain text
- ✅ Password tidak dikembalikan dalam response API

### 2. **JWT Authentication**
- ✅ Token JWT untuk autentikasi
- ✅ Token expire dalam 7 hari
- ✅ Token berisi: user id, email, dan role

### 3. **Authorization**
- ✅ Middleware auth untuk protected routes
- ✅ Role-based access control (RBAC)
- ✅ Permission checking per operation

### 4. **Input Validation**
- ✅ Validasi input menggunakan express-validator
- ✅ Sanitasi data sebelum disimpan
- ✅ Error handling yang proper

### 5. **SQL Injection Prevention**
- ✅ Prisma ORM menggunakan prepared statements
- ✅ Otomatis escape input
- ✅ Type-safe queries

---

## 🐛 Troubleshooting

### Problem 1: "Cannot connect to database"

**Solusi:**
```bash
# Cek koneksi
npx prisma db pull

# Jika error, cek:
# 1. Internet connection
# 2. DATABASE_URL di .env.local benar
# 3. Neon database masih aktif
```

### Problem 2: "Prisma Client not found"

**Solusi:**
```bash
# Generate ulang Prisma Client
npx prisma generate
```

### Problem 3: "Port 5175 already in use"

**Solusi:**
```bash
# Windows - Kill process di port 5175
netstat -ano | findstr :5175
taskkill /PID <PID_NUMBER> /F

# Atau ubah PORT di .env.local
PORT=5176
```

### Problem 4: "Database schema out of sync"

**Solusi:**
```bash
# Development - Push schema
npx prisma db push

# Production - Create migration
npx prisma migrate deploy
```

### Problem 5: "JWT_SECRET not found"

**Solusi:**
Tambahkan di `.env.local`:
```bash
JWT_SECRET=your-super-secret-key-here-change-in-production
```

### Problem 6: "CORS Error"

**Solusi:**
Server sudah dikonfigurasi dengan CORS. Pastikan:
- Frontend di port 5173
- Backend di port 5175
- VITE_API_URL di .env.local benar

---

## 📊 Database Schema

### User Model
```prisma
model User {
  id       String   @id @default(cuid())
  name     String
  email    String   @unique
  password String
  phone    String?
  role     String   @default("requester")
  status   String   @default("active")
  avatar   String?
  // Relations...
}
```

**Roles:**
- `admin` - Full access
- `designer_internal` - Internal designer
- `designer_external` - External/vendor designer
- `reviewer` - Review designs
- `approver` - Approve for printing
- `requester` - Request new designs

### Project Model
```prisma
model Project {
  id          String   @id @default(cuid())
  title       String
  description String?
  type        String
  size        String
  quantity    Int
  deadline    DateTime
  status      String   @default("draft")
  // Relations...
}
```

**Status Flow:**
1. `draft` - Initial state
2. `designing` - Assigned to designer
3. `ready_for_review` - Designer finished
4. `changes_requested` - Reviewer requested changes
5. `approved` - Reviewer approved
6. `approved_for_print` - Ready to print
7. `printing` - In print queue
8. `completed` - Printed
9. `picked_up` - Delivered

---

## 🔗 Useful Commands

```bash
# Lihat struktur database
npx prisma studio

# Pull schema dari database
npx prisma db pull

# Push schema ke database
npx prisma db push

# Create migration
npx prisma migrate dev --name migration_name

# Deploy migration
npx prisma migrate deploy

# Reset database (HATI-HATI!)
npx prisma migrate reset

# Seed database
npm run server:seed

# Check Prisma version
npx prisma --version

# Format schema.prisma
npx prisma format
```

---

## 📞 Kontak & Support

Jika ada masalah:
1. Cek dokumentasi ini
2. Cek error message di console
3. Cek Prisma docs: https://www.prisma.io/docs
4. Cek Neon docs: https://neon.tech/docs

---

**Happy Coding! 🚀**

*Last updated: October 24, 2025*
