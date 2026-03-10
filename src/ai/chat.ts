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
        let formattedMessages = messages.map(m => ({
            role: m.role,
            content: [{ text: m.text }]
        }));

        // Gemini requires the first message in history to be from the 'user'
        while (formattedMessages.length > 0 && formattedMessages[0].role !== 'user') {
            formattedMessages.shift();
        }

        const result = await ai.generate({
            system: `You are the Stride Assistant, a professional financial connectivity specialist. 
            
Stride is a platform that revolutionizes bank appointment booking. 

Key Platform Knowledge:
- Stride solves banking hassles by providing a digital platform for booking and managing appointments.
- Customers can use the Customer Portal to:
    - View available appointment slots in real-time.
    - Book new appointments and manage existing ones.
    - Access a 'Document Checklist' to prepare for their visit.
- Bank Staff use the Staff Portal to:
    - Manage their personal availability.
    - View, approve, or decline appointment requests.
- The platform uses Firebase for real-time updates and secure authentication.
- Stride supports multiple languages (English, Hindi, Bengali, Tamil, etc.).

Your Goal:
- Be concise, professional, and helpful.
- Help users navigate their Stride dashboard.
- If users ask for financial transactions (like transferring money), politely explain that Stride manages the *connectivity and appointments* for the bank, and they should contact their branch directly for specific financial services.`,
            messages: formattedMessages,
        });

        return result.text;
    }
);
