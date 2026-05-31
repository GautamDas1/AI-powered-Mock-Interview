import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Loader2, ArrowRight, Sparkles, CheckCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInterview } from '../context/InterviewContext';
import { extractTextFromPDF } from '../services/resumeParser';
import { analyzeResume } from '../services/groq';

export default function ResumeUpload() {
  const navigate = useNavigate();
  const { setResumeData, setResumeText } = useInterview();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [error, setError] = useState('');
  const [parsedData, setParsedData] = useState<Record<string, unknown> | null>(null);

  const handleFile = async (selectedFile: File) => {
    const lowerName = selectedFile.name.toLowerCase();
    if (!lowerName.endsWith('.pdf') && !lowerName.endsWith('.txt')) {
      setError('Please upload a PDF or TXT file.');
      return;
    }
    // Reset previous analysis state before each new upload
    setFile(selectedFile);
    setError('');
    setAnalysisComplete(false);
    setParsedData(null);
    setIsAnalyzing(true);

    try {
      let text = '';
      if (lowerName.endsWith('.pdf')) {
        text = await extractTextFromPDF(selectedFile);
      } else {
        text = await selectedFile.text();
      }

      if (!text.trim()) {
        setError('Could not extract text from the file. Please try a different format.');
        setIsAnalyzing(false);
        return;
      }

      const data = await analyzeResume(text);

      // ── Validate: is this actually a resume? ──
      if (data.isResume === false) {
        const reason = data.rejectionReason || 'The uploaded file does not appear to be a resume.';
        setError(`⚠️ This doesn't look like a resume. ${reason} Please upload your resume or CV.`);
        setFile(null);
        setIsAnalyzing(false);
        return;
      }

      // Only persist resume text after validation passes
      setResumeText(text);
      setResumeData(data);
      setParsedData(data);
      setAnalysisComplete(true);
    } catch (err) {
      setError(`Analysis failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  };

  /* ─── Helpers ─── */
  const cardBg: React.CSSProperties = {
    backgroundColor: 'rgba(22, 27, 34, 0.95)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 16,
  };
  const labelStyle: React.CSSProperties = {
    color: '#8b949e',
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    marginBottom: 6,
  };

  const rawSkills = (parsedData as { skills?: unknown })?.skills;
  const rawProjects = (parsedData as { projects?: unknown })?.projects;
  const skills: string[] = Array.isArray(rawSkills) ? rawSkills as string[] : [];
  const projects: string[] = Array.isArray(rawProjects) ? rawProjects as string[] : [];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0d1117', fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column' }}>
      {/* Grain overlay */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0, opacity: 0.15, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`, backgroundSize: '200px 200px' }} />
      <div className="fixed top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full pointer-events-none" style={{ opacity: 0.15, background: 'radial-gradient(circle, #F4845F 0%, transparent 70%)', filter: 'blur(80px)' }} />
      <div className="fixed bottom-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full pointer-events-none" style={{ opacity: 0.1, background: 'radial-gradient(circle, #6EB5FF 0%, transparent 70%)', filter: 'blur(80px)' }} />

      {/* ─── NAV ─── */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 24px',
        position: 'relative', zIndex: 10,
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}>
        <button onClick={() => navigate('/')} style={{ fontFamily: "'Anton', sans-serif", fontSize: 22, color: 'white', letterSpacing: '0.04em', textTransform: 'uppercase' as const, background: 'none', border: 'none', cursor: 'pointer' }}>TOONHUB</button>
        <span style={{ fontSize: 11, fontWeight: 500, color: '#8b949e', letterSpacing: '0.18em', textTransform: 'uppercase' as const }}>STEP 1 OF 3</span>
      </header>

      {/* ─── MAIN ─── */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: analysisComplete ? 'flex-start' : 'center',
        padding: analysisComplete ? '32px 24px 60px' : '24px 24px 60px',
        position: 'relative',
        zIndex: 10,
        overflowY: 'auto',
      }}>
        <div style={{ width: '100%', maxWidth: 640 }}>

          {/* Title */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: analysisComplete ? 28 : 36 }}>
            <h1 style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(30px, 6vw, 52px)', color: 'white', letterSpacing: '-0.02em', lineHeight: 1.05, textTransform: 'uppercase' }}>
              UPLOAD YOUR <span style={{ color: '#F4845F' }}>RESUME</span>
            </h1>
            <p style={{ marginTop: 10, color: '#8b949e', fontSize: 14, lineHeight: 1.6 }}>
              Our AI will analyze your skills, experience, and projects to generate personalized interview questions.
            </p>
          </motion.div>

          {/* ─── Upload area ─── */}
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
            <div
              role="button"
              tabIndex={0}
              aria-label="Upload resume file"
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInputRef.current?.click(); } }}
              style={{
                ...cardBg,
                border: `2px dashed ${isDragging ? '#F4845F' : 'rgba(255,255,255,0.12)'}`,
                backgroundColor: isDragging ? 'rgba(244,132,95,0.06)' : 'rgba(22,27,34,0.95)',
                padding: analysisComplete ? '32px' : '52px 32px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 300ms ease',
              }}
            >
              <input ref={fileInputRef} type="file" accept=".pdf,.txt" onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} style={{ display: 'none' }} />

              <AnimatePresence mode="wait">
                {isAnalyzing ? (
                  <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
                    <Loader2 size={44} className="animate-spin" style={{ color: '#F4845F' }} />
                    <p style={{ color: 'white', fontSize: 17, fontWeight: 600 }}>Analyzing your resume with AI...</p>
                    <p style={{ color: '#8b949e', fontSize: 13 }}>Extracting skills, experience & generating your profile</p>
                  </motion.div>
                ) : analysisComplete ? (
                  <motion.div key="complete" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                    <CheckCircle size={44} style={{ color: '#6BBF7A' }} />
                    <p style={{ color: 'white', fontSize: 17, fontWeight: 600 }}>Resume Analyzed Successfully!</p>
                    <p style={{ color: '#6BBF7A', fontSize: 13 }}>{file?.name}</p>
                  </motion.div>
                ) : (
                  <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(244,132,95,0.12)' }}>
                      <Upload size={28} style={{ color: '#F4845F' }} />
                    </div>
                    <div>
                      <p style={{ color: 'white', fontSize: 17, fontWeight: 600 }}>Drop your resume here</p>
                      <p style={{ color: '#8b949e', fontSize: 13, marginTop: 4 }}>or click to browse • PDF or TXT files</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 10, backgroundColor: 'rgba(255,75,75,0.08)', border: '1px solid rgba(255,75,75,0.2)' }}>
                <X size={15} style={{ color: '#ff4b4b', flexShrink: 0 }} />
                <span style={{ color: '#ff6b6b', fontSize: 13 }}>{error}</span>
              </motion.div>
            )}
          </motion.div>

          {/* ─── AI Analysis Results ─── */}
          <AnimatePresence>
            {analysisComplete && parsedData && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ ...cardBg, padding: '24px', marginTop: 20 }}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <Sparkles size={18} style={{ color: '#F4845F' }} />
                  <h3 style={{ color: 'white', fontSize: 16, fontWeight: 700, letterSpacing: '0.03em' }}>AI ANALYSIS</h3>
                </div>

                {/* Info grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 24px', marginBottom: 24 }}>
                  <div>
                    <p style={labelStyle}>Name</p>
                    <p style={{ color: 'white', fontSize: 16, fontWeight: 600 }}>{(parsedData as { name?: string }).name || 'Not specified'}</p>
                  </div>
                  <div>
                    <p style={labelStyle}>Level</p>
                    <p style={{ color: '#F4845F', fontSize: 16, fontWeight: 600, textTransform: 'capitalize' }}>{(parsedData as { experienceLevel?: string }).experienceLevel || 'Fresher'}</p>
                  </div>
                  <div>
                    <p style={labelStyle}>Suggested Role</p>
                    <p style={{ color: 'white', fontSize: 14, lineHeight: 1.4 }}>{(parsedData as { suggestedRole?: string }).suggestedRole || 'Developer'}</p>
                  </div>
                  <div>
                    <p style={labelStyle}>Skills Found</p>
                    <p style={{ color: 'white', fontSize: 14 }}>{skills.length} skills detected</p>
                  </div>
                </div>

                {/* ─── ALL Skills ─── */}
                {skills.length > 0 && (
                  <div style={{ marginBottom: 20 }}>
                    <p style={{ ...labelStyle, marginBottom: 10 }}>Skills</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {skills.map((skill: string, i: number) => (
                        <span
                          key={i}
                          style={{
                            padding: '6px 12px',
                            borderRadius: 20,
                            fontSize: 12,
                            fontWeight: 600,
                            backgroundColor: 'rgba(244,132,95,0.1)',
                            color: '#ffb59d',
                            border: '1px solid rgba(244,132,95,0.2)',
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* ─── Projects (if any) ─── */}
                {projects.length > 0 && (
                  <div style={{ marginBottom: 20 }}>
                    <p style={{ ...labelStyle, marginBottom: 10 }}>Projects</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {projects.map((proj: string, i: number) => (
                        <div
                          key={i}
                          style={{
                            padding: '10px 14px',
                            borderRadius: 10,
                            backgroundColor: 'rgba(110,181,255,0.04)',
                            border: '1px solid rgba(110,181,255,0.08)',
                          }}
                        >
                          <p style={{ color: '#e6edf3', fontSize: 13, lineHeight: 1.5 }}>{proj}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Continue button */}
                <button
                  onClick={() => navigate('/setup')}
                  style={{
                    width: '100%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '15px 0',
                    borderRadius: 12,
                    backgroundColor: '#F4845F',
                    border: 'none',
                    color: 'white', fontSize: 15, fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 200ms',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#e07350'; e.currentTarget.style.transform = 'scale(1.02)'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#F4845F'; e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  <FileText size={17} />
                  Continue to Interview Setup
                  <ArrowRight size={17} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>
    </div>
  );
}
