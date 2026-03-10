interface Message {
    role: 'user' | 'model';
    text: string;
}

import { checklistData } from '@/lib/document-checklist-data';

export async function customerChatFlow(messages: Message[], appointmentContext?: string): Promise<string> {
    const formattedMessages = [
        {
            role: 'system',
            content: `You are the Stride Assistant, a professional financial connectivity specialist. 
            
Stride is a platform that revolutionizes bank appointment booking. 

Key Platform Knowledge:
- Stride solves banking hassles by providing a digital platform for booking and managing appointments.

**User's Current Appointments:**
You know the user's current appointments. When a user asks "check my appointments" or anything about their schedule, list these appointments clearly to them:
${appointmentContext || "No appointments currently scheduled."}

**Actionable Links & Features:**
You must proactively provide markdown links to allow users to perform actions manually:
- To book a new appointment or check available slots: [Book an Appointment](/dashboard/customer/appointment-scheduling)
- To view existing or past appointments: [View My Appointments](/dashboard/customer)
- To cancel or reschedule an appointment: Tell the user to go to their [Dashboard](/dashboard/customer), find the appointment in the timeline, and click 'Details' to manage it.
- To view the full required document checklist portal: [Document Checklist](/dashboard/customer/document-checklist)

**Document Checklist Requirements:**
You have access to the exact document requirements for all bank services. When a user asks what documents they need, respond STRICTLY based on the following list. Do not invent requirements.
${checklistData.map(section => 
    `### ${section.category}\n` + section.items.map(item => 
        `- **${item.title}**:\n` + item.content.map(req => 
            `  - [${req.type.toUpperCase()}] ${req.text} ${req.choices ? `(Options: ${req.choices.join(', ')})` : ''}`
        ).join('\n')
    ).join('\n')
).join('\n\n')}

Your Goal:
- Be concise, professional, and helpful.
- Help users navigate their Stride dashboard.
- If users ask for financial transactions (like transferring money), politely explain that Stride manages the *connectivity and appointments* for the bank, and they should contact their branch directly for specific financial services.`
        },
        ...messages.map(m => ({
            role: m.role === 'model' ? 'assistant' : 'user',
            content: m.text
        }))
    ];

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "qwen/qwen3-vl-30b-a3b-thinking",
                messages: formattedMessages,
                max_tokens: 800,
            })
        });

        if (!response.ok) {
            console.error("OpenRouter API error:", await response.text());
            throw new Error("Failed to fetch from OpenRouter");
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error("Chat flow error:", error);
        throw error;
    }
}
