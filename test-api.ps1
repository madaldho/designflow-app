# Test API DesignFlow
# Pastikan backend server sudah running: npm run server

$baseUrl = "http://localhost:5175"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  DesignFlow API Test Suite" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Test Health
Write-Host "1. Testing Health Endpoint..." -ForegroundColor Green
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method GET
    Write-Host "   OK Status: $($health.status)" -ForegroundColor Yellow
    Write-Host "   Time: $($health.timestamp)" -ForegroundColor Yellow
} catch {
    Write-Host "   FAILED: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Pastikan backend server sudah running dengan: npm run server" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# 2. Test Login
Write-Host "2. Testing Login..." -ForegroundColor Green
try {
    $loginBody = @{
        email = "admin@designflow.com"
        password = "admin123"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" `
      -Method POST `
      -ContentType "application/json" `
      -Body $loginBody

    $token = $loginResponse.token
    $user = $loginResponse.user
    
    Write-Host "   OK Login successful!" -ForegroundColor Yellow
    Write-Host "   User: $($user.name)" -ForegroundColor Yellow
    Write-Host "   Email: $($user.email)" -ForegroundColor Yellow
    Write-Host "   Role: $($user.role)" -ForegroundColor Yellow
    Write-Host "   Token: $($token.Substring(0, 30))..." -ForegroundColor Yellow
} catch {
    Write-Host "   FAILED Login: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Pastikan database sudah di-seed dengan: npm run server:seed" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Setup headers for authenticated requests
$headers = @{
    Authorization = "Bearer $token"
    "Content-Type" = "application/json"
}

# 3. Test Get Users
Write-Host "3️⃣  Testing Get Users..." -ForegroundColor Green
try {
    $users = Invoke-RestMethod -Uri "$baseUrl/api/users" -Headers $headers
    Write-Host "   ✅ Found $($users.Count) users:" -ForegroundColor Yellow
    $users | Select-Object -First 5 | ForEach-Object { 
        Write-Host "      • $($_.name) - $($_.email) [$($_.role)]" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ❌ Failed: $_" -ForegroundColor Red
}
Write-Host ""

# 4. Test Get Projects
Write-Host "4️⃣  Testing Get Projects..." -ForegroundColor Green
try {
    $projects = Invoke-RestMethod -Uri "$baseUrl/api/projects" -Headers $headers
    Write-Host "   ✅ Found $($projects.Count) projects:" -ForegroundColor Yellow
    $projects | Select-Object -First 5 | ForEach-Object { 
        Write-Host "      • $($_.title) - Status: $($_.status)" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ❌ Failed: $_" -ForegroundColor Red
}
Write-Host ""

# 5. Test Get Institutions
Write-Host "5️⃣  Testing Get Institutions..." -ForegroundColor Green
try {
    $institutions = Invoke-RestMethod -Uri "$baseUrl/api/institutions" -Headers $headers
    Write-Host "   ✅ Found $($institutions.Count) institutions:" -ForegroundColor Yellow
    $institutions | ForEach-Object { 
        Write-Host "      • $($_.name) ($($_.type))" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ❌ Failed: $_" -ForegroundColor Red
}
Write-Host ""

# 6. Test Get Activities
Write-Host "6️⃣  Testing Get Activities..." -ForegroundColor Green
try {
    $activities = Invoke-RestMethod -Uri "$baseUrl/api/activities" -Headers $headers
    Write-Host "   ✅ Found $($activities.Count) activities" -ForegroundColor Yellow
    if ($activities.Count -gt 0) {
        $activities | Select-Object -First 3 | ForEach-Object { 
            Write-Host "      • $($_.type) - $($_.description)" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "   ❌ Failed: $_" -ForegroundColor Red
}
Write-Host ""

# 7. Test Create User (CRUD Test)
Write-Host "7️⃣  Testing Create User (CRUD)..." -ForegroundColor Green
try {
    $newUser = @{
        name = "Test User $(Get-Date -Format 'HHmmss')"
        email = "test$(Get-Date -Format 'HHmmss')@example.com"
        password = "test123456"
        role = "requester"
    } | ConvertTo-Json

    $createdUser = Invoke-RestMethod -Uri "$baseUrl/api/users" `
      -Method POST `
      -Headers $headers `
      -Body $newUser

    Write-Host "   ✅ User created successfully!" -ForegroundColor Yellow
    Write-Host "      • ID: $($createdUser.id)" -ForegroundColor Gray
    Write-Host "      • Name: $($createdUser.name)" -ForegroundColor Gray
    Write-Host "      • Email: $($createdUser.email)" -ForegroundColor Gray
    
    $testUserId = $createdUser.id
} catch {
    Write-Host "   ❌ Failed: $_" -ForegroundColor Red
    $testUserId = $null
}
Write-Host ""

# 8. Test Update User (if created)
if ($testUserId) {
    Write-Host "8️⃣  Testing Update User..." -ForegroundColor Green
    try {
        $updateData = @{
            phone = "081234567890"
        } | ConvertTo-Json

        $updatedUser = Invoke-RestMethod -Uri "$baseUrl/api/users/$testUserId" `
          -Method PUT `
          -Headers $headers `
          -Body $updateData

        Write-Host "   ✅ User updated successfully!" -ForegroundColor Yellow
        Write-Host "      • Phone: $($updatedUser.phone)" -ForegroundColor Gray
    } catch {
        Write-Host "   ❌ Failed: $_" -ForegroundColor Red
    }
    Write-Host ""

    # 9. Test Delete User
    Write-Host "9️⃣  Testing Delete User..." -ForegroundColor Green
    try {
        Invoke-RestMethod -Uri "$baseUrl/api/users/$testUserId" `
          -Method DELETE `
          -Headers $headers | Out-Null

        Write-Host "   ✅ User deleted successfully!" -ForegroundColor Yellow
    } catch {
        Write-Host "   ❌ Failed: $_" -ForegroundColor Red
    }
    Write-Host ""
}

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  All API Tests Completed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Dokumentasi lengkap: PANDUAN_DATABASE.md" -ForegroundColor Yellow
Write-Host "Test commands: TEST_API.md" -ForegroundColor Yellow
Write-Host ""
