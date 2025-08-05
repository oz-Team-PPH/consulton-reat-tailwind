import { useState, useEffect } from 'react';
import { 
  Mic, MicOff, Video, VideoOff, Monitor, MonitorOff, 
  Phone, Settings, Users, MessageCircle, Clock, User,
  Send, Maximize2, Volume2
} from 'lucide-react';

const VideoConsultation = () => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [showChat, setShowChat] = useState(true);
  const [showVideoGrid, setShowVideoGrid] = useState(true);
  const [newChatMessage, setNewChatMessage] = useState('');
  
  // 상담 시작 관련 상태
  const [isConsultationStarted, setIsConsultationStarted] = useState(false);
  const [expertReady, setExpertReady] = useState(false);
  const [userReady, setUserReady] = useState(false);
  
  // 미디어 권한 관련 상태
  const [mediaPermissionGranted, setMediaPermissionGranted] = useState(false);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const [permissionError, setPermissionError] = useState('');

  useEffect(() => {
    // 더미 채팅 메시지
    setChatMessages([
      {
        id: 1,
        sender: '이민수 전문가',
        message: '안녕하세요! 화면과 음성이 잘 들리시나요?',
        timestamp: new Date(Date.now() - 120000),
        isExpert: true
      },
      {
        id: 2,
        sender: '김철수',
        message: '네, 잘 들립니다!',
        timestamp: new Date(Date.now() - 60000),
        isExpert: false
      }
    ]);
  }, []);

  // 상담이 시작되면 타이머 시작
  useEffect(() => {
    let timer;
    if (isConsultationStarted) {
      timer = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isConsultationStarted]);

  // 전문가와 사용자 모두 준비 완료시 상담 시작
  useEffect(() => {
    if (expertReady && userReady && !isConsultationStarted) {
      setIsConsultationStarted(true);
    }
  }, [expertReady, userReady, isConsultationStarted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    if (confirm('정말로 상담을 종료하시겠습니까?')) {
      window.location.href = '/dashboard';
    }
  };

  const handleUserReady = () => {
    setUserReady(true);
  };

  const handleExpertReady = () => {
    // 실제로는 전문가가 별도로 준비 완료를 해야 하지만, 
    // 데모용으로 3초 후 자동으로 전문가도 준비 완료되도록 설정
    setTimeout(() => {
      setExpertReady(true);
    }, 3000);
  };

  const requestMediaPermissions = async () => {
    setIsRequestingPermission(true);
    setPermissionError('');

    try {
      // 마이크와 카메라 권한 요청
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      // 권한이 허용되면 스트림을 정리 (실제 사용은 나중에)
      stream.getTracks().forEach(track => track.stop());
      
      setMediaPermissionGranted(true);
      setIsRequestingPermission(false);
    } catch (error) {
      setIsRequestingPermission(false);
      
      if (error.name === 'NotAllowedError') {
        setPermissionError('마이크와 카메라 권한이 거부되었습니다. 브라우저 설정에서 권한을 허용해주세요.');
      } else if (error.name === 'NotFoundError') {
        setPermissionError('마이크 또는 카메라를 찾을 수 없습니다. 장치가 연결되어 있는지 확인해주세요.');
      } else {
        setPermissionError('미디어 장치에 접근할 수 없습니다. 브라우저를 새로고침하고 다시 시도해주세요.');
      }
    }
  };

  const handleSendChatMessage = () => {
    if (!newChatMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: '김철수',
      message: newChatMessage,
      timestamp: new Date(),
      isExpert: false
    };

    setChatMessages(prev => [...prev, newMessage]);
    setNewChatMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 상담 시작 준비 확인 모달 */}
      {!isConsultationStarted && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">상담 준비 확인</h2>
              <p className="text-gray-600 mb-6">
                {!mediaPermissionGranted 
                  ? '상담을 위해 마이크와 카메라 사용 권한이 필요합니다.'
                  : '화면과 음성이 정상적으로 작동하는지 확인하고 상담을 시작해주세요.'
                }
              </p>
              
              {/* 미디어 권한이 허용되지 않은 경우 */}
              {!mediaPermissionGranted ? (
                <div className="space-y-4">
                  {permissionError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{permissionError}</p>
                    </div>
                  )}
                  
                  <button
                    onClick={requestMediaPermissions}
                    disabled={isRequestingPermission}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                      isRequestingPermission
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isRequestingPermission ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>권한 요청 중...</span>
                      </div>
                    ) : (
                      '마이크 및 카메라 권한 허용'
                    )}
                  </button>
                  
                  <div className="text-xs text-gray-500 text-center">
                    브라우저에서 권한 요청이 나타나면 '허용'을 선택해주세요
                  </div>
                </div>
              ) : (
                // 미디어 권한이 허용된 경우 기존 UI 표시
                <>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">미디어 권한</span>
                      <div className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        허용됨
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">사용자 준비 상태</span>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        userReady 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {userReady ? '준비 완료' : '대기 중'}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">전문가 준비 상태</span>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        expertReady 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {expertReady ? '준비 완료' : '대기 중'}
                      </div>
                    </div>
                  </div>
                  
                  {!userReady ? (
                    <button
                      onClick={() => {
                        handleUserReady();
                        handleExpertReady(); // 데모용으로 전문가도 자동 준비
                      }}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      준비 완료
                    </button>
                  ) : (
                    <div className="text-center">
                      <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                      <p className="text-sm text-gray-600">전문가 준비 대기 중...</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 상단 헤더 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-900">화상 상담</h1>
          <div className="flex items-center space-x-2 bg-green-50 border border-green-200 text-green-700 px-3 py-1 rounded-full text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-medium">연결됨</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1 rounded-lg">
            <Clock className="h-4 w-4" />
            <span className="font-medium">
              {isConsultationStarted ? formatTime(sessionTime) : '준비 중'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {isRecording && (
            <div className="flex items-center space-x-2 bg-red-50 border border-red-200 text-red-700 px-3 py-1 rounded-lg">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">녹화 중</span>
            </div>
          )}
          
          <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1 rounded-lg">
            <Users className="h-4 w-4" />
            <span className="font-medium">2명 참여</span>
          </div>
          
          <button
            onClick={() => setShowVideoGrid(!showVideoGrid)}
            className={`p-2 rounded-lg border transition-colors relative ${
              showVideoGrid 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
            title="비디오 화면 표시/숨김"
          >
            <Video className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 flex bg-gray-50 relative">
        {/* 메인 채팅 영역 */}
        <div className="flex-1 bg-white flex flex-col">
          {/* 채팅 메시지 영역 */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {chatMessages.map(message => (
              <div key={message.id} className="flex justify-start">
                <div className={`max-w-md px-4 py-3 rounded-lg shadow-sm ${
                  message.isExpert 
                    ? 'bg-gray-100 text-gray-800' 
                    : 'bg-blue-600 text-white'
                }`}>
                  <div className="text-xs opacity-70 mb-1 font-medium">
                    {message.sender}
                  </div>
                  <div className="text-sm leading-relaxed">{message.message}</div>
                  <div className="text-xs opacity-60 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            
            {/* 더미 추가 메시지들 */}
            <div className="flex justify-start">
              <div className="max-w-md px-4 py-3 rounded-lg shadow-sm bg-gray-100 text-gray-800">
                <div className="text-xs opacity-70 mb-1 font-medium">이민수 전문가</div>
                <div className="text-sm leading-relaxed">안녕하세요! 오늘 상담받고 싶은 주제가 무엇인가요?</div>
                <div className="text-xs opacity-60 mt-2">{new Date().toLocaleTimeString()}</div>
              </div>
            </div>
            
            <div className="flex justify-start">
              <div className="max-w-md px-4 py-3 rounded-lg shadow-sm bg-blue-600 text-white">
                <div className="text-xs opacity-70 mb-1 font-medium">김철수</div>
                <div className="text-sm leading-relaxed">마케팅 전략에 대해 상담받고 싶습니다.</div>
                <div className="text-xs opacity-60 mt-2">{new Date().toLocaleTimeString()}</div>
              </div>
            </div>
            
            <div className="flex justify-start">
              <div className="max-w-md px-4 py-3 rounded-lg shadow-sm bg-gray-100 text-gray-800">
                <div className="text-xs opacity-70 mb-1 font-medium">이민수 전문가</div>
                <div className="text-sm leading-relaxed">좋습니다! 현재 어떤 사업을 하고 계신지, 그리고 주요 타겟 고객층이 누구인지 먼저 알려주시겠어요?</div>
                <div className="text-xs opacity-60 mt-2">{new Date().toLocaleTimeString()}</div>
              </div>
            </div>
          </div>
          
          {/* 메시지 입력 영역 */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex space-x-3">
              <input
                type="text"
                value={newChatMessage}
                onChange={(e) => setNewChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage()}
                placeholder="메시지를 입력하세요..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              <button
                onClick={handleSendChatMessage}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 우측 상단 비디오 그리드 */}
        {showVideoGrid && (
          <div className="absolute top-4 right-4 w-80 space-y-3 z-10">
            {/* 전문가 비디오 */}
            <div className="relative bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200">
              <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center">
                {isVideoOn ? (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-2 mx-auto shadow-lg">
                      <Video className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-gray-900 text-sm font-semibold">이민수 전문가</div>
                    <div className="text-blue-600 text-xs">비디오 활성화</div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mb-2 shadow-lg">
                      <User className="w-8 h-8 text-gray-600" />
                    </div>
                    <div className="text-gray-900 text-sm font-semibold">이민수 전문가</div>
                    <div className="text-gray-500 text-xs">비디오 꺼짐</div>
                  </div>
                )}
              </div>
              
              {/* 전문가 상태 표시 */}
              <div className="absolute bottom-3 right-3">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-full shadow-lg ${isAudioOn ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {isAudioOn ? (
                      <Mic className="w-4 h-4" />
                    ) : (
                      <MicOff className="w-4 h-4" />
                    )}
                  </div>
                  <div className={`p-2 rounded-full shadow-lg ${isVideoOn ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {isVideoOn ? (
                      <Video className="w-4 h-4" />
                    ) : (
                      <VideoOff className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 사용자 비디오 (같은 크기) */}
            <div className="relative bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200">
              <div className="w-full h-48 bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col items-center justify-center">
                {isVideoOn ? (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-2 shadow-lg">
                      <Video className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-gray-900 text-sm font-semibold">김철수 (나)</div>
                    <div className="text-green-600 text-xs">비디오 활성화</div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mb-2 shadow-lg">
                      <User className="w-8 h-8 text-gray-600" />
                    </div>
                    <div className="text-gray-900 text-sm font-semibold">김철수 (나)</div>
                    <div className="text-gray-500 text-xs">비디오 꺼짐</div>
                  </div>
                )}
              </div>
              
              {/* 사용자 상태 표시 */}
              <div className="absolute bottom-3 right-3">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-full shadow-lg ${isAudioOn ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {isAudioOn ? (
                      <Mic className="w-4 h-4" />
                    ) : (
                      <MicOff className="w-4 h-4" />
                    )}
                  </div>
                  <div className={`p-2 rounded-full shadow-lg ${isVideoOn ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {isVideoOn ? (
                      <Video className="w-4 h-4" />
                    ) : (
                      <VideoOff className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 화면 공유 표시 */}
        {isScreenSharing && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow-lg z-20">
            <Monitor className="w-4 h-4" />
            <span className="text-sm font-medium">화면 공유 중</span>
          </div>
        )}
      </div>

      {/* 하단 컨트롤 바 */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-center shadow-sm">
        <div className="flex items-center space-x-3">
          
          {/* 마이크 버튼 */}
          <button
            onClick={() => setIsAudioOn(!isAudioOn)}
            className={`p-4 rounded-full border transition-colors ${
              isAudioOn
                ? 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
            }`}
            title={isAudioOn ? '마이크 끄기' : '마이크 켜기'}
          >
            {isAudioOn ? (
              <Mic className="h-6 w-6" />
            ) : (
              <MicOff className="h-6 w-6" />
            )}
          </button>

          {/* 비디오 버튼 */}
          <button
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`p-4 rounded-full border transition-colors ${
              isVideoOn
                ? 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
            }`}
            title={isVideoOn ? '비디오 끄기' : '비디오 켜기'}
          >
            {isVideoOn ? (
              <Video className="h-6 w-6" />
            ) : (
              <VideoOff className="h-6 w-6" />
            )}
          </button>

          {/* 화면 공유 버튼 */}
          <button
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            className={`p-4 rounded-full border transition-colors ${
              isScreenSharing
                ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
            }`}
            title={isScreenSharing ? '화면 공유 중지' : '화면 공유 시작'}
          >
            {isScreenSharing ? (
              <MonitorOff className="h-6 w-6" />
            ) : (
              <Monitor className="h-6 w-6" />
            )}
          </button>

          {/* 녹화 버튼 */}
          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`p-4 rounded-full border transition-colors ${
              isRecording
                ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
            }`}
            title={isRecording ? '녹화 중지' : '녹화 시작'}
          >
            <div className={`w-6 h-6 rounded-full ${
              isRecording 
                ? 'bg-red-600' 
                : 'border-2 border-current'
            }`} />
          </button>

          {/* 설정 버튼 */}
          <button
            className="p-4 bg-gray-50 text-gray-700 border border-gray-200 rounded-full hover:bg-gray-100 transition-colors"
            title="설정"
          >
            <Settings className="h-6 w-6" />
          </button>

          {/* 통화 종료 버튼 */}
          <button
            onClick={handleEndCall}
            className="p-4 bg-red-600 text-white border border-red-600 rounded-full hover:bg-red-700 transition-colors ml-4"
            title="통화 종료"
          >
            <Phone className="h-6 w-6 transform rotate-[135deg]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoConsultation;