COMPOSE := docker compose --env-file $(CURDIR)/server/.env
CONTAINER_PREFIX := book_shelf


up:
	$(COMPOSE) up -d
up.build:
	$(COMPOSE) up --build -d
down:
	$(COMPOSE) down


# MERN Book App - Development Commands
# Usage: make <command>

# Colors for output
GREEN := \033[0;32m
YELLOW := \033[1;33m
RED := \033[0;31m
NC := \033[0m # No Color

# Default target
.DEFAULT_GOAL := help

# Help command
help: ## Show this help message
	@echo "$(GREEN)MERN Book App - Available Commands$(NC)"
	@echo "=================================="
	@awk 'BEGIN {FS = ":.*##"} /^[a-zA-Z_-]+:.*##/ { printf "$(YELLOW)%-20s$(NC) %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

# Setup commands
setup: ## Install dependencies for both frontend and backend
	@echo "$(GREEN)Installing frontend dependencies...$(NC)"
	pnpm install
	@echo "$(GREEN)Installing backend dependencies...$(NC)"
	cd server && pnpm install
	@echo "$(GREEN)Setup complete!$(NC)"

setup-env: ## Copy environment files from examples
	@echo "$(GREEN)Setting up environment files...$(NC)"
	@if [ ! -f .env.local ]; then cp .env.example .env.local && echo "Created .env.local"; fi
	@if [ ! -f server/.env ]; then cp server/.env.example server/.env && echo "Created server/.env"; fi
	@echo "$(YELLOW)Please update the environment files with your actual values$(NC)"

# Development commands
dev: ## Start both frontend and backend in development mode
	@echo "$(GREEN)Starting development servers...$(NC)"
	make -j2 dev-frontend dev-backend

dev-frontend: ## Start only the frontend development server
	@echo "$(GREEN)Starting frontend on http://localhost:3000$(NC)"
	pnpm run dev

dev-backend: ## Start only the backend development server
	@echo "$(GREEN)Starting backend on http://localhost:5000$(NC)"
	cd server && pnpm run dev

# Production commands
build: ## Build the frontend for production
	@echo "$(GREEN)Building frontend for production...$(NC)"
	pnpm run build

start: ## Start both frontend and backend in production mode
	@echo "$(GREEN)Starting production servers...$(NC)"
	make -j2 start-frontend start-backend

start-frontend: ## Start only the frontend in production mode
	@echo "$(GREEN)Starting frontend in production mode...$(NC)"
	pnpm start

start-backend: ## Start only the backend in production mode
	@echo "$(GREEN)Starting backend in production mode...$(NC)"
	cd server && pnpm start

# Database commands
seed: ## Seed the database with sample data
	@echo "$(GREEN)Seeding database with sample books...$(NC)"
	cd server && pnpm run seed

seed-check: ## Check if database connection is working
	@echo "$(GREEN)Checking database connection...$(NC)"
	cd server && node -e "require('dotenv').config(); const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => { console.log('✅ Database connection successful'); process.exit(0); }).catch(err => { console.error('❌ Database connection failed:', err.message); process.exit(1); });"

# Utility commands
clean: ## Clean node_modules and build files
	@echo "$(GREEN)Cleaning project...$(NC)"
	rm -rf node_modules
	rm -rf server/node_modules
	rm -rf .next
	rm -rf server/dist
	@echo "$(GREEN)Clean complete!$(NC)"

install: setup ## Alias for setup command

logs-backend: ## Show backend logs (if running with PM2 or similar)
	@echo "$(GREEN)Backend logs:$(NC)"
	cd server && pnpm run logs 2>/dev/null || echo "$(YELLOW)Backend not running or logs not available$(NC)"

test: ## Run tests (when implemented)
	@echo "$(GREEN)Running tests...$(NC)"
	pnpm test
	cd server && pnpm test

lint: ## Run linting for both frontend and backend
	@echo "$(GREEN)Linting frontend...$(NC)"
	pnpm run lint
	@echo "$(GREEN)Linting backend...$(NC)"
	cd server && pnpm run lint 2>/dev/null || echo "$(YELLOW)Backend linting not configured$(NC)"

# Health checks
health: ## Check if both servers are running
	@echo "$(GREEN)Checking server health...$(NC)"
	@curl -s http://localhost:3000 > /dev/null && echo "✅ Frontend is running" || echo "❌ Frontend is not running"
	@curl -s http://localhost:5000/api/health > /dev/null && echo "✅ Backend is running" || echo "❌ Backend is not running"

 

# Quick start for new developers
quick-start: up setup setup-env seed ## Complete setup for new developers
	@echo "$(GREEN)=================================="
	@echo "🚀 Quick start complete!"
	@echo "=================================="
	@echo "$(YELLOW)Next steps:$(NC)"
	@echo "1. Update .env.local and server/.env with your MongoDB URI"
	@echo "2. Run 'make dev' to start development servers"
	@echo "3. Visit http://localhost:3000 to see the app"
	@echo "$(GREEN)=================================="

# Status check
status: ## Show project status and running processes
	@echo "$(GREEN)Project Status$(NC)"
	@echo "=============="
	@echo "Frontend: $$(curl -s http://localhost:3000 > /dev/null && echo '✅ Running' || echo '❌ Not running')"
	@echo "Backend:  $$(curl -s http://localhost:5000/api/health > /dev/null && echo '✅ Running' || echo '❌ Not running')"
	@echo "Database: $$(make seed-check > /dev/null 2>&1 && echo '✅ Connected' || echo '❌ Not connected')"

.PHONY: help setup setup-env dev dev-frontend dev-backend build start start-frontend start-backend seed seed-check clean install logs-backend test lint health docker-build docker-up docker-down docker-logs quick-start status
