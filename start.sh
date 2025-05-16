#!/usr/bin/env bash
set -e  # Exit on error

echo "Installing backend dependencies..."
pip install -r requirements.txt

echo "Installing frontend dependencies and building React app..."
cd frontend
npm install
npm run build
cd ..

echo "Starting FastAPI server..."
exec uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-8000}
