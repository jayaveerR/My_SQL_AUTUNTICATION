import { Request, Response } from 'express';
import axios from 'axios';

export const chatWithAI = async (req: Request, res: Response): Promise<void> => {
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: 'Messages array is required' });
      return;
    }

    const openRouterKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterKey) {
      res.status(500).json({ error: 'OpenRouter API key is missing from environment' });
      return;
    }

    // Inject our System prompt
    const systemMessage = {
      role: 'system',
      content: "You are the official EcommHub AI Shopping Assistant. You are helpful, premium, and concise. Your goal is to help users find products, understand return policies, or track orders. Always maintain a polite, high-end concierge tone. Do not write extremely long essays; keep responses brief and scannable."
    };

    const apiResponse = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openrouter/auto',
        messages: [systemMessage, ...messages],
      },
      {
        headers: {
          'Authorization': `Bearer ${openRouterKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5173',
          'X-Title': 'EcommHub Premium',
        }
      }
    );

    const reply = apiResponse.data.choices[0].message;
    res.json({ reply });
    
  } catch (error: any) {
    console.error('OpenRouter API Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'AI Assistant is currently unavailable.' });
  }
};
