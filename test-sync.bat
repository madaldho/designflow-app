@echo off
echo ================================================
echo Testing DesignFlow Database Sync
echo ================================================
echo.

echo [1/4] Checking Prisma schema...
call npx prisma validate
if %errorlevel% neq 0 (
    echo ERROR: Prisma schema validation failed!
    pause
    exit /b 1
)
echo ✓ Schema valid
echo.

echo [2/4] Migrating database...
call npx prisma migrate deploy
if %errorlevel% neq 0 (
    echo ERROR: Database migration failed!
    pause
    exit /b 1
)
echo ✓ Migration complete
echo.

echo [3/4] Generating Prisma Client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ERROR: Prisma client generation failed!
    pause
    exit /b 1
)
echo ✓ Prisma client generated
echo.

echo [4/4] Seeding database with demo data...
call npm run server:seed
if %errorlevel% neq 0 (
    echo ERROR: Database seeding failed!
    pause
    exit /b 1
)
echo ✓ Database seeded
echo.

echo ================================================
echo ✓ All tests passed! Database is synced.
echo ================================================
echo.
echo Demo Accounts:
echo - Admin: admin@designflow.com / password123
echo - Requester: hasan@al-ihsan.sch.id / password123
echo - Designer: ahmad@designflow.com / password123
echo.
echo Now you can:
echo 1. Run 'npm run server' in one terminal
echo 2. Run 'npm run dev' in another terminal
echo 3. Open http://localhost:5173 and login
echo.
pause
