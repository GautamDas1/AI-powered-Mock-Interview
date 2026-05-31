# AI-Powered Mock Interview System

A modern, interactive web application that provides AI-driven mock interviews. Users can upload their resumes, conduct simulated interviews in a dedicated room, and view their performance analytics on a comprehensive dashboard.

## 🚀 Features

- **Resume Upload & Parsing**: Easily upload resumes (PDF or TXT) to tailor the interview questions based on the candidate's experience.
- **Interactive Interview Room**: A dedicated space for conducting the mock interview with real-time feedback.
- **Performance Dashboard**: Visual analytics and statistics of past interviews using interactive charts.
- **AI-Powered**: Integrates with the Groq API for ultra-fast, intelligent interview responses and evaluations.
- **Modern UI/UX**: Built with a sleek dark theme, glassmorphism effects, and smooth animations using Tailwind CSS and Framer Motion.

## 💻 Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
- **PDF Processing**: pdf.js
- **AI Integration**: Groq SDK

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/GautamDas1/AI-powered-Mock-Interview.git
   cd AI-powered-Mock-Interview
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and copy the contents from `.env.example`. You will need to get an API key from Groq.
   
   ```bash
   cp .env.example .env
   ```
   
   Open `.env` and add your Groq API key:
   ```env
   VITE_GROQ_API_KEY=your_actual_api_key_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:5173` to view the application.

## 🔒 Security Note

Please ensure that you **never** commit your actual `.env` file to version control. The `.gitignore` file is already configured to ignore `.env`, and the repository provides a `.env.example` file for reference.
