# Exit immediately if any command fails
$ErrorActionPreference = "Stop"

Write-Host "Installing backend dependencies..."
pip install -r requirements.txt

Write-Host "Installing frontend dependencies and building React app..."
Push-Location frontend
npm install
npm run build
Pop-Location

Write-Host "Starting FastAPI server..."
$port = $env:PORT
if (-not $port) {
    $port = 8000
}
uvicorn backend.main:app --host 0.0.0.0 --port $port
