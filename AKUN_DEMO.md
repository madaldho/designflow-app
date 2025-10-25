# 🔐 Akun Demo DesignFlow

## Cara Login dengan Akun Demo

Aplikasi DesignFlow sudah dilengkapi dengan akun demo untuk testing. Berikut cara menggunakannya:

### 1️⃣ Akun Demo yang Tersedia

| Role | Email | Password | Akses |
|------|-------|----------|-------|
| 🏢 **Admin** | `admin@designflow.com` | `demo123` | Akses penuh ke semua fitur sistem |
| 🎨 **Designer** | `designer@designflow.com` | `demo123` | Mengerjakan desain, upload proof |
| 👁️ **Reviewer** | `reviewer@designflow.com` | `demo123` | Review dan approve desain |
| 📝 **Requester** | `requester@designflow.com` | `demo123` | Request desain baru |

### 2️⃣ Cara Login

**Opsi A - Menggunakan Tombol Demo:**
1. Buka halaman login
2. Klik salah satu tombol demo (Admin, Designer, Reviewer, atau Requester)
3. Email dan password akan otomatis terisi
4. Klik tombol **"Masuk"**

**Opsi B - Input Manual:**
1. Masukkan email dari tabel di atas
2. Masukkan password: `demo123`
3. Klik tombol **"Masuk"**

### 3️⃣ Data Demo yang Tersedia

Setelah login, Anda akan melihat:
- ✅ 6 user dengan berbagai role
- ✅ 3 institusi (SMA, Yayasan, Pondok Pesantren)
- ✅ 5 project dengan status berbeda-beda
- ✅ History aktivitas

### 4️⃣ Testing & Debugging

Aplikasi dilengkapi dengan utilitas debugging di browser console:

```javascript
// Lihat daftar user yang tersedia
DesignFlowDebug.showUsers()

// Lihat daftar project
DesignFlowDebug.showProjects()

// Reset semua data demo ke kondisi awal
DesignFlowDebug.resetDemoData()

// Hapus semua data
DesignFlowDebug.clearDemoData()

// Inisialisasi ulang data demo
DesignFlowDebug.initializeDemoData()
```

### 5️⃣ Troubleshooting

**Q: Login gagal dengan error "Email atau password salah"**
- A: Pastikan email menggunakan `@designflow.com` dan password `demo123`
- A: Coba reset data demo dengan `DesignFlowDebug.resetDemoData()` di console

**Q: Tidak ada data project/user setelah login**
- A: Jalankan `DesignFlowDebug.resetDemoData()` di browser console
- A: Refresh halaman browser (F5)

**Q: Data hilang setelah refresh**
- A: Data disimpan di localStorage browser
- A: Pastikan tidak menggunakan mode incognito/private
- A: Check jika localStorage diblokir oleh browser

### 6️⃣ Reset Data Demo

Jika data demo rusak atau ingin reset ke kondisi awal:

1. Buka browser console (F12)
2. Ketik: `DesignFlowDebug.resetDemoData()`
3. Refresh halaman (F5)
4. Login kembali dengan akun demo

---

## 🛠️ Development Notes

### Struktur Data
- Users: `localStorage.getItem('designflow_users')`
- Projects: `localStorage.getItem('designflow_projects')`
- Activities: `localStorage.getItem('designflow_activities')`
- Institutions: `localStorage.getItem('designflow_institutions')`

### File Penting
- **Demo Data**: `/src/lib/seedData.ts`
- **Auth Logic**: `/src/contexts/AuthContext.tsx`
- **Login Page**: `/src/pages/auth/LoginPage.tsx`
- **Database Service**: `/src/services/database.service.ts`

### Menambah User Demo Baru

Edit file `/src/lib/seedData.ts`:

```typescript
export const DEMO_USERS: User[] = [
  // ... existing users
  {
    id: 'user-new-1',
    name: 'Nama User',
    email: 'email@designflow.com',
    phone: '081234567890',
    roles: ['requester'], // atau: admin, designer_internal, designer_external, reviewer, approver
    status: 'active',
    institutions: [DEMO_INSTITUTIONS[0]],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
```

Jangan lupa increment `CURRENT_VERSION` di function `initializeDemoData()`.

---

**Happy Testing! 🚀**
