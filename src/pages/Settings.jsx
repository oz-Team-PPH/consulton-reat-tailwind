import { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Shield, 
  Bell, 
  Palette,
  Mail,
  Sun,
  Moon,
  Monitor,
  Check
} from 'lucide-react';

const Settings = () => {

  // 통합 설정 상태
  const [settings, setSettings] = useState({
    theme: 'light',
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    twoFactorAuth: false,
    emailNotifications: true
  });

  const handleSettingChange = (key, value) => {
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      setSettings(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [key]: value
      }));
    }
  };

  const handleExternalLink = (path) => {
    window.location.href = path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <SettingsIcon className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">설정</h1>
          </div>
          <p className="text-gray-600">
            필수 설정을 간편하게 관리하세요.
          </p>
        </div>

        {/* 설정 카드들 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
          
          {/* 테마 설정 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Palette className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">테마 설정</h3>
            </div>
            <p className="text-gray-600 mb-4">화면 모드를 선택하세요</p>
            <div className="space-y-2">
              {[
                { value: 'light', label: '라이트 모드', icon: Sun },
                { value: 'dark', label: '다크 모드', icon: Moon },
                { value: 'system', label: '시스템 설정', icon: Monitor }
              ].map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => handleSettingChange('theme', theme.value)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    settings.theme === theme.value 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <theme.icon className="h-5 w-5 text-gray-600" />
                    <span className="font-medium">{theme.label}</span>
                  </div>
                  {settings.theme === theme.value && (
                    <Check className="h-5 w-5 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 알림 설정 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Bell className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">알림 설정</h3>
            </div>
            <p className="text-gray-600 mb-4">알림 수신 방법을 설정하세요</p>
            <div className="space-y-4">
              {[
                { key: 'notifications.email', label: '이메일 알림', description: '새로운 메시지와 업데이트' },
                { key: 'notifications.push', label: '푸시 알림', description: '실시간 알림 받기' },
                { key: 'notifications.sms', label: 'SMS 알림', description: '중요한 알림만' }
              ].map((notification) => (
                <div key={notification.key} className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                  <div>
                    <div className="font-medium text-gray-900">{notification.label}</div>
                    <div className="text-sm text-gray-500">{notification.description}</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications[notification.key.split('.')[1]]}
                      onChange={(e) => handleSettingChange(notification.key, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* 보안 설정 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">보안 설정</h3>
            </div>
            <p className="text-gray-600 mb-4">계정 보안을 강화하세요</p>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                <div>
                  <div className="font-medium text-gray-900">2단계 인증</div>
                  <div className="text-sm text-gray-500">로그인 시 추가 보안 코드 요구</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.twoFactorAuth}
                    onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <button className="w-full p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-900">비밀번호 변경</div>
                <div className="text-sm text-gray-500">새로운 비밀번호로 변경</div>
              </button>
            </div>
          </div>

          {/* 계정 설정 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Mail className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">계정 설정</h3>
            </div>
            <p className="text-gray-600 mb-4">계정 정보를 관리하세요</p>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                <div>
                  <div className="font-medium text-gray-900">이메일 알림</div>
                  <div className="text-sm text-gray-500">계정 관련 이메일 수신</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <button 
                onClick={() => handleExternalLink('/notification-settings')}
                className="w-full p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium text-gray-900">상세 알림 설정</div>
                <div className="text-sm text-gray-500">알림 유형별 세부 설정</div>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Settings;