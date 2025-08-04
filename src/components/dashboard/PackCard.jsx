import { useState } from 'react';
import { Check, Star, Crown, Zap } from 'lucide-react';

const PackCard = ({ pack }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setPurchaseLoading] = useState(false);

  const handlePurchase = async () => {
    setPurchaseLoading(true);
    
    try {
      // 결제 API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Package purchased:', pack);
      // 실제로는 결제 페이지로 이동하거나 결제 모달 오픈
      
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('구매에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setPurchaseLoading(false);
    }
  };

  const getPackIcon = (packName) => {
    if (packName.includes('기본')) return <Zap className="h-6 w-6" />;
    if (packName.includes('프리미엄')) return <Star className="h-6 w-6" />;
    if (packName.includes('엔터프라이즈')) return <Crown className="h-6 w-6" />;
    return <Zap className="h-6 w-6" />;
  };

  const getPackColor = (packName) => {
    if (packName.includes('기본')) return {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700',
      badge: 'bg-blue-100 text-blue-800'
    };
    if (packName.includes('프리미엄')) return {
      bg: 'bg-purple-50',
      icon: 'text-purple-600',
      button: 'bg-purple-600 hover:bg-purple-700',
      badge: 'bg-purple-100 text-purple-800'
    };
    if (packName.includes('엔터프라이즈')) return {
      bg: 'bg-amber-50',
      icon: 'text-amber-600',
      button: 'bg-amber-600 hover:bg-amber-700',
      badge: 'bg-amber-100 text-amber-800'
    };
    return {
      bg: 'bg-gray-50',
      icon: 'text-gray-600',
      button: 'bg-gray-600 hover:bg-gray-700',
      badge: 'bg-gray-100 text-gray-800'
    };
  };

  const colors = getPackColor(pack.name);
  const isPremium = pack.name.includes('프리미엄');
  const isEnterprise = pack.name.includes('엔터프라이즈');

  return (
    <div
      className={`relative bg-white rounded-xl shadow-sm border transition-all duration-300 overflow-hidden ${
        isHovered ? 'shadow-lg transform -translate-y-1 border-blue-200' : 'border-gray-200'
      } ${isPremium ? 'border-purple-200' : ''} ${isEnterprise ? 'border-amber-200' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 인기 태그 */}
      {isPremium && (
        <div className="absolute top-0 right-0 bg-purple-600 text-white px-3 py-1 rounded-bl-lg text-xs font-medium">
          인기
        </div>
      )}

      {/* 추천 태그 */}
      {isEnterprise && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-3 py-1 rounded-bl-lg text-xs font-medium">
          추천
        </div>
      )}

      <div className="p-6">
        {/* 헤더 */}
        <div className="flex items-center space-x-3 mb-4">
          <div className={`p-3 rounded-lg ${colors.bg}`}>
            <div className={colors.icon}>
              {getPackIcon(pack.name)}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{pack.name}</h3>
            <p className="text-sm text-gray-600">{pack.description}</p>
          </div>
        </div>

        {/* 가격 */}
        <div className="mb-6">
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-gray-900">
              {pack.price.toLocaleString()}원
            </span>
            <span className="text-sm text-gray-500">일시불</span>
          </div>
          <div className="mt-1">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.badge}`}>
              {pack.credits} 크레딧 포함
            </span>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            크레딧당 {Math.round(pack.price / pack.credits)}원
            {pack.credits > 100 && (
              <span className="ml-2 text-green-600 font-medium">
                ({Math.round(((100 * pack.price / pack.credits) - pack.price / pack.credits) / (pack.price / pack.credits) * 100)}% 할인)
              </span>
            )}
          </div>
        </div>

        {/* 기능 목록 */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">포함된 기능</h4>
          <ul className="space-y-2">
            {pack.features.map((feature, index) => (
              <li key={index} className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm text-gray-600">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 추가 혜택 */}
        {(isPremium || isEnterprise) && (
          <div className="mb-6 p-3 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">특별 혜택</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              {isPremium && (
                <>
                  <li>• 전문가 우선 배정</li>
                  <li>• 상담 요약 PDF 제공</li>
                  <li>• 30일 무료 재상담</li>
                </>
              )}
              {isEnterprise && (
                <>
                  <li>• 전담 고객 성공 매니저</li>
                  <li>• 맞춤형 상담 패키지</li>
                  <li>• 무제한 재상담</li>
                  <li>• API 연동 지원</li>
                </>
              )}
            </ul>
          </div>
        )}

        {/* 구매 버튼 */}
        <button
          onClick={handlePurchase}
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${colors.button} ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              처리 중...
            </div>
          ) : (
            `${pack.name} 구매하기`
          )}
        </button>

        {/* 추가 정보 */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            VAT 포함 • 즉시 사용 가능 • 30일 환불 보장
          </p>
        </div>
      </div>

      {/* 호버 효과 */}
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-50 pointer-events-none" />
      )}
    </div>
  );
};

export default PackCard;