# Test Script untuk Debug Blank Page Issue
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Blank Page Diagnostic Test" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

$allGood = $true
$issues = @()

# Test 1: Backend Running
Write-Host "[1/5] Testing Backend Server..." -ForegroundColor Yellow
try {
    $health = Invoke-WebRequest -Uri "http://localhost:5175/health" -Method GET -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
    if ($health.StatusCode -eq 200) {
        Write-Host "  ✓ Backend is running" -ForegroundColor Green
    }
} catch {
    Write-Host "  ✗ Backend NOT running!" -ForegroundColor Red
    $issues += "Backend server not running - Run: npm run server"
    $allGood = $false
}
Write-Host ""

# Test 2: Frontend Running
Write-Host "[2/5] Testing Frontend Server..." -ForegroundColor Yellow
try {
    $frontend = Invoke-WebRequest -Uri "http://localhost:5173" -Method GET -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
    if ($frontend.StatusCode -eq 200) {
        Write-Host "  ✓ Frontend is running" -ForegroundColor Green
        
        # Check if index.html contains root div
        if ($frontend.Content -match 'id="root"') {
            Write-Host "  ✓ Root div exists in HTML" -ForegroundColor Green
        } else {
            Write-Host "  ⚠ Root div not found in HTML" -ForegroundColor Yellow
            $issues += "HTML structure issue - Check index.html"
        }
    }
} catch {
    Write-Host "  ✗ Frontend NOT running!" -ForegroundColor Red
    $issues += "Frontend server not running - Run: npm run dev"
    $allGood = $false
}
Write-Host ""

# Test 3: API Endpoint (with auth)
if ($allGood) {
    Write-Host "[3/5] Testing API Authentication..." -ForegroundColor Yellow
    try {
        # Try to login
        $loginBody = @{
            email = "admin@designflow.com"
            password = "password123"
        } | ConvertTo-Json

        $loginResp = Invoke-RestMethod -Uri "http://localhost:5175/api/auth/login" `
            -Method POST `
            -Body $loginBody `
            -ContentType "application/json" `
            -TimeoutSec 5 `
            -ErrorAction Stop
        
        if ($loginResp.token) {
            Write-Host "  ✓ Authentication works" -ForegroundColor Green
            
            # Test projects endpoint
            $headers = @{
                "Authorization" = "Bearer $($loginResp.token)"
            }
            
            $projects = Invoke-RestMethod -Uri "http://localhost:5175/api/projects" `
                -Method GET `
                -Headers $headers `
                -TimeoutSec 5 `
                -ErrorAction Stop
            
            $projectCount = $projects.projects.Count
            if ($projectCount -gt 0) {
                Write-Host "  ✓ API returns data ($projectCount projects)" -ForegroundColor Green
            } else {
                Write-Host "  ⚠ API works but no data" -ForegroundColor Yellow
                $issues += "Database empty - Run: npm run server:seed"
            }
        }
    } catch {
        Write-Host "  ✗ Authentication failed!" -ForegroundColor Red
        Write-Host "    Error: $($_.Exception.Message)" -ForegroundColor Red
        $issues += "API authentication issue - Check backend logs"
        $allGood = $false
    }
} else {
    Write-Host "[3/5] Skipped (Backend not running)" -ForegroundColor Gray
}
Write-Host ""

# Test 4: CORS & Network
Write-Host "[4/5] Testing CORS Configuration..." -ForegroundColor Yellow
if ($allGood) {
    try {
        $headers = @{
            "Origin" = "http://localhost:5173"
        }
        $corsTest = Invoke-WebRequest -Uri "http://localhost:5175/health" `
            -Method GET `
            -Headers $headers `
            -UseBasicParsing `
            -TimeoutSec 3 `
            -ErrorAction Stop
        
        if ($corsTest.Headers["Access-Control-Allow-Origin"]) {
            Write-Host "  ✓ CORS configured correctly" -ForegroundColor Green
        } else {
            Write-Host "  ⚠ CORS headers missing" -ForegroundColor Yellow
            $issues += "CORS might block requests - Check server/index.ts"
        }
    } catch {
        Write-Host "  ⚠ Could not test CORS" -ForegroundColor Yellow
    }
} else {
    Write-Host "  Skipped (Backend not running)" -ForegroundColor Gray
}
Write-Host ""

# Test 5: React Build Check
Write-Host "[5/5] Checking React Build..." -ForegroundColor Yellow
if (Test-Path ".\node_modules\react\package.json") {
    Write-Host "  ✓ React installed" -ForegroundColor Green
} else {
    Write-Host "  ✗ React not installed!" -ForegroundColor Red
    $issues += "Dependencies missing - Run: npm install"
    $allGood = $false
}

if (Test-Path ".\src\main.tsx") {
    Write-Host "  ✓ Main entry point exists" -ForegroundColor Green
} else {
    Write-Host "  ✗ src/main.tsx missing!" -ForegroundColor Red
    $issues += "Entry point missing - Check src/ folder"
    $allGood = $false
}
Write-Host ""

# Summary
Write-Host "================================================" -ForegroundColor Cyan
if ($allGood -and $issues.Count -eq 0) {
    Write-Host "✓ ALL TESTS PASSED!" -ForegroundColor Green
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "System is working. If you still see blank page:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Open Browser Console (F12)" -ForegroundColor White
    Write-Host "2. Look for [AuthContext] logs" -ForegroundColor White
    Write-Host "3. Check for any red errors" -ForegroundColor White
    Write-Host "4. Try: Ctrl + Shift + R (hard refresh)" -ForegroundColor White
    Write-Host "5. Try: localStorage.clear() in console" -ForegroundColor White
    Write-Host "6. Visit: http://localhost:5173/diagnostic" -ForegroundColor White
} else {
    Write-Host "✗ ISSUES FOUND" -ForegroundColor Red
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Problems detected:" -ForegroundColor Yellow
    Write-Host ""
    foreach ($issue in $issues) {
        Write-Host "  • $issue" -ForegroundColor White
    }
    Write-Host ""
    Write-Host "Quick Fix Steps:" -ForegroundColor Yellow
    Write-Host ""
    
    if ($issues -match "Backend") {
        Write-Host "1. Start Backend:" -ForegroundColor White
        Write-Host "   npm run server" -ForegroundColor Cyan
        Write-Host ""
    }
    
    if ($issues -match "Frontend") {
        Write-Host "2. Start Frontend:" -ForegroundColor White
        Write-Host "   npm run dev" -ForegroundColor Cyan
        Write-Host ""
    }
    
    if ($issues -match "Database") {
        Write-Host "3. Seed Database:" -ForegroundColor White
        Write-Host "   npm run server:seed" -ForegroundColor Cyan
        Write-Host ""
    }
    
    if ($issues -match "Dependencies") {
        Write-Host "4. Install Dependencies:" -ForegroundColor White
        Write-Host "   npm install" -ForegroundColor Cyan
        Write-Host ""
    }
}

Write-Host ""
Write-Host "For detailed diagnosis, visit:" -ForegroundColor Yellow
Write-Host "http://localhost:5173/diagnostic" -ForegroundColor Cyan
Write-Host ""
Write-Host "Documentation:" -ForegroundColor Yellow
Write-Host "See WHY_BLANK_PAGE.md for detailed troubleshooting" -ForegroundColor Cyan
Write-Host ""
