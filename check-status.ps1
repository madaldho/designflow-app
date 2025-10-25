Write-Host "================================================" -ForegroundColor Cyan
Write-Host "DesignFlow System Status Check" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

$allGood = $true

# Check 1: Backend Server
Write-Host "[1/3] Checking Backend Server..." -ForegroundColor Yellow
try {
    $health = Invoke-WebRequest -Uri "http://localhost:5175/health" -Method GET -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    if ($health.StatusCode -eq 200) {
        Write-Host "  ✓ Backend server is RUNNING on port 5175" -ForegroundColor Green
    }
} catch {
    Write-Host "  ✗ Backend server is NOT running!" -ForegroundColor Red
    Write-Host "  → Start with: npm run server" -ForegroundColor Yellow
    $allGood = $false
}
Write-Host ""

# Check 2: Database Connection & Data
Write-Host "[2/3] Checking Database..." -ForegroundColor Yellow
if ($allGood) {
    try {
        # Try to login
        $loginData = @{ email = "admin@designflow.com"; password = "password123" } | ConvertTo-Json
        $loginResp = Invoke-RestMethod -Uri "http://localhost:5175/api/auth/login" -Method POST -Body $loginData -ContentType "application/json" -ErrorAction Stop
        
        if ($loginResp.token) {
            Write-Host "  ✓ Database is connected" -ForegroundColor Green
            Write-Host "  ✓ Test account exists (admin@designflow.com)" -ForegroundColor Green
            
            # Check projects
            $headers = @{ "Authorization" = "Bearer $($loginResp.token)" }
            $projects = Invoke-RestMethod -Uri "http://localhost:5175/api/projects" -Method GET -Headers $headers -ErrorAction Stop
            
            $projectCount = $projects.projects.Count
            if ($projectCount -gt 0) {
                Write-Host "  ✓ Found $projectCount projects in database" -ForegroundColor Green
            } else {
                Write-Host "  ⚠ No projects found in database" -ForegroundColor Yellow
                Write-Host "  → Run: npm run server:seed" -ForegroundColor Yellow
                $allGood = $false
            }
        }
    } catch {
        Write-Host "  ✗ Database connection failed!" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "  → Run these commands:" -ForegroundColor Yellow
        Write-Host "     npx prisma migrate deploy" -ForegroundColor White
        Write-Host "     npm run server:seed" -ForegroundColor White
        $allGood = $false
    }
} else {
    Write-Host "  ⚠ Skipped (backend not running)" -ForegroundColor Yellow
}
Write-Host ""

# Check 3: Frontend
Write-Host "[3/3] Checking Frontend..." -ForegroundColor Yellow
try {
    $frontend = Invoke-WebRequest -Uri "http://localhost:5173" -Method GET -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    if ($frontend.StatusCode -eq 200) {
        Write-Host "  ✓ Frontend is RUNNING on port 5173" -ForegroundColor Green
    }
} catch {
    Write-Host "  ⚠ Frontend is NOT running" -ForegroundColor Yellow
    Write-Host "  → Start with: npm run dev" -ForegroundColor Yellow
}
Write-Host ""

# Summary
Write-Host "================================================" -ForegroundColor Cyan
if ($allGood) {
    Write-Host "✓ SYSTEM READY!" -ForegroundColor Green
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Access your app at: http://localhost:5173" -ForegroundColor Green
    Write-Host "Login with: admin@designflow.com / password123" -ForegroundColor Green
} else {
    Write-Host "✗ SYSTEM NOT READY" -ForegroundColor Red
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Quick Fix Steps:" -ForegroundColor Yellow
    Write-Host "1. Open Terminal 1, run: npm run server" -ForegroundColor White
    Write-Host "2. If database empty, run: npm run server:seed" -ForegroundColor White
    Write-Host "3. Open Terminal 2, run: npm run dev" -ForegroundColor White
    Write-Host "4. Run this check again: powershell -ExecutionPolicy Bypass -File check-status.ps1" -ForegroundColor White
}
Write-Host ""
