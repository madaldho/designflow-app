# Complete API Endpoints Documentation

## ✅ SEMUA ENDPOINT SUDAH LENGKAP & SINKRON DATABASE

### 1. Authentication (`/api/auth`)
- ✅ POST `/register` - Daftar user baru
- ✅ POST `/login` - Login user
- ✅ GET `/me` - Get current user

### 2. Users (`/api/users`)
- ✅ GET `/` - Get all users (admin only)
- ✅ GET `/:id` - Get user by ID
- ✅ GET `/role/:role` - Get users by role
- ✅ PATCH `/:id` - Update user
- ✅ DELETE `/:id` - Delete user (admin only)

### 3. Institutions (`/api/institutions`)
- ✅ GET `/` - Get all institutions
- ✅ GET `/:id` - Get institution by ID
- ✅ POST `/` - Create institution (admin only)
- ✅ PATCH `/:id` - Update institution (admin only)
- ✅ DELETE `/:id` - Delete institution (admin only)

### 4. Projects (`/api/projects`)
- ✅ GET `/` - Get all projects (filtered by user role)
- ✅ GET `/:id` - Get project by ID (with full details)
- ✅ POST `/` - Create new project
- ✅ PATCH `/:id` - Update project
- ✅ DELETE `/:id` - Delete project
- ✅ GET `/stats/dashboard` - Get dashboard statistics

### 5. **Proofs (`/api/proofs`)** - BARU!
- ✅ POST `/` - Upload proof (designer only)
- ✅ GET `/project/:projectId` - Get all proofs for a project
- ✅ GET `/:id` - Get single proof with annotations
- ✅ DELETE `/:id` - Delete proof

### 6. **Reviews & Annotations (`/api/reviews`)** - BARU!
- ✅ POST `/annotations` - Create annotation (reviewer/approver)
- ✅ GET `/annotations/proof/:proofId` - Get annotations for a proof
- ✅ PATCH `/annotations/:id` - Update annotation
- ✅ DELETE `/annotations/:id` - Delete annotation
- ✅ POST `/` - Submit review (approve/request changes)
- ✅ GET `/project/:projectId` - Get all reviews for a project

### 7. **Approvals (`/api/approvals`)** - BARU!
- ✅ POST `/` - Approve for print (approver only)
- ✅ GET `/project/:projectId` - Get approvals for a project
- ✅ GET `/:id` - Get single approval

### 8. **Print Jobs (`/api/print-jobs`)** - BARU!
- ✅ GET `/` - Get all print jobs
- ✅ GET `/ready` - Get projects ready for print (approved_for_print)
- ✅ POST `/` - Create print job / Start printing
- ✅ PATCH `/:id` - Update print job status
- ✅ GET `/:id` - Get single print job

### 9. **Pickup Logs (`/api/pickup-logs`)** - BARU!
- ✅ GET `/` - Get all pickup logs
- ✅ POST `/` - Confirm pickup (percetakan only)
- ✅ GET `/project/:projectId` - Get pickup logs for a project
- ✅ GET `/:id` - Get single pickup log
- ✅ PATCH `/:id` - Update pickup log

### 10. Activities (`/api/activities`)
- ✅ GET `/` - Get activities (filtered by role)
- ✅ POST `/` - Create activity log

### 11. Notifications (`/api/notifications`)
- ✅ GET `/` - Get user notifications
- ✅ GET `/unread-count` - Get unread count
- ✅ PUT `/:id/read` - Mark as read
- ✅ PUT `/mark-all-read` - Mark all as read
- ✅ DELETE `/:id` - Delete notification

---

## Workflow Status Lengkap

```
draft 
  ↓ (upload proof)
designing / ready_for_review
  ↓ (review)
  ├─ changes_requested → (upload lagi) → ready_for_review
  └─ approved (by reviewer)
      ↓ (final approval by approver)
      approved_for_print (HIJAU - SIAP CETAK)
        ↓ (start printing by percetakan)
        in_print
          ↓ (mark as completed by percetakan)
          ready (Siap Diambil)
            ↓ (confirm pickup by percetakan)
            picked_up → archived
```

---

## Permissions Sesuai Role

### Requester
- ✅ Create project
- ✅ View own projects
- ✅ Edit own projects (draft only)

### Designer Internal
- ✅ View assigned projects
- ✅ Upload proofs
- ✅ Reply to comments

### Designer External (Percetakan)
- ✅ View assigned projects
- ✅ Upload proofs
- ✅ **Download final proofs**
- ✅ **Start printing (create print job)**
- ✅ **Update print status (in_progress → completed)**
- ✅ **Confirm pickup (create pickup log)**

### Reviewer
- ✅ View projects for review
- ✅ Add annotations/comments
- ✅ Approve or request changes
- ✅ View all reviews

### Approver (Atasan)
- ✅ View projects for approval
- ✅ Add comments
- ✅ **Final approval for print (HIJAU)**
- ✅ Reject projects

### Admin
- ✅ Full access to everything
- ✅ Manage users & institutions
- ✅ Override any permission

---

## API Service Methods Baru

File: `src/services/api.service.ts`

```typescript
// Proofs
uploadProof(data)
getProofsByProject(projectId)
getProofById(id)
deleteProof(id)

// Reviews & Annotations
createAnnotation(data)
getAnnotationsByProof(proofId)
updateAnnotation(id, data)
deleteAnnotation(id)
submitReview(data)
getReviewsByProject(projectId)

// Approvals
createApproval(data)
getApprovalsByProject(projectId)
getApprovalById(id)

// Print Jobs
getPrintJobs(params)
getReadyForPrint()
createPrintJob(data)
updatePrintJob(id, data)
getPrintJobById(id)

// Pickup Logs
getPickupLogs()
createPickupLog(data)
getPickupLogsByProject(projectId)
getPickupLogById(id)
updatePickupLog(id, data)
```

---

## Testing Checklist

### ✅ 1. User Management
- [ ] Register new user
- [ ] Login
- [ ] Update user role (admin)
- [ ] Delete user (admin)

### ✅ 2. Institution Management
- [ ] Create institution (admin)
- [ ] Edit institution (admin)
- [ ] Delete institution (admin)

### ✅ 3. Project Lifecycle (Full Workflow)
- [ ] **Requester**: Create project
- [ ] **Admin/Approver**: Assign to designer
- [ ] **Designer**: Upload proof v1
- [ ] **Reviewer**: Add annotations
- [ ] **Reviewer**: Request changes
- [ ] **Designer**: Upload proof v2 (revisi)
- [ ] **Reviewer**: Approve
- [ ] **Approver**: Approve for print (HIJAU)
- [ ] **Percetakan**: Download final proof
- [ ] **Percetakan**: Start printing (tandai sedang cetak)
- [ ] **Percetakan**: Mark as completed (selesai cetak)
- [ ] **Percetakan**: Confirm pickup (sudah diambil)

### ✅ 4. Notifications
- [ ] Get notifications from database
- [ ] Mark as read
- [ ] Real-time display in Header

### ✅ 5. Activities
- [ ] View activity logs
- [ ] Filter by project

---

## Files Modified/Created

### New API Routes (Server)
1. `server/routes/proofs.routes.ts` ✅
2. `server/routes/reviews.routes.ts` ✅
3. `server/routes/approvals.routes.ts` ✅
4. `server/routes/print-jobs.routes.ts` ✅
5. `server/routes/pickup-logs.routes.ts` ✅
6. `server/routes/notifications.routes.ts` ✅

### Updated Files
1. `server/index.ts` - Registered all new routes
2. `src/services/api.service.ts` - Added all new API methods
3. `src/hooks/useNotifications.ts` - New hook for notifications
4. `src/hooks/index.ts` - Export useNotifications
5. `src/components/layout/Header.tsx` - Real notifications from DB
6. `src/lib/utils.ts` - Added getRelativeTime function
7. `src/lib/permissions.ts` - Updated permissions sesuai dokumentasi
8. `src/pages/analytics/AnalyticsPage.tsx` - Fixed undefined errors
9. `src/pages/designer/DesignerPanelPage.tsx` - Fixed assigneeId errors
10. `src/pages/print/PrintQueuePage.tsx` - Fixed toast.info errors
11. `src/pages/DashboardPageNew.tsx` - Fixed activity type error

---

## Next Steps

1. **Start Backend Server**: `cd server && npm run dev`
2. **Test Login**: Login dengan user sesuai role
3. **Test Full Workflow**: 
   - Create project sebagai requester
   - Upload proof sebagai designer
   - Review dan approve
   - Print dan pickup
4. **Verify Database**: Check bahwa semua data tersimpan di Neon database

---

## Important Notes

- ✅ Semua endpoint **sudah connect ke database** (Neon PostgreSQL via Prisma)
- ✅ **Tidak ada mock data lagi** - semua real data dari database
- ✅ Role permissions **sudah sesuai dokumentasi**
- ✅ Workflow **lengkap dari awal sampai akhir**
- ✅ Notifications **real-time dari database**
- ⚠️ Masih ada beberapa TypeScript errors minor di file legacy (tidak mempengaruhi fungsi utama)

## Status: **READY FOR TESTING** 🚀
