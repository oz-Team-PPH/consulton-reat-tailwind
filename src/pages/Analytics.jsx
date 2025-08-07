import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  MessageCircle,
  Video,
  Calendar,
  Clock,
  Award,
  Target,
  DollarSign,
  Activity,
  Download,
  Filter,
  ChevronDown,
} from "lucide-react";

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // 더미 데이터
  const analyticsData = {
    totalConsultations: 45,
    totalHours: 67.5,
    totalCreditsUsed: 1125,
    averageRating: 4.8,
    consultationTypes: {
      video: 28,
      chat: 17,
    },
    monthlyTrend: [
      { month: "1월", consultations: 12, hours: 18, satisfaction: 4.6 },
      { month: "2월", consultations: 15, hours: 22.5, satisfaction: 4.7 },
      { month: "3월", consultations: 18, hours: 27, satisfaction: 4.8 },
    ],
    topExperts: [
      { name: "박지영", specialty: "심리상담", consultations: 8, rating: 4.9 },
      { name: "이민수", specialty: "법률상담", consultations: 6, rating: 4.8 },
      { name: "김소연", specialty: "재무상담", consultations: 5, rating: 4.7 },
    ],
    categoryBreakdown: [
      { category: "심리상담", count: 15, percentage: 33.3 },
      { category: "법률상담", count: 12, percentage: 26.7 },
      { category: "재무상담", count: 10, percentage: 22.2 },
      { category: "건강상담", count: 8, percentage: 17.8 },
    ],
  };

  const StatCard = ({
    icon: Icon,
    title,
    value,
    subtitle,
    trend,
    trendUp = true,
  }) => (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Icon className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        </div>
        {trend && (
          <div
            className={`flex items-center space-x-1 ${
              trendUp ? "text-green-600" : "text-red-600"
            }`}
          >
            <TrendingUp className={`h-4 w-4 ${!trendUp && "rotate-180"}`} />
            <span className="text-sm font-medium">{trend}</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );

  const handleExportData = () => {
    console.log("데이터 내보내기...");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* 헤더 */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">분석 리포트</h1>
              <p className="text-gray-600 mt-2">
                상담 이용 현황과 통계를 확인하세요
              </p>
            </div>
          </div>
          <div className="flex-shrink-0 ml-6">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              {/* 기간 선택 */}
              <div className="relative">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="week">최근 1주</option>
                  <option value="month">최근 1개월</option>
                  <option value="quarter">최근 3개월</option>
                  <option value="year">최근 1년</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              {/* 카테고리 필터 */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">전체 카테고리</option>
                  <option value="psychology">심리상담</option>
                  <option value="legal">법률상담</option>
                  <option value="finance">재무상담</option>
                  <option value="health">건강상담</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              {/* 내보내기 버튼 */}
              <button
                onClick={handleExportData}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <Download className="h-4 w-4" />
                <span>내보내기</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 주요 지표 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={MessageCircle}
          title="총 상담 횟수"
          value={analyticsData.totalConsultations}
          subtitle="이번 달"
          trend="+12%"
        />
        <StatCard
          icon={Clock}
          title="총 상담 시간"
          value={`${analyticsData.totalHours}시간`}
          subtitle="누적 시간"
          trend="+8%"
        />
        <StatCard
          icon={DollarSign}
          title="사용한 크레딧"
          value={analyticsData.totalCreditsUsed}
          subtitle="총 크레딧"
          trend="+15%"
        />
        <StatCard
          icon={Award}
          title="평균 만족도"
          value={analyticsData.averageRating}
          subtitle="5점 만점"
          trend="+0.2"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* 상담 유형 분포 */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Video className="h-5 w-5 text-blue-600 mr-2" />
            상담 유형 분포
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">
                  화상 상담
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-gray-900">
                  {analyticsData.consultationTypes.video}
                </span>
                <span className="text-xs text-gray-500">
                  (
                  {Math.round(
                    (analyticsData.consultationTypes.video /
                      analyticsData.totalConsultations) *
                      100
                  )}
                  %)
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{
                  width: `${
                    (analyticsData.consultationTypes.video /
                      analyticsData.totalConsultations) *
                    100
                  }%`,
                }}
              ></div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">
                  채팅 상담
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-gray-900">
                  {analyticsData.consultationTypes.chat}
                </span>
                <span className="text-xs text-gray-500">
                  (
                  {Math.round(
                    (analyticsData.consultationTypes.chat /
                      analyticsData.totalConsultations) *
                      100
                  )}
                  %)
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{
                  width: `${
                    (analyticsData.consultationTypes.chat /
                      analyticsData.totalConsultations) *
                    100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* 카테고리별 상담 현황 */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="h-5 w-5 text-blue-600 mr-2" />
            카테고리별 현황
          </h3>
          <div className="space-y-3">
            {analyticsData.categoryBreakdown.map((category, index) => (
              <div
                key={category.category}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      index === 0
                        ? "bg-blue-500"
                        : index === 1
                        ? "bg-green-500"
                        : index === 2
                        ? "bg-yellow-500"
                        : "bg-purple-500"
                    }`}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">
                    {category.category}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-gray-900">
                    {category.count}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({category.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 월별 트렌드 */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
          월별 상담 트렌드
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  월
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  상담 횟수
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  총 시간
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  만족도
                </th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.monthlyTrend.map((month) => (
                <tr key={month.month} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {month.month}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {month.consultations}회
                  </td>
                  <td className="py-3 px-4 text-gray-600">{month.hours}시간</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-1">
                      <span className="text-gray-600">
                        {month.satisfaction}
                      </span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`text-xs ${
                              star <= Math.floor(month.satisfaction)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 자주 이용한 전문가 */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Users className="h-5 w-5 text-blue-600 mr-2" />
          자주 이용한 전문가
        </h3>
        <div className="space-y-4">
          {analyticsData.topExperts.map((expert, index) => (
            <div
              key={expert.name}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{expert.name}</h4>
                  <p className="text-sm text-gray-600">{expert.specialty}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {expert.consultations}회 상담
                </p>
                <div className="flex items-center space-x-1">
                  <span className="text-sm text-gray-600">{expert.rating}</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-xs ${
                          star <= Math.floor(expert.rating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
