/**
 * Email Configuration for Hostinger SMTP
 * Supports multiple email addresses
 * 
 * @author BlueOceanHub
 */

const nodemailer = require('nodemailer');
require('dotenv').config();

// Email account configurations
const emailAccounts = {
    info: {
        email: process.env.EMAIL_INFO || 'info@ukltdregistration.com',
        name: 'UK LTD Registration',
        signature: 'Best regards,\nUK LTD Registration Team\nhttps://ukltdregistration.com'
    },
    support: {
        email: process.env.EMAIL_SUPPORT || 'support@ukltdregistration.com',
        name: 'UK LTD Support',
        signature: 'Best regards,\nUK LTD Support Team\nhttps://ukltdregistration.com'
    },
    hello: {
        email: process.env.EMAIL_HELLO || 'hello@ukltdregistration.com',
        name: 'UK LTD Registration',
        signature: 'Warm regards,\nUK LTD Registration Team\nhttps://ukltdregistration.com'
    }
};

// Create reusable transporter for Hostinger SMTP
const createTransporter = (fromAccount = 'info') => {
    const account = emailAccounts[fromAccount];
    
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.hostinger.com',
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
            user: account.email,
            pass: process.env.SMTP_PASS
        },
        tls: {
            rejectUnauthorized: false // For development only
        }
    });
};

// Send email function
const sendEmail = async (options) => {
    const {
        from = 'info',
        to,
        subject,
        text,
        html,
        attachments = []
    } = options;
    
    const account = emailAccounts[from];
    const transporter = createTransporter(from);
    
    try {
        const info = await transporter.sendMail({
            from: `"${account.name}" <${account.email}>`,
            to,
            subject,
            text,
            html,
            attachments
        });
        
        console.log('✓ Email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('✗ Email error:', error);
        return { success: false, error: error.message };
    }
};

// Verify SMTP connection
const verifyConnection = async (account = 'info') => {
    const transporter = createTransporter(account);
    
    try {
        await transporter.verify();
        console.log(`✓ SMTP connection verified for ${emailAccounts[account].email}`);
        return true;
    } catch (error) {
        console.error(`✗ SMTP connection failed for ${emailAccounts[account].email}:`, error);
        return false;
    }
};

module.exports = {
    sendEmail,
    verifyConnection,
    emailAccounts,
    createTransporter
};
