import { useState } from 'react';
import { 
  Home, MessageCircle, Users, Video, FileText, 
  Settings, User, X, ChevronRight, BarChart3,
  CreditCard, Bell
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const [activeItem, setActiveItem] = useState('dashboard');

  const menuItems = [
    {
      id: 'dashboard',
      name: '대시보드',
      icon: Home,
      path: '/dashboard',
      description: '전체 현황 보기'
    },
    {
      id: 'experts',
      name: '전문가 매칭',
      icon: Users,
      path: '/experts',
      description: '전문가 찾기'
    },
    {
      id: 'chat',
      name: '채팅 상담',
      icon: MessageCircle,
      path: '/chat',
      description: '진행 중인 상담',
      badge: '2'
    },
    {
      id: 'video',
      name: '화상 상담',
      icon: Video,
      path: '/video',
      description: '화상 회의'
    },
    {
      id: 'summary',
      name: '상담 요약',
      icon: FileText,
      path: '/summary/123',
      description: '상담 기록 보기'
    },
    {
      id: 'analytics',
      name: '분석 리포트',
      icon: BarChart3,
      path: '/analytics',
      description: '상담 통계'
    }
  ];

  const settingsItems = [
    {
      id: 'notifications',
      name: '알림 설정',
      icon: Bell,
      path: '/settings',
      description: '알림 관리'
    },
    {
      id: 'profile',
      name: '프로필',
      icon: User,
      path: '/profile',
      description: '계정 정보'
    },
    {
      id: 'billing',
      name: '결제 및 크레딧',
      icon: CreditCard,
      path: '/billing',
      description: '크레딧 관리'
    },
    {
      id: 'settings',
      name: '설정',
      icon: Settings,
      path: '/settings',
      description: '일반 설정'
    }
  ];

  const handleItemClick = (item) => {
    setActiveItem(item.id);
    window.location.href = item.path;
    onClose(); // 모바일에서 메뉴 선택 시 사이드바 닫기
  };

  return (
    <>
      {/* 모바일 오버레이 */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* 사이드바 */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* 사이드바 헤더 */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">컨설톤</h1>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* 메뉴 섹션 */}
          <div className="flex-1 overflow-y-auto py-4">
            {/* 메인 메뉴 */}
            <div className="px-4 mb-6">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                메인 메뉴
              </h2>
              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = activeItem === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <IconComponent className={`h-5 w-5 ${
                          isActive ? 'text-blue-700' : 'text-gray-500'
                        }`} />
                        <div className="text-left">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-gray-500">{item.description}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {item.badge && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {item.badge}
                          </span>
                        )}
                        <ChevronRight className={`h-4 w-4 ${
                          isActive ? 'text-blue-700' : 'text-gray-400'
                        }`} />
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* 설정 메뉴 */}
            <div className="px-4">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                설정
              </h2>
              <nav className="space-y-1">
                {settingsItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = activeItem === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <IconComponent className={`h-5 w-5 ${
                          isActive ? 'text-blue-700' : 'text-gray-500'
                        }`} />
                        <div className="text-left">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-gray-500">{item.description}</div>
                        </div>
                      </div>
                      
                      <ChevronRight className={`h-4 w-4 ${
                        isActive ? 'text-blue-700' : 'text-gray-400'
                      }`} />
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* 사이드바 하단 */}
          <div className="p-4 border-t border-gray-200">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium text-blue-900">크레딧 잔액</div>
                  <div className="text-xs text-blue-700">150 크레딧 보유</div>
                </div>
              </div>
              <button className="w-full bg-blue-600 text-white text-sm font-medium py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors">
                크레딧 충전
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;