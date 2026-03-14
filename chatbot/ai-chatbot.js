/**
 * AI Support Chatbot
 * Integrated with OpenAI GPT-4 and Anthropic Claude
 * 
 * @author BlueOceanHub
 */

require('dotenv').config();

class AIChatbot {
    constructor() {
        this.provider = process.env.AI_PROVIDER || 'openai'; // openai or anthropic
        this.apiKey = process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY;
        this.conversationHistory = new Map(); // Store user conversations
        
        // System prompt for UK LTD Registration assistance
        this.systemPrompt = `You are a helpful AI assistant for UK LTD Registration, a company formation service.

Your role:
- Help users understand UK company formation
- Answer questions about our packages (Basic £0, Standard £0, Premium £0)
- Explain the registration process for both UK residents and non-residents
- Provide information about required documents
- Guide users through the application process
- Handle common questions about taxation, VAT, banking, etc.

Important guidelines:
- Be friendly, professional, and concise
- If you don't know something, admit it and offer to connect them with human support
- Never make up prices or services - stick to what's mentioned
- Always encourage users to speak with our team for personalized advice
- Mention that we serve both UK residents and non-residents worldwide

Our services include:
- Company Formation (all packages)
- Registered Office Address (Standard & Premium)
- VAT Registration (Premium only)
- Banking Assistance (Premium only)
- Digital Documents (all packages)
- Email Support (all packages)
- Priority Support (Standard & Premium)

Support contacts:
- Email: support@ukltdregistration.com
- Live chat (on website)
- Response time: Usually within 2 hours`;
    }
    
    /**
     * Send message to AI and get response
     */
    async chat(userId, message) {
        try {
            // Get or create conversation history
            let history = this.conversationHistory.get(userId) || [];
            
            // Add user message to history
            history.push({ role: 'user', content: message });
            
            // Limit history to last 10 messages to avoid token limits
            if (history.length > 10) {
                history = history.slice(-10);
            }
            
            // Get AI response based on provider
            let response;
            if (this.provider === 'anthropic') {
                response = await this.chatWithClaude(history);
            } else {
                response = await this.chatWithGPT(history);
            }
            
            // Add AI response to history
            history.push({ role: 'assistant', content: response });
            
            // Save updated history
            this.conversationHistory.set(userId, history);
            
            // Clean old conversations (keep for 1 hour)
            this.cleanOldConversations();
            
            return {
                success: true,
                message: response,
                provider: this.provider
            };
            
        } catch (error) {
            console.error('Chatbot error:', error);
            return {
                success: false,
                message: "I'm having trouble connecting right now. Please try again or contact support@ukltdregistration.com",
                error: error.message
            };
        }
    }
    
    /**
     * Chat with OpenAI GPT-4
     */
    async chatWithGPT(history) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [
                    { role: 'system', content: this.systemPrompt },
                    ...history
                ],
                max_tokens: 500,
                temperature: 0.7
            })
        });
        
        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
    }
    
    /**
     * Chat with Anthropic Claude
     */
    async chatWithClaude(history) {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-sonnet-20240229',
                max_tokens: 500,
                system: this.systemPrompt,
                messages: history
            })
        });
        
        if (!response.ok) {
            throw new Error(`Anthropic API error: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data.content[0].text;
    }
    
    /**
     * Get suggested questions
     */
    getSuggestedQuestions() {
        return [
            "How do I register a UK company as a non-resident?",
            "What's included in the Premium package?",
            "Do I need a UK address to register?",
            "How long does company formation take?",
            "What documents do I need?",
            "Can you help with opening a UK bank account?",
            "What's the difference between the packages?",
            "Do I need to pay UK taxes?"
        ];
    }
    
    /**
     * Clear conversation history for a user
     */
    clearHistory(userId) {
        this.conversationHistory.delete(userId);
    }
    
    /**
     * Clean conversations older than 1 hour
     */
    cleanOldConversations() {
        const now = Date.now();
        const oneHour = 60 * 60 * 1000;
        
        for (const [userId, history] of this.conversationHistory.entries()) {
            // If no activity in last hour, remove
            if (history.timestamp && (now - history.timestamp) > oneHour) {
                this.conversationHistory.delete(userId);
            }
        }
    }
    
    /**
     * Get quick responses for common questions
     */
    getQuickResponse(question) {
        const quickResponses = {
            'pricing': "We offer three packages:\n\n• Basic (£0): Company Formation, Digital Documents, Email Support\n• Standard (£0): Everything in Basic + Registered Office + Priority Support\n• Premium (£0): Everything in Standard + VAT Registration + Banking Assistance\n\nWhich package interests you?",
            
            'how long': "Company formation typically takes 24-48 hours once we have all required documents. With our Premium package, we can expedite this process.",
            
            'non-resident': "Yes! We specialize in helping non-residents register UK companies. You don't need to visit the UK - everything can be done remotely. Would you like to know more about the process?",
            
            'documents': "For UK company formation, you'll typically need:\n• Passport copy\n• Proof of address\n• Company name (we'll check availability)\n• Details of directors and shareholders\n\nOur team will guide you through each step.",
            
            'bank account': "Our Premium package includes banking assistance where we help you open a UK business bank account. This can be challenging for non-residents, but we have established relationships with banks that work with international clients.",
        };
        
        // Simple keyword matching
        const lowerQuestion = question.toLowerCase();
        
        for (const [key, response] of Object.entries(quickResponses)) {
            if (lowerQuestion.includes(key)) {
                return response;
            }
        }
        
        return null; // No quick response found, use AI
    }
}

// Export singleton instance
module.exports = new AIChatbot();
