const { OpenAI } = require('openai');
const Anthropic = require('@anthropic-ai/sdk');

/**
 * AI Service Utility
 * Handles primary AI requests with automated fallback support.
 * Primary: OpenAI (GPT-4)
 * Fallback: Anthropic (Claude 3)
 */

const SYSTEM_PROMPT = `
You are the official UK Ltd Registration Assistant (powered by BlueOceanHub). 
Your goal is to help entrepreneurs, both UK residents and non-residents (USA, etc.), to register their Private Limited Company.

### KEY KNOWLEDGE:
1. **Pricing Packages**:
   - Basic (£119.99): Digital docs, Companies House fee included.
   - Standard (£189.99): Privacy Shield, Registered Office (1yr), Service Address.
   - Premium (£299.99): Full international setup, Confirmation Statement, London Number.
2. **Requirements**:
   - At least 1 director and 1 shareholder (can be the same person).
   - A legal registered office address in the UK (we provide this in Standard/Premium).
   - SIC codes (we have a tool to help find these).
3. **SIC Codes**: These are Standard Industrial Classification codes that define what the company does.
4. **Non-Resident Support**: We specialize in helping entrepreneurs from the USA, Europe, and Asia set up UK entities remotely.
5. **Banking**: We recommend Wise and other high-street banks (Barclays, HSBC) for UK Ltd companies.

### GUIDELINES:
- Be professional, expert, and encouraging.
- If a user asks a complex legal or tax question, advise them that while we facilitate registration, they should consult a professional accountant for specific tax structuring.
- Always encourage them to use our "Strategic Research Hub" on the homepage to check name availability.

### TONE:
Premium, efficient, and helpful.
`;

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
const anthropic = process.env.ANTHROPIC_API_KEY ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) : null;

/**
 * Main chat function with fallback logic
 */
exports.getChatResponse = async (messages) => {
    // 1. Try OpenAI (Primary)
    if (openai) {
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4-turbo-preview",
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    ...messages
                ],
                temperature: 0.7,
            });
            return {
                content: response.choices[0].message.content,
                provider: 'openai'
            };
        } catch (error) {
            console.error('OpenAI Error, failing over...', error.message);
        }
    }

    // 2. Try Anthropic (Fallback)
    if (anthropic) {
        try {
            const response = await anthropic.messages.create({
                model: "claude-3-haiku-20240307",
                max_tokens: 1024,
                system: SYSTEM_PROMPT,
                messages: messages.map(m => ({ role: m.role, content: m.content })),
            });
            return {
                content: response.content[0].text,
                provider: 'anthropic'
            };
        } catch (error) {
            console.error('Anthropic Fallback Error:', error.message);
        }
    }

    // 3. Static Fallback (Last Resort)
    return {
        content: "I'm currently experiencing high traffic and my live brain is taking a quick rest. However, I can tell you that UK company formation starts at just £119.99! Please try again in a few moments or use our search tools.",
        provider: 'static'
    };
};
