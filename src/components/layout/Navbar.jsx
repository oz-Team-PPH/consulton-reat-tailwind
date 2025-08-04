import { useState } from 'react';
import { 
  Menu, Search, Bell, User, Settings, 
  LogOut, ChevronDown, MessageCircle, CreditCard 
} from 'lucide-react';

const Navbar = ({ onMenuClick, user }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 더미 알림 데이터
  const notifications = [
    {
      id: 1,
      type: 'consultation',
      title: '새로운 상담 요청',
      message: '이민수 전문가가 응답했습니다.',
      time: '5분 전',
      read: false
    },
    {
      id: 2,
      type: 'system',
      title: '상담 요약 완료',
      message: '마케팅 전략 상담 요약이 준비되었습니다.',
      time: '1시간 전',
      read: false
    },
    {
      id: 3,
      type: 'reminder',
      title: '상담 일정 알림',
      message: '30분 후 비즈니스 전략 상담이 예정되어 있습니다.',
      time: '2시간 전',
      read: true
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    // 로그아웃 로직
    console.log('Logout');
    window.location.href = '/login';
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* 좌측: 메뉴 버튼 & 로고 */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 hidden sm:block">
              컨설톤
            </h1>
          </div>
        </div>

        {/* 중앙: 검색바 */}
        <div className="flex-1 max-w-lg mx-8 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="전문가, 상담 내역 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* 우측: 알림, 사용자 메뉴 */}
        <div className="flex items-center space-x-4">
          {/* 크레딧 잔액 (간단 표시) */}
          <div className="hidden sm:flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-lg">
            <CreditCard className="h-4 w-4" />
            <span className="text-sm font-medium">150 크레딧</span>
          </div>

          {/* 알림 */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg relative"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </div>
              )}
            </button>

            {/* 알림 드롭다운 */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">알림</h3>
                    <button className="text-sm text-blue-600 hover:text-blue-700">
                      모두 읽음
                    </button>
                  </div>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          !notification.read ? 'bg-blue-600' : 'bg-gray-300'
                        }`} />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 text-center border-t border-gray-200">
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    모든 알림 보기
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 사용자 메뉴 */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <User className="w-4 h-4 text-gray-600" />
                )}
              </div>
              <span className="hidden sm:block text-sm font-medium">{user.name}</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {/* 사용자 드롭다운 메뉴 */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">user@example.com</p>
                </div>
                
                <div className="py-2">
                  <a
                    href="/profile"
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User className="h-4 w-4" />
                    <span>프로필</span>
                  </a>
                  
                  <a
                    href="/settings"
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Settings className="h-4 w-4" />
                    <span>설정</span>
                  </a>
                  
                  <a
                    href="/chat"
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>상담 내역</span>
                  </a>
                </div>
                
                <div className="py-2 border-t border-gray-200">
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>로그아웃</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 모바일 검색바 */}
      <div className="mt-3 md:hidden">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;