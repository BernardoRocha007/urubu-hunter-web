Write-Host "========================================================" -ForegroundColor Green
Write-Host "  Iniciando Urubu Hunter Ecosystem" -ForegroundColor Green
Write-Host "  - Backend:  http://localhost:5033 (.NET 10)" -ForegroundColor Cyan
Write-Host "  - Frontend: http://localhost:3000 (Next.js)" -ForegroundColor Magenta
Write-Host "========================================================" -ForegroundColor Green
Write-Host "Pressione [Ctrl + C] para encerrar AMBOS simultaneamente.`n" -ForegroundColor Yellow

Set-Location "C:\Computaria\JS\urubu-web"
npm run dev:all
