import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';

// Pages - 단계적 import
import Dashboard from './pages/Dashboard';

// Layout Components
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';

import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // 개발용으로 true 설정
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 인증이 필요한 페이지들을 위한 보호된 라우트
  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/dashboard" replace />;
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* 대시보드만 먼저 테스트 */}
          <Route path="/*" element={
            <ProtectedRoute>
              <div className="flex h-screen">
                {/* 사이드바 */}
                <Sidebar 
                  isOpen={sidebarOpen} 
                  onClose={() => setSidebarOpen(false)} 
                />

                {/* 메인 콘텐츠 */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* 상단 네비게이션 */}
                  <Navbar 
                    onMenuClick={() => setSidebarOpen(true)}
                    user={{ name: '김철수', avatar: null }}
                  />

                  {/* 페이지 콘텐츠 */}
                  <main className="flex-1 overflow-y-auto">
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                    </Routes>
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
