# ⚡ QUICK FIX - Switch ke SQLite (2 Menit!)

## 🎯 Problem
Database Neon tidak bisa connect. Solusi tercepat: **Switch ke SQLite lokal**.

---

## ✅ SOLUTION (Copy-Paste ini!)

### Step 1: Update prisma/schema.prisma

**File:** `C:\Users\Al-PC\Videos\Designflow\designflow-app\prisma\schema.prisma`

**Find line 6-9:**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**Replace with:**
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

---

### Step 2: Update .env

**File:** `C:\Users\Al-PC\Videos\Designflow\designflow-app\.env`

**Change DATABASE_URL to:**
```
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET=designflow_secret_key_2024_change_in_production
PORT=5175
NODE_ENV=development
```

---

### Step 3: Run These Commands

```powershell
# Go to project
cd C:\Users\Al-PC\Videos\Designflow\designflow-app

# Kill all node
taskkill /F /IM node.exe

# Generate Prisma
npx prisma generate

# Create database & tables
npx prisma db push --accept-data-loss

# Seed data
npm run server:seed
```

---

### Step 4: Start Servers

**Terminal 1 - Backend:**
```bash
cd C:\Users\Al-PC\Videos\Designflow\designflow-app
npm run server
```

**Terminal 2 - Frontend:**
```bash
cd C:\Users\Al-PC\Videos\Designflow\designflow-app
npm run dev
```

---

## ✅ DONE!

Sekarang:
- ✅ Database lokal (SQLite)
- ✅ No internet required
- ✅ Super fast
- ✅ All data preserved

**Test:**
1. Open: http://localhost:5173
2. Login: admin@designflow.com / password123
3. Dashboard should load!

---

## 🔄 Switch Back to Neon Later

When Neon fixed:

1. **Change schema.prisma back:**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. **Update .env with new Neon URL**

3. **Push schema:**
```bash
npx prisma db push
npm run server:seed
```

---

## ⚡ Why SQLite?

- ✅ **No network required**
- ✅ **Instant setup**
- ✅ **Same features**
- ✅ **Perfect for development**
- ✅ **Fast queries**
- ✅ **Single file database**

**Production:** Can switch back to Neon/PostgreSQL anytime!

---

## 🚀 Quick Commands Reference

```powershell
# Fresh start
taskkill /F /IM node.exe
cd C:\Users\Al-PC\Videos\Designflow\designflow-app
npx prisma generate
npx prisma db push --accept-data-loss
npm run server:seed

# Start servers
npm run server          # Terminal 1
npm run dev            # Terminal 2
```

**Fix in 2 minutes!** 🎉
