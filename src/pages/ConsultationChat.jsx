import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, Bot, CheckCircle, Users, MessageSquare, ArrowRight, Sparkles } from 'lucide-react';
import QuestionInput from '../components/chat/QuestionInput';
import ChatHistory from '../components/chat/ChatHistory';
import ChatBubble from '../components/chat/ChatBubble';

const ConsultationChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: '안녕하세요! 저는 컨설트온 AI 어시스턴트입니다. 어떤 고민이나 궁금한 점이 있으신지 자세히 알려주세요. 정확한 분석과 조언을 위해 구체적인 상황을 말씀해 주시면 도움이 됩니다.',
      timestamp: new Date(Date.now() - 10000)
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConsultationComplete, setIsConsultationComplete] = useState(false);
  const [consultationSummary, setConsultationSummary] = useState('');
  const [showCompletionOptions, setShowCompletionOptions] = useState(false);
  const [messageCount, setMessageCount] = useState(1);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage, currentMessageCount) => {
    // AI 응답 시나리오 (실제로는 AI API를 호출)
    const responses = [
      "말씀해주신 상황을 잘 이해했습니다. 더 구체적인 정보를 알려주시면 더 정확한 조언을 드릴 수 있어요.",
      "흥미로운 케이스네요! 이런 상황에서는 몇 가지 접근 방법이 있습니다. 어떤 부분이 가장 우선순위인지 알려주세요.",
      "지금까지 말씀해주신 내용을 종합해보면, 핵심 이슈가 명확해지고 있습니다. 추가로 궁금한 점이 있으실까요?",
      "네, 충분한 정보를 주셨습니다. 이제 구체적인 해결책과 실행 방안을 제시해드릴 수 있을 것 같습니다."
    ];

    if (currentMessageCount >= 7) {
      return {
        content: "지금까지의 상담 내용을 바탕으로 종합적인 분석과 조언을 정리해드렸습니다. 더 전문적인 도움이 필요하시다면 전문가 매칭을 받으시거나, 커뮤니티에 상세한 상담 내용을 공유하여 전문가들의 추가 조언을 받아보시는 것을 추천드립니다.",
        isComplete: true
      };
    }

    return {
      content: responses[Math.min(currentMessageCount - 2, responses.length - 1)],
      isComplete: false
    };
  };

  const generateConsultationSummary = (messages) => {
    // 실제로는 AI가 대화 내용을 분석하여 요약 생성
    return `【상담 주제】 온라인 비즈니스 마케팅 전략
【주요 고민】 고객 유치 및 매출 증대 방안
【핵심 이슈】 타겟 고객 설정, 마케팅 채널 선택, 예산 배분
【추천 솔루션】 SNS 마케팅 강화, 콘텐츠 마케팅 도입, 데이터 분석 기반 최적화
【예상 투입 시간】 3-6개월 장기 프로젝트`;
  };

  const handleSendMessage = (message) => {
    if (!message.trim() || isConsultationComplete) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    const newMessageCount = messageCount + 1;
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setMessageCount(newMessageCount);
    
    // AI 응답 시뮬레이션
    setIsTyping(true);
    setTimeout(() => {
      const aiResponseData = generateAIResponse(message, newMessageCount);
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponseData.content,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
      
      if (aiResponseData.isComplete) {
        setIsConsultationComplete(true);
        const summary = generateConsultationSummary([...messages, userMessage, aiResponse]);
        setConsultationSummary(summary);
        setTimeout(() => {
          setShowCompletionOptions(true);
        }, 1000);
      }
    }, 1500 + Math.random() * 1000);
  };

  const handleExpertMatching = () => {
    // 전문가 매칭 페이지로 이동
    window.location.href = '/expert-matching?summary=' + encodeURIComponent(consultationSummary);
  };

  const handleCommunityPost = () => {
    // 커뮤니티 글 작성 페이지로 이동 (임시로 alert 표시)
    alert('커뮤니티 글 작성 기능이 구현될 예정입니다.\n\n상담 요약 내용:\n' + consultationSummary);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상담 완료 옵션 모달 */}
      {showCompletionOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">AI 상담 완료!</h2>
                <p className="text-gray-600">
                  상담 내용을 분석하여 다음 단계를 제안합니다. 어떤 방법을 선택하시겠어요?
                </p>
              </div>

              {/* 옵션 선택 */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <button
                  onClick={handleExpertMatching}
                  className="group p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl border-2 border-blue-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-blue-900 mb-2">전문가 매칭</h3>
                    <p className="text-sm text-blue-700 mb-3">
                      상담 내용을 바탕으로 최적의 전문가를 매칭해드립니다
                    </p>
                    <ul className="text-xs text-blue-600 space-y-1">
                      <li>• 1:1 맞춤 상담</li>
                      <li>• 전문가 검증 완료</li>
                      <li>• 화상/채팅 상담 가능</li>
                    </ul>
                  </div>
                </button>

                <button
                  onClick={handleCommunityPost}
                  className="group p-6 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl border-2 border-green-200 hover:border-green-300 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-green-900 mb-2">커뮤니티 글 작성</h3>
                    <p className="text-sm text-green-700 mb-3">
                      요약된 상담 내용으로 커뮤니티에 글을 올려보세요
                    </p>
                    <ul className="text-xs text-green-600 space-y-1">
                      <li>• 다양한 전문가 의견</li>
                      <li>• 무료 조언 가능</li>
                      <li>• 경험 공유</li>
                    </ul>
                  </div>
                </button>
              </div>

              {/* 상담 요약 */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-gray-900 mb-2">상담 요약</h4>
                <div className="text-sm text-gray-700 whitespace-pre-line">
                  {consultationSummary}
                </div>
              </div>

              {/* 하단 버튼 */}
              <div className="flex justify-between">
                <button
                  onClick={() => setShowCompletionOptions(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  나중에 결정
                </button>
                <button
                  onClick={() => window.location.href = '/dashboard'}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  대시보드로 이동
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 페이지 헤더 */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <Bot className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI 상담 어시스턴트</h1>
                <p className="text-gray-600">컨설트온 AI • 24시간 상담 가능</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {isConsultationComplete ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  상담 완료
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  <Sparkles className="w-4 h-4 mr-1" />
                  AI 상담 중
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 채팅 영역 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden" style={{height: 'calc(100vh - 200px)'}}>
          <div className="h-full flex">
            {/* 메인 채팅 */}
            <div className="flex-1 flex flex-col">
              {/* 메시지 목록 */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <ChatBubble key={message.id} message={message} />
                ))}
                
                {/* AI 타이핑 인디케이터 */}
                {isTyping && (
                  <div className="flex items-start space-x-3">
                    <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
                      <Bot className="text-white w-4 h-4" />
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg px-4 py-2 shadow-sm">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span className="text-xs text-blue-600 font-medium">AI가 답변을 생성하고 있습니다</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* 입력 영역 */}
              <div className="border-t border-gray-200 bg-white p-4">
                {isConsultationComplete ? (
                  <div className="text-center py-4">
                    <div className="inline-flex items-center px-4 py-2 rounded-lg bg-green-50 border border-green-200 text-green-700">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      <span className="font-medium">AI 상담이 완료되었습니다</span>
                    </div>
                  </div>
                ) : (
                  <QuestionInput 
                    value={newMessage}
                    onChange={setNewMessage}
                    onSend={handleSendMessage}
                    placeholder="AI 어시스턴트에게 질문하거나 고민을 자세히 설명해주세요..."
                    disabled={isTyping}
                  />
                )}
              </div>
            </div>

            {/* 사이드바 */}
            <div className="w-64 bg-white border-l border-gray-200">
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  AI 상담 정보
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900">상담 상태</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      {isConsultationComplete ? '상담 완료' : `진행 중 (${messageCount}/8)`}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900">AI 상담 특징</h4>
                    <ul className="text-sm text-gray-600 mt-1 space-y-1">
                      <li>• 24시간 즉시 상담 가능</li>
                      <li>• 무료 기본 상담 서비스</li>
                      <li>• 개인정보 보호 보장</li>
                    </ul>
                  </div>
                  
                  {isConsultationComplete && (
                    <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                      <h4 className="font-medium text-green-900">다음 단계</h4>
                      <p className="text-sm text-green-700 mt-1">
                        전문가 매칭 또는 커뮤니티 글 작성을 통해 더 구체적인 도움을 받아보세요
                      </p>
                    </div>
                  )}
                </div>

                {consultationSummary && (
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-3">상담 요약</h4>
                    <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 whitespace-pre-line">
                      {consultationSummary}
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <ChatHistory />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationChat;