# 🔧 FIX Database Connection Error

## ❌ Current Problem

```
Can't reach database server at ep-odd-dust-a1q95qjy-pooler.ap-southeast-1.aws.neon.tech:5432
Database server is not running
```

**Root Cause:** Neon database connection tidak bisa reach server

---

## 🎯 SOLUTION - 2 Options

### Option 1: Update Neon Database URL (Recommended)

Neon free tier bisa sleep setelah inactive. Perlu wake up atau update URL.

#### Step 1: Login ke Neon
1. Go to: https://console.neon.tech
2. Login dengan akun Anda
3. Pilih project: **neondb** atau yang sesuai

#### Step 2: Check Database Status
- Pastikan project **tidak di-pause**
- Jika paused, klik **Resume** atau **Activate**

#### Step 3: Copy NEW Connection String
1. Go to **Dashboard**
2. Click **Connection Details**
3. Select **Pooled connection** (with `-pooler`)
4. Copy full connection string

Example format:
```
postgresql://neondb_owner:YOUR_PASSWORD@ep-xxx-xxx.pooler.neon.tech/neondb?sslmode=require
```

#### Step 4: Update .env File
```bash
# C:\Users\Al-PC\Videos\Designflow\designflow-app\.env

DATABASE_URL=postgresql://YOUR_NEW_CONNECTION_STRING
JWT_SECRET=designflow_secret_key_2024_change_in_production
PORT=5175
NODE_ENV=development
```

#### Step 5: Test Connection
```bash
cd C:\Users\Al-PC\Videos\Designflow\designflow-app
node test-db-connection.js
```

**Expected:** ✅ Database connected successfully

---

### Option 2: Use SQLite Local Database (Quick Fix)

Jika Neon bermasalah, bisa switch ke SQLite lokal sementara.

#### Step 1: Update schema.prisma
File: `prisma/schema.prisma`

```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

#### Step 2: Update .env
```bash
DATABASE_URL="file:./prisma/dev.db"
```

#### Step 3: Generate & Migrate
```bash
cd C:\Users\Al-PC\Videos\Designflow\designflow-app

# Generate Prisma Client
npx prisma generate

# Create database
npx prisma db push

# Seed data
npm run server:seed
```

#### Step 4: Test
```bash
node test-db-connection.js
```

---

## 🚀 Quick Start After Fix

### Step 1: Kill All Node Processes
```powershell
taskkill /F /IM node.exe
```

### Step 2: Generate Prisma Client
```bash
cd C:\Users\Al-PC\Videos\Designflow\designflow-app
npx prisma generate
```

### Step 3: Test Database
```bash
node test-db-connection.js
```

**Expected output:**
```
🔌 Testing database connection...
✅ Database connected successfully!
✅ Found 7 users in database
✅ Found 5 projects in database
✅ Found 10 notifications in database
🎉 Database connection is working perfectly!
```

### Step 4: Start Backend
```bash
npm run server
```

**Expected:**
```
✅ Database connected successfully
🚀 Server running on http://localhost:5175
```

### Step 5: Start Frontend (New Terminal)
```bash
npm run dev
```

**Expected:**
```
Local: http://localhost:5173
```

---

## 🔍 Diagnostic Commands

### Check Prisma Client Status
```bash
npx prisma --version
```

### Check Database Connection
```bash
node test-db-connection.js
```

### Check If Database Has Data
```bash
npx prisma studio
# Opens visual database browser
```

### Force Regenerate Prisma
```bash
# Delete generated client
rm -rf node_modules/.prisma
rm -rf node_modules/@prisma/client

# Regenerate
npx prisma generate
```

---

## ⚠️ Common Errors & Fixes

### Error: "Can't reach database server"
**Cause:** Database offline atau URL salah
**Fix:** Update DATABASE_URL di .env

### Error: "Invalid connection string"
**Cause:** DATABASE_URL format salah
**Fix:** Check format:
```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require
```

### Error: "Prisma Client not generated"
**Cause:** Belum generate after schema change
**Fix:** 
```bash
npx prisma generate
```

### Error: "SSL connection required"
**Cause:** Missing sslmode parameter
**Fix:** Add `?sslmode=require` ke connection string

---

## 📝 Complete Fix Script

Copy paste ini ke PowerShell:

```powershell
# Go to project directory
cd C:\Users\Al-PC\Videos\Designflow\designflow-app

# Kill all node processes
taskkill /F /IM node.exe

# Wait 2 seconds
Start-Sleep -Seconds 2

# Generate Prisma Client
npx prisma generate

# Test database connection
node test-db-connection.js

# If test passed, start servers
# Terminal 1: Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\Users\Al-PC\Videos\Designflow\designflow-app; npm run server"

# Wait 3 seconds
Start-Sleep -Seconds 3

# Terminal 2: Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\Users\Al-PC\Videos\Designflow\designflow-app; npm run dev"

Write-Host "✅ Servers started!"
Write-Host "Backend: http://localhost:5175"
Write-Host "Frontend: http://localhost:5173"
```

---

## ✅ Success Checklist

After fixing database:
- [ ] `node test-db-connection.js` shows ✅
- [ ] `npm run server` starts without errors
- [ ] Backend shows: "✅ Database connected"
- [ ] Frontend loads without errors
- [ ] Can login successfully
- [ ] Dashboard loads with data
- [ ] Notifications show correct count

---

## 🆘 Still Not Working?

### Option A: Use SQLite (Fastest)
Switch to SQLite local database (see Option 2 above)
- No internet required
- Fast setup
- Works offline

### Option B: Check Network
```powershell
# Test if can reach Neon
Test-NetConnection ep-odd-dust-a1q95qjy-pooler.ap-southeast-1.aws.neon.tech -Port 5432
```

### Option C: Create New Neon Database
1. Go to https://neon.tech
2. Create new project
3. Copy new connection string
4. Update .env
5. Run migrations:
```bash
npx prisma db push
npm run server:seed
```

---

## 📞 Next Steps

1. **Choose Option 1** (Update Neon URL) - if Neon account active
2. **Choose Option 2** (SQLite) - if want quick local fix
3. **Run Fix Script** above
4. **Test** with login
5. **Report** if still errors

---

## Status: ⚠️ NEEDS FIX

**Issue:** Database connection failed
**Impact:** App tidak bisa start
**Priority:** HIGH
**Est. Fix Time:** 5 minutes (Option 1) or 2 minutes (Option 2)

**Pick an option and run the fix!** 🚀
