# COMPLETE SETUP GUIDE
## UK LTD Registration - Hostinger Business Hosting

**All-in-One Package with:**
- ✅ Node.js Application
- ✅ Custom Email (info@, support@, hello@)
- ✅ Email Templates & Autoresponders  
- ✅ AI Support Chatbot
- ✅ Paddle Payment Gateway (Sandbox)

Created by **BlueOceanHub** - https://blueoceanhub.info

---

## 📦 WHAT'S INCLUDED

### 1. Email System
- **3 Custom Addresses:** info@, support@, hello@ukltdregistration.com
- **Hostinger SMTP Configuration**
- **Email Templates:**
  - Welcome Email (autoresponder)
  - Contact Form Autoresponder
  - Payment Confirmation
  - Marketing Campaigns
- **Template Variables:** {{name}}, {{email}}, {{message}}, etc.

### 2. AI Chatbot
- **Dual Provider Support:** OpenAI GPT-4 & Anthropic Claude
- **Context-Aware:** Remembers conversation history
- **Pre-trained** on UK company formation knowledge
- **Suggested Questions** for users
- **Quick Responses** for common queries
- **24/7 Availability**

### 3. Payment Integration
- **Paddle Gateway** (Sandbox mode for testing)
- **3 Package Tiers:** Basic, Standard, Premium
- **Webhook Handling:** Automatic payment notifications
- **Email Receipts:** Sent automatically
- **Subscription Management:** Create, update, cancel
- **One-time & Recurring** payments supported

### 4. Node.js Application
- **Express Server** with full routing
- **EJS Templates** for dynamic pages
- **Security Hardened** (Helmet, CSRF protection)
- **Performance Optimized** (Compression, caching)
- **Mobile Responsive**
- **SEO Optimized**

---

## 🚀 QUICK START (30 Minutes)

### Step 1: Upload Files to Hostinger (5 min)

**Via FTP:**
```bash
# Use FileZilla or any FTP client
Host: ftp.ukltdregistration.com
Username: [from hPanel]
Password: [from hPanel]
Port: 21

# Upload all files to: /public_html
```

**Via hPanel File Manager:**
1. Go to Files → File Manager
2. Navigate to public_html
3. Upload ukltd-hostinger.zip
4. Extract files

### Step 2: Enable Node.js (2 min)

1. hPanel → Advanced → **Node.js**
2. Click **Enable Node.js**
3. Set Node.js version: **18.x**
4. Application Root: `/public_html`
5. Application Startup File: `server.js`
6. Application Mode: **Production**
7. Click **Update**

### Step 3: Create Email Accounts (5 min)

1. hPanel → Emails → **Email Accounts**
2. Create 3 accounts:

```
info@ukltdregistration.com      [password: Strong123!]
support@ukltdregistration.com   [password: Strong123!]
hello@ukltdregistration.com     [password: Strong123!]
```

3. Note SMTP details:
   - Host: smtp.hostinger.com
   - Port: 587
   - Security: STARTTLS

### Step 4: Configure Environment (5 min)

**SSH into server:**
```bash
ssh u123456789@ukltdregistration.com -p 65002
cd ~/public_html
nano .env
```

**Paste this (UPDATE with your values):**
```env
NODE_ENV=production
PORT=3000
SITE_URL=https://ukltdregistration.com

# Email (UPDATE passwords)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=info@ukltdregistration.com
SMTP_PASS=YOUR_EMAIL_PASSWORD_HERE

EMAIL_INFO=info@ukltdregistration.com
EMAIL_SUPPORT=support@ukltdregistration.com
EMAIL_HELLO=hello@ukltdregistration.com

# Session Secret (GENERATE: openssl rand -hex 32)
SESSION_SECRET=REPLACE_WITH_RANDOM_32_CHAR_STRING

# Paddle (Get from paddle.com)
PADDLE_VENDOR_ID=YOUR_VENDOR_ID
PADDLE_API_KEY=YOUR_API_KEY
PADDLE_PUBLIC_KEY=YOUR_PUBLIC_KEY
PADDLE_ENVIRONMENT=sandbox

# AI Chatbot (Get from openai.com or anthropic.com)
AI_PROVIDER=openai
OPENAI_API_KEY=YOUR_OPENAI_KEY
ANTHROPIC_API_KEY=YOUR_ANTHROPIC_KEY
```

**Save:** Ctrl+X, Y, Enter

### Step 5: Install Dependencies (5 min)

```bash
npm install --production
```

If errors, try:
```bash
npm install --production --unsafe-perm
```

### Step 6: Start Application (2 min)

```bash
# Install PM2
npm install -g pm2

# Start app
pm2 start server.js --name ukltd-app

# Save process
pm2 save

# Auto-start on reboot
pm2 startup
# Run the command it outputs
```

### Step 7: Test Everything (5 min)

**Test Website:**
- Visit: https://ukltdregistration.com
- Should load homepage

**Test Email:**
```bash
cd ~/public_html
node -e "require('./config/email').verifyConnection('info')"
# Should show: ✓ SMTP connection verified
```

**Test Chatbot:**
- Open website
- Click chatbot icon
- Send message: "How do I register?"
- Should get AI response

**Test Payment:**
- Click on a package
- Should redirect to Paddle sandbox checkout

---

## 📧 EMAIL TEMPLATES GUIDE

### Using Templates

**Send Welcome Email:**
```javascript
const { sendEmail } = require('./config/email');
const fs = require('fs');

let html = fs.readFileSync('./emails/templates/welcome.html', 'utf8');
html = html.replace('{{firstName}}', 'John');

await sendEmail({
    from: 'hello',
    to: 'customer@example.com',
    subject: 'Welcome to UK LTD Registration!',
    html: html
});
```

**Available Templates:**
- `welcome.html` - Welcome new users
- `contact-autoresponder.html` - Contact form response
- `payment-confirmation.html` - Payment receipt
- `marketing-newsletter.html` - Marketing campaigns

**Template Variables:**
```
{{firstName}}
{{lastName}}
{{email}}
{{message}}
{{orderNumber}}
{{amount}}
{{package}}
{{unsubscribeUrl}}
```

---

## 🤖 CHATBOT CONFIGURATION

### API Keys Setup

**OpenAI (Recommended):**
1. Visit: https://platform.openai.com/api-keys
2. Create API key
3. Add to .env: `OPENAI_API_KEY=sk-...`

**Anthropic Claude:**
1. Visit: https://console.anthropic.com
2. Generate API key
3. Add to .env: `ANTHROPIC_API_KEY=sk-ant-...`

### Chatbot Features

**Pre-configured Knowledge:**
- UK company formation process
- Package details (Basic, Standard, Premium)
- Pricing information
- Document requirements
- Non-resident guidance
- Tax and VAT information

**Customization:**
Edit `chatbot/ai-chatbot.js` - update `systemPrompt`

### Frontend Integration

Add to your page:
```html
<!-- Chatbot Widget -->
<div id="chatbot-container"></div>
<script src="/js/chatbot-widget.js"></script>
```

---

## 💳 PADDLE PAYMENT SETUP

### Sandbox Testing

**Get Sandbox Credentials:**
1. Visit: https://sandbox-vendors.paddle.com
2. Sign up for free sandbox account
3. Get Vendor ID and API Key
4. Add to .env

**Test Cards:**
```
Card Number: 4242 4242 4242 4242
Expiry: Any future date
CVC: Any 3 digits
```

### Create Products

1. Login to Paddle Sandbox
2. Catalog → Products → **New Product**
3. Create 3 products:
   - **Basic Package** (£0 or any amount)
   - **Standard Package**
   - **Premium Package**
4. Copy Product IDs
5. Add to .env:
```env
PADDLE_PRODUCT_BASIC=12345
PADDLE_PRODUCT_STANDARD=12346
PADDLE_PRODUCT_PREMIUM=12347
```

### Webhook Setup

1. Paddle → Developer Tools → Webhooks
2. Add webhook URL:
```
https://ukltdregistration.com/api/paddle/webhook
```
3. Select all events
4. Save

### Switch to Production

When ready for live payments:
```env
PADDLE_ENVIRONMENT=production
PADDLE_VENDOR_ID=[production vendor id]
PADDLE_API_KEY=[production api key]
```

---

## 🔧 TROUBLESHOOTING

### Email Not Sending

**Check:**
```bash
# Test SMTP connection
node -e "require('./config/email').verifyConnection('info')"

# Check email password
nano .env  # Verify SMTP_PASS is correct

# Test send
node -e "require('./config/email').sendEmail({from:'info',to:'your@email.com',subject:'Test',text:'Hello'})"
```

### Chatbot Not Responding

**Check:**
```bash
# Verify API key
echo $OPENAI_API_KEY  # Should show your key

# Test API
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

### Payment Not Working

**Check:**
1. Verify Paddle credentials in .env
2. Check webhook is set up
3. View Paddle logs in sandbox dashboard
4. Check browser console for errors

### App Not Starting

**Check:**
```bash
# View logs
pm2 logs ukltd-app

# Check port
lsof -i:3000  # Should show node process

# Restart
pm2 restart ukltd-app
```

---

## 📊 MONITORING

### Check Status

```bash
pm2 status            # Process status
pm2 monit             # Live monitor
pm2 logs ukltd-app    # View logs
```

### Email Logs

```bash
# View email send attempts
pm2 logs ukltd-app | grep "Email"
```

### Payment Logs

```bash
# View Paddle events
pm2 logs ukltd-app | grep "Paddle"
```

---

## 🔐 SECURITY CHECKLIST

Before going live:

- [ ] Change all default passwords
- [ ] Generate strong SESSION_SECRET
- [ ] Enable HTTPS (SSL certificate)
- [ ] Set secure cookie flags
- [ ] Enable firewall in hPanel
- [ ] Set up backups
- [ ] Test email sending
- [ ] Test payment in sandbox
- [ ] Test chatbot
- [ ] Review error logs
- [ ] Set up monitoring alerts

---

## 📞 SUPPORT

**BlueOceanHub Support:**
- Website: https://blueoceanhub.info
- Email: support@blueoceanhub.info

**Hostinger Support:**
- Live Chat: 24/7 in hPanel
- Email: support@hostinger.com

**Documentation:**
- Hostinger: support.hostinger.com
- Node.js: nodejs.org/docs
- Paddle: developer.paddle.com
- OpenAI: platform.openai.com/docs

---

## ✅ SUCCESS CHECKLIST

- [ ] Files uploaded to Hostinger
- [ ] Node.js enabled
- [ ] Email accounts created
- [ ] .env configured
- [ ] Dependencies installed
- [ ] Application running
- [ ] Website accessible
- [ ] Email sending works
- [ ] Chatbot responds
- [ ] Payment redirects to Paddle
- [ ] SSL certificate active
- [ ] Backups enabled

---

**🎉 CONGRATULATIONS!**

Your UK LTD Registration platform is now live with:
✓ Custom emails
✓ AI chatbot
✓ Payment processing
✓ Professional templates
✓ Production-ready code

**Created by BlueOceanHub**
https://blueoceanhub.info
