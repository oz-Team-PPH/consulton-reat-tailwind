import { useState, useEffect } from 'react';
import { 
  Download, Share2, Clock, User, Calendar, 
  FileText, Video, CheckSquare, Tag 
} from 'lucide-react';
import RecordingStatus from '../components/summary/RecordingStatus';
import RecordingPlayer from '../components/summary/RecordingPlayer';
import SummaryCard from '../components/summary/SummaryCard';
import ToDoList from '../components/summary/ToDoList';

const ConsultationSummary = () => {
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('summary');

  // 더미 상담 요약 데이터
  const mockSummaryData = {
    id: 'consultation-123',
    title: '온라인 쇼핑몰 마케팅 전략 상담',
    date: new Date('2024-01-15T14:30:00'),
    duration: 45, // 분
    expert: {
      name: '이민수',
      title: '디지털 마케팅 전문가',
      avatar: null
    },
    client: {
      name: '김철수',
      company: 'ABC 쇼핑몰'
    },
    status: 'completed',
    recordingUrl: 'https://example.com/recording/123',
    recordingDuration: 2700, // 45분 (초)
    summary: {
      keyPoints: [
        '현재 SNS 마케팅 채널별 성과 분석 필요',
        '타겟 고객층 재정의 및 페르소나 개발',
        '퍼포먼스 마케팅 예산 최적화 방안',
        '브랜드 포지셔닝 전략 수립'
      ],
      recommendations: [
        {
          title: 'SNS 마케팅 채널 다각화',
          description: '인스타그램과 틱톡을 활용한 젊은 층 타겟 마케팅 강화',
          priority: 'high',
          timeframe: '2주 내'
        },
        {
          title: '데이터 분석 도구 도입',
          description: 'Google Analytics 4와 Facebook Pixel을 활용한 성과 측정',
          priority: 'medium',
          timeframe: '1개월 내'
        },
        {
          title: '콘텐츠 마케팅 전략 수립',
          description: '브랜드 스토리텔링을 통한 고객 참여도 향상',
          priority: 'medium',
          timeframe: '3개월 내'
        }
      ],
      actionItems: [
        {
          id: 1,
          task: '타겟 고객 설문조사 실시',
          assignee: '김철수',
          dueDate: new Date('2024-01-29'),
          status: 'pending',
          priority: 'high'
        },
        {
          id: 2,
          task: 'Instagram Business 계정 개설',
          assignee: '김철수',
          dueDate: new Date('2024-01-22'),
          status: 'pending',
          priority: 'high'
        },
        {
          id: 3,
          task: 'Google Analytics 4 설정',
          assignee: '김철수',
          dueDate: new Date('2024-02-05'),
          status: 'pending',
          priority: 'medium'
        }
      ],
      tags: ['마케팅', '디지털마케팅', 'SNS', '쇼핑몰', '전략수립'],
      nextSteps: '2주 후 진행상황 리뷰 미팅 예정'
    },
    creditsUsed: 25,
    rating: null
  };

  useEffect(() => {
    // 실제로는 API에서 데이터 가져오기
    setTimeout(() => {
      setSummaryData(mockSummaryData);
      setLoading(false);
    }, 1000);
  }, []);

  const handleDownloadSummary = () => {
    // PDF 다운로드 로직
    console.log('Downloading summary...');
  };

  const handleShareSummary = () => {
    // 공유 로직
    console.log('Sharing summary...');
  };

  const handleRating = (rating) => {
    setSummaryData(prev => ({ ...prev, rating }));
    // API로 평점 전송
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">상담 요약을 생성하고 있습니다...</p>
        </div>
      </div>
    );
  }

  if (!summaryData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">상담 요약을 찾을 수 없습니다</h2>
          <p className="text-gray-600">요청하신 상담 요약이 존재하지 않거나 아직 처리 중입니다.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'summary', name: '요약', icon: FileText },
    { id: 'recording', name: '녹화', icon: Video },
    { id: 'actions', name: '할 일', icon: CheckSquare }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <RecordingStatus status={summaryData.status} />
                <span className="text-sm text-gray-500">
                  {summaryData.date.toLocaleDateString('ko-KR')}
                </span>
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {summaryData.title}
              </h1>
              
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{summaryData.expert.name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{summaryData.duration}분</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{summaryData.date.toLocaleTimeString('ko-KR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleShareSummary}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Share2 className="h-4 w-4" />
                <span>공유</span>
              </button>
              <button
                onClick={handleDownloadSummary}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>다운로드</span>
              </button>
            </div>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* 탭 콘텐츠 */}
        {activeTab === 'summary' && (
          <div className="space-y-8">
            <SummaryCard
              title="핵심 내용"
              icon={FileText}
              items={summaryData.summary.keyPoints}
            />
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">추천 사항</h3>
              <div className="space-y-4">
                {summaryData.summary.recommendations.map((rec, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{rec.title}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        rec.priority === 'high' 
                          ? 'bg-red-100 text-red-800'
                          : rec.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {rec.priority === 'high' ? '높음' : 
                         rec.priority === 'medium' ? '보통' : '낮음'}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-1">{rec.description}</p>
                    <p className="text-xs text-gray-500">기한: {rec.timeframe}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Tag className="h-5 w-5 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900">태그</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {summaryData.summary.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'recording' && (
          <div className="space-y-6">
            <RecordingPlayer
              url={summaryData.recordingUrl}
              duration={summaryData.recordingDuration}
              title={summaryData.title}
            />
          </div>
        )}

        {activeTab === 'actions' && (
          <div className="space-y-6">
            <ToDoList
              items={summaryData.summary.actionItems}
              onUpdateItem={(id, updates) => {
                setSummaryData(prev => ({
                  ...prev,
                  summary: {
                    ...prev.summary,
                    actionItems: prev.summary.actionItems.map(item =>
                      item.id === id ? { ...item, ...updates } : item
                    )
                  }
                }));
              }}
            />
          </div>
        )}

        {/* 평점 및 피드백 */}
        {!summaryData.rating && (
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              상담은 어떠셨나요?
            </h3>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">평점:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRating(star)}
                  className="text-2xl text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  ⭐
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultationSummary;