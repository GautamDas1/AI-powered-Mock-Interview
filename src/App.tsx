import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { InterviewProvider } from './context/InterviewContext';
import ProtectedRoute from './components/ProtectedRoute';
import Hero from './pages/Hero';
import Login from './pages/Login';
import ResumeUpload from './pages/ResumeUpload';
import InterviewSetup from './pages/InterviewSetup';
import InterviewRoom from './pages/InterviewRoom';
import Dashboard from './pages/Dashboard';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import InterviewHistory from './pages/InterviewHistory';

function App() {
  return (
    <AuthProvider>
      <InterviewProvider>
        <Router>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Hero />} />
            <Route path="/login" element={<Login />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />

            {/* Protected — require Google sign-in */}
            <Route path="/upload"    element={<ProtectedRoute><ResumeUpload /></ProtectedRoute>} />
            <Route path="/setup"     element={<ProtectedRoute><InterviewSetup /></ProtectedRoute>} />
            <Route path="/interview" element={<ProtectedRoute><InterviewRoom /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/history"   element={<ProtectedRoute><InterviewHistory /></ProtectedRoute>} />
          </Routes>
        </Router>
      </InterviewProvider>
    </AuthProvider>
  );
}

export default App;
