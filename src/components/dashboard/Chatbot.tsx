"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, MessageSquare, Send, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";
import { useUser, useFirestore, useMemoFirebase } from "@/firebase/provider";
import { doc, collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { useDoc } from "@/firebase/firestore/use-doc";
import { format } from "date-fns";
import { isAppointmentUpcoming } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { emitStrideNotification } from "@/lib/notifications/client";

interface Message {
    role: "user" | "model";
    text: string;
}

interface AppointmentData {
  id: string;
  bankName: string;
  branch: string;
  date: Timestamp;
  time: string;
  specificService: string;
  deleted?: boolean;
}

export default function Chatbot({ className, onClose }: { className?: string; onClose?: () => void }) {
    const [messages, setMessages] = useState<Message[]>([
        { role: "model", text: "Hello! How can I help you with your Stride dashboard today?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const userDocRef = useMemoFirebase(() => user ? doc(firestore, "users", user.uid) : null, [user, firestore]);
    const { data: userData, isLoading: isUserDocLoading } = useDoc(userDocRef);
    const [allAppointments, setAllAppointments] = useState<AppointmentData[]>([]);

    useEffect(() => {
        const fetchApps = async () => {
            if (isUserDocLoading || !user) return;
            const ids = userData?.appointmentIds;
            if (!ids || ids.length === 0) return;
            try {
                const q = query(collection(firestore, "appointments"), where("__name__", "in", ids));
                const snap = await getDocs(q);
                const items: AppointmentData[] = [];
                snap.forEach(d => { const data = d.data(); if (data.date?.toDate) items.push({ id: d.id, ...data } as AppointmentData); });
                items.sort((a, b) => a.date.toDate().getTime() - b.date.toDate().getTime());
                setAllAppointments(items);
            } catch (e) { console.error("Error fetching appointments for chat context", e); }
        };
        fetchApps();
    }, [user, userData, isUserDocLoading, firestore]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: "user", text: input.trim() };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput("");
        setIsLoading(true);

        try {
            const upcomingAppointments = allAppointments.filter(a => !a.deleted && isAppointmentUpcoming(a.date.toDate(), a.time));
            const appointmentContext = upcomingAppointments.length 
                ? upcomingAppointments.map(a => `- ${a.specificService} at ${a.bankName} (${a.branch}) on ${format(a.date.toDate(), "MMM d, yyyy")} at ${a.time}`).join('\n')
                : "No upcoming appointments currently scheduled.";

            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    messages: newMessages,
                    appointmentContext 
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch chat response");
            }

            const data = await response.json();
            const assistantText = String(data.text ?? "I have a new update for your dashboard.");
            setMessages((prev) => [...prev, { role: "model", text: assistantText }]);
            emitStrideNotification({
                title: "Stride Assistant",
                body: "You received a new assistant response.",
                url: "/dashboard",
            });
        } catch (error) {
            console.error(error);
            const fallbackText = "Sorry, I am having trouble connecting right now. Please try again later.";
            setMessages((prev) => [
                ...prev,
                { role: "model", text: fallbackText }
            ]);
            emitStrideNotification({
                title: "Stride Assistant",
                body: "The assistant encountered a connection issue.",
                url: "/dashboard",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={cn("flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-border bg-background/80 shadow-2xl backdrop-blur-xl", className)}>
            <div className="flex items-center justify-between border-b border-border bg-card p-4">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <MessageSquare className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">Stride Assistant</h3>
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => window.dispatchEvent(new Event("stride:enable-notifications"))}
                        aria-label="Enable notifications"
                    >
                        <Bell className="h-4 w-4" />
                    </Button>
                    {onClose && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={onClose}
                            aria-label="Close chat"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-4">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                            }`}
                    >
                        <div
                            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm overflow-hidden ${msg.role === "user"
                                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                                    : "bg-muted text-foreground rounded-tl-sm"
                                }`}
                        >
                            {msg.role === "user" ? (
                                msg.text
                            ) : (
                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                    <ReactMarkdown
                                        components={{
                                            a: ({ node, ...props }) => <a {...props} className="text-blue-600 hover:text-blue-800 underline font-medium" target="_blank" rel="noopener noreferrer" />,
                                            ul: ({ node, ...props }) => <ul {...props} className="list-disc pl-4 my-2 space-y-1" />,
                                            ol: ({ node, ...props }) => <ol {...props} className="list-decimal pl-4 my-2 space-y-1" />,
                                            li: ({ node, ...props }) => <li {...props} className="leading-snug" />,
                                            p: ({ node, ...props }) => <p {...props} className="mb-2 last:mb-0 leading-relaxed" />,
                                            strong: ({ node, ...props }) => <strong {...props} className="font-semibold text-foreground" />
                                        }}
                                    >
                                        {msg.text}
                                    </ReactMarkdown>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-muted px-4 py-2 text-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-border bg-background p-4">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 bg-muted/50 focus-visible:ring-1"
                        disabled={isLoading}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={!input.trim() || isLoading}
                        className="h-10 w-10 shrink-0 rounded-full"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
