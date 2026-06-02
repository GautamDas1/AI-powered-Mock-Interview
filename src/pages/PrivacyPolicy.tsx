import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: '#0d1117',
    fontFamily: "'Inter', sans-serif",
    color: '#e6edf3',
  };
  const headerStyle: React.CSSProperties = {
    position: 'sticky', top: 0, zIndex: 50,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 24px',
    backgroundColor: 'rgba(13,17,23,0.88)',
    backdropFilter: 'blur(16px)',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  };
  const h2Style: React.CSSProperties = {
    fontFamily: "'Anton', sans-serif", fontSize: 22, color: 'white',
    letterSpacing: '0.02em', textTransform: 'uppercase', marginBottom: 14, marginTop: 32,
  };
  const pStyle: React.CSSProperties = {
    color: '#c9d1d9', fontSize: 13.5, lineHeight: 1.75, marginBottom: 12,
  };
  const liStyle: React.CSSProperties = {
    color: '#c9d1d9', fontSize: 13.5, lineHeight: 1.75, marginBottom: 6, paddingLeft: 8,
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <button
          onClick={() => navigate(-1)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: '#e6edf3', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
        >
          <ArrowLeft size={14} /> Back
        </button>
        <button onClick={() => navigate('/')} style={{ fontFamily: "'Anton', sans-serif", fontSize: 22, color: 'white', letterSpacing: '0.04em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer' }}>InterviewAI</button>
        <div style={{ width: 80 }} />
      </header>

      <main style={{ maxWidth: 680, margin: '0 auto', padding: '32px 24px 60px' }}>
        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(110,181,255,0.1)' }}>
            <Shield size={18} style={{ color: '#6EB5FF' }} />
          </div>
          <h1 style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(28px, 5vw, 40px)', color: 'white', letterSpacing: '-0.01em', textTransform: 'uppercase' }}>
            Privacy Policy
          </h1>
        </div>
        <p style={{ color: '#8b949e', fontSize: 12, marginBottom: 32 }}>Last updated: June 2, 2026</p>

        <p style={pStyle}>
          InterviewAI ("we", "our", or "the Service") respects your privacy. This policy explains what data we collect, how we use it, and your rights regarding that data.
        </p>

        <h2 style={h2Style}>1. Information We Collect</h2>
        <p style={pStyle}>When you use InterviewAI, we collect:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={liStyle}>• <strong>Google Account Info:</strong> Your name, email address, and profile picture via Google Sign-In.</li>
          <li style={liStyle}>• <strong>Resume Data:</strong> The text content of your uploaded resume, which is processed in real-time to generate interview questions.</li>
          <li style={liStyle}>• <strong>Interview Responses:</strong> Your answers, scores, and AI-generated feedback from mock interviews.</li>
          <li style={liStyle}>• <strong>Usage Analytics:</strong> Anonymous usage data such as pages visited, interview modes selected, and session duration via Firebase Analytics.</li>
        </ul>

        <h2 style={h2Style}>2. How We Use Your Data</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={liStyle}>• To provide personalized AI-powered mock interviews based on your resume.</li>
          <li style={liStyle}>• To save your interview history so you can track your progress over time.</li>
          <li style={liStyle}>• To generate performance analytics and improvement roadmaps.</li>
          <li style={liStyle}>• To improve the Service through aggregated, anonymous usage statistics.</li>
        </ul>

        <h2 style={h2Style}>3. Third-Party Services</h2>
        <p style={pStyle}>We use the following third-party services:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={liStyle}>• <strong>Google Firebase:</strong> Authentication, Firestore database, and Analytics.</li>
          <li style={liStyle}>• <strong>Groq API:</strong> AI-powered resume analysis, question generation, and answer evaluation. Your resume text is sent to Groq's servers for processing.</li>
        </ul>
        <p style={pStyle}>
          These services have their own privacy policies. We encourage you to review them.
        </p>

        <h2 style={h2Style}>4. Data Storage & Security</h2>
        <p style={pStyle}>
          Your interview data is stored in Google Cloud Firestore, associated with your authenticated user ID. We use Firebase's built-in security rules to ensure only you can access your own data. We do not sell, share, or distribute your personal data to any other parties.
        </p>

        <h2 style={h2Style}>5. Data Retention</h2>
        <p style={pStyle}>
          Your interview history is retained for as long as your account exists. You may request deletion of your data at any time by contacting us.
        </p>

        <h2 style={h2Style}>6. Your Rights</h2>
        <p style={pStyle}>You have the right to:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={liStyle}>• Access the personal data we hold about you.</li>
          <li style={liStyle}>• Request correction of inaccurate data.</li>
          <li style={liStyle}>• Request deletion of your data and account.</li>
          <li style={liStyle}>• Withdraw consent for data processing at any time.</li>
        </ul>

        <h2 style={h2Style}>7. Contact</h2>
        <p style={pStyle}>
          For privacy-related inquiries, please contact us at:{' '}
          <a href="mailto:gautamdas@interviewai.app" style={{ color: '#F4845F', textDecoration: 'none' }}>gautamdas@interviewai.app</a>
        </p>
      </main>
    </div>
  );
}
