import { genkit } from 'genkit';
import { googleAI, gemini15Flash } from '@genkit-ai/googleai';

// Initialize Genkit with Google AI plugin
const ai = genkit({
    plugins: [googleAI()],
});

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return Response.json({ error: 'Invalid messages format' }, { status: 400 });
        }

        const lastMessage = messages[messages.length - 1].content;

        const response = await ai.generate({
            model: gemini15Flash,
            prompt: `You are the Stride Banking Assistant, a helpful, concise, and professional AI. 
Your goal is to assist customers with banking queries, document checklists, and appointments.
Use plain text or simple bullet points. Keep answers brief (max 3-4 sentences).

Customer says: "${lastMessage}"`,
        });

        return Response.json({ text: response.text });
    } catch (error) {
        console.error('Chat API Error:', error);
        return Response.json({ error: 'Failed to generate response. Please make sure GOOGLE_GENAI_API_KEY is set in your environment.' }, { status: 500 });
    }
}
