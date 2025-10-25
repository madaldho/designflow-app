# 🔧 Troubleshooting Guide - DesignFlow

## Masalah Umum dan Solusinya

### ❌ Problem: Dashboard tidak menampilkan data / Halaman kosong

**Penyebab:**
1. Backend server belum running
2. Database belum di-seed (kosong)
3. Token authentication expired

**Solusi:**

```bash
# 1. Cek apakah backend running
powershell -ExecutionPolicy Bypass -File check-status.ps1

# 2. Jika backend tidak running, start:
npm run server

# 3. Jika database kosong, seed:
npm run server:seed

# 4. Restart frontend:
npm run dev
```

---

### ❌ Problem: Halaman /review-panel, /request-design, dll tidak bisa diakses

**Penyebab:**
1. Komponen page belum ter-load
2. Routing error
3. Permission issue

**Solusi:**

1. **Cek di Debug Page:**
   - Login ke aplikasi
   - Buka: http://localhost:5173/debug
   - Lihat status semua checks

2. **Hard Refresh Browser:**
   ```
   Ctrl + Shift + R (Windows)
   Cmd + Shift + R (Mac)
   ```

3. **Clear localStorage:**
   - Buka Browser Console (F12)
   - Ketik: `localStorage.clear()`
   - Refresh halaman
   - Login lagi

4. **Restart Development Server:**
   ```bash
   # Stop server (Ctrl + C)
   # Start lagi:
   npm run dev
   ```

---

### ❌ Problem: "Cannot connect to server" / Network Error

**Penyebab:**
Backend server tidak running atau crash

**Solusi:**

```bash
# 1. Check health endpoint
curl http://localhost:5175/health

# 2. Jika tidak respond, start server:
npm run server

# 3. Jika masih error, check console untuk error message
# Biasanya database connection issue

# 4. Fix database:
npx prisma generate
npx prisma migrate deploy
npm run server:seed
```

---

### ❌ Problem: Login berhasil tapi tidak ada data di dashboard

**Penyebab:**
Database kosong atau API endpoint error

**Solusi:**

**Option 1 - Quick Check:**
```bash
powershell -ExecutionPolicy Bypass -File check-status.ps1
```

**Option 2 - Manual Fix:**
```bash
# 1. Seed database
npm run server:seed

# 2. Test API directly
curl http://localhost:5175/api/projects -H "Authorization: Bearer YOUR_TOKEN"

# 3. Check /debug page di browser
http://localhost:5173/debug
```

---

### ❌ Problem: "JWT token expired" / Session expired

**Penyebab:**
Token authentication expired (default: 7 days)

**Solusi:**

1. **Logout dan Login lagi**
2. **Atau clear localStorage:**
   ```javascript
   // Di Browser Console (F12)
   localStorage.clear()
   window.location.reload()
   ```

---

### ❌ Problem: Prisma Client Error

**Error Message:**
```
Error: @prisma/client did not initialize yet
```

**Solusi:**

```bash
# 1. Generate Prisma Client
npx prisma generate

# 2. Restart backend
# Ctrl + C to stop
npm run server
```

---

### ❌ Problem: Database Migration Error

**Error Message:**
```
Migration failed to apply
```

**Solusi:**

**WARNING: This will delete all data!**

```bash
# 1. Reset database
npx prisma migrate reset

# 2. Apply migrations
npx prisma migrate deploy

# 3. Seed data
npm run server:seed
```

---

### ❌ Problem: Port Already in Use

**Error Message:**
```
Error: listen EADDRINUSE: address already in use :::5175
```

**Solusi:**

**Windows:**
```powershell
# Find process using port 5175
netstat -ano | findstr :5175

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

# Then start server again
npm run server
```

**Or use different port:**
```bash
# Edit .env file
PORT=5176

# Restart server
npm run server
```

---

## 🚀 Quick Start dari Awal

Jika semua error dan mau start dari bersih:

### Step 1: Setup Database
```bash
# Generate Prisma Client
npx prisma generate

# Apply migrations
npx prisma migrate deploy

# Seed demo data
npm run server:seed
```

### Step 2: Start Servers
```bash
# Option A: Automated (recommended)
quick-start.bat

# Option B: Manual
# Terminal 1:
npm run server

# Terminal 2:
npm run dev
```

### Step 3: Test
```bash
# Check system status
powershell -ExecutionPolicy Bypass -File check-status.ps1
```

### Step 4: Access
- Frontend: http://localhost:5173
- Backend: http://localhost:5175
- Debug Page: http://localhost:5173/debug
- Login: `admin@designflow.com` / `password123`

---

## 🧪 Testing & Debugging Tools

### 1. **check-status.ps1** - System Health Check
```bash
powershell -ExecutionPolicy Bypass -File check-status.ps1
```
Checks:
- ✓ Backend running
- ✓ Database connected
- ✓ Data exists
- ✓ Frontend running

### 2. **Debug Page** - In-App Diagnostics
```
http://localhost:5173/debug
```
Shows:
- Authentication status
- Backend health
- Database connection
- Data counts
- Real-time API tests

### 3. **test-connection.ps1** - API Testing
```bash
powershell -ExecutionPolicy Bypass -File test-connection.ps1
```
Tests:
- API endpoints
- Authentication
- Data fetching
- Sample queries

### 4. **Browser Console** - Frontend Errors
```
Press F12 in browser
Check Console tab for errors
Check Network tab for failed requests
```

---

## 📊 Expected Behavior (After Seed)

### Database Should Have:
- ✓ 7 Users (1 admin, 1 approver, 1 reviewer, 2 designers, 2 requesters)
- ✓ 3 Institutions
- ✓ 5 Projects (various statuses)
- ✓ Multiple Activities

### Dashboard Should Show:
- ✓ Total Projects count
- ✓ Projects by status
- ✓ Recent projects list
- ✓ Recent activities
- ✓ Quick action buttons

### Pages That Should Work:
- ✓ `/dashboard` - Main dashboard
- ✓ `/projects` - All projects list
- ✓ `/projects/:id` - Project details
- ✓ `/request-design` - Create new project
- ✓ `/designer-panel` - For designers
- ✓ `/review-panel` - For reviewers
- ✓ `/print-queue` - For print operators
- ✓ `/admin` - Admin panel
- ✓ `/profile` - User profile
- ✓ `/debug` - Debug/diagnostics

---

## 🆘 Still Having Issues?

### Check These Files:
1. **.env** - Verify DATABASE_URL is correct
2. **Console logs** - Check backend terminal for errors
3. **Browser console** - Check for JavaScript errors
4. **Network tab** - Check for failed API calls

### Common Console Errors:

**"Failed to fetch"**
- Backend not running → `npm run server`

**"401 Unauthorized"**
- Token expired → Logout and login again

**"404 Not Found"**
- Wrong API URL → Check VITE_API_URL in .env.local

**"500 Internal Server Error"**
- Database error → Check backend console logs
- Run: `npm run server:seed`

---

## 📝 Checklist Before Asking for Help

- [ ] Backend server is running (`npm run server`)
- [ ] Frontend server is running (`npm run dev`)
- [ ] Database is migrated (`npx prisma migrate deploy`)
- [ ] Database is seeded (`npm run server:seed`)
- [ ] Ran check-status.ps1 successfully
- [ ] Checked /debug page
- [ ] Tried hard refresh (Ctrl + Shift + R)
- [ ] Cleared localStorage
- [ ] Checked browser console for errors
- [ ] Checked backend console for errors

---

**Last Updated:** 2025-10-24
**For More Help:** Check debug page at http://localhost:5173/debug
