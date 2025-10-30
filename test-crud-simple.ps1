# Simple CRUD Test for Designflow API
$baseUrl = "http://localhost:5175"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   DESIGNFLOW API CRUD TEST" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test Server Health
Write-Host "1. Testing Server Health..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method GET
    Write-Host "   ✓ Server is running: $($health.status)" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Server not responding!" -ForegroundColor Red
    exit 1
}

# Test Authentication
Write-Host "`n2. Testing Authentication..." -ForegroundColor Yellow
try {
    $loginBody = @{
        email = "admin@designflow.com"
        password = "password123"
    } | ConvertTo-Json
    
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "   ✓ Login successful" -ForegroundColor Green
    
    # Create auth header for next requests
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
} catch {
    Write-Host "   ✗ Login failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Get Current User
Write-Host "`n3. Testing Get Current User..." -ForegroundColor Yellow
try {
    $currentUser = Invoke-RestMethod -Uri "$baseUrl/api/auth/me" -Method GET -Headers $headers
    Write-Host "   ✓ Current user: $($currentUser.name) ($($currentUser.role))" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Get current user failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Users CRUD
Write-Host "`n4. Testing Users CRUD..." -ForegroundColor Yellow
try {
    # GET all users
    $users = Invoke-RestMethod -Uri "$baseUrl/api/users" -Method GET -Headers $headers
    Write-Host "   ✓ GET Users: Found $($users.Length) users" -ForegroundColor Green
    
    # CREATE user
    $newUserBody = @{
        name = "Test User"
        email = "test$(Get-Random -Maximum 1000)@designflow.com"
        password = "testpass123"
        role = "requester"
        phone = "081234567890"
    } | ConvertTo-Json
    
    $newUser = Invoke-RestMethod -Uri "$baseUrl/api/users" -Method POST -Body $newUserBody -Headers $headers
    Write-Host "   ✓ CREATE User: $($newUser.name)" -ForegroundColor Green
    
    # UPDATE user
    $updateBody = @{
        name = "Updated Test User"
    } | ConvertTo-Json
    
    $updated = Invoke-RestMethod -Uri "$baseUrl/api/users/$($newUser.id)" -Method PUT -Body $updateBody -Headers $headers
    Write-Host "   ✓ UPDATE User: Name changed" -ForegroundColor Green
    
    # DELETE user
    $null = Invoke-RestMethod -Uri "$baseUrl/api/users/$($newUser.id)" -Method DELETE -Headers $headers
    Write-Host "   ✓ DELETE User: Removed test user" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Users CRUD failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Projects CRUD
Write-Host "`n5. Testing Projects CRUD..." -ForegroundColor Yellow
try {
    # GET all projects
    $projects = Invoke-RestMethod -Uri "$baseUrl/api/projects" -Method GET -Headers $headers
    Write-Host "   ✓ GET Projects: Found $($projects.Length) projects" -ForegroundColor Green
    
    # CREATE project
    $newProjectBody = @{
        title = "Test Project $(Get-Random -Maximum 1000)"
        description = "Test description"
        type = "poster"
        size = "A3"
        quantity = 100
        deadline = "2025-12-31T00:00:00.000Z"
        institutionId = "cmh5h661x0000ae8o7ped1oim"
        brief = "Test brief"
    } | ConvertTo-Json
    
    $newProject = Invoke-RestMethod -Uri "$baseUrl/api/projects" -Method POST -Body $newProjectBody -Headers $headers
    Write-Host "   ✓ CREATE Project: $($newProject.title)" -ForegroundColor Green
    
    # UPDATE project
    $updateProjBody = @{
        status = "designing"
    } | ConvertTo-Json
    
    $updatedProj = Invoke-RestMethod -Uri "$baseUrl/api/projects/$($newProject.id)" -Method PUT -Body $updateProjBody -Headers $headers
    Write-Host "   ✓ UPDATE Project: Status changed to designing" -ForegroundColor Green
    
    # DELETE project
    $null = Invoke-RestMethod -Uri "$baseUrl/api/projects/$($newProject.id)" -Method DELETE -Headers $headers
    Write-Host "   ✓ DELETE Project: Removed test project" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Projects CRUD failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Institutions CRUD
Write-Host "`n6. Testing Institutions CRUD..." -ForegroundColor Yellow
try {
    # GET all institutions
    $institutions = Invoke-RestMethod -Uri "$baseUrl/api/institutions" -Method GET -Headers $headers
    Write-Host "   ✓ GET Institutions: Found $($institutions.Length) institutions" -ForegroundColor Green
    
    # CREATE institution
    $newInstBody = @{
        name = "Test Institution $(Get-Random -Maximum 1000)"
        type = "sma"
        address = "Jl. Test No. 123"
        phone = "021-12345678"
        email = "test@institution.com"
    } | ConvertTo-Json
    
    $newInst = Invoke-RestMethod -Uri "$baseUrl/api/institutions" -Method POST -Body $newInstBody -Headers $headers
    Write-Host "   ✓ CREATE Institution: $($newInst.name)" -ForegroundColor Green
    
    # UPDATE institution
    $updateInstBody = @{
        name = "Updated Test Institution"
    } | ConvertTo-Json
    
    $updatedInst = Invoke-RestMethod -Uri "$baseUrl/api/institutions/$($newInst.id)" -Method PUT -Body $updateInstBody -Headers $headers
    Write-Host "   ✓ UPDATE Institution: Name changed" -ForegroundColor Green
    
    # DELETE institution
    $null = Invoke-RestMethod -Uri "$baseUrl/api/institutions/$($newInst.id)" -Method DELETE -Headers $headers
    Write-Host "   ✓ DELETE Institution: Removed test institution" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Institutions CRUD failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Notifications
Write-Host "`n7. Testing Notifications..." -ForegroundColor Yellow
try {
    # GET all notifications
    $notifications = Invoke-RestMethod -Uri "$baseUrl/api/notifications" -Method GET -Headers $headers
    Write-Host "   ✓ GET Notifications: Found $($notifications.Length) notifications" -ForegroundColor Green
    
    # GET unread count
    $unreadCount = Invoke-RestMethod -Uri "$baseUrl/api/notifications/unread-count" -Method GET -Headers $headers
    Write-Host "   ✓ Unread Count: $($unreadCount.count) unread notifications" -ForegroundColor Green
    
    # Mark as read (if there are notifications)
    if ($notifications.Length -gt 0 -and $notifications[0].read -eq $false) {
        $null = Invoke-RestMethod -Uri "$baseUrl/api/notifications/$($notifications[0].id)/read" -Method PUT -Headers $headers
        Write-Host "   ✓ Mark as Read: First notification marked" -ForegroundColor Green
    }
} catch {
    Write-Host "   ✗ Notifications failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Activities
Write-Host "`n8. Testing Activities..." -ForegroundColor Yellow
try {
    $activities = Invoke-RestMethod -Uri "$baseUrl/api/activities" -Method GET -Headers $headers
    Write-Host "   ✓ GET Activities: Found $($activities.Length) activities" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Activities failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Statistics
Write-Host "`n9. Testing Statistics..." -ForegroundColor Yellow
try {
    $stats = Invoke-RestMethod -Uri "$baseUrl/api/statistics" -Method GET -Headers $headers
    Write-Host "   ✓ Statistics: Users=$($stats.users), Projects=$($stats.projects)" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Statistics failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "         TEST COMPLETED" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
