import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SidebarProvider } from './context/SidebarContext';

// Layouts
import AuthLayout from './components/layout/AuthLayout';
import DashboardLayout from './components/layout/DashboardLayout';

// Pages
import LandingPage from './features/landing/pages/LandingPage';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import ResumeAnalysisPage from './features/resume/pages/ResumeAnalysisPage';
import InterviewSetupPage from './features/interview/pages/InterviewSetupPage';
import InterviewSessionPage from './features/interview/pages/InterviewSessionPage';
import InterviewResultPage from './features/interview/pages/InterviewResultPage';
import PracticePlanPage from './features/practice/pages/PracticePlanPage';
import AnalyticsPage from './features/analytics/pages/AnalyticsPage';
import InterviewHistoryPage from './features/interview/pages/InterviewHistoryPage';
import InterviewReplayPage from './features/interview/pages/InterviewReplayPage';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SidebarProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              
              {/* Auth Routes */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Route>

              {/* Dashboard / Protected Routes */}
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/resume-analysis" element={<ResumeAnalysisPage />} />
                <Route path="/interview/setup" element={<InterviewSetupPage />} />
                <Route path="/interview/session" element={<InterviewSessionPage />} />
                <Route path="/interview/result" element={<InterviewResultPage />} />
                <Route path="/interviews/history" element={<InterviewHistoryPage />} />
                <Route path="/interviews/:id/replay" element={<InterviewReplayPage />} />
                <Route path="/practice-plan" element={<PracticePlanPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </SidebarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
