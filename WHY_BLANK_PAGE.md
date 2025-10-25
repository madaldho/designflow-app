# 🔍 Why Blank Page / White Screen?

## Layout muncul tapi page content PUTIH + NO ERROR di console

Ini masalah UMUM banget! Saya sudah fix beberapa hal:

---

## ✅ Yang Sudah Diperbaiki:

### 1. **AuthContext Infinite Loop**
- ❌ **Masalah:** useEffect di AuthContext bisa stuck, isLoading never become false
- ✅ **Fix:** Add timeout (10 detik) dan proper cleanup
- ✅ **Fix:** Add console logs untuk debug
- ✅ **Fix:** Add isMounted check untuk prevent memory leak

### 2. **Loading State Stuck**
- ❌ **Masalah:** useProjects() / useDashboardStats() bisa stuck di loading forever
- ✅ **Fix:** Add 5 detik timeout untuk loading
- ✅ **Fix:** Show warning message kalau loading terlalu lama
- ✅ **Fix:** Add diagnostic link

### 3. **No Visual Feedback**
- ❌ **Masalah:** User tidak tahu apa yang salah
- ✅ **Fix:** Show "Loading timeout" message
- ✅ **Fix:** Show suggestion & quick fix buttons
- ✅ **Fix:** Add link ke diagnostic page

---

## 🔥 SOLUSI INSTANT:

### **Step 1: Check Browser Console**
1. Buka browser
2. Press **F12** (atau klik kanan → Inspect)
3. Klik tab **Console**
4. Look for messages yang dimulai dengan `[AuthContext]` atau `[Dashboard]`

**Yang HARUS kamu lihat:**
```
[AuthContext] Initializing auth...
[AuthContext] Token exists: true/false
[AuthContext] User authenticated: admin@designflow.com
```

**Kalau stuck di "Initializing" atau tidak ada message sama sekali** = Backend issue!

---

### **Step 2: Run Diagnostic Page**

Buka: **http://localhost:5173/diagnostic**

Ini halaman KHUSUS yang tidak butuh login, bisa detect semua masalah:
- ✓ React loaded
- ✓ LocalStorage works
- ✓ Backend server running
- ✓ Database connected
- ✓ Authentication valid
- ✓ API data fetch

**Page ini akan kasih tau EXACTLY apa masalahnya!**

---

### **Step 3: Quick Fix Berdasarkan Masalah**

#### Masalah A: "[AuthContext] Auth timeout"
**Penyebab:** Backend tidak respond dalam 10 detik

**Fix:**
```bash
# Check backend running
curl http://localhost:5175/health

# Kalau error, start backend:
npm run server
```

#### Masalah B: "Loading Takes Too Long" message
**Penyebab:** API call tidak pernah complete

**Fix:**
```bash
# 1. Pastikan backend running
npm run server

# 2. Pastikan database ada data
npm run server:seed

# 3. Refresh browser
Ctrl + Shift + R
```

#### Masalah C: No console logs sama sekali
**Penyebab:** JavaScript error atau React crash

**Fix:**
```bash
# 1. Check Network tab (F12 → Network)
# Look for failed requests (red color)

# 2. Clear cache & hard refresh
Ctrl + Shift + Del → Clear cached images and files
Ctrl + Shift + R

# 3. Clear localStorage
# Di console (F12), ketik:
localStorage.clear()
window.location.reload()
```

---

## 🎯 ROOT CAUSE Common Scenarios:

### Scenario 1: Backend Tidak Running
**Symptom:**
- Layout muncul
- Loading spinner muncul sebentar
- Lalu blank/putih
- Console error: "Failed to fetch" atau "Network Error"

**Solution:**
```bash
npm run server
```

### Scenario 2: Database Kosong
**Symptom:**
- Login berhasil
- Dashboard muncul tapi no data
- Projects page kosong
- Console log: "[AuthContext] User authenticated" ✓

**Solution:**
```bash
npm run server:seed
```

### Scenario 3: Token Expired
**Symptom:**
- Redirect ke login terus
- Atau stuck di loading
- Console: "401 Unauthorized"

**Solution:**
```javascript
// Di browser console (F12):
localStorage.clear()
window.location.href = '/login'
```

### Scenario 4: React Query Stuck
**Symptom:**
- Layout muncul
- Loading forever
- No error
- Console: Tidak ada error tapi juga tidak ada "[Dashboard]" logs

**Solution:**
```bash
# Hard refresh
Ctrl + Shift + R

# Jika masih stuck, restart dev server:
# Stop (Ctrl+C), then:
npm run dev
```

### Scenario 5: Port Conflict / CORS
**Symptom:**
- Console error: "CORS policy blocked"
- Atau "Failed to fetch"
- Backend running tapi frontend tidak bisa akses

**Solution:**
```bash
# Check .env.local
# Pastikan VITE_API_URL correct:
VITE_API_URL=http://localhost:5175

# Restart frontend:
npm run dev
```

---

## 🛠️ Advanced Debugging:

### 1. Enable Verbose Logging

Di browser console, ketik:
```javascript
localStorage.setItem('debug', 'true')
window.location.reload()
```

### 2. Check React Query State

Di browser console, ketik:
```javascript
// Show all React Query cache
window.__REACT_QUERY_DEVTOOLS__
```

### 3. Manual API Test

```javascript
// Test API directly from console
fetch('http://localhost:5175/health')
  .then(r => r.json())
  .then(d => console.log('Backend:', d))
  .catch(e => console.error('Backend error:', e))
```

### 4. Check Auth State

```javascript
// Check localStorage
console.log('Token:', localStorage.getItem('designflow_token'))
console.log('User:', JSON.parse(localStorage.getItem('designflow_user') || '{}'))
```

---

## 📊 Diagnostic Checklist:

Run this checklist IN ORDER:

- [ ] **Browser Console open** (F12 → Console)
- [ ] **Backend running?** → `curl http://localhost:5175/health`
- [ ] **Console shows `[AuthContext]` logs?**
- [ ] **Token exists?** → Check Application tab → Local Storage
- [ ] **API responding?** → Network tab → Check XHR requests
- [ ] **Database seeded?** → `npm run server:seed`
- [ ] **Tried hard refresh?** → `Ctrl + Shift + R`
- [ ] **Cleared localStorage?** → `localStorage.clear()`
- [ ] **Checked diagnostic page?** → http://localhost:5173/diagnostic

---

## 🚀 Nuclear Option (Reset Everything):

Kalau semua cara di atas tidak work:

```bash
# 1. Stop all servers (Ctrl+C di semua terminal)

# 2. Clear cache
# Di browser: Ctrl + Shift + Del → Clear everything

# 3. Clear localStorage
# Di console: localStorage.clear()

# 4. Reset database
npx prisma migrate reset
npm run server:seed

# 5. Restart servers
# Terminal 1:
npm run server

# Terminal 2:
npm run dev

# 6. Hard refresh browser
Ctrl + Shift + R

# 7. Login again
http://localhost:5173/login
```

---

## 📸 Visual Debug Guide:

### ✅ **CORRECT Behavior:**

**Browser Console should show:**
```
[AuthContext] Initializing auth...
[AuthContext] Token exists: true
[AuthContext] User authenticated: admin@designflow.com
[Dashboard] Loading data...
[Dashboard] Data loaded: 5 projects
```

**Page should show:**
- Header with user name
- Sidebar with navigation
- Dashboard content with stats
- Projects list

### ❌ **INCORRECT (Blank Page):**

**Browser Console shows:**
```
[AuthContext] Initializing auth...
[AuthContext] Token exists: true
(then nothing... stuck!)
```

**Page shows:**
- Layout (header + sidebar) ✓
- Content area = BLANK/WHITE ✗

**This means:** Loading stuck! Follow fixes above.

---

## 🆘 Still Blank After Everything?

### Option 1: Use Diagnostic Page
```
http://localhost:5173/diagnostic
```
This page ALWAYS works because it doesn't depend on auth or API.

### Option 2: Check These Files

Look for console errors in these files:
- `src/contexts/AuthContext.tsx` - Auth initialization
- `src/hooks/useProjects.ts` - Data fetching
- `src/pages/DashboardPage.tsx` - Dashboard rendering
- `src/services/api.service.ts` - API calls

### Option 3: Temporary Bypass

For testing only, you can temporarily bypass auth:

Edit `src/App.tsx`, comment out `ProtectedRoute`:
```tsx
// TEMPORARY - for testing only!
<Route path="/dashboard" element={
  // <ProtectedRoute>
    <AppLayout>
      <DashboardPage />
    </AppLayout>
  // </ProtectedRoute>
} />
```

If page shows now = Auth issue.
If still blank = Data fetching issue.

---

## 📞 Quick Reference:

| Problem | Quick Fix Command |
|---------|------------------|
| Backend not running | `npm run server` |
| Database empty | `npm run server:seed` |
| Stuck loading | `Ctrl + Shift + R` |
| Token expired | `localStorage.clear()` → reload |
| General issue | `http://localhost:5173/diagnostic` |
| Nuclear reset | `npm run server:seed` + hard refresh |

---

**Updated:** 2025-10-24  
**Status:** ✅ Fixes Applied - Test Now!

**Next Step:** Buka browser, press F12, check Console, kasih tau saya apa yang muncul! 🚀
