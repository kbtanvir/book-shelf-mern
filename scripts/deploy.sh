#!/bin/bash

# MERN Book App Deployment Script
# Usage: ./scripts/deploy.sh [platform]
# Platforms: vercel, railway, docker, aws, local

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    local deps=("$@")
    for dep in "${deps[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            log_error "$dep is not installed. Please install it first."
            exit 1
        fi
    done
}

# Setup environment files
setup_env() {
    log_info "Setting up environment files..."
    
    if [ ! -f ".env.local" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env.local
            log_warning "Created .env.local from .env.example. Please update with your values."
        else
            log_error ".env.example not found. Please create environment files manually."
            exit 1
        fi
    fi
    
    if [ ! -f "server/.env" ]; then
        if [ -f "server/.env.example" ]; then
            cp server/.env.example server/.env
            log_warning "Created server/.env from server/.env.example. Please update with your values."
        else
            log_error "server/.env.example not found. Please create environment files manually."
            exit 1
        fi
    fi
}

# Deploy to Vercel
deploy_vercel() {
    log_info "Deploying to Vercel..."
    check_dependencies "vercel"
    
    # Check if user is logged in
    if ! vercel whoami &> /dev/null; then
        log_info "Please log in to Vercel..."
        vercel login
    fi
    
    # Deploy frontend
    log_info "Deploying frontend to Vercel..."
    vercel --prod
    
    log_success "Frontend deployed to Vercel!"
    log_warning "Don't forget to deploy your backend to Railway or another platform."
}

# Deploy to Railway
deploy_railway() {
    log_info "Deploying backend to Railway..."
    check_dependencies "railway"
    
    # Check if user is logged in
    if ! railway whoami &> /dev/null; then
        log_info "Please log in to Railway..."
        railway login
    fi
    
    # Deploy backend
    cd server
    
    # Initialize if not already done
    if [ ! -f "railway.json" ]; then
        log_info "Initializing Railway project..."
        railway init
    fi
    
    # Set environment variables
    log_info "Setting environment variables..."
    if [ -f ".env" ]; then
        while IFS='=' read -r key value; do
            if [[ ! $key =~ ^# ]] && [[ $key ]]; then
                railway variables set "$key=$value"
            fi
        done &lt; .env
    fi
    
    # Deploy
    log_info "Deploying to Railway..."
    railway up
    
    cd ..
    log_success "Backend deployed to Railway!"
}

# Deploy with Docker
deploy_docker() {
    log_info "Deploying with Docker..."
    check_dependencies "docker" "docker-compose"
    
    setup_env
    
    # Build and deploy
    log_info "Building and starting containers..."
    docker-compose -f docker-compose.prod.yml down
    docker-compose -f docker-compose.prod.yml up --build -d
    
    # Wait for services to start
    log_info "Waiting for services to start..."
    sleep 10
    
    # Check if services are running
    if docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
        log_success "Application deployed with Docker!"
        log_info "Frontend: http://localhost:3000"
        log_info "Backend: http://localhost:5000"
    else
        log_error "Failed to start services. Check logs with: docker-compose -f docker-compose.prod.yml logs"
        exit 1
    fi
}

# Deploy to AWS
deploy_aws() {
    log_info "Deploying to AWS..."
    check_dependencies "aws"
    
    log_warning "AWS deployment requires manual setup of EC2, RDS, and other services."
    log_info "Please refer to the deployment documentation for detailed AWS setup instructions."
    log_info "You can use the Docker deployment method on your EC2 instance."
    
    # Optionally, you could add AWS CLI commands here for automated deployment
    # This would require more complex setup and configuration
}

# Local production deployment
deploy_local() {
    log_info "Setting up local production environment..."
    
    setup_env
    
    # Install dependencies
    log_info "Installing dependencies..."
    npm install
    cd server && npm install && cd ..
    
    # Build frontend
    log_info "Building frontend..."
    npm run build
    
    # Start services
    log_info "Starting services..."
    
    # Start backend in background
    cd server
    npm start &
    BACKEND_PID=$!
    cd ..
    
    # Start frontend
    npm start &
    FRONTEND_PID=$!
    
    log_success "Local production environment started!"
    log_info "Frontend: http://localhost:3000"
    log_info "Backend: http://localhost:5000"
    log_info "Press Ctrl+C to stop services"
    
    # Wait for user interrupt
    trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
    wait
}

# Health check
health_check() {
    local url=$1
    log_info "Checking health of $url..."
    
    if curl -f -s "$url/health" > /dev/null; then
        log_success "Service is healthy!"
        return 0
    else
        log_error "Service health check failed!"
        return 1
    fi
}

# Main deployment function
main() {
    local platform=${1:-"help"}
    
    case $platform in
        "vercel")
            deploy_vercel
            ;;
        "railway")
            deploy_railway
            ;;
        "docker")
            deploy_docker
            ;;
        "aws")
            deploy_aws
            ;;
        "local")
            deploy_local
            ;;
        "full")
            log_info "Deploying full stack (Railway + Vercel)..."
            deploy_railway
            deploy_vercel
            ;;
        "help"|*)
            echo "MERN Book App Deployment Script"
            echo ""
            echo "Usage: $0 [platform]"
            echo ""
            echo "Available platforms:"
            echo "  vercel    - Deploy frontend to Vercel"
            echo "  railway   - Deploy backend to Railway"
            echo "  docker    - Deploy with Docker Compose"
            echo "  aws       - Deploy to AWS (manual setup required)"
            echo "  local     - Run local production environment"
            echo "  full      - Deploy both backend (Railway) and frontend (Vercel)"
            echo "  help      - Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0 vercel     # Deploy frontend only"
            echo "  $0 railway    # Deploy backend only"
            echo "  $0 full       # Deploy both frontend and backend"
            echo "  $0 docker     # Deploy with Docker"
            ;;
    esac
}

# Run main function with all arguments
main "$@"
