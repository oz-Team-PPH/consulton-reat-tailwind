import { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Video, VideoOff, Monitor, MonitorOff, 
  Phone, Settings, Users, MessageCircle, Clock 
} from 'lucide-react';
import VideoGrid from '../components/video/VideoGrid';
import ParticipantVideo from '../components/video/ParticipantVideo';
import VideoControls from '../components/video/VideoControls';
import MuteButton from '../components/video/MuteButton';
import VideoToggleButton from '../components/video/VideoToggleButton';
import ScreenShareButton from '../components/video/ScreenShareButton';
import StatusIndicator from '../components/video/StatusIndicator';

const VideoConsultation = () => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [sessionTime, setSessionTime] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [newChatMessage, setNewChatMessage] = useState('');
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // 더미 참가자 데이터
  const mockParticipants = [
    {
      id: 'user-1',
      name: '김철수',
      role: 'client',
      isVideoOn: true,
      isAudioOn: true,
      isPresenting: false
    },
    {
      id: 'expert-1',
      name: '이민수 전문가',
      role: 'expert',
      isVideoOn: true,
      isAudioOn: true,
      isPresenting: false
    }
  ];

  useEffect(() => {
    setParticipants(mockParticipants);
    
    // 세션 시간 카운터
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);

    // 더미 채팅 메시지
    setChatMessages([
      {
        id: 1,
        sender: '이민수 전문가',
        message: '안녕하세요! 화면과 음성이 잘 들리시나요?',
        timestamp: new Date(Date.now() - 120000)
      },
      {
        id: 2,
        sender: '김철수',
        message: '네, 잘 들립니다!',
        timestamp: new Date(Date.now() - 60000)
      }
    ]);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    if (confirm('정말로 상담을 종료하시겠습니까?')) {
      // 통화 종료 로직
      window.location.href = '/dashboard';
    }
  };

  const handleSendChatMessage = () => {
    if (!newChatMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: '김철수',
      message: newChatMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, newMessage]);
    setNewChatMessage('');
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col overflow-hidden">
      {/* 상단 헤더 */}
      <div className="bg-gray-800 text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold">비디오 상담</h1>
          <StatusIndicator status="connected" />
          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <Clock className="h-4 w-4" />
            <span>{formatTime(sessionTime)}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {isRecording && (
            <div className="flex items-center space-x-2 text-red-400">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm">녹화 중</span>
            </div>
          )}
          
          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <Users className="h-4 w-4" />
            <span>{participants.length}명 참여</span>
          </div>
          
          <button
            onClick={() => setShowChat(!showChat)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors relative"
          >
            <MessageCircle className="h-5 w-5" />
            {chatMessages.length > 2 && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                {chatMessages.length - 2}
              </div>
            )}
          </button>
        </div>
      </div>

      {/* 메인 비디오 영역 */}
      <div className="flex-1 flex">
        {/* 비디오 그리드 */}
        <div className={`${showChat ? 'flex-1' : 'w-full'} relative`}>
          <VideoGrid participants={participants} isScreenSharing={isScreenSharing} />
          
          {/* 로컬 비디오 (작은 화면) */}
          <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden">
            <ParticipantVideo
              participant={participants.find(p => p.role === 'client')}
              isLocal={true}
            />
          </div>
        </div>

        {/* 채팅 패널 */}
        {showChat && (
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">채팅</h3>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {chatMessages.map(message => (
                <div key={message.id} className="text-sm">
                  <div className="font-medium text-gray-900">{message.sender}</div>
                  <div className="text-gray-600 mt-1">{message.message}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newChatMessage}
                  onChange={(e) => setNewChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage()}
                  placeholder="메시지를 입력하세요..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendChatMessage}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  전송
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 하단 컨트롤 */}
      <div className="bg-gray-800 px-6 py-4">
        <VideoControls
          isVideoOn={isVideoOn}
          isAudioOn={isAudioOn}
          isScreenSharing={isScreenSharing}
          isRecording={isRecording}
          onToggleVideo={() => setIsVideoOn(!isVideoOn)}
          onToggleAudio={() => setIsAudioOn(!isAudioOn)}
          onToggleScreenShare={() => setIsScreenSharing(!isScreenSharing)}
          onToggleRecording={() => setIsRecording(!isRecording)}
          onEndCall={handleEndCall}
        />
      </div>
    </div>
  );
};

export default VideoConsultation;