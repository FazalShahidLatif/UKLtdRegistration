/**
 * Paddle Payment Gateway Integration
 * Sandbox Environment for Testing
 * 
 * @author BlueOceanHub
 */

require('dotenv').config();
const crypto = require('crypto');

class PaddlePayment {
    constructor() {
        this.vendorId = process.env.PADDLE_VENDOR_ID;
        this.apiKey = process.env.PADDLE_API_KEY;
        this.publicKey = process.env.PADDLE_PUBLIC_KEY;
        this.environment = process.env.PADDLE_ENVIRONMENT || 'sandbox';
        
        // Sandbox or Production URLs
        this.apiUrl = this.environment === 'sandbox' 
            ? 'https://sandbox-api.paddle.com'
            : 'https://api.paddle.com';
            
        this.checkoutUrl = this.environment === 'sandbox'
            ? 'https://sandbox-checkout.paddle.com/checkout/custom/'
            : 'https://checkout.paddle.com/checkout/custom/';
    }
    
    /**
     * Create a payment link for a package
     */
    createPaymentLink(packageData) {
        const {
            productId,
            productName,
            price,
            currency = 'GBP',
            customerEmail = '',
            customerName = '',
            passthrough = {}
        } = packageData;
        
        // Build checkout URL with parameters
        const params = new URLSearchParams({
            vendor: this.vendorId,
            product: productId,
            email: customerEmail,
            passthrough: JSON.stringify(passthrough),
            guest_email: customerEmail,
            customer_name: customerName,
            // Add success/cancel URLs
            success_url: `${process.env.SITE_URL}/payment/success`,
            cancel_url: `${process.env.SITE_URL}/payment/cancelled`
        });
        
        return `${this.checkoutUrl}?${params.toString()}`;
    }
    
    /**
     * Generate Pay Link (for one-time payments)
     */
    async generatePayLink(options) {
        const {
            productId,
            title,
            image = '',
            price,
            currency = 'GBP',
            returnUrl = `${process.env.SITE_URL}/payment/success`,
            quantity = 1,
            customerEmail = '',
            passthrough = {}
        } = options;
        
        try {
            const response = await fetch(`${this.apiUrl}/2.0/product/generate_pay_link`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    vendor_id: this.vendorId,
                    vendor_auth_code: this.apiKey,
                    title: title,
                    webhook_url: `${process.env.SITE_URL}/api/paddle/webhook`,
                    prices: `${currency}:${price}`,
                    image_url: image,
                    return_url: returnUrl,
                    quantity_variable: 0,
                    quantity: quantity,
                    customer_email: customerEmail,
                    passthrough: JSON.stringify(passthrough),
                    expires: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                return {
                    success: true,
                    url: data.response.url,
                    expires: data.response.expires
                };
            } else {
                return {
                    success: false,
                    error: data.error
                };
            }
        } catch (error) {
            console.error('Paddle Pay Link Error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    /**
     * Verify webhook signature
     */
    verifyWebhook(postData, signature) {
        // Sort the data
        const sorted = {};
        Object.keys(postData).sort().forEach(key => {
            sorted[key] = postData[key];
        });
        
        // Serialize the data
        const serialized = Object.keys(sorted)
            .filter(key => key !== 'p_signature')
            .map(key => `${key}=${sorted[key]}`)
            .join('&');
        
        // Verify signature
        const verifier = crypto.createVerify('sha1');
        verifier.update(serialized);
        
        const isValid = verifier.verify(
            this.publicKey,
            signature,
            'base64'
        );
        
        return isValid;
    }
    
    /**
     * Handle webhook events
     */
    async handleWebhook(event, data) {
        console.log(`Paddle Webhook: ${event}`);
        
        switch (event) {
            case 'subscription_created':
                await this.handleSubscriptionCreated(data);
                break;
                
            case 'subscription_updated':
                await this.handleSubscriptionUpdated(data);
                break;
                
            case 'subscription_cancelled':
                await this.handleSubscriptionCancelled(data);
                break;
                
            case 'subscription_payment_succeeded':
                await this.handlePaymentSucceeded(data);
                break;
                
            case 'subscription_payment_failed':
                await this.handlePaymentFailed(data);
                break;
                
            case 'payment_succeeded':
                await this.handleOneTimePayment(data);
                break;
                
            default:
                console.log(`Unhandled event: ${event}`);
        }
    }
    
    /**
     * Handle subscription created
     */
    async handleSubscriptionCreated(data) {
        console.log('New subscription created:', data.subscription_id);
        
        // TODO: Save to database
        // - User ID
        // - Subscription ID
        // - Plan ID
        // - Status
        // - Start date
        
        // Send confirmation email
        const { sendEmail } = require('../config/email');
        await sendEmail({
            from: 'info',
            to: data.email,
            subject: 'Subscription Confirmed - UK LTD Registration',
            html: `
                <h2>Subscription Confirmed!</h2>
                <p>Thank you for subscribing to our ${data.subscription_plan_name} plan.</p>
                <p>Subscription ID: ${data.subscription_id}</p>
                <p>Next payment: ${data.next_bill_date}</p>
            `
        });
    }
    
    /**
     * Handle subscription updated
     */
    async handleSubscriptionUpdated(data) {
        console.log('Subscription updated:', data.subscription_id);
        // TODO: Update database
    }
    
    /**
     * Handle subscription cancelled
     */
    async handleSubscriptionCancelled(data) {
        console.log('Subscription cancelled:', data.subscription_id);
        
        // Send cancellation email
        const { sendEmail } = require('../config/email');
        await sendEmail({
            from: 'support',
            to: data.email,
            subject: 'Subscription Cancelled - UK LTD Registration',
            html: `
                <h2>Subscription Cancelled</h2>
                <p>Your subscription has been cancelled.</p>
                <p>You will continue to have access until: ${data.cancellation_effective_date}</p>
                <p>We're sorry to see you go! If you have any feedback, please reply to this email.</p>
            `
        });
    }
    
    /**
     * Handle successful payment
     */
    async handlePaymentSucceeded(data) {
        console.log('Payment succeeded:', data.order_id);
        // TODO: Update database, send receipt
    }
    
    /**
     * Handle failed payment
     */
    async handlePaymentFailed(data) {
        console.log('Payment failed:', data.subscription_id);
        
        // Send payment failed email
        const { sendEmail } = require('../config/email');
        await sendEmail({
            from: 'support',
            to: data.email,
            subject: 'Payment Failed - UK LTD Registration',
            html: `
                <h2>Payment Failed</h2>
                <p>We were unable to process your payment.</p>
                <p>Please update your payment method to continue your subscription.</p>
                <p><a href="${data.update_url}">Update Payment Method</a></p>
            `
        });
    }
    
    /**
     * Handle one-time payment
     */
    async handleOneTimePayment(data) {
        console.log('One-time payment succeeded:', data.order_id);
        
        // Send purchase confirmation
        const { sendEmail } = require('../config/email');
        await sendEmail({
            from: 'info',
            to: data.email,
            subject: 'Payment Received - UK LTD Registration',
            html: `
                <h2>Payment Received!</h2>
                <p>Thank you for your payment of ${data.currency} ${data.amount}.</p>
                <p>Order ID: ${data.order_id}</p>
                <p>Receipt ID: ${data.receipt_url}</p>
                <p>Our team will be in touch shortly to proceed with your company formation.</p>
            `
        });
    }
    
    /**
     * Get subscription details
     */
    async getSubscription(subscriptionId) {
        try {
            const response = await fetch(`${this.apiUrl}/2.0/subscription/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    vendor_id: this.vendorId,
                    vendor_auth_code: this.apiKey,
                    subscription_id: subscriptionId
                })
            });
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Get Subscription Error:', error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Cancel subscription
     */
    async cancelSubscription(subscriptionId) {
        try {
            const response = await fetch(`${this.apiUrl}/2.0/subscription/users_cancel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    vendor_id: this.vendorId,
                    vendor_auth_code: this.apiKey,
                    subscription_id: subscriptionId
                })
            });
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Cancel Subscription Error:', error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Get payment packages configuration
     */
    getPackages() {
        return [
            {
                id: 'basic',
                name: 'Basic',
                productId: process.env.PADDLE_PRODUCT_BASIC || '12345',
                price: 0,
                currency: 'GBP',
                features: [
                    'Company Formation',
                    'Digital Documents',
                    'Email Support'
                ]
            },
            {
                id: 'standard',
                name: 'Standard',
                productId: process.env.PADDLE_PRODUCT_STANDARD || '12346',
                price: 0,
                currency: 'GBP',
                features: [
                    'Everything in Basic',
                    'Registered Office',
                    'Priority Support'
                ],
                popular: true
            },
            {
                id: 'premium',
                name: 'Premium',
                productId: process.env.PADDLE_PRODUCT_PREMIUM || '12347',
                price: 0,
                currency: 'GBP',
                features: [
                    'Everything in Standard',
                    'VAT Registration',
                    'Banking Assistance'
                ]
            }
        ];
    }
}

// Export singleton instance
module.exports = new PaddlePayment();
