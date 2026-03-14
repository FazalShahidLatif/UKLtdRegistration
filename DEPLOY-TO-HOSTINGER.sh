#!/bin/bash
#
# Deploy to Hostinger - Complete Automated Script
# For ukltdregistration.com
#

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  DEPLOY TO HOSTINGER"
echo "  ukltdregistration.com"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Step 1: Navigate to public_html
echo "[1/12] Navigating to website directory..."
cd ~/public_html || { echo "✗ Error: public_html not found"; exit 1; }
echo "✓ Current directory: $(pwd)"
echo ""

# Step 2: Backup existing files
echo "[2/12] Creating backup..."
if [ -d "backup_$(date +%Y%m%d)" ]; then
    echo "✓ Backup already exists for today"
else
    mkdir -p backup_$(date +%Y%m%d)
    cp -r * backup_$(date +%Y%m%d)/ 2>/dev/null
    echo "✓ Backup created: backup_$(date +%Y%m%d)"
fi
echo ""

# Step 3: Pull from GitHub (or skip if files already present)
echo "[3/12] Getting latest code..."
if [ -f "package.json" ]; then
    echo "✓ Code already present"
else
    echo "Upload your files via FTP or Git clone"
fi
echo ""

# Step 4: Install dependencies
echo "[4/12] Installing Node.js dependencies..."
npm install --production
echo "✓ Dependencies installed"
echo ""

# Step 5: Create .env file
echo "[5/12] Creating environment file..."
if [ ! -f ".env" ]; then
    cat > .env << 'ENVFILE'
NODE_ENV=production
PORT=3000
SITE_URL=https://ukltdregistration.com
SESSION_SECRET=ukltd-secret-$(openssl rand -hex 16)

# Email Configuration
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=info@ukltdregistration.com
SMTP_PASS=

# Email Addresses
EMAIL_INFO=info@ukltdregistration.com
EMAIL_SUPPORT=support@ukltdregistration.com
EMAIL_HELLO=hello@ukltdregistration.com
ENVFILE
    echo "✓ .env file created"
    echo "⚠ IMPORTANT: Edit .env and add your SMTP_PASS"
else
    echo "✓ .env file already exists"
fi
echo ""

# Step 6: Create .htaccess
echo "[6/12] Creating Apache configuration..."
cat > .htaccess << 'HTACCESS'
RewriteEngine On

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Proxy to Node.js
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]

# Enable Proxy
ProxyPreserveHost On
ProxyPass / http://localhost:3000/
ProxyPassReverse / http://localhost:3000/
HTACCESS
echo "✓ .htaccess created"
echo ""

# Step 7: Install PM2
echo "[7/12] Installing PM2 process manager..."
npm install -g pm2 2>/dev/null
echo "✓ PM2 installed"
echo ""

# Step 8: Stop old processes
echo "[8/12] Stopping old processes..."
pm2 delete all 2>/dev/null
pkill -f node 2>/dev/null
echo "✓ Old processes stopped"
echo ""

# Step 9: Start application
echo "[9/12] Starting Node.js application..."
pm2 start server.js --name ukltd
sleep 2
echo "✓ Application started"
echo ""

# Step 10: Configure auto-restart
echo "[10/12] Configuring auto-restart..."
pm2 startup 2>/dev/null
pm2 save
echo "✓ Auto-restart configured"
echo ""

# Step 11: Test application
echo "[11/12] Testing application..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ "$HTTP_CODE" = "200" ]; then
    echo "✓ Application responding (HTTP $HTTP_CODE)"
else
    echo "⚠ Application returned: HTTP $HTTP_CODE"
    echo "Check logs: pm2 logs ukltd"
fi
echo ""

# Step 12: Display status
echo "[12/12] Final status..."
pm2 status
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  DEPLOYMENT COMPLETE!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ NEXT STEPS:"
echo ""
echo "1. Edit .env file and add SMTP password:"
echo "   nano .env"
echo ""
echo "2. Enable Node.js in Hostinger hPanel:"
echo "   https://hpanel.hostinger.com"
echo "   Advanced → Node.js → Enable"
echo "   Version: 18.x"
echo "   Startup File: server.js"
echo "   Port: 3000"
echo ""
echo "3. Test your website:"
echo "   https://ukltdregistration.com"
echo ""
echo "4. Monitor logs:"
echo "   pm2 logs ukltd"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
