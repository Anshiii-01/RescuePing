#!/bin/bash
# Rescue Ping - Local Development Script
# This script starts both the backend and frontend for local development

echo "🚀 Starting Rescue Ping Development Environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Change to project directory
cd "$(dirname "$0")"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}📦 Creating Python virtual environment...${NC}"
    python3 -m venv venv
fi

# Install Python dependencies
echo -e "${YELLOW}📦 Installing Python dependencies...${NC}"
./venv/bin/pip install -q fastapi uvicorn requests python-dotenv sentry-sdk aiohttp pydantic

# Start backend server in background
echo -e "${GREEN}🔧 Starting Backend Server on http://localhost:8000${NC}"
./venv/bin/python backend/simple_backend.py &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Wait for backend to start
sleep 3

# Check if backend is running
if curl -s http://127.0.0.1:8000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is running${NC}"
else
    echo -e "${RED}❌ Backend failed to start${NC}"
fi

# Start frontend
echo -e "${GREEN}🌐 Starting Frontend on http://localhost:3000${NC}"
npm start

# Cleanup on exit
trap "echo 'Stopping backend...'; kill $BACKEND_PID 2>/dev/null" EXIT
