import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Pages
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import CreditPackages from "./pages/CreditPackages";
import ConsultationChat from "./pages/ConsultationChat";

import ExpertSearch from "./pages/ExpertSearch";
import ConsultationSummary from "./pages/ConsultationSummary";
import VideoConsultation from "./pages/VideoConsultation";
import NotificationSettings from "./pages/NotificationSettings";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

// Layout Components
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";

import "./App.css";

function App() {
  const [isAuthenticated, _setIsAuthenticated] = useState(true); // 개발용으로 true 설정
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // localStorage에서 서비스 진입 상태를 확인, 기본값은 true (랜딩페이지 표시)
  const [showLanding, setShowLanding] = useState(() => {
    const hasEnteredService = localStorage.getItem("hasEnteredService");
    return hasEnteredService !== "true";
  });

  // 서비스 진입 핸들러
  const handleEnterService = () => {
    setShowLanding(false);
    localStorage.setItem("hasEnteredService", "true");
  };

  // 랜딩페이지로 돌아가기 핸들러
  const handleBackToLanding = () => {
    setShowLanding(true);
    localStorage.removeItem("hasEnteredService");
  };

  // 인증이 필요한 페이지들을 위한 보호된 라우트
  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/dashboard" replace />;
  };

  // 네비게이션 핸들러를 위한 컴포넌트
  const AppContent = () => {
    const navigate = useNavigate();

    const handleNavigation = (page) => {
      if (page === "expertSearch") {
        navigate("/expert-search");
      }
    };

    return (
      <div className="flex min-h-screen">
        {/* 사이드바 */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* 메인 콘텐츠 */}
        <div className="flex-1 flex flex-col">
          {/* 상단 네비게이션 */}
          <Navbar
            onMenuClick={() => setSidebarOpen(true)}
            onBackToLanding={handleBackToLanding}
            onNavigate={handleNavigation}
            user={{ name: "김철수", avatar: null }}
          />

          {/* 페이지 콘텐츠 */}
          <main className="pt-16 lg:ml-64">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/expert-search" element={<ExpertSearch />} />
              <Route path="/credit-packages" element={<CreditPackages />} />
              <Route path="/chat" element={<ConsultationChat />} />

              <Route path="/video" element={<VideoConsultation />} />
              <Route path="/summary/:id" element={<ConsultationSummary />} />
              <Route path="/notifications" element={<NotificationSettings />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 랜딩페이지 */}
      {showLanding && <LandingPage onEnterService={handleEnterService} />}

      {/* 서비스 화면 */}
      {!showLanding && (
        <Router>
          <div className="min-h-screen bg-gray-50">
            <ProtectedRoute>
              <AppContent />
            </ProtectedRoute>
          </div>
        </Router>
      )}
    </div>
  );
}

export default App;
