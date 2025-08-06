/**
 * 전문가 레벨 시스템 유틸리티
 * Firebase Functions의 로직을 프론트엔드에서 사용할 수 있도록 컴포넌트화
 */

// 전문가 레벨 정의 (10,000원 = 1,000크레딧 기준)
export const LEVELS = [
  {
    name: "Diamond",
    sessions: 200,
    rating: 4.8,
    baseCreditsPerMinute: 3000, // 분당 3,000 크레딧 (30,000원/분)
    maxCreditsPerMinute: 4000, // 최대 분당 4,000 크레딧 (40,000원/분)
    color: "from-blue-400 to-purple-500",
    bgColor: "bg-gradient-to-r from-blue-100 to-purple-100",
    textColor: "text-purple-700",
    borderColor: "border-purple-500",
  },
  {
    name: "Platinum",
    sessions: 100,
    rating: 4.7,
    baseCreditsPerMinute: 2200, // 분당 2,200 크레딧 (22,000원/분)
    maxCreditsPerMinute: 2800, // 최대 분당 2,800 크레딧 (28,000원/분)
    color: "from-gray-300 to-gray-500",
    bgColor: "bg-gradient-to-r from-gray-100 to-gray-200",
    textColor: "text-gray-700",
    borderColor: "border-gray-400",
  },
  {
    name: "Gold",
    sessions: 60,
    rating: 4.5,
    baseCreditsPerMinute: 1800, // 분당 1,800 크레딧 (18,000원/분)
    maxCreditsPerMinute: 2100, // 최대 분당 2,100 크레딧 (21,000원/분)
    color: "from-yellow-400 to-orange-500",
    bgColor: "bg-gradient-to-r from-yellow-100 to-orange-100",
    textColor: "text-orange-700",
    borderColor: "border-yellow-500",
  },
  {
    name: "Silver",
    sessions: 30,
    rating: 4.3,
    baseCreditsPerMinute: 1500, // 분당 1,500 크레딧 (15,000원/분)
    maxCreditsPerMinute: 1700, // 최대 분당 1,700 크레딧 (17,000원/분)
    color: "from-gray-400 to-gray-600",
    bgColor: "bg-gradient-to-r from-gray-50 to-gray-100",
    textColor: "text-gray-600",
    borderColor: "border-gray-500",
  },
  {
    name: "Bronze",
    sessions: 5,
    rating: 4.0,
    baseCreditsPerMinute: 1200, // 분당 1,200 크레딧 (12,000원/분)
    maxCreditsPerMinute: 1400, // 최대 분당 1,400 크레딧 (14,000원/분)
    color: "from-amber-600 to-amber-800",
    bgColor: "bg-gradient-to-r from-amber-50 to-amber-100",
    textColor: "text-amber-700",
    borderColor: "border-amber-600",
  },
];

/**
 * 전문가의 현재 레벨을 계산합니다.
 * @param {number} totalSessions - 총 상담 세션 수
 * @param {number} avgRating - 평균 평점
 * @returns {Object} 레벨 정보 객체
 */
export const calculateExpertLevel = (totalSessions = 0, avgRating = 0) => {
  // 조건을 만족하는 가장 높은 레벨을 찾습니다
  const level = LEVELS.find(
    (l) => totalSessions >= l.sessions && avgRating >= l.rating
  );
  return level || LEVELS[LEVELS.length - 1]; // 기본값은 Bronze
};

/**
 * 레벨명으로 레벨 정보를 가져옵니다.
 * @param {string} levelName - 레벨명
 * @returns {Object} 레벨 정보 객체
 */
export const getLevelInfo = (levelName) => {
  return LEVELS.find((l) => l.name === levelName) || LEVELS[LEVELS.length - 1];
};

/**
 * 분당 크레딧 요금을 계산합니다.
 * @param {Object} expert - 전문가 정보
 * @param {number} expert.totalSessions - 총 상담 세션 수
 * @param {number} expert.avgRating - 평균 평점
 * @param {number} expert.creditsPerMinute - 현재 설정된 분당 크레딧 (선택사항)
 * @returns {number} 분당 크레딧 요금
 */
export const calculateCreditsPerMinute = (expert) => {
  const { totalSessions = 0, avgRating = 0, creditsPerMinute } = expert;
  const level = calculateExpertLevel(totalSessions, avgRating);

  // 현재 분당 크레딧이 설정되어 있고 최대 요금을 초과하지 않으면 그대로 사용
  if (creditsPerMinute && creditsPerMinute <= level.maxCreditsPerMinute) {
    return creditsPerMinute;
  }

  // 레벨에 따른 기본 분당 크레딧 반환
  return level.baseCreditsPerMinute;
};

/**
 * 다음 레벨까지의 진행률을 계산합니다.
 * @param {number} totalSessions - 총 상담 세션 수
 * @param {number} avgRating - 평균 평점
 * @returns {Object} 진행률 정보
 */
export const getNextLevelProgress = (totalSessions = 0, avgRating = 0) => {
  const currentLevel = calculateExpertLevel(totalSessions, avgRating);
  const currentLevelIndex = LEVELS.findIndex(
    (l) => l.name === currentLevel.name
  );

  // 이미 최고 레벨인 경우
  if (currentLevelIndex === 0) {
    return {
      isMaxLevel: true,
      progress: 100,
      nextLevel: null,
      sessionsNeeded: 0,
      ratingNeeded: 0,
    };
  }

  const nextLevel = LEVELS[currentLevelIndex - 1];
  const sessionsProgress = Math.min(
    100,
    (totalSessions / nextLevel.sessions) * 100
  );
  const ratingProgress = Math.min(100, (avgRating / nextLevel.rating) * 100);
  const overallProgress = Math.min(sessionsProgress, ratingProgress);

  return {
    isMaxLevel: false,
    progress: overallProgress,
    nextLevel,
    sessionsNeeded: Math.max(0, nextLevel.sessions - totalSessions),
    ratingNeeded: Math.max(0, nextLevel.rating - avgRating),
    sessionsProgress,
    ratingProgress,
  };
};

/**
 * 레벨 배지 컴포넌트에 필요한 스타일 정보를 반환합니다.
 * @param {string} levelName - 레벨명
 * @returns {Object} 스타일 정보
 */
export const getLevelBadgeStyles = (levelName) => {
  const level = getLevelInfo(levelName);
  return {
    gradient: level.color,
    background: level.bgColor,
    textColor: level.textColor,
    borderColor: level.borderColor,
  };
};

/**
 * 레벨별 요금 정보를 반환합니다.
 * @param {string} levelName - 레벨명
 * @returns {Object} 요금 정보
 */
export const getLevelPricing = (levelName) => {
  const level = getLevelInfo(levelName);
  return {
    baseCreditsPerMinute: level.baseCreditsPerMinute,
    maxCreditsPerMinute: level.maxCreditsPerMinute,
    baseCreditsPerHour: level.baseCreditsPerMinute * 60,
    maxCreditsPerHour: level.maxCreditsPerMinute * 60,
  };
};

/**
 * 전문가 레벨 시스템의 전체 통계를 계산합니다.
 * @param {Array} experts - 전문가 목록
 * @returns {Object} 레벨별 통계
 */
export const calculateLevelStatistics = (experts = []) => {
  const stats = LEVELS.reduce((acc, level) => {
    acc[level.name] = { count: 0, percentage: 0 };
    return acc;
  }, {});

  experts.forEach((expert) => {
    const level = calculateExpertLevel(expert.totalSessions, expert.avgRating);
    stats[level.name].count++;
  });

  const total = experts.length;
  if (total > 0) {
    Object.keys(stats).forEach((levelName) => {
      stats[levelName].percentage = Math.round(
        (stats[levelName].count / total) * 100
      );
    });
  }

  return stats;
};

/**
 * 한국어 레벨명을 반환합니다.
 * @param {string} levelName - 영문 레벨명
 * @returns {string} 한국어 레벨명
 */
export const getKoreanLevelName = (levelName) => {
  const levelMap = {
    Diamond: "다이아몬드",
    Platinum: "플래티넘",
    Gold: "골드",
    Silver: "실버",
    Bronze: "브론즈",
  };
  return levelMap[levelName] || levelName;
};
