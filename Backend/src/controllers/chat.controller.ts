import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import mammoth from 'mammoth';
const pdfParse = require('pdf-parse');

const prisma = new PrismaClient();

// Get all chat sessions (with messages) for the current user
export const getChatHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const sessions = await prisma.chatSession.findMany({
      where: { userId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    res.json({ sessions });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const uploadChatFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const file = req.file;
    const { sessionId } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    let fileContext = '';
    const ext = file.originalname.split('.').pop()?.toLowerCase();

    if (ext === 'txt') {
      fileContext = file.buffer.toString('utf-8');
    } else if (ext === 'pdf') {
      const data = await pdfParse(file.buffer);
      fileContext = data.text;
    } else if (ext === 'docx') {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      fileContext = result.value;
    } else {
      res.status(400).json({ error: 'Unsupported file type. Use PDF, DOCX, or TXT.' });
      return;
    }

    if (fileContext.length > 20000) {
      fileContext = fileContext.substring(0, 20000) + '... [TRUNCATED]';
    }

    let activeSessionId = sessionId;
    
    if (!activeSessionId || activeSessionId === 'null') {
      const newSession = await prisma.chatSession.create({
        data: { 
          userId, 
          title: `Document: ${file.originalname}`,
          fileContext,
          fileName: file.originalname
        }
      });
      activeSessionId = newSession.id;
    } else {
      await prisma.chatSession.update({
        where: { id: activeSessionId },
        data: { fileContext, fileName: file.originalname }
      });
    }

    res.json({ sessionId: activeSessionId, fileName: file.originalname });
  } catch (error) {
    console.error('File Upload Error:', error);
    res.status(500).json({ error: 'Failed to process document' });
  }
};

export const chatWithAI = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { sessionId, content, model } = req.body;
    
    if (!content) {
      res.status(400).json({ error: 'Message content is required' });
      return;
    }

    const openRouterKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterKey) {
      res.status(500).json({ error: 'OpenRouter API key is missing' });
      return;
    }

    // 1. Resolve or Create Session
    let activeSessionId = sessionId;
    let session = null;
    
    if (!activeSessionId || activeSessionId === 'null') {
      const title = content.length > 30 ? content.substring(0, 30) + '...' : content;
      session = await prisma.chatSession.create({
        data: { userId, title }
      });
      activeSessionId = session.id;
    } else {
      session = await prisma.chatSession.findFirst({
        where: { id: activeSessionId, userId }
      });
      if (!session) {
        res.status(404).json({ error: 'Session not found' });
        return;
      }
    }

    // 2. Save User Message to DB
    await prisma.chatMessage.create({
      data: {
        sessionId: activeSessionId,
        role: 'user',
        content
      }
    });

    // 3. Fetch past context
    const recentMessages = await prisma.chatMessage.findMany({
      where: { sessionId: activeSessionId },
      orderBy: { createdAt: 'asc' },
      take: 10
    });

    let systemPrompt = "You are the official EcommHub AI Shopping Assistant. You are helpful, premium, and concise. Your goal is to help users find products, understand return policies, or track orders. Always maintain a polite, high-end concierge tone.";
    
    if (session.fileContext) {
      systemPrompt = `You are a helpful AI Assistant. The user has uploaded a document named '${session.fileName}'. Answer the user's questions based ONLY on the attached document.\n\n--- DOCUMENT CONTENT ---\n${session.fileContext}\n------------------------`;
    }

    const systemMessage = {
      role: 'system',
      content: systemPrompt
    };

    const payloadMessages = recentMessages.map((m: any) => ({
      role: m.role,
      content: m.content
    }));

    // 4. Configure SSE Headers for client
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    // Immediately send the session ID to the client
    res.write(`data: ${JSON.stringify({ type: 'session', sessionId: activeSessionId })}\n\n`);

    const selectedModel = model || 'openrouter/auto';

    // 5. Stream from OpenRouter
    const apiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'EcommHub Premium',
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [systemMessage, ...payloadMessages],
        stream: true
      })
    });

    if (!apiResponse.ok) {
      throw new Error(`OpenRouter HTTP error! status: ${apiResponse.status}`);
    }

    if (!apiResponse.body) throw new Error("No response body");

    // 6. Create Assistant Message early to protect against crashes
    const assistantMessage = await prisma.chatMessage.create({
      data: {
        sessionId: activeSessionId,
        role: 'assistant',
        content: '',
      }
    });

    const reader = apiResponse.body.getReader();
    const decoder = new TextDecoder('utf-8');
    
    let buffer = '';
    let fullResponse = '';
    let lastSaveTime = Date.now();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      
      // The last line might be incomplete, so keep it in the buffer
      buffer = lines.pop() || '';
      
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data: ')) continue;
        if (trimmed === 'data: [DONE]') continue;
        
        try {
          const data = JSON.parse(trimmed.slice(6));
          const textChunk = data.choices?.[0]?.delta?.content;
          if (textChunk) {
            fullResponse += textChunk;
            res.write(`data: ${JSON.stringify({ type: 'content', content: textChunk })}\n\n`);
          }
        } catch (e) {
          // Ignore parse errors on malformed chunks
        }
      }

      // Throttle DB updates (every 1.5s) to prevent DB lockups but ensure data retention
      if (Date.now() - lastSaveTime > 1500 && fullResponse.length > 0) {
        lastSaveTime = Date.now();
        prisma.chatMessage.update({
          where: { id: assistantMessage.id },
          data: { content: fullResponse }
        }).catch(err => console.error('Throttled save error', err));
      }
    }

    // 7. Stream finished, final save
    await prisma.chatMessage.update({
      where: { id: assistantMessage.id },
      data: { content: fullResponse }
    });

    await prisma.chatSession.update({
      where: { id: activeSessionId },
      data: { updatedAt: new Date() }
    });

    // End stream
    res.write(`data: [DONE]\n\n`);
    res.end();
    
  } catch (error: any) {
    console.error('OpenRouter Stream Error:', error.message);
    if (!res.headersSent) {
      res.status(500).json({ error: 'AI Assistant is currently unavailable.' });
    } else {
      res.write(`data: ${JSON.stringify({ type: 'error', content: 'Connection lost.' })}\n\n`);
      res.end();
    }
  }
};
