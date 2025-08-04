import { useState, useRef } from 'react';
import { 
  User, Mail, Phone, MapPin, Calendar, 
  Camera, Edit3, Save, X, Eye, EyeOff 
} from 'lucide-react';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: '김철수',
    email: 'kim.chulsu@example.com',
    phone: '010-1234-5678',
    company: 'ABC 쇼핑몰',
    position: '마케팅 팀장',
    location: '서울시 강남구',
    bio: '10년 경력의 마케팅 전문가입니다. 온라인 마케팅과 브랜드 전략에 관심이 많습니다.',
    avatar: null,
    joinDate: new Date('2023-03-15'),
    lastLogin: new Date('2024-01-15T09:30:00'),
    totalConsultations: 23,
    totalCreditsUsed: 450,
    preferredCategories: ['마케팅', '비즈니스', '기술'],
    language: 'ko',
    timezone: 'Asia/Seoul'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [saveStatus, setSaveStatus] = useState('idle');
  const fileInputRef = useRef(null);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    setSaveStatus('saving');
    
    try {
      // API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEditing(false);
      setSaveStatus('saved');
      
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      alert('비밀번호는 최소 8자 이상이어야 합니다.');
      return;
    }

    try {
      // API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowPasswordChange(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      alert('비밀번호가 성공적으로 변경되었습니다.');
    } catch (error) {
      alert('비밀번호 변경에 실패했습니다.');
    }
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          avatar: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const stats = [
    {
      label: '총 상담 횟수',
      value: profileData.totalConsultations,
      unit: '회'
    },
    {
      label: '사용한 크레딧',
      value: profileData.totalCreditsUsed,
      unit: '크레딧'
    },
    {
      label: '가입일',
      value: profileData.joinDate.toLocaleDateString('ko-KR'),
      unit: ''
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">프로필</h1>
              <p className="mt-2 text-gray-600">계정 정보를 관리하고 설정을 변경하세요.</p>
            </div>
            
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit3 className="h-4 w-4" />
                <span>편집</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setSaveStatus('idle');
                  }}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <X className="h-4 w-4" />
                  <span>취소</span>
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={saveStatus === 'saving'}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{saveStatus === 'saving' ? '저장 중...' : '저장'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 좌측: 프로필 정보 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 기본 정보 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">기본 정보</h2>
              
              <div className="space-y-6">
                {/* 프로필 사진 */}
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                      {profileData.avatar ? (
                        <img src={profileData.avatar} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-8 h-8 text-gray-600" />
                      )}
                    </div>
                    {isEditing && (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{profileData.name}</h3>
                    <p className="text-gray-600">{profileData.position} • {profileData.company}</p>
                  </div>
                </div>

                {/* 입력 필드들 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{profileData.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{profileData.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">전화번호</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{profileData.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">회사</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{profileData.company}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">직책</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.position}
                        onChange={(e) => handleInputChange('position', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{profileData.position}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">위치</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{profileData.location}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">소개</label>
                  {isEditing ? (
                    <textarea
                      rows={4}
                      value={profileData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="자기소개를 입력하세요..."
                    />
                  ) : (
                    <p className="text-gray-900">{profileData.bio}</p>
                  )}
                </div>
              </div>
            </div>

            {/* 보안 설정 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">보안 설정</h2>
                <button
                  onClick={() => setShowPasswordChange(!showPasswordChange)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  비밀번호 변경
                </button>
              </div>

              {showPasswordChange && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">현재 비밀번호</label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">새 비밀번호</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">새 비밀번호 확인</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowPasswordChange(false)}
                      className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      취소
                    </button>
                    <button
                      onClick={handlePasswordUpdate}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      비밀번호 변경
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 우측: 통계 및 활동 */}
          <div className="space-y-6">
            {/* 활동 통계 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">활동 통계</h3>
              <div className="space-y-4">
                {stats.map((stat, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-600">{stat.label}</span>
                    <span className="font-semibold text-gray-900">
                      {stat.value}{stat.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 관심 분야 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">관심 분야</h3>
              <div className="flex flex-wrap gap-2">
                {profileData.preferredCategories.map((category, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            {/* 최근 활동 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">계정 정보</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">마지막 로그인</span>
                  <span className="text-gray-900">
                    {profileData.lastLogin.toLocaleDateString('ko-KR')} {profileData.lastLogin.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">언어</span>
                  <span className="text-gray-900">한국어</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">시간대</span>
                  <span className="text-gray-900">서울 (UTC+9)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 저장 완료 메시지 */}
        {saveStatus === 'saved' && (
          <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg">
            프로필이 성공적으로 저장되었습니다!
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;