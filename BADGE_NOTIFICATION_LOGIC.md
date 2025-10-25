# 🔔 Logika Badge Notification Berdasarkan Role

## ✅ Perbaikan yang Sudah Dilakukan

### 1. **Badge di Header (Desktop)**
- ✅ Menampilkan jumlah notifikasi **unread** untuk user yang login
- ✅ Badge **HILANG** ketika dropdown notification dibuka
- ✅ Badge muncul kembali jika masih ada notifikasi unread
- ✅ Animasi pulse untuk menarik perhatian
- ✅ Auto-refresh setiap 60 detik

**Cara Kerja:**
```tsx
// Badge hanya muncul jika ada unread DAN dropdown belum dibuka
{unreadCount > 0 && !showNotifications && (
  <span className="badge-danger animate-pulse">
    {unreadCount > 9 ? '9+' : unreadCount}
  </span>
)}
```

---

### 2. **Badge di MobileNav (Bottom Bar)**

Badge di mobile navigation sekarang **DINAMIS** berdasarkan role user:

#### 📊 **Badge "Proyek"** (Icon Dokumen)

##### Role: **Requester** / **Admin**
- Menampilkan jumlah proyek yang **dibuat oleh user tersebut**
- Filter: `project.createdById === user.id`
```typescript
const myProjects = projects.filter(p => p.createdById === user.id);
projectsBadge = myProjects.length;
```

##### Role: **Designer Internal** / **Designer External**
- Menampilkan jumlah proyek yang **ditugaskan ke designer**
- Filter: `project.assigneeId === user.id`
```typescript
const assignedProjects = projects.filter(p => p.assigneeId === user.id);
projectsBadge = assignedProjects.length;
```

##### Role: **Percetakan**
- Menampilkan jumlah proyek di **antrian cetak**
- Filter: Status `approved_for_print` atau `in_print`
```typescript
const printProjects = projects.filter(p => 
  p.status === 'approved_for_print' || p.status === 'in_print'
);
projectsBadge = printProjects.length;
```

---

#### 👁️ **Badge "Review"** (Icon Mata)

##### Role: **Reviewer**
- Menampilkan jumlah proyek yang **perlu direview**
- Filter: Status `ready_for_review` dan `reviewerId === user.id`
```typescript
const reviewProjects = projects.filter(p => 
  p.status === 'ready_for_review' && p.reviewerId === user.id
);
reviewBadge = reviewProjects.length;
```

##### Role: **Approver**
- Menampilkan jumlah proyek yang **perlu approval**
- Filter: Status `approved` dan `approverId === user.id`
```typescript
const approvalProjects = projects.filter(p => 
  p.status === 'approved' && p.approverId === user.id
);
reviewBadge = approvalProjects.length;
```

##### Role: **Admin**
- Menampilkan **semua proyek** yang perlu review atau approval
- Kombinasi dari reviewer + approver

---

## 📋 Tabel Ringkasan Badge per Role

| Role | Badge "Proyek" | Badge "Review" | Badge "Notifikasi" |
|------|----------------|----------------|-------------------|
| **Admin** | Proyek yang dibuat | Semua review + approval | Semua unread notifications |
| **Requester** | Proyek yang dibuat | - | Unread notifications |
| **Designer Internal** | Proyek assigned | - | Unread notifications |
| **Designer External** | Proyek assigned | - | Unread notifications |
| **Reviewer** | - | Proyek ready_for_review | Unread notifications |
| **Approver** | - | Proyek approved | Unread notifications |
| **Percetakan** | Proyek di antrian cetak | - | Unread notifications |

---

## 🎯 Contoh Skenario

### Skenario 1: User Login sebagai **Designer**
- Badge "Proyek": **3** (ada 3 proyek assigned)
- Badge "Review": Tidak ada (designer tidak punya akses review)
- Badge Notification: **2** (ada 2 notifikasi unread)

### Skenario 2: User Login sebagai **Reviewer**
- Badge "Proyek": Tidak ada
- Badge "Review": **5** (ada 5 proyek ready for review)
- Badge Notification: **1** (ada 1 notifikasi unread)

### Skenario 3: User Login sebagai **Percetakan**
- Badge "Proyek": **4** (ada 4 proyek di antrian cetak)
- Badge "Review": Tidak ada
- Badge Notification: **0** (tidak ada notifikasi unread)

### Skenario 4: User **Buka Dropdown Notification**
```
SEBELUM: Badge notification = 3 (merah, berkedip)
DIBUKA: Badge notification = HILANG ❌
DITUTUP: Badge notification = muncul kembali jika masih ada unread
```

---

## 🔄 Auto-Refresh Notification

### Backend
- ✅ Endpoint `/api/notifications/unread-count` 
- ✅ Filter otomatis berdasarkan `userId` dari token JWT
- ✅ Response: `{ count: number }`

### Frontend
```typescript
export function useUnreadNotificationsCount() {
  return useQuery<number>({
    queryKey: NOTIFICATION_KEYS.unreadCount(),
    queryFn: async () => {
      const response = await apiService.getUnreadNotificationsCount();
      return response.count;
    },
    staleTime: 30 * 1000,      // Cache 30 detik
    refetchInterval: 60 * 1000, // Auto-refresh tiap 60 detik
    refetchOnWindowFocus: true, // Refresh saat tab difokus
  });
}
```

**Fitur Auto-Refresh:**
- ✅ Cek otomatis setiap **60 detik**
- ✅ Refresh saat **tab browser difokus kembali**
- ✅ Cache 30 detik untuk **mengurangi request**
- ✅ Background polling tanpa mengganggu user

---

## 🎨 Styling Badge

### Badge Notification (Header)
```tsx
className="absolute -top-0.5 -right-0.5 h-5 w-5 bg-danger-500 text-white text-xs font-semibold rounded-full flex items-center justify-center shadow-sm animate-pulse"
```

**Fitur:**
- ✅ Warna merah (`bg-danger-500`)
- ✅ Animasi pulse (berkedip)
- ✅ Shadow untuk depth
- ✅ Posisi absolute di kanan atas icon
- ✅ Ukuran 20x20px (h-5 w-5)

### Badge MobileNav (Bottom Bar)
```tsx
className="absolute -top-1.5 -right-1.5 h-4 min-w-[16px] px-1 bg-danger-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm"
```

**Fitur:**
- ✅ Warna merah (`bg-danger-500`)
- ✅ Ukuran lebih kecil (h-4)
- ✅ Text lebih kecil (10px)
- ✅ Min width 16px
- ✅ Padding horizontal untuk angka 2 digit

---

## 🧪 Testing Badge

### Test 1: Badge Hilang Saat Dropdown Dibuka
```
1. Login dengan user yang punya notifikasi unread
2. Lihat badge notification di header (ada angka merah)
3. Klik icon bell
4. ✅ Badge HILANG saat dropdown terbuka
5. Klik di luar dropdown
6. ✅ Badge MUNCUL KEMBALI jika masih ada unread
```

### Test 2: Badge Berubah Setelah Mark as Read
```
1. Badge notification = 5
2. Klik dropdown notification
3. Klik salah satu notification untuk mark as read
4. ✅ Badge otomatis update jadi 4
```

### Test 3: Badge Sesuai Role
```
ROLE: Designer Internal
1. Login sebagai ahmad@designflow.com
2. ✅ Badge "Proyek" = jumlah proyek assigned ke ahmad
3. ✅ Badge "Review" = tidak ada (hidden)
4. ✅ Badge notification = jumlah unread

ROLE: Reviewer
1. Login sebagai siti@designflow.com
2. ✅ Badge "Proyek" = tidak ada atau 0
3. ✅ Badge "Review" = jumlah proyek ready_for_review untuk siti
4. ✅ Badge notification = jumlah unread

ROLE: Percetakan
1. Login sebagai user percetakan
2. ✅ Badge "Proyek" = jumlah proyek di print queue
3. ✅ Badge "Review" = tidak ada (hidden)
4. ✅ Badge notification = jumlah unread
```

---

## 📊 Database Query untuk Badge

### Unread Notifications Count
```sql
SELECT COUNT(*) as count 
FROM "Notification" 
WHERE "userId" = 'current-user-id' 
AND read = false;
```

### Projects for Designer
```sql
SELECT * FROM "Project" 
WHERE "assigneeId" = 'designer-user-id';
```

### Projects for Reviewer
```sql
SELECT * FROM "Project" 
WHERE status = 'ready_for_review' 
AND "reviewerId" = 'reviewer-user-id';
```

### Projects for Approver
```sql
SELECT * FROM "Project" 
WHERE status = 'approved' 
AND "approverId" = 'approver-user-id';
```

### Projects for Percetakan
```sql
SELECT * FROM "Project" 
WHERE status IN ('approved_for_print', 'in_print');
```

---

## 🎉 Kesimpulan

### ✅ Fitur yang Sudah Berfungsi

1. **Badge Notification di Header**
   - ✅ Dinamis dari database
   - ✅ Hilang saat dropdown dibuka
   - ✅ Animasi pulse
   - ✅ Auto-refresh tiap 60 detik

2. **Badge di MobileNav**
   - ✅ Berbeda per role
   - ✅ Badge "Proyek" sesuai role
   - ✅ Badge "Review" sesuai role
   - ✅ Dinamis dari database

3. **Backend API**
   - ✅ Filter otomatis berdasarkan userId
   - ✅ Count unread notifications
   - ✅ Mark as read
   - ✅ Mark all as read

4. **Auto-Refresh**
   - ✅ Polling tiap 60 detik
   - ✅ Refresh on window focus
   - ✅ Cache 30 detik

### 🚀 Siap Digunakan!

Semua badge notification sekarang:
- ✅ Dinamis dari database Neon
- ✅ Sesuai role user yang login
- ✅ Hilang ketika sudah dibuka (notification badge)
- ✅ Auto-refresh real-time
- ✅ Performance optimal dengan caching

**Badge notification sudah sempurna! 🎉**
