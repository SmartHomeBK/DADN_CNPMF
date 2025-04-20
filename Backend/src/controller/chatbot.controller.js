import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config({ path: './../Backend/config/.env' });

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const chatWithAI = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content:
                        'You are a helpful assistant for a smart home IoT system. You can help users control their devices, check status, and provide information about the system.',
                },
                {
                    role: 'user',
                    content: message,
                },
            ],
            temperature: 0.7,
            max_tokens: 150,
        });

        const response = completion.choices[0].message.content;
        res.json({ response });
    } catch (error) {
        console.error('Error in chatWithAI:', error);
        res.status(500).json({ error: 'Failed to process chat request' });
    }
};
