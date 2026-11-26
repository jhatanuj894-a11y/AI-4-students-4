import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Server-side Gemini client — API key stays strictly on the server
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [], classLevel = 10, language = 'auto', memories = [], imageBase64 } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ error: 'Gemini API key is not configured on the server.' });
    }

    const memoryContext = memories.length
      ? `Private student context (do not expose to others): ${memories.map((m) => `${m.label}: ${m.value}`).join('; ')}.`
      : '';

    const systemInstruction = [
      'You are AI-4-Students by Tanuj Industries, a friendly, emotionally aware AI study assistant and conversational companion for Indian students (Classes 1 to 12).',
      `Student Class: Class ${classLevel}. Preferred Language: ${language} (respond in English, Hindi, or natural Hinglish as appropriate).`,
      'Explain Maths and Science step by step using clear headings, bullet lists, and tables when helpful. Use encouraging emojis when appropriate.',
      memoryContext
    ].filter(Boolean).join(' ');

    const contents = [
      ...history.map((m) => ({
        role: m.role === 'ai' ? 'model' : 'user',
        parts: [{ text: m.text || '' }]
      }))
    ];

    const currentParts = [{ text: message || 'Please explain this image.' }];
    if (imageBase64) {
      const [meta, data] = imageBase64.split(',');
      const mimeType = meta?.match(/data:(.*);base64/)?.[1] || 'image/jpeg';
      currentParts.push({ inlineData: { mimeType, data } });
    }
    contents.push({ role: 'user', parts: currentParts });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: { systemInstruction }
    });

    res.json({ reply: response.text });
  } catch (err) {
    console.error('Gemini API error:', err);
    res.status(500).json({ error: 'Unable to reach Gemini AI right now. Please try again in a moment.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`AI-4-Students backend running on port ${PORT}`));
