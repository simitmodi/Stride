/**
 * @fileOverview Shared types and schemas for user feedback.
 *
 * - FeedbackInput - The input type for the submitFeedback function.
 * - FeedbackOutput - The return type for the submitFeedback function.
 * - FeedbackInputSchema - The Zod schema for feedback input.
 * - FeedbackOutputSchema - The Zod schema for feedback output.
 */

import { z } from 'genkit';

export const FeedbackInputSchema = z.object({
  name: z.string().min(1).describe("The user's full name."),
  email: z.string().email().describe("The user's email address."),
  phone: z.string().optional().describe("The user's optional phone number."),
  category: z.enum(["Complaint", "Suggestion", "Feedback", "Other"]).describe("The category of the feedback."),
  subject: z.string().min(1).describe("The subject of the feedback message."),
  message: z.string().min(50).describe("The detailed feedback message from the user."),
});

export type FeedbackInput = z.infer<typeof FeedbackInputSchema>;

export const FeedbackOutputSchema = z.object({
  feedbackId: z.string().describe("The unique ID of the submitted feedback document."),
});

export type FeedbackOutput = z.infer<typeof FeedbackOutputSchema>;
