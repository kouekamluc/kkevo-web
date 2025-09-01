Write-Host "Verifying KKEVO Development Servers..." -ForegroundColor Green
Write-Host ""

# Test Django Backend
Write-Host "Testing Django Backend..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8081/api/v1/healthz/" -UseBasicParsing -TimeoutSec 3
    Write-Host "✅ Django Backend: RUNNING (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Django Backend: NOT RUNNING" -ForegroundColor Red
}

Write-Host ""

# Test Next.js Frontend
Write-Host "Testing Next.js Frontend..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 3
    Write-Host "✅ Next.js Frontend: RUNNING (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Next.js Frontend: NOT RUNNING" -ForegroundColor Red
}

Write-Host ""
Write-Host "Verification complete!" -ForegroundColor Green



