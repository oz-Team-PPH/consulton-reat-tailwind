import { useState } from 'react';
import { 
  Star, MapPin, Clock, MessageCircle, 
  Video, Calendar, CheckCircle, AlertCircle, 
  XCircle, User, Crown
} from 'lucide-react';

const ExpertCard = ({ expert, onSelect, viewMode = 'grid' }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getAvailabilityIcon = (availability) => {
    switch (availability) {
      case 'available':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'busy':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'offline':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getAvailabilityText = (availability) => {
    switch (availability) {
      case 'available': return '상담 가능';
      case 'busy': return '상담 중';
      case 'offline': return '오프라인';
      default: return '알 수 없음';
    }
  };

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'available': return 'text-green-600 bg-green-50';
      case 'busy': return 'text-yellow-600 bg-yellow-50';
      case 'offline': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const isTopRated = expert.rating >= 4.8 && expert.reviewCount >= 100;
  const isListView = viewMode === 'list';

  return (
    <div
      className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-200 overflow-hidden ${
        isHovered ? 'transform -translate-y-1' : ''
      } ${isListView ? 'flex items-center p-4' : 'p-6'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 상단 배지 */}
      {isTopRated && !isListView && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-bl-lg text-xs font-medium flex items-center space-x-1">
          <Crown className="h-3 w-3" />
          <span>TOP</span>
        </div>
      )}

      <div className={`${isListView ? 'flex items-center space-x-4 w-full' : ''}`}>
        {/* 프로필 섹션 */}
        <div className={`${isListView ? 'flex items-center space-x-4' : 'flex items-center space-x-4 mb-4'}`}>
          {/* 아바타 */}
          <div className="relative">
            <div className={`${isListView ? 'w-16 h-16' : 'w-20 h-20'} bg-gray-300 rounded-full flex items-center justify-center overflow-hidden`}>
              {expert.avatar ? (
                <img src={expert.avatar} alt={expert.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-gray-600" />
              )}
            </div>
            
            {/* 상태 표시 */}
            <div className={`absolute -bottom-1 -right-1 ${isListView ? 'w-5 h-5' : 'w-6 h-6'} rounded-full border-2 border-white ${
              expert.availability === 'available' ? 'bg-green-500' :
              expert.availability === 'busy' ? 'bg-yellow-500' : 'bg-red-500'
            }`}></div>
          </div>

          {/* 기본 정보 */}
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className={`font-bold text-gray-900 ${isListView ? 'text-lg' : 'text-xl'}`}>
                {expert.name}
              </h3>
              {isTopRated && (
                <Crown className="h-4 w-4 text-yellow-500" />
              )}
            </div>
            <p className={`text-gray-600 ${isListView ? 'text-sm' : ''}`}>
              {expert.title}
            </p>
            
            {/* 평점과 리뷰 */}
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium text-gray-900">
                  {expert.rating}
                </span>
                <span className="text-sm text-gray-500">
                  ({expert.reviewCount})
                </span>
              </div>
              
              {!isListView && (
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <MapPin className="h-3 w-3" />
                  <span>{expert.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 상세 정보 */}
        <div className={`${isListView ? 'flex-1 grid grid-cols-2 gap-4' : 'space-y-4'}`}>
          {/* 전문 분야 */}
          <div className={isListView ? '' : 'mb-4'}>
            <h4 className="text-sm font-medium text-gray-900 mb-2">전문 분야</h4>
            <div className="flex flex-wrap gap-1">
              {expert.specialties.slice(0, isListView ? 2 : 3).map((specialty, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {specialty}
                </span>
              ))}
              {expert.specialties.length > (isListView ? 2 : 3) && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  +{expert.specialties.length - (isListView ? 2 : 3)}
                </span>
              )}
            </div>
          </div>

          {/* 상담 정보 */}
          <div className={`grid ${isListView ? 'grid-cols-1' : 'grid-cols-2'} gap-4 text-sm`}>
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{expert.responseTime}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-600">
              <MessageCircle className="h-4 w-4" />
              <span>{expert.consultationCount}회 상담</span>
            </div>
            
            {!isListView && (
              <>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{expert.experience} 경력</span>
                </div>
                
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{expert.location}</span>
                </div>
              </>
            )}
          </div>

          {/* 설명 */}
          {!isListView && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {expert.description}
            </p>
          )}
        </div>

        {/* 하단 섹션 */}
        <div className={`${isListView ? 'flex items-center space-x-4' : 'flex items-center justify-between pt-4 border-t border-gray-100'}`}>
          {/* 가격 정보 */}
          <div className={`flex items-center space-x-2 ${isListView ? '' : 'flex-1'}`}>
            <span className={`font-bold text-gray-900 ${isListView ? 'text-lg' : 'text-xl'}`}>
              {expert.pricePerHour.toLocaleString()}원
            </span>
            <span className="text-sm text-gray-500">/시간</span>
          </div>

          {/* 상태 및 버튼 */}
          <div className="flex items-center space-x-3">
            {/* 상태 표시 */}
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(expert.availability)}`}>
              {getAvailabilityIcon(expert.availability)}
              <span>{getAvailabilityText(expert.availability)}</span>
            </div>

            {/* 상담 버튼 */}
            <button
              onClick={onSelect}
              disabled={expert.availability === 'offline'}
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                expert.availability === 'offline'
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {expert.availability === 'available' ? '상담 시작' : 
               expert.availability === 'busy' ? '대기 예약' : '오프라인'}
            </button>
          </div>
        </div>
      </div>

      {/* 호버 효과 */}
      {isHovered && !isListView && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-30 pointer-events-none rounded-lg" />
      )}
    </div>
  );
};

export default ExpertCard;