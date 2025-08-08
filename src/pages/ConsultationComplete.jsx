import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Star,
  Download,
  Share2,
  MessageCircle,
  Clock,
  DollarSign,
  FileText,
  Video,
  Mic,
  User,
  ArrowRight,
  Heart,
  AlertCircle,
  Calendar,
  BookOpen,
} from "lucide-react";

const ConsultationComplete = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [consultationData, setConsultationData] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSummary, setShowSummary] = useState(true);

  // location.state에서 상담 데이터 가져오기
  const sessionData = location.state?.sessionData;

  useEffect(() => {
    // 상담 데이터가 없으면 대시보드로 이동
    if (!sessionData) {
      navigate("/dashboard");
      return;
    }

    // 상담 완료 데이터 생성 (실제로는 API에서 가져옴)
    const mockConsultationData = {
      id: `consultation-${Date.now()}`,
      expert: sessionData.expert,
      duration: sessionData.duration || 45,
      usedCredits: sessionData.usedCredits || 25,
      consultationType: sessionData.consultationType || "video",
      startTime: sessionData.startTime || new Date(),
      endTime: new Date(),
      summary: sessionData.summary || "상담 내용 요약이 생성 중입니다...",
      keyPoints: [
        "주요 상담 내용 포인트 1",
        "주요 상담 내용 포인트 2",
        "주요 상담 내용 포인트 3",
      ],
      actionItems: [
        {
          id: 1,
          task: "다음 단계 실행 계획",
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1주일 후
          priority: "high",
        },
        {
          id: 2,
          task: "추가 리서치 진행",
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3일 후
          priority: "medium",
        },
      ],
      recordingUrl: sessionData.recordingUrl,
      transcriptUrl: sessionData.transcriptUrl,
    };

    setConsultationData(mockConsultationData);
    setIsLoading(false);
  }, [sessionData, navigate]);

  const handleRatingSubmit = async () => {
    if (rating === 0) {
      alert("평점을 선택해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 평점 제출 API 호출 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("평점 제출:", { rating, feedback });
      alert("평점이 성공적으로 제출되었습니다. 감사합니다!");
    } catch (error) {
      console.error("평점 제출 실패:", error);
      alert("평점 제출에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadSummary = () => {
    // PDF 다운로드 로직
    console.log("상담 요약 다운로드");
    alert("상담 요약 PDF가 다운로드됩니다.");
  };

  const handleShareSummary = () => {
    // 공유 로직
    if (navigator.share) {
      navigator.share({
        title: "상담 요약",
        text: `${consultationData.expert.name} 전문가와의 상담 요약`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("상담 요약 링크가 클립보드에 복사되었습니다.");
    }
  };

  const handleBookFollowUp = () => {
    // 후속 상담 예약 페이지로 이동
    navigate("/expert-search", {
      state: {
        expert: consultationData.expert,
        isFollowUp: true,
      },
    });
  };

  const handleViewHistory = () => {
    // 상담 히스토리 페이지로 이동
    navigate("/consultation-history");
  };

  const getConsultationTypeIcon = (type) => {
    switch (type) {
      case "video":
        return Video;
      case "voice":
        return Mic;
      case "chat":
        return MessageCircle;
      default:
        return MessageCircle;
    }
  };

  const getConsultationTypeLabel = (type) => {
    switch (type) {
      case "video":
        return "화상 상담";
      case "voice":
        return "음성 상담";
      case "chat":
        return "채팅 상담";
      default:
        return type;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">상담 완료 처리 중...</p>
        </div>
      </div>
    );
  }

  if (!consultationData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            상담 정보를 찾을 수 없습니다
          </h2>
          <p className="text-gray-600 mb-6">
            상담이 정상적으로 완료되지 않았습니다.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            대시보드로 이동
          </button>
        </div>
      </div>
    );
  }

  const IconComponent = getConsultationTypeIcon(
    consultationData.consultationType
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 완료 헤더 */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            상담이 완료되었습니다
          </h1>
          <p className="text-gray-600">
            {consultationData.expert.name} 전문가와의 상담이 성공적으로
            마무리되었습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 왼쪽 컬럼 - 상담 정보 및 요약 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 상담 정보 카드 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start space-x-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                    {consultationData.expert.avatar ? (
                      <img
                        src={consultationData.expert.avatar}
                        alt={consultationData.expert.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <User className="w-8 h-8 text-gray-600" />
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {consultationData.expert.name}
                  </h3>
                  <p className="text-blue-600 font-medium mb-2">
                    {consultationData.expert.specialty}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <IconComponent className="h-4 w-4 mr-1" />
                      <span>
                        {getConsultationTypeLabel(
                          consultationData.consultationType
                        )}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{consultationData.duration}분</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span>{consultationData.usedCredits} 크레딧 사용</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 상담 요약 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  상담 요약
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={handleDownloadSummary}
                    className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>다운로드</span>
                  </button>
                  <button
                    onClick={handleShareSummary}
                    className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>공유</span>
                  </button>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-gray-700 leading-relaxed">
                  {consultationData.summary}
                </p>
              </div>

              {/* 주요 포인트 */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">주요 포인트</h4>
                <ul className="space-y-2">
                  {consultationData.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 액션 아이템 */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">다음 단계</h4>
                <div className="space-y-2">
                  {consultationData.actionItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-medium text-gray-900">
                          {item.task}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {item.dueDate.toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 피드백 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                상담 피드백
              </h3>
              <div className="space-y-4">
                {/* 평점 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    상담 만족도
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className={`p-2 rounded-lg transition-colors ${
                          rating >= star
                            ? "text-yellow-500 bg-yellow-50"
                            : "text-gray-300 hover:text-yellow-400"
                        }`}
                      >
                        <Star className="w-6 h-6 fill-current" />
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {rating === 0 && "평점을 선택해주세요"}
                    {rating === 1 && "매우 불만족"}
                    {rating === 2 && "불만족"}
                    {rating === 3 && "보통"}
                    {rating === 4 && "만족"}
                    {rating === 5 && "매우 만족"}
                  </p>
                </div>

                {/* 피드백 텍스트 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    추가 의견 (선택사항)
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="상담에 대한 의견이나 개선사항을 자유롭게 작성해주세요."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={4}
                  />
                </div>

                {/* 제출 버튼 */}
                <button
                  onClick={handleRatingSubmit}
                  disabled={isSubmitting || rating === 0}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                    isSubmitting || rating === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isSubmitting ? "제출 중..." : "피드백 제출"}
                </button>
              </div>
            </div>
          </div>

          {/* 오른쪽 컬럼 - 액션 버튼들 */}
          <div className="space-y-6">
            {/* 빠른 액션 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                다음 단계
              </h3>
              <div className="space-y-3">
                <button
                  onClick={handleBookFollowUp}
                  className="w-full flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div className="text-left">
                      <div className="font-medium text-gray-900">
                        후속 상담 예약
                      </div>
                      <div className="text-sm text-gray-600">
                        추가 상담이 필요하시면 예약하세요
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-blue-600" />
                </button>

                <button
                  onClick={handleViewHistory}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-5 h-5 text-gray-600" />
                    <div className="text-left">
                      <div className="font-medium text-gray-900">
                        상담 히스토리
                      </div>
                      <div className="text-sm text-gray-600">
                        이전 상담 기록을 확인하세요
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* 상담 통계 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                상담 통계
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">상담 시간</span>
                  <span className="font-medium">
                    {consultationData.duration}분
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">사용 크레딧</span>
                  <span className="font-medium">
                    {consultationData.usedCredits} 크레딧
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">상담 방식</span>
                  <span className="font-medium">
                    {getConsultationTypeLabel(
                      consultationData.consultationType
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">상담 날짜</span>
                  <span className="font-medium">
                    {consultationData.startTime.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* 도움말 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Heart className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-800 mb-1">
                    상담이 도움이 되셨나요?
                  </p>
                  <p className="text-blue-700">
                    피드백을 남겨주시면 더 나은 서비스를 제공할 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationComplete;
