import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/* ── Full-screen loader shown while Firebase checks auth state ── */
function AuthLoader() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0d1117',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 16,
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{
        width: 44,
        height: 44,
        borderRadius: '50%',
        border: '3px solid rgba(244,132,95,0.2)',
        borderTopColor: '#F4845F',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ color: '#8b949e', fontSize: 13 }}>Checking session...</p>
    </div>
  );
}

interface Props { children: React.ReactNode; }

export default function ProtectedRoute({ children }: Props) {
  const { user, loading } = useAuth();
  if (loading) return <AuthLoader />;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
