import { createContext, useContext, useState, type ReactNode } from 'react';

export interface Question {
  id: number;
  question: string;
  type: string;
  difficulty: string;
  topic: string;
  expectedPoints: string[];
}

export interface AnswerResult {
  questionId: number;
  question: string;
  answer: string;
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  confidenceIndicators: {
    clarity: number;
    depth: number;
    relevance: number;
    communication: number;
  };
  sampleAnswer: string;
}

export interface ResumeData {
  name: string;
  skills: string[];
  experience: string;
  education: string;
  projects: string[];
  strengths: string[];
  suggestedRole: string;
  experienceLevel: string;
}

export interface RoadmapData {
  overallScore: number;
  overallFeedback: string;
  topStrengths: string[];
  areasToImprove: string[];
  roadmap: {
    week: number;
    focus: string;
    tasks: string[];
    resources: string[];
  }[];
  tips: string[];
}

interface InterviewContextType {
  resumeData: ResumeData | null;
  setResumeData: (data: ResumeData | null) => void;
  resumeText: string;
  setResumeText: (text: string) => void;
  interviewMode: 'technical' | 'hr' | 'mixed';
  setInterviewMode: (mode: 'technical' | 'hr' | 'mixed') => void;
  questions: Question[];
  setQuestions: (questions: Question[]) => void;
  results: AnswerResult[];
  setResults: (results: AnswerResult[]) => void;
  addResult: (result: AnswerResult) => void;
  roadmap: RoadmapData | null;
  setRoadmap: (roadmap: RoadmapData | null) => void;
  resetInterview: () => void;
}

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

export function InterviewProvider({ children }: { children: ReactNode }) {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [interviewMode, setInterviewMode] = useState<'technical' | 'hr' | 'mixed'>('technical');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [results, setResults] = useState<AnswerResult[]>([]);
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);

  const addResult = (result: AnswerResult) => {
    setResults((prev) => [...prev, result]);
  };

  const resetInterview = () => {
    setQuestions([]);
    setResults([]);
    setRoadmap(null);
  };

  return (
    <InterviewContext.Provider
      value={{
        resumeData, setResumeData,
        resumeText, setResumeText,
        interviewMode, setInterviewMode,
        questions, setQuestions,
        results, setResults, addResult,
        roadmap, setRoadmap,
        resetInterview,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
}

export function useInterview() {
  const context = useContext(InterviewContext);
  if (!context) throw new Error('useInterview must be used within InterviewProvider');
  return context;
}
