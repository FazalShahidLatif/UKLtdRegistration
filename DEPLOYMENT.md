# Deployment Guide - UK LTD Registration (Node.js)

## Quick Deployment Commands

### Deploy to Production Server (Ubuntu/Debian)

```bash
# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 3. Install MongoDB (optional)
sudo apt install -y mongodb

# 4. Install Nginx
sudo apt install -y nginx

# 5. Clone/upload your application
cd /var/www
sudo git clone your-repo ukltd
cd ukltd

# 6. Install dependencies
npm install --production

# 7. Configure environment
sudo nano .env
# Set production values

# 8. Build assets
npm run build

# 9. Install PM2
sudo npm install -g pm2

# 10. Start application
pm2 start server.js --name ukltd-app
pm2 save
pm2 startup

# 11. Configure Nginx
sudo nano /etc/nginx/sites-available/ukltd
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name ukltdregistration.com www.ukltdregistration.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Enable site and SSL

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/ukltd /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Install SSL with Certbot
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d ukltdregistration.com -d www.ukltdregistration.com

# Auto-renew SSL
sudo certbot renew --dry-run
```

## Platform-Specific Deployments

### Vercel (Easiest - Zero Config)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production
vercel --prod
```

Create `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ]
}
```

### Heroku

```bash
heroku create ukltd-registration
heroku config:set NODE_ENV=production
heroku config:set SESSION_SECRET=$(openssl rand -hex 32)
git push heroku main
heroku open
```

Create `Procfile`:

```
web: node server.js
```

### Railway.app

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize
railway init

# Deploy
railway up
```

### DigitalOcean App Platform

1. Connect GitHub repo
2. Select Node.js environment
3. Set environment variables
4. Deploy

### AWS Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init

# Create environment
eb create production

# Deploy
eb deploy
```

## Environment Variables Checklist

Before deploying, set these:

```bash
NODE_ENV=production
PORT=3000
SITE_URL=https://ukltdregistration.com
SESSION_SECRET=[random-32-char-string]
MONGODB_URI=[your-mongodb-connection-string]
```

Generate secure session secret:

```bash
openssl rand -hex 32
```

## Post-Deployment Checklist

- [ ] SSL certificate installed
- [ ] DNS configured correctly
- [ ] Environment variables set
- [ ] Database connected (if using)
- [ ] Static assets loading
- [ ] Forms working (contact, login)
- [ ] Email notifications working
- [ ] Mobile responsive
- [ ] SEO meta tags present
- [ ] Analytics tracking
- [ ] Error pages (404, 500) working
- [ ] Sitemap accessible (/sitemap.xml)
- [ ] RSS feed accessible (/feed.xml)
- [ ] Backup strategy in place
- [ ] Monitoring configured
- [ ] Security headers enabled
- [ ] Rate limiting active

## Monitoring

```bash
# PM2 monitoring
pm2 monit

# View logs
pm2 logs ukltd-app

# Check status
pm2 status
```

## Backups

```bash
# Database backup (if using MongoDB)
mongodump --uri="$MONGODB_URI" --out=/backups/$(date +%Y%m%d)

# Automated daily backups
crontab -e
# Add: 0 2 * * * /path/to/backup-script.sh
```

## Updates

```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm install --production

# Build
npm run build

# Restart application
pm2 restart ukltd-app
```

Created by BlueOceanHub - https://blueoceanhub.info
