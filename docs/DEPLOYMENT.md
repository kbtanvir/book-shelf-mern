# 🚀 Deployment Guide

This guide covers multiple deployment options for the MERN Book App, from free hosting to production-ready solutions.

## 📋 Prerequisites

- Node.js 18+ installed
- MongoDB database (Atlas recommended)
- Git repository
- Domain name (optional)

## 🎯 Quick Start Deployment

### Option 1: Vercel + Railway (Recommended for beginners)

**Cost**: Free tier available, ~$5/month for production

1. **Deploy Backend to Railway**
   \`\`\`bash
   cd server
   npm install -g @railway/cli
   railway login
   railway init
   railway variables set MONGODB_URI="your-mongodb-connection-string"
   railway variables set NODE_ENV="production"
   railway variables set JWT_SECRET="your-jwt-secret"
   railway up
   \`\`\`

2. **Deploy Frontend to Vercel**
   \`\`\`bash
   npm install -g vercel
   vercel login
   vercel env add NEXT_PUBLIC_API_URL
   # Enter your Railway backend URL (e.g., https://your-app.railway.app/api)
   vercel --prod
   \`\`\`

### Option 2: Docker Deployment

**Cost**: VPS hosting ~$10-20/month

\`\`\`bash
# Build and run with Docker Compose
docker-compose -f docker-compose.prod.yml up --build -d
\`\`\`

### Option 3: AWS/DigitalOcean

**Cost**: ~$50-100/month for production

See detailed AWS deployment section below.

## 🔧 Environment Variables

### Frontend (.env.local)
\`\`\`env
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
NEXT_PUBLIC_FRONTEND_URL=https://your-frontend-url.com
\`\`\`

### Backend (.env)
\`\`\`env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bookshelf
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.com
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
ALLOWED_ORIGINS=https://your-frontend-url.com,https://www.your-domain.com
\`\`\`

## 🐳 Docker Deployment

### Production Docker Setup

1. **Build Images**
   \`\`\`bash
   # Frontend
   docker build -f Dockerfile.frontend -t bookshelf-frontend .
   
   # Backend
   docker build -f server/Dockerfile -t bookshelf-backend ./server
   \`\`\`

2. **Run with Docker Compose**
   \`\`\`bash
   docker-compose -f docker-compose.prod.yml up -d
   \`\`\`

3. **Environment Setup**
   \`\`\`bash
   # Copy environment files
   cp .env.example .env.local
   cp server/.env.example server/.env
   # Edit with your production values
   \`\`\`

## ☁️ Cloud Platform Deployments

### Vercel (Frontend)

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Import your Git repository
   - Select the root directory

2. **Configure Build Settings**
   \`\`\`json
   {
     "buildCommand": "npm run build",
     "outputDirectory": ".next",
     "installCommand": "npm install"
   }
   \`\`\`

3. **Environment Variables**
   - Add `NEXT_PUBLIC_API_URL` in Vercel dashboard
   - Point to your backend URL

### Railway (Backend)

1. **Deploy from GitHub**
   \`\`\`bash
   railway login
   railway init
   railway link
   \`\`\`

2. **Set Environment Variables**
   \`\`\`bash
   railway variables set MONGODB_URI="your-connection-string"
   railway variables set NODE_ENV="production"
   railway variables set JWT_SECRET="your-secret"
   \`\`\`

3. **Deploy**
   \`\`\`bash
   railway up
   \`\`\`

### Heroku (Alternative Backend)

1. **Create Heroku App**
   \`\`\`bash
   heroku create your-app-name
   heroku config:set MONGODB_URI="your-connection-string"
   heroku config:set NODE_ENV="production"
   \`\`\`

2. **Deploy**
   \`\`\`bash
   git subtree push --prefix server heroku main
   \`\`\`

### AWS Deployment

#### EC2 + RDS Setup

1. **Launch EC2 Instance**
   - Ubuntu 22.04 LTS
   - t3.micro (free tier) or t3.small
   - Security groups: HTTP (80), HTTPS (443), SSH (22)

2. **Install Dependencies**
   \`\`\`bash
   # Connect to EC2
   ssh -i your-key.pem ubuntu@your-ec2-ip
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install Docker
   sudo apt-get update
   sudo apt-get install docker.io docker-compose
   sudo usermod -aG docker ubuntu
   \`\`\`

3. **Deploy Application**
   \`\`\`bash
   git clone https://github.com/your-username/book-shelf-mern.git
   cd book-shelf-mern
   
   # Set up environment
   cp .env.example .env.local
   cp server/.env.example server/.env
   
   # Deploy with Docker
   docker-compose -f docker-compose.prod.yml up -d
   \`\`\`

4. **Set up Nginx (Optional)**
   \`\`\`bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/bookshelf
   \`\`\`

   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
       
       location /api {
           proxy_pass http://localhost:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   \`\`\`

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)

1. **Create Cluster**
   - Go to [mongodb.com/atlas](https://mongodb.com/atlas)
   - Create free cluster
   - Choose region closest to your users

2. **Configure Access**
   - Add IP addresses (0.0.0.0/0 for development)
   - Create database user
   - Get connection string

3. **Connection String Format**
   \`\`\`
   mongodb+srv://username:password@cluster.mongodb.net/bookshelf?retryWrites=true&w=majority
   \`\`\`

### Self-hosted MongoDB

\`\`\`bash
# Install MongoDB
sudo apt-get install mongodb

# Start service
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Connection string
mongodb://localhost:27017/bookshelf
\`\`\`

## 🔒 Security Checklist

### Production Security

- [ ] Use HTTPS everywhere
- [ ] Set secure JWT secrets
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Use environment variables for secrets
- [ ] Set up database authentication
- [ ] Configure firewall rules
- [ ] Enable MongoDB authentication
- [ ] Use strong passwords
- [ ] Regular security updates

### Environment Variables Security

\`\`\`bash
# Generate secure JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Use strong MongoDB passwords
# Enable 2FA on cloud accounts
# Rotate secrets regularly
\`\`\`

## 📊 Monitoring & Logging

### Application Monitoring

1. **Add Logging**
   \`\`\`javascript
   // server/middleware/logger.js
   const winston = require('winston');
   
   const logger = winston.createLogger({
     level: 'info',
     format: winston.format.json(),
     transports: [
       new winston.transports.File({ filename: 'error.log', level: 'error' }),
       new winston.transports.File({ filename: 'combined.log' })
     ]
   });
   \`\`\`

2. **Health Check Endpoint**
   \`\`\`javascript
   // server/routes/health.js
   app.get('/health', (req, res) => {
     res.status(200).json({
       status: 'OK',
       timestamp: new Date().toISOString(),
       uptime: process.uptime()
     });
   });
   \`\`\`

### Performance Monitoring

- Use PM2 for process management
- Set up Nginx for load balancing
- Monitor database performance
- Use CDN for static assets

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   \`\`\`javascript
   // Add to server/server.js
   app.use(cors({
     origin: process.env.FRONTEND_URL,
     credentials: true
   }));
   \`\`\`

2. **Database Connection Issues**
   \`\`\`bash
   # Check MongoDB connection
   mongosh "your-connection-string"
   
   # Verify environment variables
   echo $MONGODB_URI
   \`\`\`

3. **Build Failures**
   \`\`\`bash
   # Clear cache
   npm run clean
   rm -rf node_modules package-lock.json
   npm install
   
   # Check Node.js version
   node --version  # Should be 18+
   \`\`\`

4. **Memory Issues**
   \`\`\`bash
   # Increase Node.js memory limit
   export NODE_OPTIONS="--max-old-space-size=4096"
   \`\`\`

### Deployment Verification

\`\`\`bash
# Test endpoints
curl https://your-backend-url.com/api/health
curl https://your-backend-url.com/api/books

# Check logs
docker logs container-name
railway logs
vercel logs
\`\`\`

## 📈 Scaling Considerations

### Horizontal Scaling

- Use load balancers (Nginx, AWS ALB)
- Database clustering (MongoDB replica sets)
- CDN for static assets (Cloudflare, AWS CloudFront)
- Caching layer (Redis)

### Performance Optimization

- Enable gzip compression
- Optimize images
- Use database indexing
- Implement pagination
- Add caching headers

## 💰 Cost Optimization

### Free Tier Options
- **Frontend**: Vercel (free)
- **Backend**: Railway ($5/month)
- **Database**: MongoDB Atlas (free 512MB)
- **Total**: ~$5/month

### Production Setup
- **Frontend**: Vercel Pro ($20/month)
- **Backend**: AWS EC2 t3.small ($15/month)
- **Database**: MongoDB Atlas M10 ($57/month)
- **CDN**: Cloudflare (free)
- **Total**: ~$90/month

## 🔄 CI/CD Pipeline

### GitHub Actions (Optional)

\`\`\`yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm run test
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
\`\`\`

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section
2. Review application logs
3. Verify environment variables
4. Test API endpoints manually
5. Check database connectivity

For additional help, create an issue in the GitHub repository.
