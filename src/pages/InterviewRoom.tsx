import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Send, Volume2, VolumeX, ArrowRight, Loader2, Clock, MessageSquare } from 'lucide-react';
import { useInterview } from '../context/InterviewContext';
import { evaluateAnswer } from '../services/groq';
import { startListening, stopListening, speak, stopSpeaking, isSpeechSupported } from '../services/speech';

const GRAIN_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E`;
const COLORS = ['#F4845F', '#6BBF7A', '#E882B4', '#6EB5FF'];

export default function InterviewRoom() {
  const navigate = useNavigate();
  const { questions, addResult, results } = useInterview();
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastFeedback, setLastFeedback] = useState<Record<string, unknown> | null>(null);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typedTextRef = useRef(''); // Text typed before mic was activated

  const question = questions[currentQ];
  const isLastQuestion = currentQ === questions.length - 1;
  const accentColor = COLORS[currentQ % COLORS.length];

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [currentQ]);

  // Speak question on load
  useEffect(() => {
    if (question) {
      setTimer(0);
      setAnswer('');
      typedTextRef.current = '';
      setShowFeedback(false);
      setLastFeedback(null);
      setIsSpeaking(true);
      speak(question.question, () => setIsSpeaking(false));
    }
    return () => stopSpeaking();
  }, [currentQ, question]);

  // Redirect if no questions
  useEffect(() => {
    if (!questions.length) navigate('/setup');
  }, [questions, navigate]);

  const toggleVoice = () => {
    if (isListening) {
      stopListening();
      setIsListening(false);
      // Save the current answer as the new typed base
      typedTextRef.current = answer;
    } else {
      // Save current typed text before starting mic
      typedTextRef.current = answer;
      setIsListening(true);
      startListening(
        (result) => {
          // Replace answer with: typed text + final speech + interim speech
          const parts = [typedTextRef.current];
          if (result.finalTranscript) parts.push(result.finalTranscript);
          if (result.interimTranscript) parts.push(result.interimTranscript);
          setAnswer(parts.filter(Boolean).join(' ').trim());
        },
        () => {
          setIsListening(false);
          typedTextRef.current = answer;
        },
        () => {
          setIsListening(false);
          typedTextRef.current = answer;
        },
      );
    }
  };

  const toggleSpeak = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else if (question) {
      setIsSpeaking(true);
      speak(question.question, () => setIsSpeaking(false));
    }
  };

  const handleSubmit = async () => {
    if (!answer.trim() || !question) return;
    stopListening();
    setIsListening(false);
    setIsEvaluating(true);

    try {
      const evaluation = await evaluateAnswer(question.question, answer, question.expectedPoints || []);
      const result = {
        questionId: question.id,
        question: question.question,
        answer: answer.trim(),
        score: evaluation.score || 5,
        feedback: evaluation.feedback || '',
        strengths: evaluation.strengths || [],
        improvements: evaluation.improvements || [],
        confidenceIndicators: evaluation.confidenceIndicators || { clarity: 5, depth: 5, relevance: 5, communication: 5 },
        sampleAnswer: evaluation.sampleAnswer || '',
      };
      addResult(result);
      setLastFeedback(evaluation);
      setShowFeedback(true);
    } catch {
      setLastFeedback({ score: 5, feedback: 'Evaluation unavailable', strengths: [], improvements: [] });
      setShowFeedback(true);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      navigate('/dashboard');
    } else {
      setCurrentQ((q) => q + 1);
    }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  if (!question) return null;

  return (
    <div className="min-h-screen relative flex flex-col" style={{ backgroundColor: '#131313', fontFamily: "'Inter', sans-serif" }}>
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1, opacity: 0.25, backgroundImage: `url("${GRAIN_SVG}")`, backgroundSize: '200px 200px', backgroundRepeat: 'repeat' }} />
      <div className="fixed top-[-200px] left-[50%] translate-x-[-50%] w-[800px] h-[400px] rounded-full opacity-10 pointer-events-none" style={{ background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`, filter: 'blur(100px)', transition: 'background 650ms' }} />

      {/* Header */}
      <div className="relative flex items-center justify-between px-6 sm:px-10 py-4" style={{ zIndex: 10, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <button onClick={() => navigate('/')} className="cursor-pointer" style={{ fontFamily: "'Anton', sans-serif", fontSize: '22px', color: 'white', letterSpacing: '0.04em', textTransform: 'uppercase', background: 'none', border: 'none' }}>TOONHUB</button>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Clock size={14} style={{ color: accentColor }} />
            <span style={{ color: 'white', fontSize: '14px', fontFamily: "'Inter', monospace", fontWeight: 600 }}>{formatTime(timer)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageSquare size={14} style={{ color: accentColor }} />
            <span style={{ color: 'white', fontSize: '13px', fontWeight: 600 }}>{currentQ + 1}<span style={{ opacity: 0.4 }}>/{questions.length}</span></span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative w-full h-1" style={{ backgroundColor: 'rgba(255,255,255,0.06)', zIndex: 10 }}>
        <motion.div animate={{ width: `${((currentQ + (showFeedback ? 1 : 0)) / questions.length) * 100}%` }} transition={{ duration: 0.5 }} className="h-full" style={{ backgroundColor: accentColor }} />
      </div>

      {/* Main content */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-6 py-8" style={{ zIndex: 10 }}>
        <div className="w-full max-w-2xl">
          {/* Question card */}
          <AnimatePresence mode="wait">
            <motion.div key={currentQ} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.4 }} className="rounded-2xl p-6 sm:p-8" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase" style={{ backgroundColor: `${accentColor}20`, color: accentColor, letterSpacing: '0.08em' }}>{question.type}</span>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase" style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: '#e5e2e1', opacity: 0.6 }}>{question.difficulty}</span>
                <button onClick={toggleSpeak} className="ml-auto cursor-pointer rounded-full p-2 transition-colors duration-200" style={{ background: isSpeaking ? `${accentColor}20` : 'transparent', border: 'none', color: isSpeaking ? accentColor : 'rgba(255,255,255,0.5)' }}>
                  {isSpeaking ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </button>
              </div>
              <p style={{ color: 'white', fontSize: '20px', fontWeight: 600, lineHeight: 1.6 }}>{question.question}</p>
              {question.topic && <p className="mt-3" style={{ color: accentColor, fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Topic: {question.topic}</p>}
            </motion.div>
          </AnimatePresence>

          {/* Answer area */}
          {!showFeedback && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-6">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder={isListening ? '🎤 Listening... speak your answer' : 'Type your answer here or use the microphone...'}
                  rows={5}
                  className="w-full rounded-xl p-5 pr-14 resize-none outline-none transition-all duration-200"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    border: `1px solid ${isListening ? accentColor : 'rgba(255,255,255,0.1)'}`,
                    color: 'white',
                    fontSize: '15px',
                    lineHeight: 1.6,
                    fontFamily: "'Inter', sans-serif",
                  }}
                  onFocus={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = accentColor; }}
                  onBlur={(e) => { if (!isListening) (e.target as HTMLTextAreaElement).style.borderColor = 'rgba(255,255,255,0.1)'; }}
                />
                {/* Mic button */}
                {isSpeechSupported() && (
                  <button
                    onClick={toggleVoice}
                    className="absolute bottom-4 right-4 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200"
                    style={{ backgroundColor: isListening ? accentColor : 'rgba(255,255,255,0.08)', border: 'none', color: 'white' }}
                  >
                    {isListening ? <Mic size={18} className="animate-pulse" /> : <MicOff size={18} />}
                  </button>
                )}
              </div>

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={!answer.trim() || isEvaluating}
                className="mt-4 w-full flex items-center justify-center gap-2 py-4 rounded-xl cursor-pointer transition-all duration-200"
                style={{
                  backgroundColor: !answer.trim() || isEvaluating ? '#333' : accentColor,
                  color: 'white',
                  border: 'none',
                  fontSize: '15px',
                  fontWeight: 700,
                  opacity: !answer.trim() ? 0.5 : 1,
                }}
              >
                {isEvaluating ? <><Loader2 size={18} className="animate-spin" /> Evaluating with AI...</> : <><Send size={16} /> Submit Answer</>}
              </button>
            </motion.div>
          )}

          {/* Feedback card */}
          <AnimatePresence>
            {showFeedback && lastFeedback && (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mt-6 rounded-2xl p-6" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {/* Score */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: `${accentColor}20`, border: `3px solid ${accentColor}` }}>
                    <span style={{ color: accentColor, fontSize: '24px', fontWeight: 900 }}>{(lastFeedback as { score?: number }).score}</span>
                  </div>
                  <div>
                    <p style={{ color: 'white', fontSize: '16px', fontWeight: 700 }}>
                      {((lastFeedback as { score?: number }).score || 0) >= 8 ? 'Excellent!' : ((lastFeedback as { score?: number }).score || 0) >= 6 ? 'Good job!' : ((lastFeedback as { score?: number }).score || 0) >= 4 ? 'Needs improvement' : 'Keep practicing'}
                    </p>
                    <p style={{ color: '#e5e2e1', opacity: 0.6, fontSize: '13px' }}>Score: {(lastFeedback as { score?: number }).score}/10</p>
                  </div>
                </div>

                <p className="mb-4" style={{ color: '#e5e2e1', opacity: 0.8, fontSize: '14px', lineHeight: 1.6 }}>{(lastFeedback as { feedback?: string }).feedback}</p>

                {/* Strengths & Improvements */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {((lastFeedback as { strengths?: string[] }).strengths || []).length > 0 && (
                    <div className="rounded-xl p-4" style={{ backgroundColor: 'rgba(107,191,122,0.08)', border: '1px solid rgba(107,191,122,0.2)' }}>
                      <p style={{ color: '#6BBF7A', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Strengths</p>
                      {((lastFeedback as { strengths?: string[] }).strengths || []).map((s: string, i: number) => (
                        <p key={i} style={{ color: '#e5e2e1', fontSize: '13px', marginBottom: 4, opacity: 0.8 }}>• {s}</p>
                      ))}
                    </div>
                  )}
                  {((lastFeedback as { improvements?: string[] }).improvements || []).length > 0 && (
                    <div className="rounded-xl p-4" style={{ backgroundColor: 'rgba(244,132,95,0.08)', border: '1px solid rgba(244,132,95,0.2)' }}>
                      <p style={{ color: '#F4845F', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>To Improve</p>
                      {((lastFeedback as { improvements?: string[] }).improvements || []).map((s: string, i: number) => (
                        <p key={i} style={{ color: '#e5e2e1', fontSize: '13px', marginBottom: 4, opacity: 0.8 }}>• {s}</p>
                      ))}
                    </div>
                  )}
                </div>

                {/* Next button */}
                <button
                  onClick={handleNext}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl cursor-pointer transition-all duration-200"
                  style={{ backgroundColor: accentColor, color: 'white', border: 'none', fontSize: '15px', fontWeight: 700 }}
                  onMouseEnter={(e) => { (e.currentTarget).style.transform = 'scale(1.02)'; }}
                  onMouseLeave={(e) => { (e.currentTarget).style.transform = 'scale(1)'; }}
                >
                  {isLastQuestion ? 'View Results Dashboard' : 'Next Question'} <ArrowRight size={18} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
