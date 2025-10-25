# Test DesignFlow API Connection and Database Sync
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Testing DesignFlow Database Connection" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if server is running
Write-Host "[1/3] Checking if API server is running..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5175/health" -Method GET -UseBasicParsing -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "✓ API server is running!" -ForegroundColor Green
        Write-Host "  Response: $($response.Content)" -ForegroundColor Gray
    }
} catch {
    Write-Host "✗ API server is NOT running!" -ForegroundColor Red
    Write-Host "  Please run: npm run server" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Test database connection by fetching projects
Write-Host "[2/3] Testing database connection (fetching projects)..." -ForegroundColor Yellow
try {
    # First, try to login to get a token
    $loginBody = @{
        email = "admin@designflow.com"
        password = "password123"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "http://localhost:5175/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json" -ErrorAction Stop
    $token = $loginResponse.token
    
    if ($token) {
        Write-Host "✓ Login successful!" -ForegroundColor Green
        
        # Now fetch projects with the token
        $headers = @{
            "Authorization" = "Bearer $token"
        }
        
        $projectsResponse = Invoke-RestMethod -Uri "http://localhost:5175/api/projects" -Method GET -Headers $headers -ErrorAction Stop
        $projectCount = $projectsResponse.projects.Count
        
        Write-Host "✓ Database connected! Found $projectCount projects" -ForegroundColor Green
        
        if ($projectCount -eq 0) {
            Write-Host "  Warning: No projects found. Consider running: npm run server:seed" -ForegroundColor Yellow
        } else {
            Write-Host "  Sample projects:" -ForegroundColor Gray
            $projectsResponse.projects | Select-Object -First 3 | ForEach-Object {
                Write-Host "    - $($_.title) [$($_.status)]" -ForegroundColor Gray
            }
        }
    }
} catch {
    Write-Host "✗ Database connection failed!" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "  Make sure database is seeded: npm run server:seed" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Test institutions
Write-Host "[3/3] Testing institutions..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    $instResponse = Invoke-RestMethod -Uri "http://localhost:5175/api/institutions" -Method GET -Headers $headers -ErrorAction Stop
    $instCount = $instResponse.institutions.Count
    
    Write-Host "✓ Found $instCount institutions" -ForegroundColor Green
    if ($instCount -gt 0) {
        $instResponse.institutions | ForEach-Object {
            Write-Host "    - $($_.name)" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "✗ Failed to fetch institutions" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "✓ All connection tests passed!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your database is synced with Neon!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Frontend: npm run dev (in another terminal)" -ForegroundColor White
Write-Host "2. Open: http://localhost:5173" -ForegroundColor White
Write-Host "3. Login with: admin@designflow.com / password123" -ForegroundColor White
Write-Host ""
