import { useState, useMemo, useCallback } from 'react';
import { 
  Star, MapPin, Clock, MessageCircle, 
  Video, Calendar, CheckCircle, AlertCircle, 
  XCircle, User, Crown
} from 'lucide-react';

/**
 * 전문가 카드 컴포넌트
 * 개별 전문가의 정보를 카드 형태로 표시합니다.
 * 
 * @param {Object} props - 컴포넌트 props
 * @param {Object} props.expert - 전문가 정보 객체
 * @param {Function} props.onSelect - 전문가 선택 시 호출되는 함수
 * @param {string} props.viewMode - 표시 모드 ('grid' | 'list')
 * 
 * @example
 * <ExpertCard 
 *   expert={expertData} 
 *   onSelect={(expert) => handleSelect(expert)}
 *   viewMode="grid"
 * />
 */
const ExpertCard = ({ expert = {}, onSelect = () => {}, viewMode = 'grid' }) => {
  const [isHovered, setIsHovered] = useState(false);

  // 가용성 아이콘 컴포넌트 메모화
  const getAvailabilityIcon = useCallback((availability) => {
    switch (availability) {
      case 'available':
        return <CheckCircle className="h-4 w-4 text-green-500" aria-label="상담 가능" />;
      case 'busy':
        return <AlertCircle className="h-4 w-4 text-yellow-500" aria-label="상담 중" />;
      case 'offline':
        return <XCircle className="h-4 w-4 text-red-500" aria-label="오프라인" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-400" aria-label="상태 알 수 없음" />;
    }
  }, []);

  const getAvailabilityText = useCallback((availability) => {
    switch (availability) {
      case 'available': return '상담 가능';
      case 'busy': return '상담 중';
      case 'offline': return '오프라인';
      default: return '알 수 없음';
    }
  }, []);

  const getAvailabilityColor = useCallback((availability) => {
    switch (availability) {
      case 'available': return 'text-green-600 bg-green-50';
      case 'busy': return 'text-yellow-600 bg-yellow-50';
      case 'offline': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  }, []);

  // 계산된 값들 메모화
  const expertInfo = useMemo(() => {
    // 안전한 기본값 제공
    const safeExpert = {
      name: expert.name || '이름 없음',
      rating: expert.rating || 0,
      reviewCount: expert.reviewCount || 0,
      availability: expert.availability || 'offline',
      specialties: expert.specialties || [],
      creditsPerMinute: expert.creditsPerMinute || expert.pricePerHour || 0,
      ...expert
    };

    return {
      ...safeExpert,
      isTopRated: safeExpert.rating >= 4.8 && safeExpert.reviewCount >= 100,
      isListView: viewMode === 'list',
      displaySpecialties: safeExpert.specialties.slice(0, viewMode === 'list' ? 2 : 3),
      remainingSpecialtiesCount: Math.max(0, safeExpert.specialties.length - (viewMode === 'list' ? 2 : 3))
    };
  }, [expert, viewMode]);

  // 이벤트 핸들러 최적화
  const handleSelect = useCallback(() => {
    if (expertInfo.availability !== 'offline' && onSelect) {
      onSelect(expert);
    }
  }, [expert, expertInfo.availability, onSelect]);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  return (
    <div
      className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-200 overflow-hidden ${
        isHovered ? 'transform -translate-y-1' : ''
      } ${expertInfo.isListView ? 'flex items-center p-4' : 'p-6'} relative`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="article"
      aria-label={`전문가 ${expertInfo.name} 정보`}
    >
      {/* 상단 배지 */}
      {expertInfo.isTopRated && !expertInfo.isListView && (
        <div 
          className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-bl-lg text-xs font-medium flex items-center space-x-1"
          aria-label="최고 평점 전문가"
        >
          <Crown className="h-3 w-3" />
          <span>TOP</span>
        </div>
      )}

      <div className={`${expertInfo.isListView ? 'flex items-center space-x-4 w-full' : ''}`}>
        {/* 프로필 섹션 */}
        <div className={`${expertInfo.isListView ? 'flex items-center space-x-4' : 'flex items-center space-x-4 mb-4'}`}>
          {/* 아바타 */}
          <div className="relative">
            <div className={`${expertInfo.isListView ? 'w-16 h-16' : 'w-20 h-20'} bg-gray-300 rounded-full flex items-center justify-center overflow-hidden`}>
              {expertInfo.avatar ? (
                <img 
                  src={expertInfo.avatar} 
                  alt={`${expertInfo.name} 프로필 사진`} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              ) : null}
              <User className="w-8 h-8 text-gray-600" style={{display: expertInfo.avatar ? 'none' : 'block'}} />
            </div>
            
            {/* 상태 표시 */}
            <div 
              className={`absolute -bottom-1 -right-1 ${expertInfo.isListView ? 'w-5 h-5' : 'w-6 h-6'} rounded-full border-2 border-white ${
                expertInfo.availability === 'available' ? 'bg-green-500' :
                expertInfo.availability === 'busy' ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              aria-label={getAvailabilityText(expertInfo.availability)}
            ></div>
          </div>

          {/* 기본 정보 */}
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className={`font-bold text-gray-900 ${expertInfo.isListView ? 'text-lg' : 'text-xl'}`}>
                {expertInfo.name}
              </h3>
              {expertInfo.isTopRated && (
                <Crown className="h-4 w-4 text-yellow-500" />
              )}
            </div>
            <p className={`text-gray-600 ${expertInfo.isListView ? 'text-sm' : ''}`}>
              {expertInfo.title || expert.title}
            </p>
            
            {/* 평점과 리뷰 */}
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium text-gray-900">
                  {expertInfo.rating}
                </span>
                <span className="text-sm text-gray-500">
                  ({expertInfo.reviewCount})
                </span>
              </div>
              
              {!expertInfo.isListView && (
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <MapPin className="h-3 w-3" />
                  <span>{expertInfo.location || expert.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 상세 정보 */}
        <div className={`${expertInfo.isListView ? 'flex-1 grid grid-cols-2 gap-4' : 'space-y-4'}`}>
          {/* 전문 분야 */}
          <div className={expertInfo.isListView ? '' : 'mb-4'}>
            <h4 className="text-sm font-medium text-gray-900 mb-2">전문 분야</h4>
            <div className="flex flex-wrap gap-1">
              {expertInfo.displaySpecialties.map((specialty, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {specialty}
                </span>
              ))}
              {expertInfo.remainingSpecialtiesCount > 0 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  +{expertInfo.remainingSpecialtiesCount}
                </span>
              )}
            </div>
          </div>

          {/* 상담 정보 */}
          <div className={`grid ${expertInfo.isListView ? 'grid-cols-1' : 'grid-cols-2'} gap-4 text-sm`}>
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{expertInfo.responseTime || expert.responseTime}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-600">
              <MessageCircle className="h-4 w-4" />
              <span>{expertInfo.consultationCount || expert.consultationCount}회 상담</span>
            </div>
            
            {!expertInfo.isListView && (
              <>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{expertInfo.experience || expert.experience} 경력</span>
                </div>
                
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{expertInfo.location || expert.location}</span>
                </div>
              </>
            )}
          </div>

          {/* 설명 */}
          {!expertInfo.isListView && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {expertInfo.description || expert.description}
            </p>
          )}
        </div>

        {/* 하단 섹션 */}
        <div className={`${expertInfo.isListView ? 'flex items-center space-x-4' : 'flex items-center justify-between pt-4 border-t border-gray-100'}`}>
          {/* 가격 정보 */}
          <div className={`flex items-center space-x-2 ${expertInfo.isListView ? '' : 'flex-1'}`}>
            <span className={`font-bold text-gray-900 ${expertInfo.isListView ? 'text-lg' : 'text-xl'}`}>
              {expertInfo.creditsPerMinute}크레딧
            </span>
            <span className="text-sm text-gray-500">/분</span>
          </div>

          {/* 상태 및 버튼 */}
          <div className="flex items-center space-x-3">
            {/* 상태 표시 */}
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(expertInfo.availability)}`}>
              {getAvailabilityIcon(expertInfo.availability)}
              <span>{getAvailabilityText(expertInfo.availability)}</span>
            </div>

            {/* 상담 버튼 */}
            <button
              onClick={handleSelect}
              disabled={expertInfo.availability === 'offline'}
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                expertInfo.availability === 'offline'
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
              }`}
              aria-label={`${expertInfo.name} 전문가와 ${
                expertInfo.availability === 'available' ? '상담 시작' : 
                expertInfo.availability === 'busy' ? '대기 예약' : '오프라인'
              }`}
            >
              {expertInfo.availability === 'available' ? '상담 시작' : 
               expertInfo.availability === 'busy' ? '대기 예약' : '오프라인'}
            </button>
          </div>
        </div>
      </div>

      {/* 호버 효과 */}
      {isHovered && !expertInfo.isListView && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-30 pointer-events-none rounded-lg" />
      )}
    </div>
  );
};

// 컴포넌트 displayName 설정
ExpertCard.displayName = 'ExpertCard';

export default ExpertCard;