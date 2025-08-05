import { useState, useEffect } from "react";
import { BarChart3, MessageCircle, Users, Video } from "lucide-react";
import CreditBalance from "../components/dashboard/CreditBalance";

const Dashboard = () => {
  const [user, setUser] = useState({ name: "김철수", credits: 150 });

  const stats = [
    {
      title: "이번 달 상담",
      value: "12",
      icon: MessageCircle,
      change: "+2.5%",
      changeType: "increase",
    },
    {
      title: "매칭된 전문가",
      value: "8",
      icon: Users,
      change: "+1.2%",
      changeType: "increase",
    },
    {
      title: "비디오 세션",
      value: "5",
      icon: Video,
      change: "+4.75%",
      changeType: "increase",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            안녕하세요, {user.name}님! 👋
          </h1>
          <p className="mt-2 text-gray-600">
            오늘도 전문가와 함께 성장해보세요.
          </p>
        </div>

        {/* 크레딧 잔액 */}
        <div className="mb-8">
          <CreditBalance credits={user.credits} />
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <stat.icon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.title}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stat.value}
                        </div>
                        <div
                          className={`ml-2 flex items-baseline text-sm font-semibold ${
                            stat.changeType === "increase"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {stat.change}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 빠른 액션 */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">빠른 시작</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-4 text-left transition-colors">
              <MessageCircle className="h-6 w-6 text-blue-600 mb-2" />
              <div className="text-sm font-medium text-blue-900">
                새 상담 시작
              </div>
            </button>
            <button className="bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-4 text-left transition-colors">
              <Users className="h-6 w-6 text-green-600 mb-2" />
              <div className="text-sm font-medium text-green-900">
                전문가 찾기
              </div>
            </button>
            <button className="bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg p-4 text-left transition-colors">
              <Video className="h-6 w-6 text-purple-600 mb-2" />
              <div className="text-sm font-medium text-purple-900">
                비디오 상담
              </div>
            </button>
            <button className="bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg p-4 text-left transition-colors">
              <BarChart3 className="h-6 w-6 text-orange-600 mb-2" />
              <div className="text-sm font-medium text-orange-900">
                상담 히스토리
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
