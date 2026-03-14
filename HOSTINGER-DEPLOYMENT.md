# Hostinger Business Hosting Deployment Guide
## UK LTD Registration - Node.js Application

**Optimized for Hostinger Business Hosting**  
**Created by BlueOceanHub**

---

## 📋 Prerequisites

### What You Need:
1. **Hostinger Business Hosting** account
2. **SSH Access** enabled (contact Hostinger support if not enabled)
3. **Custom Email Accounts** (info@, support@, hello@ukltdregistration.com)
4. **Domain** pointed to Hostinger nameservers
5. **Node.js** selector in hPanel (Hostinger control panel)

---

## 🚀 Step-by-Step Deployment

### Step 1: Enable Node.js in hPanel

1. Log into your Hostinger hPanel
2. Go to **Advanced** → **Node.js**
3. **Enable Node.js** for your domain
4. Select **Node.js version 18.x** or higher
5. Set **Application Mode** to Production
6. Set **Application Root** to `/public_html`
7. Set **Application Startup File** to `server.js`

### Step 2: SSH into Your Server

```bash
# Get SSH credentials from Hostinger hPanel
# Advanced → SSH Access

# Connect via terminal
ssh u123456789@yourdomain.com -p 65002

# Or use Hostinger's browser-based SSH
```

### Step 3: Prepare Directory

```bash
# Navigate to your web root
cd ~/public_html

# Backup existing files (if any)
mkdir -p ~/backups
mv * ~/backups/ 2>/dev/null

# Download and extract application
# (Upload via FTP or use wget)
wget https://yourserver.com/ukltd-nodejs-complete.tar.gz
tar -xzf ukltd-nodejs-complete.tar.gz
mv ukltd-nodejs/* .
mv ukltd-nodejs/.* . 2>/dev/null
rm -rf ukltd-nodejs ukltd-nodejs-complete.tar.gz
```

### Step 4: Install Dependencies

```bash
# Install packages
npm install --production

# If you get permission errors:
npm install --production --unsafe-perm

# Build CSS (if using Tailwind)
npm run build
```

### Step 5: Configure Environment

```bash
# Create .env file
nano .env
```

**Paste this configuration:**

```env
# Server Configuration
NODE_ENV=production
PORT=3000
SITE_URL=https://ukltdregistration.com

# Database (Optional - use Hostinger MySQL or MongoDB)
MONGODB_URI=

# Session Secret (Generate with: openssl rand -hex 32)
SESSION_SECRET=your-secure-random-32-char-string-here

# Email Configuration (Hostinger SMTP)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=info@ukltdregistration.com
SMTP_PASS=your-email-password-here

# Email Addresses
EMAIL_INFO=info@ukltdregistration.com
EMAIL_SUPPORT=support@ukltdregistration.com
EMAIL_HELLO=hello@ukltdregistration.com

# Admin
ADMIN_EMAIL=info@ukltdregistration.com
SITE_NAME=UK Ltd Registration

# Paddle Payment Gateway (Sandbox)
PADDLE_VENDOR_ID=your-vendor-id
PADDLE_API_KEY=your-api-key
PADDLE_PUBLIC_KEY=your-public-key
PADDLE_ENVIRONMENT=sandbox

# AI Chatbot
OPENAI_API_KEY=your-openai-key-here
ANTHROPIC_API_KEY=your-anthropic-key-here

# Security
RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=
```

**Save and exit:** Ctrl+X, Y, Enter

### Step 6: Configure Node.js Application

In Hostinger hPanel:

1. Go to **Advanced** → **Node.js**
2. Click **Edit** on your application
3. Set **Application Startup File:** `server.js`
4. Set **Application Mode:** Production
5. Click **Update**

### Step 7: Start Application

```bash
# Start with npm
npm start

# Or use PM2 (if available on Hostinger)
npm install -g pm2
pm2 start server.js --name ukltd
pm2 save
```

### Step 8: Configure .htaccess

```bash
nano .htaccess
```

**Paste this:**

```apache
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Proxy to Node.js
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]

# Security Headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
    Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>

# Caching
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

---

## 📧 Email Setup (Hostinger)

### Create Email Accounts

1. Go to hPanel → **Emails** → **Email Accounts**
2. Create these accounts:
   - `info@ukltdregistration.com`
   - `support@ukltdregistration.com`
   - `hello@ukltdregistration.com`

3. Set strong passwords
4. Note down SMTP settings:
   - **Host:** smtp.hostinger.com
   - **Port:** 587
   - **Security:** STARTTLS
   - **Username:** full email address
   - **Password:** your email password

### Test Email Configuration

```bash
# Create test script
nano test-email.js
```

```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 587,
    secure: false,
    auth: {
        user: 'info@ukltdregistration.com',
        pass: 'your-password-here'
    }
});

transporter.sendMail({
    from: '"UK LTD Registration" <info@ukltdregistration.com>',
    to: 'your-test-email@gmail.com',
    subject: 'Test Email',
    text: 'This is a test email from Hostinger SMTP'
}, (err, info) => {
    if (err) {
        console.error('Error:', err);
    } else {
        console.log('Success:', info.messageId);
    }
});
```

```bash
# Run test
node test-email.js
```

---

## 🗄️ Database Setup (Optional)

### Option 1: Hostinger MySQL

```bash
# In hPanel → Databases → MySQL Databases
# Create new database: ukltd_db
# Create user and assign permissions

# Update .env
DATABASE_TYPE=mysql
DATABASE_HOST=localhost
DATABASE_NAME=ukltd_db
DATABASE_USER=ukltd_user
DATABASE_PASS=your-password
```

### Option 2: MongoDB Atlas (Free Tier)

```bash
# 1. Create free cluster at mongodb.com/atlas
# 2. Get connection string
# 3. Update .env

MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ukltd
```

---

## 🔄 Auto-Start on Server Reboot

### Using PM2 (Recommended)

```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start server.js --name ukltd-app

# Save PM2 process list
pm2 save

# Generate startup script
pm2 startup

# Copy and run the command it outputs
```

### Using Hostinger Node.js Manager

The Node.js application in hPanel **auto-starts on reboot** by default.

---

## 🛠️ Troubleshooting

### Application Not Starting

```bash
# Check logs
pm2 logs ukltd-app

# Or check Hostinger error logs
tail -f ~/logs/error.log
```

### Port Already in Use

```bash
# Find process using port 3000
lsof -ti:3000

# Kill process
kill -9 $(lsof -ti:3000)

# Restart app
pm2 restart ukltd-app
```

### Permission Issues

```bash
# Fix permissions
chmod -R 755 ~/public_html
chown -R $(whoami):$(whoami) ~/public_html
```

### Email Not Sending

1. Verify email account exists in hPanel
2. Check SMTP credentials in .env
3. Ensure port 587 is not blocked
4. Check spam folder
5. View logs: `pm2 logs`

---

## 📊 Monitoring

### Check Application Status

```bash
pm2 status
pm2 monit
pm2 logs ukltd-app --lines 100
```

### Hostinger hPanel Monitoring

1. **Advanced** → **Node.js** → View application status
2. **Metrics** → Check resource usage
3. **Logs** → View error logs

---

## 🔒 Security Checklist

- [x] HTTPS enabled (SSL certificate)
- [x] Strong SESSION_SECRET set
- [x] Email passwords secured
- [x] Database credentials protected
- [x] .env file permissions: `chmod 600 .env`
- [x] Firewall configured
- [x] Regular backups enabled
- [x] Fail2ban installed (if available)
- [x] Security headers in .htaccess

---

## 🔄 Updates

```bash
# SSH into server
cd ~/public_html

# Pull latest changes (if using git)
git pull origin main

# Or upload new files via FTP

# Install dependencies
npm install --production

# Build assets
npm run build

# Restart application
pm2 restart ukltd-app

# Or restart via hPanel Node.js manager
```

---

## 📞 Hostinger Support

If you encounter issues:

1. **Live Chat:** Available 24/7 in hPanel
2. **Email:** support@hostinger.com
3. **Knowledge Base:** support.hostinger.com
4. **Video Tutorials:** YouTube.com/@HostingerAcademy

---

## 🎯 Performance Optimization

### Enable Caching

```bash
# Already configured in .htaccess above
# Verify it's working:
curl -I https://ukltdregistration.com
# Look for: Cache-Control, Expires headers
```

### Enable Compression

```bash
# Already configured in .htaccess
# Test compression:
curl -H "Accept-Encoding: gzip" -I https://ukltdregistration.com
```

### Use Hostinger CDN

1. Go to hPanel → **Website** → **Performance**
2. Enable **Hostinger CDN**
3. Configure for static assets

---

## 💾 Backup Strategy

### Automated Backups

Hostinger Business includes **automatic daily backups**.

Access: hPanel → **Files** → **Backups**

### Manual Backup

```bash
# Create backup
cd ~
tar -czf backup-$(date +%Y%m%d).tar.gz public_html

# Download via FTP or:
# hPanel → File Manager → Download
```

### Database Backup

```bash
# MySQL backup (if using)
mysqldump -u username -p database_name > backup.sql

# Restore
mysql -u username -p database_name < backup.sql
```

---

## ✅ Final Checklist

- [ ] Node.js enabled in hPanel
- [ ] Application deployed to ~/public_html
- [ ] Dependencies installed
- [ ] .env configured with correct values
- [ ] Email accounts created
- [ ] SMTP tested
- [ ] Database connected (if using)
- [ ] SSL certificate active
- [ ] .htaccess configured
- [ ] Application running (pm2 or hPanel)
- [ ] Domain pointing to Hostinger
- [ ] Test all pages working
- [ ] Test email sending
- [ ] Test payment gateway (sandbox)
- [ ] Test chatbot
- [ ] Backups enabled

---

**Created by BlueOceanHub**  
https://blueoceanhub.info

For technical support: support@blueoceanhub.info
