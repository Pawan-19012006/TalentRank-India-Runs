const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv').config()
const { OpenRouter } = require('@openrouter/sdk')

const app = express()
const PORT = process.env.PORT || 5001

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY
});

app.use(cors())
app.use(express.json())

const mockCandidates = require('./mockCandidates.json');

app.post('/api/chat', async (req, res) => {
    try {
        const { messages } = req.body;
        
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();

        const systemPrompt = `You are an AI Recruiter Copilot. Answer user questions concisely based ONLY on the following mock data containing 50 applicants. 
Applicant Data:
${JSON.stringify(mockCandidates)}

If asked a general question, answer as a helpful recruiter assistant. Do not mention that you are an AI or using mock data. Provide clear answers based on the applicant data provided.`;

        // Format messages: only role and content are allowed typically, map the frontend messages
        const formattedMessages = messages.map(m => ({
            role: m.role === 'ai' ? 'assistant' : m.role,
            content: m.content
        }));

        const stream = await openrouter.chat.send({
            chatRequest: {
                model: "poolside/laguna-xs.2:free",
                messages: [
                    { role: "system", content: systemPrompt },
                    ...formattedMessages
                ],
                stream: true
            }
        });

        console.log("Connected to OpenRouter, starting stream...");
        for await (const chunk of stream) {
            const content = chunk.choices?.[0]?.delta?.content;
            if (content) {
                res.write(`data: ${JSON.stringify({ content })}\n\n`);
            } else if (chunk.choices?.[0]?.delta?.reasoning) {
                // Send an empty update so frontend doesn't hang
                res.write(`data: ${JSON.stringify({ ping: true })}\n\n`);
            }

            if (chunk.usage && chunk.usage.reasoningTokens !== undefined) {
                res.write(`data: ${JSON.stringify({ reasoningTokens: chunk.usage.reasoningTokens })}\n\n`);
            }
        }
        res.write('data: [DONE]\n\n');
        res.end();
    } catch (error) {
        console.error("OpenRouter API Error:", error);
        res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
        res.end();
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})