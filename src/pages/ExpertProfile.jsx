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
      } catch (error) {
        console.log("공유 취소됨");
      }
    } else {
      // 클립보드에 URL 복사
      navigator.clipboard.writeText(window.location.href);
      alert("프로필 링크가 클립보드에 복사되었습니다.");
    }
  };

  // 상담 신청 핸들러
  const handleConsultationRequest = () => {
    // 상담 신청 모달 또는 페이지로 이동
    navigate("/consultation/request", {
      state: { expert: expert },
    });
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

  // 전문가 레벨 정보 계산
  const expertLevel = calculateExpertLevel(
    expert.totalSessions || 0,
    expert.avgRating || expert.rating || 0
  );
  const levelBadgeStyles = getLevelBadgeStyles(expertLevel.name);
  const creditsPerMinute = calculateCreditsPerMinute(expert);

  // 가용성 상태 아이콘
  const getAvailabilityIcon = (availability) => {
    switch (availability) {
      case "available":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "busy":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "offline":
      default:
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getAvailabilityText = (availability) => {
    switch (availability) {
      case "available":
        return "상담 가능";
      case "busy":
        return "상담 중";
      case "offline":
      default:
        return "오프라인";
    }
  };

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case "available":
        return "text-green-600 bg-green-50 border-green-200";
      case "busy":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "offline":
      default:
        return "text-red-600 bg-red-50 border-red-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          {/* TOP 배지 */}
          {expert.rating >= 4.8 && expert.reviewCount >= 100 && (
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 text-center">
              <div className="flex items-center justify-center space-x-1">
                <Crown className="h-4 w-4" />
                <span className="font-medium text-sm">TOP RATED EXPERT</span>
              </div>
            </div>
          )}

          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-start md:space-x-8">
              {/* 프로필 이미지 */}
              <div className="flex-shrink-0 mb-6 md:mb-0">
                <div className="relative">
                  <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                    {expert.avatar || expert.profileImage ? (
                      <img
                        src={expert.avatar || expert.profileImage}
                        alt={`${expert.name} 프로필 사진`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-gray-600" />
                    )}
                  </div>

                  {/* 온라인 상태 표시 */}
                  <div
                    className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-white ${
                      expert.isOnline || expert.availability === "available"
                        ? "bg-green-500"
                        : expert.availability === "busy"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  />
                </div>
              </div>

              {/* 기본 정보 */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                  <div className="mb-4 sm:mb-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h1 className="text-3xl font-bold text-gray-900">
                        {expert.name}
                      </h1>

                      {/* 레벨 배지 */}
                      <div
                        className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${levelBadgeStyles.background} ${levelBadgeStyles.textColor}`}
                      >
                        <span>{levelBadgeStyles.icon}</span>
                        <span>{getKoreanLevelName(expertLevel.name)}</span>
                      </div>

                      {expert.rating >= 4.8 && expert.reviewCount >= 100 && (
                        <Crown className="h-5 w-5 text-yellow-500" />
                      )}
                    </div>

                    <p className="text-xl text-blue-600 font-semibold mb-2">
                      {expert.specialty}
                    </p>

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

                    {/* 가용성 상태 */}
                    <div
                      className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg border text-sm font-medium ${getAvailabilityColor(
                        expert.availability ||
                          (expert.isOnline ? "available" : "offline")
                      )}`}
                    >
                      {getAvailabilityIcon(
                        expert.availability ||
                          (expert.isOnline ? "available" : "offline")
                      )}
                      <span>
                        {getAvailabilityText(
                          expert.availability ||
                            (expert.isOnline ? "available" : "offline")
                        )}
                      </span>
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

                    <button
                      onClick={handleConsultationRequest}
                      disabled={expert.availability === "offline"}
                      className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                        expert.availability === "offline"
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {expert.availability === "available"
                        ? "상담 신청"
                        : expert.availability === "busy"
                        ? "대기 예약"
                        : "오프라인"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 상세 정보 탭들 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 왼쪽 컬럼 - 주요 정보 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 소개 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">소개</h3>
              <p className="text-gray-700 leading-relaxed">
                {expert.description}
              </p>
            </div>

            {/* 전문 분야 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                전문 분야
              </h3>
              <div className="flex flex-wrap gap-2">
                {(expert.specialties || []).map((specialty, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
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
          </div>

          {/* 오른쪽 컬럼 - 부가 정보 */}
          <div className="space-y-6">
            {/* 상담 방식 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                상담 방식
              </h3>
              <div className="space-y-3">
                {(expert.consultationTypes || []).map((type) => (
                  <div key={type} className="flex items-center space-x-3">
                    {type === "video" && (
                      <Video className="h-5 w-5 text-blue-600" />
                    )}
                    {type === "chat" && (
                      <MessageCircle className="h-5 w-5 text-green-600" />
                    )}
                    {type === "phone" && (
                      <Phone className="h-5 w-5 text-purple-600" />
                    )}
                    <span className="text-gray-700">
                      {type === "video" && "화상 상담"}
                      {type === "chat" && "채팅 상담"}
                      {type === "phone" && "전화 상담"}
                      {type === "offline" && "오프라인 상담"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 언어 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                사용 언어
              </h3>
              <div className="flex flex-wrap gap-2">
                {(expert.languages || ["한국어"]).map((language, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded text-sm bg-gray-100 text-gray-700"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>

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

            {/* 상담 가능 시간 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                상담 가능 시간
              </h3>
              <div className="flex items-center space-x-2 text-gray-700">
                <Clock className="h-5 w-5 text-gray-400" />
                <span>{expert.availableTime || "상담 가능 시간 미등록"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertProfile;
