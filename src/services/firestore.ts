import {
  collection,
  addDoc,
  doc,
  getDoc,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp,
  type Timestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { AnswerResult, ResumeData, RoadmapData } from '../context/InterviewContext';

/* ── Types ── */
export interface InterviewSession {
  id?: string;
  userId: string;
  userName: string;
  userEmail: string;
  resumeData: ResumeData;
  interviewMode: 'technical' | 'hr' | 'mixed';
  questionCount: number;
  results: AnswerResult[];
  roadmap: RoadmapData | null;
  avgScore: number;
  bestScore: number;
  completedAt: Timestamp | null;
  createdAt: Timestamp | null;
}

/* ── Save a completed interview session ── */
export async function saveInterviewSession(
  userId: string,
  userName: string,
  userEmail: string,
  resumeData: ResumeData,
  interviewMode: 'technical' | 'hr' | 'mixed',
  results: AnswerResult[],
  roadmap: RoadmapData | null,
): Promise<string> {
  const avgScore = results.length
    ? Math.round((results.reduce((s, r) => s + r.score, 0) / results.length) * 10)
    : 0;
  const bestScore = results.length ? Math.max(...results.map(r => r.score)) : 0;

  const docRef = await addDoc(collection(db, 'interviews'), {
    userId,
    userName,
    userEmail,
    resumeData,
    interviewMode,
    questionCount: results.length,
    results,
    roadmap,
    avgScore,
    bestScore,
    completedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

/* ── Load all interview sessions for a user ── */
export async function getUserInterviews(userId: string): Promise<InterviewSession[]> {
  const q = query(
    collection(db, 'interviews'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as InterviewSession[];
}

/* ── Load a single interview session by ID ── */
export async function getInterviewById(interviewId: string): Promise<InterviewSession | null> {
  const docSnap = await getDoc(doc(db, 'interviews', interviewId));
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as InterviewSession;
}
