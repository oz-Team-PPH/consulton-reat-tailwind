import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Star,
  MapPin,
  Clock,
  MessageCircle,
  Video,
  Calendar,
  CheckCircle,
  AlertCircle,
  XCircle,
  User,
  Crown,
  Award,
  Phone,
  Mail,
  Globe,
  ArrowLeft,
  Heart,
  Share2,
  CreditCard,
  ArrowRight,
  Shield,
  CheckCircle as CheckCircleIcon,
} from "lucide-react";
import {
  calculateExpertLevel,
  calculateCreditsPerMinute,
  getLevelBadgeStyles,
  getKoreanLevelName,
} from "../utils/expertLevels";

const ExpertProfile = () => {
  const { expertId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // location.state에서 전문가 데이터 가져오기 (있는 경우)
  const [expert, setExpert] = useState(location.state?.expert || null);
  const [loading, setLoading] = useState(!expert);
  const [isFavorite, setIsFavorite] = useState(false);

  // 상담 시작 관련 상태
  const [consultationType, setConsultationType] = useState("chat");
  const [estimatedDuration, setEstimatedDuration] = useState(30);
  const [userCredits] = useState(150); // 실제로는 API에서 가져옴
  const [isStartingConsultation, setIsStartingConsultation] = useState(false);

  useEffect(() => {
    // 만약 state로 전달된 데이터가 없다면 API에서 데이터를 가져와야 함
    if (!expert && expertId) {
      // 실제로는 API 호출
      // fetchExpertData(expertId);
      setLoading(false);
    }
  }, [expert, expertId]);

  // 뒤로 가기 핸들러
  const handleGoBack = () => {
    const from = location.state?.from;
    if (from === "expert-search") {
      navigate("/expert-search");
    } else if (from === "expert-card") {
      navigate(-1);
    } else {
      navigate("/dashboard");
    }
  };

  // 즐겨찾기 토글
  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
    // 실제로는 API 호출하여 즐겨찾기 상태 저장
  };

  // 공유하기
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${expert.name} 전문가 프로필`,
          text: `${expert.specialty} 전문가 ${expert.name}님의 프로필을 확인해보세요.`,
          url: window.location.href,
        });
      } catch {
        console.log("공유 취소됨");
      }
    } else {
      // 클립보드에 URL 복사
      navigator.clipboard.writeText(window.location.href);
      alert("프로필 링크가 클립보드에 복사되었습니다.");
    }
  };

  // 상담 방법 선택 데이터
  const consultationTypes = [
    {
      id: "chat",
      name: "채팅 상담",
      icon: MessageCircle,
      description: "실시간 텍스트 상담",
      creditRate: 1.0,
      features: ["실시간 채팅", "파일 공유", "상담 요약 제공"],
      color: "blue",
    },
    {
      id: "voice",
      name: "음성 상담",
      icon: Phone,
      description: "음성 통화 상담",
      creditRate: 1.2,
      features: ["고품질 음성 통화", "녹음 서비스", "상담 요약 제공"],
      color: "green",
    },
    {
      id: "video",
      name: "화상 상담",
      icon: Video,
      description: "화상 통화 상담",
      creditRate: 1.5,
      features: ["HD 화상 통화", "화면 공유", "녹화 서비스", "상담 요약 제공"],
      color: "purple",
    },
  ];

  const selectedType = consultationTypes.find(
    (type) => type.id === consultationType
  );
  const baseCredits = expert?.creditsPerMinute * estimatedDuration || 0;
  const finalCredits = Math.round(baseCredits * selectedType.creditRate);
  const hasEnoughCredits = userCredits >= finalCredits;

  // 상담 시작/예약 핸들러
  const handleStartConsultation = async () => {
    if (!hasEnoughCredits) {
      alert("크레딧이 부족합니다. 크레딧을 충전해주세요.");
      navigate("/credit-packages");
      return;
    }

    setIsStartingConsultation(true);

    try {
      // 상담 시작 API 호출 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 상담 시작
      navigate("/video-consultation", {
        state: {
          expert: expert,
          consultationType: consultationType,
          estimatedDuration: estimatedDuration,
          consultationSummary: location.state?.consultationSummary,
          consultationTopic: location.state?.consultationTopic,
        },
      });
    } catch (error) {
      console.error("상담 시작 실패:", error);
      alert("상담을 시작할 수 없습니다. 다시 시도해주세요.");
    } finally {
      setIsStartingConsultation(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">전문가 프로필을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!expert) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            전문가를 찾을 수 없습니다
          </h2>
          <p className="text-gray-600 mb-6">
            요청하신 전문가 프로필이 존재하지 않거나 비공개 상태입니다.
          </p>
          <button
            onClick={handleGoBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 전문가 레벨 정보 (직접 설정된 레벨 사용)
  const expertLevel = {
    level: expert.level || 1,
    name: "expert"
  };
  const levelBadgeStyles = getLevelBadgeStyles(expertLevel.name);
  const creditsPerMinute = calculateCreditsPerMinute({
    ...expert,
    level: expert.level || 1 // 직접 설정된 레벨 사용
  });

  // 답변 시간 텍스트 변환 함수
  const getResponseTimeText = (responseTime) => {
    if (!responseTime) return "답변 시간 정보 없음";
    
    if (typeof responseTime === 'string') {
      return responseTime;
    }
    
    if (typeof responseTime === 'number') {
      if (responseTime < 60) {
        return `${responseTime}분 내`;
      } else if (responseTime < 1440) { // 24시간 = 1440분
        const hours = Math.floor(responseTime / 60);
        return `${hours}시간 내`;
      } else {
        const days = Math.floor(responseTime / 1440);
        return `${days}일 내`;
      }
    }
    
    return "답변 시간 정보 없음";
  };

  // 답변 시간 아이콘 컴포넌트
  const getResponseTimeIcon = (responseTime) => {
    if (!responseTime) {
      return <Clock className="h-5 w-5 text-gray-400" />;
    }
    
    if (typeof responseTime === 'number') {
      if (responseTime < 60) {
        return <Clock className="h-5 w-5 text-green-500" />;
      } else if (responseTime < 1440) {
        return <Clock className="h-5 w-5 text-yellow-500" />;
      } else {
        return <Clock className="h-5 w-5 text-red-500" />;
      }
    }
    
    return <Clock className="h-5 w-5 text-gray-400" />;
  };

  // 답변 시간 색상 클래스
  const getResponseTimeColor = (responseTime) => {
    if (!responseTime) return "text-gray-600 bg-gray-50 border-gray-200";
    
    if (typeof responseTime === 'number') {
      if (responseTime < 60) {
        return "text-green-600 bg-green-50 border-green-200";
      } else if (responseTime < 1440) {
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      } else {
        return "text-red-600 bg-red-50 border-red-200";
      }
    }
    
    return "text-gray-600 bg-gray-50 border-gray-200";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-6">
          <button
            onClick={handleGoBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            돌아가기
          </button>
        </div>

        {/* 전문가 기본 정보 카드 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
          {/* 레벨 배지 */}
          <div className={`text-white px-4 py-2 text-center ${
            expert.level >= 800 ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
            expert.level >= 600 ? 'bg-gradient-to-r from-red-500 to-red-600' :
            expert.level >= 400 ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
            expert.level >= 200 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
            expert.level >= 100 ? 'bg-gradient-to-r from-green-500 to-green-600' :
            'bg-gradient-to-r from-blue-500 to-blue-600'
          }`}>
            <div className="flex items-center justify-center space-x-1">
              <Crown className="h-4 w-4" />
              <span className="font-medium text-sm">Lv.{expert.level} EXPERT</span>
            </div>
          </div>

          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-start md:space-x-8">
              {/* 프로필 이미지 */}
              <div className="flex-shrink-0 mb-6 md:mb-0">
                <div className="relative">
                  <div className={`w-40 h-40 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden border-4 ${
                    expert.level >= 800 ? 'border-purple-500' :
                    expert.level >= 600 ? 'border-red-500' :
                    expert.level >= 400 ? 'border-orange-500' :
                    expert.level >= 200 ? 'border-yellow-500' :
                    expert.level >= 100 ? 'border-green-500' :
                    'border-blue-500'
                  }`}>
                    {expert.avatar || expert.profileImage ? (
                      <img
                        src={expert.avatar || expert.profileImage}
                        alt={`${expert.name} 프로필 사진`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-20 h-20 text-gray-600" />
                    )}
                  </div>
                </div>
                
                {/* 전문가 이름 */}
                <div className="text-center mt-4">
                  <div className="flex items-center justify-center space-x-2">
                    {expert.rating >= 4.8 && expert.reviewCount >= 100 && (
                      <Crown className="h-5 w-5 text-yellow-500" />
                    )}
                    <h1 className="text-3xl font-bold text-gray-900">
                      {expert.name}
                    </h1>
                  </div>
                  
                  {/* 평균 응답시간 */}
                  <div className="mt-3">
                    <div
                      className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg border text-sm font-medium ${getResponseTimeColor(
                        expert.responseTime
                      )}`}
                    >
                      {getResponseTimeIcon(expert.responseTime)}
                      <span>평균 응답시간: {getResponseTimeText(expert.responseTime)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 기본 정보 */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                  <div className="mb-4 sm:mb-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <p className="text-2xl text-blue-600 font-semibold">
                        {expert.specialty}
                      </p>
                    </div>



                    <div className="flex items-center space-x-4 text-gray-600 mb-4">
                      <div className="flex items-center space-x-1">
                        <Star className="h-5 w-5 text-yellow-500 fill-current" />
                        <span className="font-semibold text-gray-900">
                          {expert.rating || expert.avgRating}
                        </span>
                        <span>({expert.reviewCount || 0})</span>
                      </div>

                      <div className="flex items-center space-x-1">
                        <Award className="h-5 w-5" />
                        <span>{expert.experience}년 경력</span>
                      </div>

                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-5 w-5" />
                        <span>
                          {expert.totalConsultations ||
                            expert.consultationCount ||
                            0}
                          회 상담
                        </span>
                      </div>
                    </div>

                    {/* 전문분야 배지들 */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {(expert.specialties || []).slice(0, 4).map((specialty, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-2 rounded-lg border text-sm font-medium bg-blue-100 text-blue-700 border-blue-200"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                    
                    {/* 상담방식 배지들 */}
                    <div className="flex flex-wrap gap-2">
                      {(expert.consultationTypes || []).map((type, index) => {
                        const Icon = type === "video" ? Video : MessageCircle;
                        return (
                          <span
                            key={index}
                            className="inline-flex items-center space-x-1 px-3 py-2 rounded-lg border text-sm font-medium bg-purple-100 text-purple-700 border-purple-200"
                          >
                            <Icon className="h-4 w-4" />
                            <span>
                              {type === "video" ? "화상 상담" : "채팅 상담"}
                            </span>
                          </span>
                        );
                      })}
                      
                      {/* 사용 언어 배지들 */}
                      {(expert.languages || ["한국어"]).map((language, index) => (
                        <span
                          key={`lang-${index}`}
                          className="inline-flex items-center px-3 py-2 rounded-lg border text-sm font-medium bg-gray-100 text-gray-700 border-gray-200"
                        >
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 액션 버튼들 */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleFavoriteToggle}
                      className={`p-2 rounded-full transition-colors ${
                        isFavorite
                          ? "text-red-500 bg-red-50"
                          : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                      }`}
                    >
                      <Heart
                        className={`h-6 w-6 ${
                          isFavorite ? "fill-current" : ""
                        }`}
                      />
                    </button>

                    <button
                      onClick={handleShare}
                      className="p-2 rounded-full text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      <Share2 className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                {/* 가격 정보 */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">상담 요금</p>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-2xl font-bold text-gray-900">
                          {creditsPerMinute}
                        </span>
                        <span className="text-lg text-gray-600">크레딧/분</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 메인 콘텐츠 그리드 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 왼쪽 컬럼 - 전문가 정보 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 소개 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">소개</h3>
              <p className="text-gray-700 leading-relaxed">
                {expert.description}
              </p>
            </div>



            {/* 학력 및 자격증 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                학력 및 자격증
              </h3>

              {expert.education && expert.education.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    학력
                  </h4>
                  <ul className="space-y-2">
                    {expert.education.map((edu, index) => (
                      <li
                        key={index}
                        className="text-gray-700 flex items-center"
                      >
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {edu}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {expert.certifications && expert.certifications.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    자격증
                  </h4>
                  <ul className="space-y-2">
                    {expert.certifications.map((cert, index) => (
                      <li
                        key={index}
                        className="text-gray-700 flex items-center"
                      >
                        <Award className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                        {cert}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* 상담 예약 섹션 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                상담 예약
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 왼쪽 - 상담 방법 선택 */}
                <div className="space-y-6">
                  {/* 상담 방법 선택 */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-4">
                      상담 방법 선택
                    </h4>
                    <div className="space-y-3">
                      {consultationTypes.map((type) => {
                        const IconComponent = type.icon;
                        return (
                          <div
                            key={type.id}
                            onClick={() => setConsultationType(type.id)}
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                              consultationType === type.id
                                ? `border-${type.color}-600 bg-${type.color}-50`
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-10 h-10 bg-${type.color}-100 rounded-lg flex items-center justify-center`}
                              >
                                <IconComponent
                                  className={`w-5 h-5 text-${type.color}-600`}
                                />
                              </div>
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-900">
                                  {type.name}
                                </h5>
                                <p className="text-sm text-gray-600">
                                  {type.description}
                                </p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {type.features.map((feature, index) => (
                                    <span
                                      key={index}
                                      className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded"
                                    >
                                      {feature}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 예상 시간 선택 */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-4">
                      예상 상담 시간
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <input
                          type="range"
                          min="15"
                          max="120"
                          step="15"
                          value={estimatedDuration}
                          onChange={(e) =>
                            setEstimatedDuration(parseInt(e.target.value))
                          }
                          className="flex-1"
                        />
                        <div className="flex items-center space-x-2">
                          <Clock className="h-5 w-5 text-gray-400" />
                          <span className="font-medium text-gray-900">
                            {estimatedDuration}분
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>15분</span>
                        <span>2시간</span>
                      </div>
                    </div>
                  </div>

                  {/* 상담 요약 (있는 경우) */}
                  {location.state?.consultationSummary && (
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-4">
                        상담 요약
                      </h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {location.state.consultationSummary}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* 오른쪽 - 요약 및 시작 버튼 */}
                <div className="space-y-6">
                  {/* 크레딧 정보 */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-md font-medium text-gray-900 mb-4">
                      크레딧 정보
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">보유 크레딧</span>
                        <span className="font-medium">
                          {userCredits} 크레딧
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">예상 사용 크레딧</span>
                        <span className="font-medium">
                          {finalCredits} 크레딧
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">잔여 크레딧</span>
                        <span
                          className={`font-medium ${
                            hasEnoughCredits ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {userCredits - finalCredits} 크레딧
                        </span>
                      </div>
                    </div>

                    {!hasEnoughCredits && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center">
                          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                          <span className="text-sm text-red-700">
                            크레딧이 부족합니다. 크레딧을 충전해주세요.
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 상담 정보 요약 */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-md font-medium text-gray-900 mb-4">
                      상담 정보
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">전문가</span>
                        <span className="font-medium">{expert.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">전문가 레벨</span>
                        <span className="font-medium">Lv.{expert.level}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">상담 방법</span>
                        <span className="font-medium">{selectedType.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">예상 시간</span>
                        <span className="font-medium">
                          {estimatedDuration}분
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">분당 요금</span>
                        <span className="font-medium">
                          {expert.creditsPerMinute} 크레딧
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">답변 시간</span>
                        <span className="font-medium">
                          {getResponseTimeText(expert.responseTime)}
                        </span>
                      </div>
                      <div className="border-t pt-3 flex justify-between">
                        <span className="font-semibold text-gray-900">
                          총 사용 크레딧
                        </span>
                        <span className="font-bold text-lg text-blue-600">
                          {finalCredits} 크레딧
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 안전한 상담 안내 */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <Shield className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-blue-800 mb-1">
                          안전한 상담 환경
                        </p>
                        <p className="text-blue-700">
                          모든 상담은 암호화되어 안전하게 진행되며, 상담 내용은
                          비공개로 보호됩니다.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 답변 시간 안내 */}
                  {expert.responseTime && expert.responseTime > 60 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <Clock className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-blue-800 mb-1">
                            답변 시간 안내
                          </p>
                          <p className="text-blue-700">
                            이 전문가는 평균 {getResponseTimeText(expert.responseTime)}에 답변합니다.
                            급한 문의사항이 있으시면 다른 전문가를 찾아보세요.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 상담 시작 버튼 */}
                  <button
                    onClick={handleStartConsultation}
                    disabled={!hasEnoughCredits || isStartingConsultation}
                    className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center space-x-2 ${
                      !hasEnoughCredits || isStartingConsultation
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {isStartingConsultation ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>상담 준비 중...</span>
                      </>
                    ) : !hasEnoughCredits ? (
                      <>
                        <CreditCard className="h-5 w-5" />
                        <span>크레딧 충전 필요</span>
                      </>
                    ) : (
                      <>
                        <ArrowRight className="h-5 w-5" />
                        <span>상담 시작하기</span>
                      </>
                    )}
                  </button>

                  {!hasEnoughCredits && (
                    <button
                      onClick={() => navigate("/credit-packages")}
                      className="w-full py-3 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      크레딧 충전하기
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽 컬럼 - 부가 정보 */}
          <div className="space-y-6">




            {/* 연락처 정보 */}
            {expert.contactInfo && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  연락처
                </h3>
                <div className="space-y-3">
                  {expert.contactInfo.location && (
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-700">
                        {expert.contactInfo.location}
                      </span>
                    </div>
                  )}

                  {expert.contactInfo.email && (
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-700">
                        {expert.contactInfo.email}
                      </span>
                    </div>
                  )}

                  {expert.contactInfo.website && (
                    <div className="flex items-center space-x-3">
                      <Globe className="h-5 w-5 text-gray-400" />
                      <a
                        href={expert.contactInfo.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        웹사이트 방문
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 답변 시간 정보 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                답변 시간 정보
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  {getResponseTimeIcon(expert.responseTime)}
                  <span className="text-gray-700">
                    평균 응답시간: {getResponseTimeText(expert.responseTime)}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {expert.responseTime && expert.responseTime < 60 ? (
                    <span className="text-green-600">빠른 답변 전문가</span>
                  ) : expert.responseTime && expert.responseTime < 1440 ? (
                    <span className="text-yellow-600">보통 답변 전문가</span>
                  ) : expert.responseTime ? (
                    <span className="text-red-600">느린 답변 전문가</span>
                  ) : (
                    <span className="text-gray-500">답변 시간 정보 없음</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertProfile;
