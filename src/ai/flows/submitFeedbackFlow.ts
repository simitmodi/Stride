
'use server';
/**
 * @fileOverview A flow to handle user feedback submissions.
 *
 * - submitFeedback - Saves feedback to Firestore and returns a feedback ID.
 */

import { ai } from '@/ai/genkit';
import { db } from '@/lib/firebase/config';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { FeedbackInput, FeedbackInputSchema, FeedbackOutput, FeedbackOutputSchema } from './feedback';

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
