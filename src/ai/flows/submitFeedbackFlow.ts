
'use server';
/**
 * @fileOverview A flow to handle user feedback submissions.
 *
 * - submitFeedback - Saves feedback to Firestore and returns a feedback ID.
 * - FeedbackInput - The input type for the submitFeedback function.
 * - FeedbackOutput - The return type for the submitFeedback function.
 */

import { ai } from '@/ai/genkit';
import { db } from '@/lib/firebase/config';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { z } from 'genkit';

export const FeedbackInputSchema = z.object({
  name: z.string().describe("The user's full name."),
  email: z.string().email().describe("The user's email address."),
  phone: z.string().optional().describe("The user's optional phone number."),
  category: z.enum(["Complaint", "Suggestion", "Feedback", "Other"]).describe("The category of the feedback."),
  subject: z.string().describe("The subject of the feedback message."),
  message: z.string().describe("The detailed feedback message from the user."),
});

export type FeedbackInput = z.infer<typeof FeedbackInputSchema>;

export const FeedbackOutputSchema = z.object({
  feedbackId: z.string().describe("The unique ID of the submitted feedback document."),
});

export type FeedbackOutput = z.infer<typeof FeedbackOutputSchema>;

const submitFeedbackFlow = ai.defineFlow(
  {
    name: 'submitFeedbackFlow',
    inputSchema: FeedbackInputSchema,
    outputSchema: FeedbackOutputSchema,
  },
  async (input) => {
    try {
      const feedbackRef = await addDoc(collection(db, "UserFeedback"), {
        ...input,
        timestamp: serverTimestamp(),
        status: "Pending",
      });
      
      // Here you would typically trigger an email to the user and an admin notification.
      // This can be done via another flow or a direct integration with an email service.
      
      return { feedbackId: feedbackRef.id };
    } catch (error) {
      console.error("Error saving feedback to Firestore:", error);
      throw new Error("Failed to save feedback.");
    }
  }
);

export async function submitFeedback(input: FeedbackInput): Promise<FeedbackOutput> {
    return submitFeedbackFlow(input);
}
