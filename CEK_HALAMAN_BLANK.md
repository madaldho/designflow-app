# 🔍 TROUBLESHOOTING HALAMAN BLANK

## Masalah: Halaman Putih/Blank tapi Header & Navigasi Muncul

### ✅ Yang Sudah Diperbaiki:
1. ✅ TypeScript error `user.institutions` → Fixed (tambah field di User type)
2. ✅ Implicit any type → Fixed (tambah explicit type annotation)
3. ✅ Frontend running di port 5174

---

## 🚀 CARA CEK ERROR

### 1. Buka Browser Console
1. Buka browser: **http://localhost:5174/**
2. Tekan **F12** (Developer Tools)
3. Klik tab **Console**
4. Lihat apakah ada error merah

### 2. Error yang Mungkin Muncul:

#### A. **Network Error (Backend Tidak Running)**
```
Error: Cannot connect to server
Error: Network Error
```

**Solusi:**
```powershell
# Pastikan backend running
npm run server
```

#### B. **API Error (Database Tidak Seeded)**
```
Error: users is undefined
Error: Cannot read property 'map' of undefined
```

**Solusi:**
```powershell
# Seed database dulu
npm run server:seed
```

#### C. **CORS Error**
```
Access to fetch at 'http://localhost:5175/api/...' has been blocked by CORS policy
```

**Solusi:**
- Backend sudah ada CORS config, restart backend

#### D. **React Query Error**
```
TypeError: Cannot read properties of undefined (reading 'map')
```

**Solusi:**
- Check apakah data dari API valid
- Check default value di hooks: `const { data = [] } = useProjects();`

---

## 📋 CHECKLIST DEBUG

### Step 1: Cek Backend Running
```powershell
# Terminal 1
npm run server
```

**Expected Output:**
```
✅ Database connected successfully
🚀 Server running on http://localhost:5175
```

**Test API:**
```powershell
# Test health check
curl http://localhost:5175/api/health

# Expected: {"status":"ok"}
```

### Step 2: Cek Frontend Running
```powershell
# Terminal 2
npm run dev
```

**Expected Output:**
```
VITE v5.4.21  ready in XXX ms
➜  Local:   http://localhost:5174/
```

### Step 3: Test Login
1. Buka: http://localhost:5174/
2. Klik tombol **Admin** (demo account)
3. Klik **Masuk**
4. **Expected:** Redirect ke `/dashboard`
5. **Actual:** Cek apa yang terjadi

---

## 🐛 KEMUNGKINAN PENYEBAB BLANK PAGE

### 1. Data Tidak Ada (Empty State)
```typescript
// Jika data kosong, halaman mungkin blank karena tidak ada empty state
const { data: projects = [] } = useProjects();

// Fix: Tambahkan empty state
{projects.length === 0 ? (
  <div className="text-center py-12">
    <p>Belum ada data</p>
  </div>
) : (
  // Render data
)}
```

### 2. Error di Component
```typescript
// Error: Cannot read property 'name' of undefined
<p>{user.institution.name}</p>

// Fix: Optional chaining
<p>{user?.institution?.name || 'No institution'}</p>
```

### 3. React Query Loading Forever
```typescript
// Jika API tidak response, isLoading = true forever
const { data, isLoading } = useProjects();

if (isLoading) {
  return <LoadingSpinner />; // User stuck di sini
}

// Fix: Tambah timeout
React.useEffect(() => {
  const timer = setTimeout(() => {
    if (isLoading) {
      console.error('Loading timeout!');
    }
  }, 5000);
  return () => clearTimeout(timer);
}, [isLoading]);
```

### 4. API Response Format Salah
```typescript
// Backend return: { projects: [...] }
// Frontend expect: data.projects

// Check response format
const response = await apiService.getProjects();
console.log('API Response:', response);

// Ensure: response.projects exists
```

---

## 🔥 QUICK FIX COMMANDS

### Reset Semua
```powershell
# Stop all terminals (Ctrl+C di semua terminal)

# Kill process yang masih jalan
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force

# Hapus cache
Remove-Item -Recurse -Force node_modules/.vite

# Restart backend
npm run server

# Restart frontend (terminal baru)
npm run dev
```

### Test API Manual
```powershell
# Test users
curl http://localhost:5175/api/users -H "Authorization: Bearer YOUR_TOKEN"

# Test projects
curl http://localhost:5175/api/projects -H "Authorization: Bearer YOUR_TOKEN"

# Test institutions
curl http://localhost:5175/api/institutions -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📸 SCREENSHOT ERROR

Jika masih blank, bisa screenshot:
1. Browser console (F12 → Console tab)
2. Network tab (F12 → Network tab)
3. Kasih screenshot ke developer

---

## ✅ SOLUSI UMUM

### Jika Halaman Dashboard Blank:

**Cek di browser console:**
```javascript
// Expected:
// No errors

// If error:
TypeError: Cannot read properties of undefined (reading 'map')
// → Data tidak ada, backend belum return data

Error: Network Error
// → Backend tidak running

401 Unauthorized
// → Token expired, login ulang
```

**Fix:**
1. Pastikan login dulu
2. Pastikan backend running
3. Pastikan database seeded
4. Clear localStorage: `localStorage.clear()` di console
5. Refresh page

---

## 🎯 DEBUG MODE

Tambahkan di component yang blank:

```typescript
const MyComponent = () => {
  const { data, isLoading, error } = useProjects();
  
  // Debug log
  console.log('Component render:', {
    data,
    isLoading,
    error,
    dataLength: data?.length
  });
  
  if (isLoading) {
    console.log('Still loading...');
    return <div>Loading...</div>;
  }
  
  if (error) {
    console.error('Error:', error);
    return <div>Error: {error.message}</div>;
  }
  
  console.log('Data loaded:', data);
  return <div>Content here</div>;
};
```

---

## 📞 JIKA MASIH ERROR

Kasih tau detail:
1. Screenshot browser console
2. Screenshot network tab
3. Halaman mana yang blank
4. Langkah yang sudah dicoba
5. Output terminal backend & frontend

---

*Debugging Guide - 24 Oktober 2025*
