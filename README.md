# -ENIGMA_2.0_BINARY-BRAINS
# Intelligent Interview Simulation System

## Problem
Students lack real interview experience and structured feedback.

## Solution
The Intelligent Interview Simulation System bridges the gap between coding platforms and real-world interviews. Unlike traditional platforms, it evaluates not only code correctness but also problem-solving skills, communication clarity, reasoning ability, and overall interview readiness. The system simulates a real interview by analyzing:
- Candidate’s voice explanations
- Coding performance
- Resume context
- HR responses
- It provides structured feedback, follow-up questions, and analytics for both technical and communication performance.

## Features
- AI-powered DSA interview simulation with real-time conversational interaction.
- Resume upload and automated skill extraction.
- AI-generated personalized questions based on resume skills.
- Code and voice evaluation with structured scoring.
- Follow-up question generation for adaptive interviews.
- Session tracking and performance analytics dashboard.
- Browser lock during interviews to prevent cheating.
- Cloud-hosted PostgreSQL database for storing sessions, transcripts, scores, and analytics.

## Tech Stack
- Frontend:
   React – Interactive UI for candidate interface
   Vite – Development server for fast local testing
   Networking: Exposed via IP (--host) for multi-device testing
   Fetch API – Frontend ↔ Backend communication
- Backend:
   Node.js – Server-side runtime
   Express.js – REST API routing
   PostgreSQL (Railway) – Cloud database storing sessions, scores, feedback, analytics
   Groq LLM (llama-3.1-8b-instant) – AI for skill extraction, question generation, answer evaluation, follow-ups
   Multer – Resume PDF upload handling
   pdf-parse – Extract text from PDF resumes
   dotenv – Environment variables for API keys and DB connection
   CORS – Allows frontend to communicate with backend securely

## API Endpoints
- /api/resume/extract-skills - POST - 	Extracts skills from uploaded resume PDF
- /api/interview/generate-question	- POST -	Generates technical/HR question based on skills
- /api/interview/analyze-answer - POST - 	Evaluates candidate’s answer (code + voice) and gives structured feedback
- /api/interview/follow-up	- POST -	Generates follow-up questions dynamically
- /api/interview/session/:id - GET	- Fetch interview session details
- /api/interview/analytics	- GET -	Returns aggregated analytics (average scores, trends)

## System Architecture
- Resume Flow:
   PDF Upload → Multer → pdf-parse → Extract Text → Groq → Skills → PostgreSQL
- Interview Flow:
   Skills → Groq → Question → Candidate Answer → Groq → Structured Score & Feedback → PostgreSQL → Frontend
- Analytics Flow:
   PostgreSQL → Aggregate Queries → Average Scores / Dashboard → Frontend
- Full End-to-End Flow:
Frontend (React + Vite)
        ↓ Upload Resume / Submit Code / Record Voice
Backend (Node + Express)
        ↓ Resume Parsing / AI Evaluation
        ↓ Groq LLM → Skills / Question Generation / Answer Analysis
        ↓ Store feedback & scores in PostgreSQL
        ↓ Return JSON → Frontend updates UI
     

## How to run
- Step 1: clone repo
- Step 2: install requirements
- Step 3: Setup Backend
- Step 4: Setup Frontend
- Step 5: Connect Frontend to Backend
- step 6: Test the System

## Demo
<img width="1917" height="1147" alt="Screenshot 2026-02-27 060452" src="https://github.com/user-attachments/assets/858e30ab-c804-45fd-bde0-bb5d07556b5b" />
<img width="1919" height="1129" alt="Screenshot 2026-02-27 061322" src="https://github.com/user-attachments/assets/b58ceb13-dd88-4fa0-b5c8-75709a08e620" />
<img width="1894" height="1079" alt="Screenshot 2026-02-26 133609" src="https://github.com/user-attachments/assets/6d2a89de-af67-4dca-bdcb-2516e0d1df56" />
<img width="1908" height="1132" alt="Screenshot 2026-02-27 062127" src="https://github.com/user-attachments/assets/290c9d4b-8dc6-440c-af25-4fa97bcc0fea" />


## Team Members
- Rudra pahune (team lead)
- aarya ambule
- anushka chatur
- anish gotmare
- anagha adpewar
