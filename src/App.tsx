import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { InterviewProvider } from './context/InterviewContext';
import Hero from './pages/Hero';
import ResumeUpload from './pages/ResumeUpload';
import InterviewSetup from './pages/InterviewSetup';
import InterviewRoom from './pages/InterviewRoom';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <InterviewProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/upload" element={<ResumeUpload />} />
          <Route path="/setup" element={<InterviewSetup />} />
          <Route path="/interview" element={<InterviewRoom />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </InterviewProvider>
  );
}

export default App;
