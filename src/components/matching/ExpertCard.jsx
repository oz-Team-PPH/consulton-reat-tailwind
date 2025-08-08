import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";
import {
  calculateExpertLevel,
  calculateCreditsPerMinute,
  getLevelBadgeStyles,
  getKoreanLevelName,
} from "../../utils/expertLevels";

/**
 * 전문가 카드 컴포넌트
 * 개별 전문가의 정보를 카드 형태로 표시합니다.
 *
 * @param {Object} props - 컴포넌트 props
 * @param {Object} props.expert - 전문가 정보 객체
 * @param {Function} props.onProfileView - 전문가 프로필 보기 시 호출되는 함수
 * @param {string} props.viewMode - 표시 모드 ('grid' | 'list')
 *
 * @example
 * <ExpertCard
 *   expert={expertData}
 *   onProfileView={(expert) => handleProfileView(expert)}
 *   viewMode="grid"
 * />
 */
const ExpertCard = ({
  expert = {},
  onProfileView = () => {},
  viewMode = "grid",
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  // 답변 시간 텍스트 변환 함수
  const getResponseTimeText = useCallback((responseTime) => {
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
  }, []);

  // 답변 시간 아이콘 컴포넌트
  const getResponseTimeIcon = useCallback((responseTime) => {
    if (!responseTime) {
      return <Clock className="h-4 w-4 text-gray-400" aria-label="답변 시간 정보 없음" />;
    }
    
    if (typeof responseTime === 'number') {
      if (responseTime < 60) {
        return <Clock className="h-4 w-4 text-green-500" aria-label="빠른 답변" />;
      } else if (responseTime < 1440) {
        return <Clock className="h-4 w-4 text-yellow-500" aria-label="보통 답변" />;
      } else {
        return <Clock className="h-4 w-4 text-red-500" aria-label="느린 답변" />;
      }
    }
    
    return <Clock className="h-4 w-4 text-gray-400" aria-label="답변 시간" />;
  }, []);

  // 답변 시간 색상 클래스
  const getResponseTimeColor = useCallback((responseTime) => {
    if (!responseTime) return "text-gray-600 bg-gray-50";
    
    if (typeof responseTime === 'number') {
      if (responseTime < 60) {
        return "text-green-600 bg-green-50";
      } else if (responseTime < 1440) {
        return "text-yellow-600 bg-yellow-50";
      } else {
        return "text-red-600 bg-red-50";
      }
    }
    
    return "text-gray-600 bg-gray-50";
  }, []);

  // 계산된 값들 메모화
  const expertInfo = useMemo(() => {
    // 안전한 기본값 제공
    const safeExpert = {
      name: expert.name || "이름 없음",
      rating: expert.rating || 0,
      reviewCount: expert.reviewCount || 0,
      responseTime: expert.responseTime || null,
      specialties: expert.specialties || [],
      totalSessions: expert.totalSessions || 0,
      avgRating: expert.avgRating || expert.rating || 0,
      level: expert.level || 1, // 레벨 정보 추가
      ...expert,
    };

    // 레벨 정보 계산
    const expertLevel = calculateExpertLevel(
      safeExpert.totalSessions,
      safeExpert.avgRating
    );
    const levelBadgeStyles = getLevelBadgeStyles(expertLevel.name);
    const creditsPerMinute = calculateCreditsPerMinute(safeExpert);

    // 카드 사이즈에 맞게 태그 개수 결정
    const maxTags = viewMode === "list" ? 1 : 3;
    const displaySpecialties = safeExpert.specialties.slice(0, maxTags);
    const remainingSpecialtiesCount = Math.max(0, safeExpert.specialties.length - maxTags);

    return {
      ...safeExpert,
      expertLevel,
      levelBadgeStyles,
      creditsPerMinute,
      isTopRated: safeExpert.rating >= 4.8 && safeExpert.reviewCount >= 100,
      isListView: viewMode === "list",
      displaySpecialties,
      remainingSpecialtiesCount,
    };
  }, [expert, viewMode]);

  // 이벤트 핸들러 최적화
  const handleProfileView = useCallback(() => {
    if (onProfileView) {
      onProfileView(expert);
    } else {
      // 기본 동작: 전문가 프로필 페이지로 이동
      navigate(`/expert/${expert.id}`, {
        state: {
          expert: expert,
          from: "expert-card",
        },
      });
    }
  }, [expert, onProfileView, navigate]);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  return (
    <div
      className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200 overflow-hidden ${
        isHovered ? "transform -translate-y-1" : ""
      } ${expertInfo.isListView ? "flex items-center p-4" : "p-6"} relative`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="article"
      aria-label={`전문가 ${expertInfo.name} 정보`}
    >
      {/* 상단 배지 */}
      {expertInfo.isTopRated && !expertInfo.isListView && (
        <div
          className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-bl-xl text-xs font-medium flex items-center space-x-1"
          aria-label="최고 평점 전문가"
        >
          <Crown className="h-3 w-3" />
          <span>TOP</span>
        </div>
      )}

      <div
        className={`${
          expertInfo.isListView ? "flex items-center space-x-4 w-full" : ""
        }`}
      >
        {/* 프로필 섹션 */}
        <div
          className={`${
            expertInfo.isListView
              ? "flex items-center space-x-4"
              : "flex items-start space-x-4 mb-5"
          }`}
        >
          {/* 아바타 */}
          <div className="relative flex-shrink-0">
            <div
              className={`${
                expertInfo.isListView ? "w-20 h-20" : "w-24 h-24"
              } bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-gray-100`}
            >
              {expertInfo.avatar ? (
                <img
                  src={expertInfo.avatar}
                  alt={`${expertInfo.name} 프로필 사진`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "block";
                  }}
                />
              ) : null}
              <User
                className="w-10 h-10 text-gray-400"
                style={{ display: expertInfo.avatar ? "none" : "block" }}
              />
            </div>
          </div>

          {/* 기본 정보 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h3
                className={`font-bold text-gray-900 truncate ${
                  expertInfo.isListView ? "text-lg" : "text-xl"
                }`}
              >
                {expertInfo.name}
              </h3>
              {/* 레벨 배지 */}
              <div
                className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700`}
              >
                <span>Lv.{expertInfo.expertLevel.level}</span>
              </div>
              {expertInfo.isTopRated && (
                <Crown className="h-4 w-4 text-yellow-500" />
              )}
            </div>
            <p
              className={`text-gray-600 font-medium ${
                expertInfo.isListView ? "text-sm" : "text-base"
              }`}
            >
              {expertInfo.title || expert.title}
            </p>

            {/* 평점과 리뷰 */}
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm font-semibold text-gray-900">
                  {expertInfo.rating}
                </span>
                <span className="text-sm text-gray-500">
                  ({expertInfo.reviewCount})
                </span>
              </div>

              {!expertInfo.isListView && (
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{expertInfo.location || expert.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 전문 분야 */}
        <div className={`${expertInfo.isListView ? "flex-1" : "mb-4"}`}>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            전문 분야
          </h4>
          <div className="flex gap-1.5 overflow-hidden">
            {expertInfo.displaySpecialties.map((specialty, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 flex-shrink-0"
              >
                {specialty}
              </span>
            ))}
            {expertInfo.remainingSpecialtiesCount > 0 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-100 flex-shrink-0">
                +{expertInfo.remainingSpecialtiesCount}
              </span>
            )}
          </div>
        </div>

        {/* 상담 정보 */}
        <div
          className={`grid ${
            expertInfo.isListView ? "grid-cols-1" : "grid-cols-2"
          } gap-3 text-sm mb-4`}
        >
          <div className="flex items-center space-x-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{expertInfo.experience || expert.experience}년 경력</span>
          </div>

          <div className="flex items-center space-x-2 text-gray-600">
            <MessageCircle className="h-4 w-4" />
            <span>
              {expertInfo.consultationCount || expert.consultationCount}회
              상담
            </span>
          </div>

          {!expertInfo.isListView && (
            <>
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{expertInfo.responseTime || expert.responseTime}</span>
              </div>

              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span className="truncate">{expertInfo.location || expert.location}</span>
              </div>
            </>
          )}
        </div>

        {/* 설명 */}
        {!expertInfo.isListView && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {expertInfo.description || expert.description}
          </p>
        )}

        {/* 하단 섹션 */}
        <div
          className={`${
            expertInfo.isListView
              ? "flex items-center space-x-4"
              : "flex items-center justify-between pt-4 border-t border-gray-100"
          }`}
        >
          {/* 가격 정보 */}
          <div
            className={`flex items-center space-x-2 ${
              expertInfo.isListView ? "" : "flex-1"
            }`}
          >
            <span
              className={`font-bold text-gray-900 ${
                expertInfo.isListView ? "text-lg" : "text-xl"
              }`}
            >
              {expertInfo.creditsPerMinute}크레딧
            </span>
            <span className="text-sm text-gray-500">/분</span>
          </div>

          {/* 답변 시간 및 버튼 */}
          <div className="flex items-center space-x-3">
            {/* 답변 시간 표시 */}
            <div
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium ${getResponseTimeColor(
                expertInfo.responseTime
              )}`}
            >
              {getResponseTimeIcon(expertInfo.responseTime)}
              <span>{getResponseTimeText(expertInfo.responseTime)}</span>
            </div>

            {/* 프로필 보기 버튼 */}
            <button
              onClick={handleProfileView}
              className="px-4 py-2 rounded-lg font-medium transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm"
              aria-label={`${expertInfo.name} 전문가 프로필 보기`}
            >
              프로필 보기
            </button>
          </div>
        </div>
      </div>

      {/* 호버 효과 */}
      {isHovered && !expertInfo.isListView && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-20 pointer-events-none rounded-xl" />
      )}
    </div>
  );
};

// 컴포넌트 displayName 설정
ExpertCard.displayName = "ExpertCard";

export default ExpertCard;
