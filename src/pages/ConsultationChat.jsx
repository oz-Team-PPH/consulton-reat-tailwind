import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile } from 'lucide-react';
import QuestionInput from '../components/chat/QuestionInput';
import ChatHistory from '../components/chat/ChatHistory';
import ChatBubble from '../components/chat/ChatBubble';

const ConsultationChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'expert',
      content: '안녕하세요! 저는 마케팅 전문가 이민수입니다. 어떤 도움이 필요하신가요?',
      timestamp: new Date(Date.now() - 10000),
      expertInfo: {
        name: '이민수',
        title: '마케팅 전문가',
        avatar: null
      }
    },
    {
      id: 2,
      type: 'user',
      content: '안녕하세요! 온라인 쇼핑몰 마케팅 전략에 대해 상담받고 싶습니다.',
      timestamp: new Date(Date.now() - 8000)
    },
    {
      id: 3,
      type: 'expert',
      content: '좋은 주제네요! 어떤 업종의 쇼핑몰이신지, 그리고 현재 어떤 마케팅을 하고 계신지 알려주시면 더 구체적인 조언을 드릴 수 있습니다.',
      timestamp: new Date(Date.now() - 5000),
      expertInfo: {
        name: '이민수',
        title: '마케팅 전문가',
        avatar: null
      }
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (message) => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    
    // 전문가 응답 시뮬레이션
    setIsTyping(true);
    setTimeout(() => {
      const expertResponse = {
        id: Date.now() + 1,
        type: 'expert',
        content: '좋은 질문이네요! 구체적인 상황을 더 알려주시면 맞춤형 조언을 드릴 수 있습니다.',
        timestamp: new Date(),
        expertInfo: {
          name: '이민수',
          title: '마케팅 전문가',
          avatar: null
        }
      };
      setMessages(prev => [...prev, expertResponse]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">이</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">이민수 전문가</h1>
              <p className="text-sm text-gray-500">마케팅 전문가 • 온라인</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              상담 중
            </span>
          </div>
        </div>
      </div>

      {/* 채팅 영역 */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {/* 메인 채팅 */}
          <div className="flex-1 flex flex-col">
            {/* 메시지 목록 */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <ChatBubble key={message.id} message={message} />
              ))}
              
              {/* 타이핑 인디케이터 */}
              {isTyping && (
                <div className="flex items-start space-x-3">
                  <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">이</span>
                  </div>
                  <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* 입력 영역 */}
            <div className="border-t border-gray-200 bg-white p-4">
              <QuestionInput 
                value={newMessage}
                onChange={setNewMessage}
                onSend={handleSendMessage}
                placeholder="전문가에게 질문을 입력하세요..."
              />
            </div>
          </div>

          {/* 사이드바 */}
          <div className="w-80 bg-white border-l border-gray-200">
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                상담 정보
              </h3>
              
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900">상담 주제</h4>
                  <p className="text-sm text-blue-700 mt-1">온라인 쇼핑몰 마케팅 전략</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900">예상 소요 시간</h4>
                  <p className="text-sm text-gray-600 mt-1">30-45분</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900">크레딧 사용량</h4>
                  <p className="text-sm text-green-700 mt-1">20 크레딧 (진행 중)</p>
                </div>
              </div>

              <div className="mt-6">
                <ChatHistory />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationChat;