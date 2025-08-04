import { useState, useEffect } from 'react';
import { Search, Filter, Star, MapPin, Clock } from 'lucide-react';
import ExpertList from '../components/matching/ExpertList';
import ExpertCard from '../components/matching/ExpertCard';
import PaymentModal from '../components/matching/PaymentModal';

const ExpertMatching = () => {
  const [experts, setExperts] = useState([]);
  const [filteredExperts, setFilteredExperts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', name: '전체' },
    { id: 'marketing', name: '마케팅' },
    { id: 'business', name: '비즈니스' },
    { id: 'tech', name: '기술' },
    { id: 'design', name: '디자인' },
    { id: 'finance', name: '재무' },
    { id: 'legal', name: '법무' },
    { id: 'hr', name: '인사' },
    { id: 'education', name: '교육' }
  ];

  // 더미 전문가 데이터
  const mockExperts = [
    {
      id: 1,
      name: '김마케팅',
      title: '디지털 마케팅 전문가',
      category: 'marketing',
      rating: 4.9,
      reviewCount: 127,
      experience: '8년',
      location: '서울',
      pricePerHour: 50000,
      availability: 'available', // available, busy, offline
      specialties: ['SNS 마케팅', '퍼포먼스 마케팅', '브랜드 전략'],
      description: '다양한 업계에서 8년간 디지털 마케팅을 담당했습니다. ROI 중심의 실무 경험을 바탕으로 실질적인 조언을 드립니다.',
      avatar: null,
      responseTime: '평균 2시간',
      consultationCount: 234
    },
    {
      id: 2,
      name: '박비즈니스',
      title: '사업 전략 컨설턴트',
      category: 'business',
      rating: 4.8,
      reviewCount: 89,
      experience: '12년',
      location: '부산',
      pricePerHour: 80000,
      availability: 'available',
      specialties: ['사업 계획', '시장 분석', '투자 유치'],
      description: '스타트업부터 대기업까지 다양한 규모의 회사에서 사업 전략을 수립해왔습니다.',
      avatar: null,
      responseTime: '평균 1시간',
      consultationCount: 156
    },
    {
      id: 3,
      name: '이테크니컬',
      title: '풀스택 개발자',
      category: 'tech',
      rating: 4.7,
      reviewCount: 203,
      experience: '6년',
      location: '서울',
      pricePerHour: 45000,
      availability: 'busy',
      specialties: ['React', 'Node.js', 'AWS'],
      description: '웹 애플리케이션 개발 전반에 대한 경험이 풍부합니다. 기술적인 문제 해결과 아키텍처 설계를 도와드립니다.',
      avatar: null,
      responseTime: '평균 3시간',
      consultationCount: 178
    },
    {
      id: 4,
      name: '최디자인',
      title: 'UX/UI 디자이너',
      category: 'design',
      rating: 4.9,
      reviewCount: 145,
      experience: '7년',
      location: '서울',
      pricePerHour: 55000,
      availability: 'available',
      specialties: ['사용자 경험', '인터페이스 디자인', '디자인 시스템'],
      description: '사용자 중심의 디자인으로 비즈니스 가치를 만드는 것을 목표로 합니다.',
      avatar: null,
      responseTime: '평균 1시간',
      consultationCount: 192
    }
  ];

  useEffect(() => {
    // 실제로는 API 호출
    setTimeout(() => {
      setExperts(mockExperts);
      setFilteredExperts(mockExperts);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = experts;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(expert => expert.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(expert =>
        expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expert.specialties.some(specialty => 
          specialty.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    setFilteredExperts(filtered);
  }, [experts, selectedCategory, searchTerm]);

  const handleExpertSelect = (expert) => {
    setSelectedExpert(expert);
    setShowPaymentModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">전문가를 찾고 있습니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">전문가 매칭</h1>
          <p className="mt-2 text-gray-600">
            당신의 문제를 해결해줄 최적의 전문가를 찾아보세요.
          </p>
        </div>

        {/* 검색 및 필터 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* 검색 바 */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="전문가 이름, 분야, 기술을 검색하세요..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* 카테고리 필터 */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 결과 통계 */}
        <div className="mb-6">
          <p className="text-gray-600">
            총 <span className="font-semibold text-gray-900">{filteredExperts.length}명</span>의 전문가를 찾았습니다.
          </p>
        </div>

        {/* 전문가 목록 */}
        {filteredExperts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperts.map((expert) => (
              <ExpertCard
                key={expert.id}
                expert={expert}
                onSelect={() => handleExpertSelect(expert)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              검색 결과가 없습니다
            </h3>
            <p className="text-gray-500">
              다른 키워드로 검색하거나 필터를 변경해보세요.
            </p>
          </div>
        )}

        {/* 결제 모달 */}
        {showPaymentModal && selectedExpert && (
          <PaymentModal
            expert={selectedExpert}
            onClose={() => {
              setShowPaymentModal(false);
              setSelectedExpert(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ExpertMatching;