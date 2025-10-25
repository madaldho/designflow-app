# 🧪 Test API DesignFlow

## Test semua endpoint API dengan curl

### 1. Health Check
```bash
curl http://localhost:5175/health
```

**Expected Response:**
```json
{"status":"ok","timestamp":"2025-10-24T..."}
```

---

## Authentication

### 2. Login (Get Token)
```bash
curl -X POST http://localhost:5175/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@designflow.com\",\"password\":\"admin123\"}"
```

**Expected Response:**
```json
{
  "user": {
    "id": "...",
    "name": "Admin Designflow",
    "email": "admin@designflow.com",
    "role": "admin",
    ...
  },
  "token": "eyJhbGci..."
}
```

**PENTING:** Simpan token dari response untuk request selanjutnya!

### 3. Register User Baru
```bash
curl -X POST http://localhost:5175/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"test123456\",\"role\":\"requester\"}"
```

---

## Users CRUD

### 4. Get All Users
```bash
curl http://localhost:5175/api/users ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 5. Get User by ID
```bash
curl http://localhost:5175/api/users/USER_ID_HERE ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 6. Create User
```bash
curl -X POST http://localhost:5175/api/users ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Jane Doe\",\"email\":\"jane@example.com\",\"password\":\"password123\",\"role\":\"designer_internal\"}"
```

### 7. Update User
```bash
curl -X PUT http://localhost:5175/api/users/USER_ID_HERE ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Jane Smith Updated\",\"phone\":\"081234567890\"}"
```

### 8. Delete User
```bash
curl -X DELETE http://localhost:5175/api/users/USER_ID_HERE ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Projects CRUD

### 9. Get All Projects
```bash
curl http://localhost:5175/api/projects ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 10. Get Project by ID
```bash
curl http://localhost:5175/api/projects/PROJECT_ID_HERE ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 11. Create Project
```bash
curl -X POST http://localhost:5175/api/projects ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
  -H "Content-Type: application/json" ^
  -d "{\"title\":\"Banner Test\",\"description\":\"Test banner project\",\"type\":\"banner\",\"size\":\"3m x 1m\",\"quantity\":1,\"deadline\":\"2025-12-31T00:00:00.000Z\",\"institutionId\":\"INSTITUTION_ID_HERE\"}"
```

### 12. Update Project
```bash
curl -X PUT http://localhost:5175/api/projects/PROJECT_ID_HERE ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
  -H "Content-Type: application/json" ^
  -d "{\"status\":\"designing\",\"assigneeId\":\"DESIGNER_USER_ID\"}"
```

### 13. Delete Project
```bash
curl -X DELETE http://localhost:5175/api/projects/PROJECT_ID_HERE ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Institutions CRUD

### 14. Get All Institutions
```bash
curl http://localhost:5175/api/institutions ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 15. Get Institution by ID
```bash
curl http://localhost:5175/api/institutions/INSTITUTION_ID_HERE ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 16. Create Institution
```bash
curl -X POST http://localhost:5175/api/institutions ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"SMA Test\",\"type\":\"sma\",\"address\":\"Jl. Test No. 1\",\"phone\":\"021-1234567\",\"email\":\"sma@test.com\"}"
```

### 17. Update Institution
```bash
curl -X PUT http://localhost:5175/api/institutions/INSTITUTION_ID_HERE ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
  -H "Content-Type: application/json" ^
  -d "{\"phone\":\"021-9999999\"}"
```

### 18. Delete Institution
```bash
curl -X DELETE http://localhost:5175/api/institutions/INSTITUTION_ID_HERE ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Activities

### 19. Get Recent Activities
```bash
curl http://localhost:5175/api/activities ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📝 Catatan PowerShell

Jika menggunakan PowerShell, gunakan format berikut:

```powershell
# Login Example
$loginBody = @{
    email = "admin@designflow.com"
    password = "admin123"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:5175/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body $loginBody

$result = $response.Content | ConvertFrom-Json
$token = $result.token
Write-Host "Token: $token"

# Get Users Example
$headers = @{
    Authorization = "Bearer $token"
}

Invoke-WebRequest -Uri "http://localhost:5175/api/users" `
  -Headers $headers | Select-Object -ExpandProperty Content | ConvertFrom-Json
```

---

## 🎯 Quick Test Script

Simpan sebagai `test-api.ps1`:

```powershell
# Test API Script
$baseUrl = "http://localhost:5175"

# 1. Test Health
Write-Host "Testing Health Endpoint..." -ForegroundColor Green
curl "$baseUrl/health"
Write-Host "`n"

# 2. Login
Write-Host "Testing Login..." -ForegroundColor Green
$loginBody = @{
    email = "admin@designflow.com"
    password = "admin123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body $loginBody

$token = $response.token
Write-Host "Login successful! Token: $($token.Substring(0, 20))..." -ForegroundColor Yellow
Write-Host "`n"

# 3. Get Users
Write-Host "Testing Get Users..." -ForegroundColor Green
$headers = @{
    Authorization = "Bearer $token"
}

$users = Invoke-RestMethod -Uri "$baseUrl/api/users" -Headers $headers
Write-Host "Found $($users.Count) users" -ForegroundColor Yellow
$users | ForEach-Object { Write-Host "  - $($_.name) ($($_.email))" }
Write-Host "`n"

# 4. Get Projects
Write-Host "Testing Get Projects..." -ForegroundColor Green
$projects = Invoke-RestMethod -Uri "$baseUrl/api/projects" -Headers $headers
Write-Host "Found $($projects.Count) projects" -ForegroundColor Yellow
$projects | ForEach-Object { Write-Host "  - $($_.title) [$($_.status)]" }
Write-Host "`n"

# 5. Get Institutions
Write-Host "Testing Get Institutions..." -ForegroundColor Green
$institutions = Invoke-RestMethod -Uri "$baseUrl/api/institutions" -Headers $headers
Write-Host "Found $($institutions.Count) institutions" -ForegroundColor Yellow
$institutions | ForEach-Object { Write-Host "  - $($_.name) ($($_.type))" }
Write-Host "`n"

Write-Host "All tests completed! ✅" -ForegroundColor Green
```

Jalankan:
```powershell
.\test-api.ps1
```

---

## 🔐 Default Credentials

Untuk testing, gunakan credentials ini:

| Email | Password | Role |
|-------|----------|------|
| admin@designflow.com | admin123 | admin |
| designer@designflow.com | designer123 | designer_internal |
| reviewer@designflow.com | reviewer123 | reviewer |

**CATATAN:** Password ini ada di database yang sudah di-seed. Jika belum seed, jalankan:
```bash
npm run server:seed
```
