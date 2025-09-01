# Auth0 Setup Script for KKEVO Company App
# This script will help you set up the environment files

Write-Host "Setting up Auth0 for KKEVO Company App..." -ForegroundColor Green
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "frontend") -or -not (Test-Path "backend")) {
    Write-Host "Error: Please run this script from the root directory of the project" -ForegroundColor Red
    exit 1
}

# Frontend setup
Write-Host "Setting up Frontend environment..." -ForegroundColor Yellow
if (Test-Path "frontend/env.local.template") {
    if (-not (Test-Path "frontend/.env.local")) {
        Copy-Item "frontend/env.local.template" "frontend/.env.local"
        Write-Host "Created frontend/.env.local from template" -ForegroundColor Green
    } else {
        Write-Host "frontend/.env.local already exists" -ForegroundColor Blue
    }
} else {
    Write-Host "Error: frontend/env.local.template not found" -ForegroundColor Red
}

# Backend setup
Write-Host "Setting up Backend environment..." -ForegroundColor Yellow
if (Test-Path "backend/env.template") {
    if (-not (Test-Path "backend/.env")) {
        Copy-Item "backend/env.template" "backend/.env"
        Write-Host "Created backend/.env from template" -ForegroundColor Green
    } else {
        Write-Host "backend/.env already exists" -ForegroundColor Blue
    }
} else {
    Write-Host "Error: backend/env.template not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Green
Write-Host "1. Update the Auth0 credentials in frontend/.env.local" -ForegroundColor White
Write-Host "2. Update the Auth0 credentials in backend/.env" -ForegroundColor White
Write-Host "3. Install dependencies: pip install -r backend/requirements.txt" -ForegroundColor White
Write-Host "4. Start the backend: cd backend; python manage.py runserver 8081" -ForegroundColor White
Write-Host "5. Start the frontend: cd frontend; npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "For detailed setup instructions, see: setup-auth0.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "Auth0 Setup Complete!" -ForegroundColor Green
