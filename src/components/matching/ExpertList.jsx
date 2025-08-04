import { useState, useEffect } from 'react';
import { Grid, List } from 'lucide-react';
import ExpertCard from './ExpertCard';

const ExpertList = ({ experts, onExpertSelect, loading = false }) => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [sortBy, setSortBy] = useState('rating'); // 'rating', 'price', 'experience', 'availability'

  const sortExperts = (experts, sortBy) => {
    return [...experts].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          return a.pricePerHour - b.pricePerHour;
        case 'experience':
          return parseInt(b.experience) - parseInt(a.experience);
        case 'availability':
          const availabilityOrder = { 'available': 3, 'busy': 2, 'offline': 1 };
          return availabilityOrder[b.availability] - availabilityOrder[a.availability];
        default:
          return 0;
      }
    });
  };

  const sortedExperts = sortExperts(experts, sortBy);

  const getSortLabel = (sortBy) => {
    switch (sortBy) {
      case 'rating': return '평점순';
      case 'price': return '가격순';
      case 'experience': return '경력순';
      case 'availability': return '응답 가능순';
      default: return '평점순';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="flex space-x-2">
            <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
          </div>
        </div>
        
        <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 컨트롤 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900">
            전문가 목록 ({sortedExperts.length}명)
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          {/* 정렬 옵션 */}
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">정렬:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-gray-300 rounded px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="rating">평점순</option>
              <option value="price">가격순</option>
              <option value="experience">경력순</option>
              <option value="availability">응답 가능순</option>
            </select>
          </div>

          {/* 뷰 모드 전환 */}
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 text-sm ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
              title="그리드 보기"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 text-sm ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
              title="리스트 보기"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 전문가 목록 */}
      {sortedExperts.length > 0 ? (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {sortedExperts.map((expert) => (
            <ExpertCard
              key={expert.id}
              expert={expert}
              onSelect={() => onExpertSelect(expert)}
              viewMode={viewMode}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            조건에 맞는 전문가가 없습니다
          </h3>
          <p className="text-gray-500">
            검색 조건을 조정하거나 필터를 변경해보세요.
          </p>
        </div>
      )}

      {/* 더 보기 버튼 (페이지네이션) */}
      {sortedExperts.length > 0 && sortedExperts.length >= 12 && (
        <div className="flex justify-center">
          <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            더 많은 전문가 보기
          </button>
        </div>
      )}
    </div>
  );
};

export default ExpertList;