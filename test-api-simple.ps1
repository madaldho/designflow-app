# Test API DesignFlow - Simple Version
# Pastikan backend server sudah running: npm run server

$baseUrl = "http://localhost:5175"

Write-Host "========================================"
Write-Host "  DesignFlow API Test Suite"
Write-Host "========================================"
Write-Host ""

# 1. Test Health
Write-Host "[1] Testing Health Endpoint..." -ForegroundColor Cyan
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method GET
    Write-Host "    PASS - Status: $($health.status)" -ForegroundColor Green
} catch {
    Write-Host "    FAIL - $_" -ForegroundColor Red
    Write-Host "    Make sure backend is running: npm run server"
    exit 1
}

# 2. Test Login
Write-Host "[2] Testing Login..." -ForegroundColor Cyan
try {
    $loginBody = @{
        email = "admin@designflow.com"
        password = "password123"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" `
      -Method POST `
      -ContentType "application/json" `
      -Body $loginBody

    $token = $loginResponse.token
    $user = $loginResponse.user
    
    Write-Host "    PASS - Logged in as: $($user.name) ($($user.role))" -ForegroundColor Green
} catch {
    Write-Host "    FAIL - $_" -ForegroundColor Red
    Write-Host "    Make sure database is seeded: npm run server:seed"
    exit 1
}

# Setup headers
$headers = @{
    Authorization = "Bearer $token"
    "Content-Type" = "application/json"
}

# 3. Test Get Users
Write-Host "[3] Testing Get Users..." -ForegroundColor Cyan
try {
    $users = Invoke-RestMethod -Uri "$baseUrl/api/users" -Headers $headers
    Write-Host "    PASS - Found $($users.Count) users" -ForegroundColor Green
} catch {
    Write-Host "    FAIL - $_" -ForegroundColor Red
}

# 4. Test Get Projects
Write-Host "[4] Testing Get Projects..." -ForegroundColor Cyan
try {
    $projects = Invoke-RestMethod -Uri "$baseUrl/api/projects" -Headers $headers
    Write-Host "    PASS - Found $($projects.Count) projects" -ForegroundColor Green
} catch {
    Write-Host "    FAIL - $_" -ForegroundColor Red
}

# 5. Test Get Institutions
Write-Host "[5] Testing Get Institutions..." -ForegroundColor Cyan
try {
    $institutions = Invoke-RestMethod -Uri "$baseUrl/api/institutions" -Headers $headers
    Write-Host "    PASS - Found $($institutions.Count) institutions" -ForegroundColor Green
} catch {
    Write-Host "    FAIL - $_" -ForegroundColor Red
}

# 6. Test Create User
Write-Host "[6] Testing Create User (CRUD)..." -ForegroundColor Cyan
try {
    $timestamp = Get-Date -Format "yyyyMMddHHmmss"
    $newUser = @{
        name = "Test User $timestamp"
        email = "test$timestamp@example.com"
        password = "test123456"
        role = "requester"
    } | ConvertTo-Json

    $createdUser = Invoke-RestMethod -Uri "$baseUrl/api/users" `
      -Method POST `
      -Headers $headers `
      -Body $newUser

    Write-Host "    PASS - Created user: $($createdUser.name)" -ForegroundColor Green
    $testUserId = $createdUser.id
} catch {
    Write-Host "    FAIL - $_" -ForegroundColor Red
    $testUserId = $null
}

# 7. Test Update User
if ($testUserId) {
    Write-Host "[7] Testing Update User..." -ForegroundColor Cyan
    try {
        $updateData = @{
            phone = "081234567890"
        } | ConvertTo-Json

        $updatedUser = Invoke-RestMethod -Uri "$baseUrl/api/users/$testUserId" `
          -Method PUT `
          -Headers $headers `
          -Body $updateData

        Write-Host "    PASS - Updated phone: $($updatedUser.phone)" -ForegroundColor Green
    } catch {
        Write-Host "    FAIL - $_" -ForegroundColor Red
    }

    # 8. Test Delete User
    Write-Host "[8] Testing Delete User..." -ForegroundColor Cyan
    try {
        Invoke-RestMethod -Uri "$baseUrl/api/users/$testUserId" `
          -Method DELETE `
          -Headers $headers | Out-Null

        Write-Host "    PASS - User deleted successfully" -ForegroundColor Green
    } catch {
        Write-Host "    FAIL - $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================"
Write-Host "  All Tests Completed!"
Write-Host "========================================"
Write-Host ""
Write-Host "Documentation: PANDUAN_DATABASE.md"
Write-Host "API Examples: TEST_API.md"
Write-Host ""
