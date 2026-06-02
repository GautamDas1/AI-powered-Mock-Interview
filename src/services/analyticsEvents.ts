import { logEvent } from 'firebase/analytics';
import { analytics } from '../lib/firebase';

/* ── Custom event tracking for product analytics ── */

/** User uploaded a resume successfully */
export function trackResumeUploaded() {
  logEvent(analytics, 'resume_uploaded');
}

/** User started an interview */
export function trackInterviewStarted(mode: string, questionCount: number) {
  logEvent(analytics, 'interview_started', {
    interview_mode: mode,
    question_count: questionCount,
  });
}

/** User submitted an answer */
export function trackAnswerSubmitted(questionNumber: number, score: number) {
  logEvent(analytics, 'answer_submitted', {
    question_number: questionNumber,
    score,
  });
}

/** User completed an interview (all questions answered) */
export function trackInterviewCompleted(mode: string, avgScore: number, questionCount: number) {
  logEvent(analytics, 'interview_completed', {
    interview_mode: mode,
    avg_score: avgScore,
    question_count: questionCount,
  });
}

/** User viewed the results dashboard */
export function trackDashboardViewed() {
  logEvent(analytics, 'dashboard_viewed');
}

/** User selected an interview mode on setup page */
export function trackModeSelected(mode: string) {
  logEvent(analytics, 'mode_selected', {
    interview_mode: mode,
  });
}

/** User signed in */
export function trackSignIn(method: string) {
  logEvent(analytics, 'login', { method });
}

/** User signed out */
export function trackSignOut() {
  logEvent(analytics, 'sign_out');
}
