/**
 * Legacy payment module removed.
 * This repository no longer uses Paddle or any third-party payment gateway.
 */

class LegacyPaymentModule {
    constructor() {
        this.disabled = true;
    }

    createPaymentLink() {
        return null;
    }

    async generatePayLink() {
        return { success: false, error: 'Payment gateway integration removed' };
    }

    verifyWebhook() {
        return false;
    }

    async handleWebhook() {
        return null;
    }
}

module.exports = new LegacyPaymentModule();
    async handleSubscriptionUpdated(data) {
        console.log('Subscription updated:', data.subscription_id);
        
        try {
            const Subscription = require('../models/Subscription');
            await Subscription.findOneAndUpdate(
                { subscriptionId: data.subscription_id },
                {
                    status: data.status,
                    nextBillDate: data.next_bill_date ? new Date(data.next_bill_date) : null,
                    updateUrl: data.update_url,
                    cancelUrl: data.cancel_url,
                    lastUpdated: Date.now()
                },
                { upsert: true }
            );
        } catch (err) {
            console.error('Error updating subscription in DB:', err);
        }
    }
    
    /**
     * Handle subscription cancelled
     */
    async handleSubscriptionCancelled(data) {
        console.log('Subscription cancelled:', data.subscription_id);
        
        try {
            const Subscription = require('../models/Subscription');
            await Subscription.findOneAndUpdate(
                { subscriptionId: data.subscription_id },
                {
                    status: 'cancelled',
                    cancellationDate: data.cancellation_effective_date ? new Date(data.cancellation_effective_date) : new Date(),
                    lastUpdated: Date.now()
                }
            );
        } catch (err) {
            console.error('Error cancelling subscription in DB:', err);
        }
        
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
        
        try {
            const Order = require('../models/Order');
            await Order.create({
                orderId: data.order_id,
                email: data.email,
                amount: parseFloat(data.sale_gross || 0),
                currency: data.currency,
                receiptUrl: data.receipt_url,
                productId: data.subscription_plan_id || data.product_id
            });
        } catch (err) {
            console.error('Error saving successful payment to DB:', err);
        }
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
        
        try {
            const Order = require('../models/Order');
            await Order.create({
                orderId: data.order_id,
                email: data.email,
                amount: parseFloat(data.sale_gross || 0),
                currency: data.currency,
                receiptUrl: data.receipt_url,
                productId: data.product_id
            });
        } catch (err) {
            console.error('Error saving one-time payment to DB:', err);
        }
        
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
module.exports = new LegacyPaymentModule();
