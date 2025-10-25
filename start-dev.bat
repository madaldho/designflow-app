@echo off
echo Starting DesignFlow Development Environment...
echo.

REM Set environment variables
set "DATABASE_URL=postgresql://neondb_owner:npg_W3x2BuqLFAGd@ep-odd-dust-a1q95qjy-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
set "JWT_SECRET=designflow_secret_key_2024_change_in_production"
set "PORT=5175"
set "NODE_ENV=development"

echo Environment variables set.
echo.
echo Starting backend server on port 5175...
echo.

npm run server
