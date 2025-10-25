# Wireframe Web‑App “Desain → Review → Cetak” (End‑to‑End)

Dokumen ini merinci **alur, halaman, komponen UI, status, notifikasi, serta hak akses** dari tahap pendaftaran akun hingga serah‑terima hasil cetak. Fokus: **sederhana, jelas, minim miskomunikasi**, dan **mudah untuk percetakan eksternal**.

---

## 0) Prinsip Desain

* **Single source of truth**: satu halaman status per proyek.
* **Hijau = boleh cetak** (Siap Cetak), tanpa QR (opsional belakangan).
* **Peran jelas**: yang desain tidak meng-approve; yang approve bukan percetakan.
* **Percetakan panel super sederhana**: 2 tab → *Perlu Desain/Revisi* & *Siap Cetak*.
* **Komentar/coret‑coret** langsung di proof (annotation pencil, lingkaran, panah, highlight).

---

## 1) Arsitektur Navigasi (Sitemap)

* **Auth**

  * Login / Daftar
  * Lupa Password
* **Onboarding**

  * Pilih Peran Awal (Request/Designer Internal/Designer Eksternal/Reviewer)
  * Pilih Lembaga (Pondok/Yayasan/SMP, dll)
* **Home (Dashboard)**

  * Ringkasan Status & Aktivitas
  * Shortcut Aksi Cepat
* **Proyek**

  * List Proyek (filter, pencarian)
  * Detail Proyek (Canvas Proof Viewer + Komentar)
* **Request Desain (Form)**
* **Panel Desainer (Internal & Eksternal)**

  * Tab: *Perlu Desain/Revisi*
  * Tab: *Siap Cetak*
* **Panel Review & Approval**
* **Antrian Cetak (Percetakan)**
* **Pickup Log (Serah Terima tanpa QR)**
* **Riwayat & Audit Log**
* **Profil & Preferensi Notifikasi**
* **Admin**

  * Manajemen Pengguna & Peran
  * Manajemen Lembaga/Unit
  * Rute Persetujuan (Reviewer → Approver)
  * Template Checklist Pra‑Cetak
  * Konfigurasi Notifikasi (WA/Email)

---

## 2) Peran & Hak Akses (Matrix)

| Peran                               | Buat Request | Upload Desain | Coret/Komentar       | Approve                     | Download Final  | Set Status Cetak   | Serah Terima             |
| ----------------------------------- | ------------ | ------------- | -------------------- | --------------------------- | --------------- | ------------------ | ------------------------ |
| **Requester / Konten**              | ✅            | ➖             | ➖                    | ➖                           | ➖               | ➖                  | ➖                        |
| **Desainer Internal**               | ➖            | ✅             | Boleh balas komentar | ➖                           | ➖               | ➖                  | ➖                        |
| **Desainer Eksternal (Percetakan)** | ➖            | ✅             | Boleh balas komentar | ➖                           | ✅ (hanya Final) | ✅ (Sedang/Selesai) | ✅ (Input nama pengambil) |
| **Reviewer**                        | ➖            | ➖             | ✅ (coret/komentar)   | ✅ (Approve)                 | ➖               | ➖                  | ➖                        |
| **Approver (Atasan)**               | ➖            | ➖             | ✅                    | ✅ (**Setujui untuk Cetak**) | ➖               | ➖                  | ➖                        |
| **Admin**                           | ✅            | ✅             | ✅                    | ✅                           | ✅               | ✅                  | ✅                        |

> Catatan: Role **Admin** dapat mengubah peran user lain kapan saja.

---

## 3) Alur Status Proyek (State Machine)

```
Draft → Designing → Ready for Review →
  ├─ Changes Requested ↺ (kembali ke Designing)
  └─ Approved (Reviewer complete) → Approved for Print (oleh Approver)
      → In Print → Ready (Selesai) → Picked Up → Archived/Cancelled
```

**Aturan:** Upload versi baru **mereset** status Approved & memaksa review ulang versi terbaru.

---

## 4) Onboarding & Pendaftaran

### 4.1 Halaman Daftar

* Field: **Nama Lengkap**, **Email**, **Nomor HP (WA)**, **Kata Sandi**
* Dropdown: **Lembaga** (Pondok/Yayasan/SMP/…)
* Pilih **Peran Awal** (opsi):

  * Requester / Konten
  * Desainer Internal
  * Desainer Eksternal (Percetakan)
  * Reviewer (butuh persetujuan Admin)
* Checkbox: **Saya setuju** S&K dan Kebijakan Privasi
* CTA: `Daftar`

**Logika Role:**

* Role sensitif (Reviewer/Approver/Admin) **pending** hingga disetujui Admin.
* Default aman: Requester/Desainer (internal/eksternal) langsung aktif.

### 4.2 Halaman Login

* Email, Kata Sandi → `Masuk`
* Link: `Lupa kata sandi?`

### 4.3 Onboarding Singkat

* Pilih **Preferensi Notifikasi** (WA/Email)
* (Opsional) Tambah **Foto Profil**
* Simpan

---

## 5) Home (Dashboard)

**Komponen:**

* **Ringkasan Status** (kartu): Draft • Menunggu Review • **Siap Cetak (Hijau)** • Sedang Dicetak • Selesai
* **Aktivitas Terbaru**: siapa upload/revisi/approve
* **Filter cepat**: Lembaga • Jenis (Baliho/Poster/Rundown) • Deadline (minggu ini)
* **Aksi Cepat**: `+ Request Desain`, `Panel Desainer`, `Antrian Siap Cetak`, `Pickup Log`

**Empty state:** “Belum ada proyek. Mulai dengan `+ Request Desain`.”

---

## 6) Request Desain (Form)

**Fields:**

* Judul Proyek
* Jenis Media (Baliho/Poster/Rundown/Spanduk/Leaflet…)
* Ukuran (preset + custom)
* Jumlah Cetak
* Deadline (tgl & jam)
* Lembaga Pemilik
* Teks/Konten (textarea) + **Checklist ejaan nama/gelar/jabatan**
* **Lampiran Bahan**: upload file / **Link Google Drive (opsional)**
* **Sketsa/Coretan** (opsional): unggah foto kertas/catatan
* **Rute Review**: pilih Reviewer (1..N), pilih Approver (1)

**CTA:** `Kirim ke Desainer Internal` **atau** `Kirim ke Desainer Eksternal (Percetakan)`

**Validasi:** wajib isi Judul, Jenis, Ukuran, Deadline, Lembaga, Konten minimal.

---

## 7) List Proyek (Semua Peran)

* **Search** (judul/id)
* **Filter** (status, lembaga, jenis, approver)
* **Sort** (deadline, terbaru, abjad)
* **Tampilan Kartu** (responsif):

  * Judul • Badge Status • Deadline • Lembaga • Versi Terakhir • 2 poin koreksi terbaru
  * CTA kecil: `Buka`, `Upload Versi Baru` (jika desainer)

---

## 8) Detail Proyek (Canvas Proof Viewer + Komentar)

**Layout 2 kolom (desktop)**

* **Kiri:** Preview PNG/PDF (zoom, fit width)
* **Kanan:**

  * **Komentar & Koreksi** (tiap anotasi → komentar numerik)
  * **Checklist Pra‑Cetak** (untuk reviewer – wajib sebelum approve)
  * **Riwayat Versi** (v1/v2/v3 – klik untuk lihat)

**Header bar:**

* Judul • Status • Versi aktif • Lembaga • Deadline
* Aksi per peran:

  * **Desainer**: `Upload Versi Baru` (modal: file + catatan), `Tandai Siap Ditinjau`
  * **Reviewer**: alat **Coret‑coret** (pensil/lingkaran/panah), `Minta Revisi` (wajib isi poin), `Approve`
  * **Approver**: `Setujui untuk Cetak (jadikan Hijau)` atau `Tolak (Desain Ulang)`

**Keyboard shortcut:** U (upload), N/P (next/prev anotasi), R (siap ditinjau), A (approve)

**Empty states:**

* Belum ada anotasi: “Tambahkan koreksi dengan alat pencil di kiri atas.”

---

## 9) Panel Desainer Eksternal (Percetakan)

**2 Tab saja**

### Tab A — Perlu Desain / Revisi

* **Kartu**: Judul • Badge (Draft/Perlu Revisi/Siap Ditinjau) • Deadline • Ukuran/Jumlah • Lembaga • Versi terakhir • Ringkas 2–3 koreksi
* **CTA**: `Buka` | `Upload Versi Baru`
* **Halaman Detail (dari kartu):**

  * Header: info job + tombol `Upload Versi Baru`
  * Preview + panel komentar (read, reply singkat)
  * Link bahan: **Google Drive (opsional)** + file
  * **Riwayat Versi** (klik untuk banding)
  * **Aksi**: `Upload Versi Baru` → status otomatis **Siap Ditinjau** (notif ke reviewer)

### Tab B — Siap Cetak (Hijau)

* **Kartu**: Judul • **Badge Hijau** (disetujui atasan) • Versi Final • Approver & waktu approve • Ukuran/Jumlah • Deadline
* **CTA**: `Preview` | `Download` | `Tandai Sedang Dicetak` | `Tandai Selesai (Siap Diambil)`

**Catatan:** Item pindah dari Tab A → B **otomatis** saat atasan menekan **Setujui untuk Cetak**.

---

## 10) Panel Desainer Internal

Mirip DE, namun biasanya **sumber request** dari internal. Aksi sama (upload versi, siap ditinjau). Item yang disetujui atasan juga tampil di **Siap Cetak** (untuk arsip), namun hanya percetakan yang menandai *Sedang/Selesai*.

---

## 11) Panel Review & Approval (Reviewer/Atasan)

* **Queue**: daftar item *Ready for Review* dengan badge prioritas (deadline dekat → merah)
* **Detail**: lihat preview, checklist pra‑cetak, anotasi, histori versi
* **Aksi Reviewer**: `Minta Revisi` (form poin), `Approve`
* **Aksi Approver**: `Setujui untuk Cetak` → status proyek **Siap Cetak (Hijau)**

---

## 12) Antrian Cetak (Percetakan)

* Tabel/Board: **hanya** item **Siap Cetak (Hijau)**
* Kolom: Judul • Ukuran • Jumlah • Deadline • Approver • Versi Final • Aksi
* Aksi baris: `Preview`, `Download`, `Tandai Sedang Dicetak`, `Tandai Selesai`

---

## 13) Pickup Log (Serah Terima tanpa QR)

**Form singkat di percetakan:**

* **Nama Pengambil** (wajib)
* **PIC/Lembaga** (opsional)
* **Catatan** (opsional)
* (Opsional) **Nomor/Barcode internal** jika tersedia
* CTA: `Konfirmasi Diambil`

**Di internal**: pada detail proyek muncul catatan: “Diambil oleh [Nama] pada [Tanggal Jam]”.

---

## 14) Riwayat & Audit Log

* Timeline tiap proyek (aksi, pelaku, waktu)
* Filter per jenis aksi (upload, komentar, approve, cetak, ambil)

---

## 15) Profil & Preferensi

* Data diri: Nama, Email, WA, Lembaga, Peran aktif
* **Peran Tambahan** (jika user punya multi‑role)
* Preferensi notifikasi (WA/Email)
* Daftar proyek terkait

---

## 16) Admin Area

### 16.1 Manajemen Pengguna & Peran

* List user: nama, email, WA, lembaga, peran
* Aksi: `Ubah Peran`, `Suspend`, `Reset Password`, `Jadikan Admin`
* **Kebijakan:** peran **Approver** dan **Admin** hanya diberikan oleh Admin; perubahan tercatat di log.

### 16.2 Manajemen Lembaga/Unit

* CRUD lembaga (Pondok/Yayasan/SMP/…)
* Mapping user ↔ lembaga (multi lembaga diperbolehkan jika perlu)

### 16.3 Rute Persetujuan

* Definisikan urutan: Reviewer (1..N, paralel/serial) → Approver (1)
* Aturan: semua reviewer **wajib approve** sebelum Approver aktif

### 16.4 Template Checklist Pra‑Cetak

* Buat & edit checklist: ukuran, bleed, warna, ejaan, logo, kontak, dsb.

### 16.5 Notifikasi

* Channel: WA/Email (aktif/nonaktif)
* Template pesan (variabel: {judul}, {deadline}, {versi}, {link})

---

## 17) Komponen UI Reusable

* **Card Proyek** (list)
* **Badge Status** (Draft/Designing/Ready/Perlu Revisi/Disetujui/Siap Cetak Hijau/Sedang/Selesai/Diambil)
* **Modal Upload Versi** (drag&drop + catatan perubahan)
* **Annotation Toolbar** (pencil, lingkaran, panah, highlighter, text)
* **Checklist Component** (checkbox + catatan item)
* **Sidebar Riwayat Versi**
* **Toast/Alert** (berhasil, gagal, butuh perhatian)

---

## 18) Wireframe (ASCII) – Layar Kunci

### 18.1 Login / Daftar

```
+----------------------------------+
|  LOGO                            |
|  [ Email ]                       |
|  [ Password ]                    |
|  ( ) Ingat saya    [Masuk]       |
|  ------------------------------  |
|  [Daftar Akun]                   |
+----------------------------------+
```

```
+----------------------------------+
|  DAFTAR                          |
|  Nama        [...............]   |
|  Email       [...............]   |
|  Nomor HP    [...............]   |
|  Lembaga     [v Pondok]          |
|  Peran Awal  [v Desainer Ekst]   |
|  [ ] Setuju S&K                  |
|               [Daftar]           |
+----------------------------------+
```

### 18.2 Home (Dashboard)

```
+------------------+ +------------------+ +------------------+
| Draft: 3         | | Ready Review: 5  | | Siap Cetak: 2   |
+------------------+ +------------------+ +------------------+

Aktivitas Terbaru
- v3 diunggah (Pamflet Lomba)
- Approve oleh Pak Faisal (Baliho HSN)

[Aksi Cepat] [+ Request] [Panel Desainer] [Antrian Siap Cetak]
```

### 18.3 List Proyek (Card)

```
[Baliho HSN 3x5m] [Badge: Perlu Revisi] Deadline: 18/10  Lembaga: Pondok
Versi: v2  Koreksi: #1 ejaan, #2 logo
[ Buka ] [ Upload Versi Baru ]
```

### 18.4 Detail Proyek (Canvas)

```
+---------------------+ | Komentar/Koreksi
|  Preview (PNG/PDF)  | | #1 Perbesar logo kanan
|  [Zoom] [Fit]       | | #2 Perbaiki ejaan “Kepala”
+---------------------+ | Checklist Pra-Cetak [ ]
Header: Judul | Status | Versi | Lembaga | Deadline
Aksi (Desainer): [Upload Versi Baru] [Siap Ditinjau]
Aksi (Reviewer): [Minta Revisi] [Approve]
Aksi (Approver): [Setujui untuk Cetak]
```

### 18.5 Panel Desainer Eksternal – Tab A

```
TAB: [Perlu Desain/Revisi] [Siap Cetak]
Card: Pamflet Lomba | Perlu Revisi | DL: 12/10 | v3
[ Buka ] [ Upload Versi Baru ]
```

### 18.6 Panel Desainer Eksternal – Tab B (Siap Cetak)

```
Card: Baliho HSN 3x5m | SIAP CETAK (Hijau) | Final v4 | Approver: Pak Faisal
[ Preview ] [ Download ] [ Sedang Dicetak ] [ Selesai ]
```

### 18.7 Pickup Log (Percetakan)

```
Nama Pengambil   [................]
PIC/Lembaga      [................]
Catatan (ops)    [................]
[ Konfirmasi Diambil ]
```

---

## 19) Notifikasi (ringkas, berisi tautan)

* “v3 diunggah oleh *Percetakan*. Mohon review: {link}.”
* “Reviewer menyetujui. Menunggu atasan: {link}.”
* “Disetujui untuk Cetak (Hijau) oleh {nama}. Lihat file final: {link}.”
* “Percetakan menandai *Selesai (Siap Diambil)* untuk {judul}.”
* “Diambil oleh {nama_pengambil} pada {waktu}.”

---

## 20) Error & Empty States (Contoh)

* **Tidak ada akses**: “Anda tidak punya hak melihat file final. Hubungi admin.”
* **Belum ada anotasi**: “Reviewer belum menambahkan koreksi.”
* **Upload gagal**: “Ukuran file melebihi batas. Coba kompres atau hubungi admin.”

---

## 21) Data Ringkas (MVP)

* `users`: id, nama, email, phone, lembaga[], role[], status
* `projects`: id, judul, jenis, ukuran, qty, deadline, lembaga, status, created_by
* `brief_assets`: id, project_id, url|gdrive_link, type
* `proofs`: id, project_id, version, file_url, notes, created_by, created_at
* `annotations`: id, proof_id, shape, comment, by_user, status
* `reviews`: id, project_id, reviewer_id, decision, note, time
* `approvals`: id, project_id, approver_id, approved_at
* `print_jobs`: id, project_id, status, finished_at
* `pickups`: id, project_id, taker_name, pic_name, note, confirmed_at
* `logs`: id, project_id, action, actor, meta, ts

---

## 22) Kebijakan Role & Keamanan Praktis

* Sign‑up bebas, role tinggi (Reviewer/Approver/Admin) **by approval Admin**.
* Semua perubahan peran tercatat di `logs`.
* File final hanya muncul setelah status **Siap Cetak (Hijau)**.
* Percetakan **hanya** melihat 2 tab (fokus kerja).

---

## 23) Analitik (opsional)

* Rata‑rata waktu: Request → Ready Review, Ready Review → Approve, Approve → Selesai.
* Revisi terbanyak per jenis media/lembaga.
* Bottleneck (SLA) by peran.

---

## 24) Roadmap Implementasi (4 minggu)

1. **M1**: Auth, Daftar, Role dasar, Home, Request Form.
2. **M2**: Detail Proyek (Canvas + Anotasi), Panel Reviewer/Approver.
3. **M3**: Panel Desainer Eksternal 2‑tab, Antrian Cetak, Pickup Log.
4. **M4**: Admin (User & Role), Rute Persetujuan, Template Checklist, Notifikasi WA/Email.

---

## 25) Microcopy (siap tempel)

* Tombol: `Upload Versi Baru`, `Siap Ditinjau`, `Minta Revisi`, `Approve`, `Setujui untuk Cetak`, `Sedang Dicetak`, `Selesai (Siap Diambil)`, `Konfirmasi Diambil`.
* Alert: “Upload sukses. Reviewer akan diberi tahu.” / “Periksa checklist pra‑cetak sebelum approve.” / “Item berpindah ke *Siap Cetak (Hijau)*.”

---

**Selesai.** Wireframe ini bisa langsung diturunkan ke desain hi‑fi atau prototipe. Jika diinginkan, kita bisa lanjut bikin versi HTML/Tailwind dari layar kunci untuk demo cepat (read‑only).
