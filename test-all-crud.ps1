# Test All CRUD Operations for Designflow App
# This script tests all API endpoints to ensure frontend-backend integration works

$baseUrl = "http://localhost:5175/api"
$token = ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   DESIGNFLOW CRUD OPERATIONS TEST" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to make API calls
function Test-API {
    param(
        [string]$Method,
        [string]$Endpoint,
        [hashtable]$Body = @{},
        [string]$Description,
        [bool]$RequiresAuth = $false
    )
    
    Write-Host "Testing: $Description" -ForegroundColor Yellow
    
    $headers = @{
        "Content-Type" = "application/json"
    }
    
    if ($RequiresAuth -and $token) {
        $headers["Authorization"] = "Bearer $token"
    }
    
    try {
        $response = $null
        if ($Method -eq "GET" -or $Method -eq "DELETE") {
            if ($RequiresAuth) {
                $response = Invoke-RestMethod -Uri "$baseUrl$Endpoint" -Method $Method -Headers $headers -ErrorAction Stop
            } else {
                $response = Invoke-RestMethod -Uri "$baseUrl$Endpoint" -Method $Method -Headers @{"Content-Type" = "application/json"} -ErrorAction Stop
            }
        } else {
            $jsonBody = $Body | ConvertTo-Json
            if ($RequiresAuth) {
                $response = Invoke-RestMethod -Uri "$baseUrl$Endpoint" -Method $Method -Body $jsonBody -Headers $headers -ErrorAction Stop
            } else {
                $response = Invoke-RestMethod -Uri "$baseUrl$Endpoint" -Method $Method -Body $jsonBody -Headers @{"Content-Type" = "application/json"} -ErrorAction Stop
            }
        }
        
        Write-Host "✓ Success" -ForegroundColor Green
        if ($response) {
            return $response
        }
    }
    catch {
        Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# 1. TEST HEALTH CHECK
Write-Host "`n1. HEALTH CHECK" -ForegroundColor Magenta
Write-Host "----------------------------------------" -ForegroundColor Gray
Test-API -Method "GET" -Endpoint "/health" -Description "API Health Check"

# 2. TEST AUTHENTICATION
Write-Host "`n2. AUTHENTICATION" -ForegroundColor Magenta
Write-Host "----------------------------------------" -ForegroundColor Gray

# Login as admin
$loginData = Test-API -Method "POST" -Endpoint "/auth/login" -Body @{
    email = "admin@designflow.com"
    password = "password123"
} -Description "Login as Admin"

if ($loginData -and $loginData.token) {
    $token = $loginData.token
    Write-Host "Token acquired: $($token.Substring(0, 20))..." -ForegroundColor DarkGreen
}

# Get current user
Test-API -Method "GET" -Endpoint "/auth/me" -Description "Get Current User" -RequiresAuth $true

# 3. TEST USER CRUD
Write-Host "`n3. USER MANAGEMENT (CRUD)" -ForegroundColor Magenta
Write-Host "----------------------------------------" -ForegroundColor Gray

# Get all users
Test-API -Method "GET" -Endpoint "/users" -Description "GET all users" -RequiresAuth $true

# Get single user
Test-API -Method "GET" -Endpoint "/users/cmh5h66jj0003ae8o7ngv1990" -Description "GET single user by ID" -RequiresAuth $true

# Create new user
$newUser = Test-API -Method "POST" -Endpoint "/users" -Body @{
    name = "Test User $(Get-Random -Maximum 1000)"
    email = "test$(Get-Random -Maximum 1000)@designflow.com"
    password = "testpass123"
    role = "requester"
    phone = "081234567890"
} -Description "CREATE new user" -RequiresAuth $true

# Update user (if created)
if ($newUser -and $newUser.id) {
    Test-API -Method "PUT" -Endpoint "/users/$($newUser.id)" -Body @{
        name = "Updated Test User"
        phone = "089876543210"
    } -Description "UPDATE user" -RequiresAuth $true
    
    # Delete user
    Test-API -Method "DELETE" -Endpoint "/users/$($newUser.id)" -Description "DELETE user" -RequiresAuth $true
}

# 4. TEST PROJECT CRUD
Write-Host "`n4. PROJECT MANAGEMENT (CRUD)" -ForegroundColor Magenta
Write-Host "----------------------------------------" -ForegroundColor Gray

# Get all projects
Test-API -Method "GET" -Endpoint "/projects" -Description "GET all projects" -RequiresAuth $true

# Get single project
Test-API -Method "GET" -Endpoint "/projects/cmh5h67kf000bae8o9k1c0udo" -Description "GET single project" -RequiresAuth $true

# Create new project
$newProject = Test-API -Method "POST" -Endpoint "/projects" -Body @{
    title = "Test Project $(Get-Random -Maximum 1000)"
    description = "Test project description"
    type = "poster"
    size = "A3"
    quantity = 100
    deadline = "2025-12-31T00:00:00.000Z"
    institutionId = "cmh5h661x0000ae8o7ped1oim"
    brief = "Test brief"
} -Description "CREATE new project" -RequiresAuth $true

# Update project (if created)
if ($newProject -and $newProject.id) {
    Test-API -Method "PUT" -Endpoint "/projects/$($newProject.id)" -Body @{
        title = "Updated Test Project"
        status = "designing"
    } -Description "UPDATE project" -RequiresAuth $true
    
    # Delete project
    Test-API -Method "DELETE" -Endpoint "/projects/$($newProject.id)" -Description "DELETE project" -RequiresAuth $true
}

# 5. TEST INSTITUTION CRUD
Write-Host "`n5. INSTITUTION MANAGEMENT (CRUD)" -ForegroundColor Magenta
Write-Host "----------------------------------------" -ForegroundColor Gray

# Get all institutions
Test-API -Method "GET" -Endpoint "/institutions" -Description "GET all institutions" -RequiresAuth $true

# Get single institution
Test-API -Method "GET" -Endpoint "/institutions/cmh5h661x0000ae8o7ped1oim" -Description "GET single institution" -RequiresAuth $true

# Create new institution
$newInst = Test-API -Method "POST" -Endpoint "/institutions" -Body @{
    name = "Test Institution $(Get-Random -Maximum 1000)"
    type = "sma"
    address = "Jl. Test No. 123"
    phone = "021-12345678"
    email = "test@institution.com"
} -Description "CREATE new institution" -RequiresAuth $true

# Update institution (if created)
if ($newInst -and $newInst.id) {
    Test-API -Method "PUT" -Endpoint "/institutions/$($newInst.id)" -Body @{
        name = "Updated Test Institution"
        address = "Jl. Updated No. 456"
    } -Description "UPDATE institution" -RequiresAuth $true
    
    # Delete institution
    Test-API -Method "DELETE" -Endpoint "/institutions/$($newInst.id)" -Description "DELETE institution" -RequiresAuth $true
}

# 6. TEST NOTIFICATION CRUD
Write-Host "`n6. NOTIFICATION MANAGEMENT (CRUD)" -ForegroundColor Magenta
Write-Host "----------------------------------------" -ForegroundColor Gray

# Get all notifications
Test-API -Method "GET" -Endpoint "/notifications" -Description "GET all notifications" -RequiresAuth $true

# Get unread count
Test-API -Method "GET" -Endpoint "/notifications/unread-count" -Description "GET unread notification count" -RequiresAuth $true

# Mark as read
$notifications = Test-API -Method "GET" -Endpoint "/notifications" -Description "Get notifications for marking" -RequiresAuth $true
if ($notifications -and $notifications[0]) {
    Test-API -Method "PUT" -Endpoint "/notifications/$($notifications[0].id)/read" -Description "Mark notification as read" -RequiresAuth $true
}

# 7. TEST STATISTICS
Write-Host "`n7. STATISTICS AND ANALYTICS" -ForegroundColor Magenta
Write-Host "----------------------------------------" -ForegroundColor Gray

Test-API -Method "GET" -Endpoint "/statistics" -Description "GET dashboard statistics" -RequiresAuth $true
Test-API -Method "GET" -Endpoint "/statistics/projects-by-status" -Description "GET projects by status" -RequiresAuth $true
Test-API -Method "GET" -Endpoint "/statistics/projects-by-institution" -Description "GET projects by institution" -RequiresAuth $true

# 8. TEST ACTIVITIES
Write-Host "`n8. ACTIVITY LOG" -ForegroundColor Magenta
Write-Host "----------------------------------------" -ForegroundColor Gray

Test-API -Method "GET" -Endpoint "/activities" -Description "GET recent activities" -RequiresAuth $true
Test-API -Method "GET" -Endpoint "/activities?limit=5" -Description "GET limited activities" -RequiresAuth $true

# FINAL SUMMARY
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "         TEST COMPLETED" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✓ All CRUD operations tested" -ForegroundColor Green
Write-Host "Check above for any failures marked in red" -ForegroundColor Yellow
Write-Host ""
