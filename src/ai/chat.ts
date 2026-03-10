import { z } from 'zod';
import { ai } from './genkit';

export const customerChatFlow = ai.defineFlow(
    {
        name: 'customerChatFlow',
        inputSchema: z.array(
            z.object({
                role: z.enum(['user', 'model']),
                text: z.string(),
            })
        ),
        outputSchema: z.string(),
    },
    async (messages) => {
        // Format messages for Genkit
        const formattedMessages = messages.map(m => ({
            role: m.role,
            content: [{ text: m.text }]
        }));

        const { text } = await ai.generate({
            system: "You are a helpful customer support and financial assistant for Stride, a Professional Financial Connectivity platform. Be concise, polite, and professional. You act as an AI embedded inside the user's dashboard answering questions they might have about their experience.",
            messages: formattedMessages,
        });

        return text;
    }
);
