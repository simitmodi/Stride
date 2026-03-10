import { NextRequest, NextResponse } from 'next/server';
import { customerChatFlow } from '@/ai/chat';

export async function POST(req: NextRequest) {
    try {
        const { messages, appointmentContext } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
        }

        const resultText = await customerChatFlow(messages, appointmentContext);
        return NextResponse.json({ text: resultText });
    } catch (error) {
        console.error('Chat API error:', error);
        return NextResponse.json({ error: 'Failed to process chat request' }, { status: 500 });
    }
}
