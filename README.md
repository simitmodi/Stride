# Stride: Seamless Bank Appointments

Stride is a web application designed to streamline the process of booking and managing bank appointments. It provides a user-friendly platform for customers to schedule appointments with their bank, and for bank staff to manage their availability and appointments.

## The Problem

Traditionally, booking a bank appointment can be a cumbersome process, involving phone calls, long waiting times, and a lack of visibility into available slots. Stride aims to solve this by providing a simple, efficient, and transparent online platform for appointment booking.

## Key Features

*   **Customer Portal:** Customers can view available appointment slots, book new appointments, and manage their existing appointments.
*   **Bank Staff Portal:** Bank staff can manage their availability, view their schedule, and approve or decline appointment requests.
*   **Next.js:** A React framework for building server-side rendered and statically generated web applications.
*   **Firebase:** Integrated with Firebase for backend services like authentication and database.
*   **Genkit:** Includes Genkit for building AI-powered features.
*   **TypeScript:** The project is written in TypeScript for type safety and improved developer experience.
*   **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
*   **UI Components:** A rich set of pre-built UI components are available in `src/components/ui`.

## Getting Started

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    This will start the Next.js development server on `http://localhost:9002`.

3.  **Run Genkit:**
    To run the Genkit development server:
    ```bash
    npm run genkit:dev
    ```

## Available Scripts

*   `npm run dev`: Starts the Next.js development server with Turbopack.
*   `npm run build`: Builds the application for production.
*   `npm run start`: Starts a production server.
*   `npm run lint`: Lints the codebase using Next.js's built-in ESLint configuration.
*   `npm run typecheck`: Runs the TypeScript compiler to check for type errors.
*   `npm run genkit:dev`: Starts the Genkit development server.
*   `npm run genkit:watch`: Starts the Genkit development server in watch mode.

## Project Structure

*   `src/app`: Contains the main application pages and layouts.
*   `src/components`: Contains reusable React components.
*   `src/lib`: Contains utility functions and library initializations.
*   `src/ai`: Contains Genkit-related code for AI features.
*   `public`: Contains static assets.
