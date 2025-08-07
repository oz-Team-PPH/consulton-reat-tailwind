import { useState } from "react";
import { CreditCard } from "lucide-react";
import PackCard from "../components/dashboard/PackCard";
import CreditBalance from "../components/dashboard/CreditBalance";

const CreditPackages = () => {
  const [user] = useState({ name: "김철수", credits: 150 });

  // 분당 평균 요금 (1800원)
  const averageRatePerMinute = 1800;
  const creditsPerMinute = averageRatePerMinute / 10; // 1크레딧 = 10원이므로 180크레딧/분

  const packs = [
    // 크레딧 충전 패키지들 (충전량이 많을수록 보너스 증가)
    {
      id: 1,
      type: "credit",
      name: "베이직 충전",
      description: "시작하기 좋은 기본 충전 + 5분 추가",
      price: 30000,
      credits: 3000,
      bonusCredits: 1050, // 150 (5% 보너스) + 900 (5분 추가)
      totalCredits: 4050,
      payPerMinute: 1800,
      usageMinutes: Math.floor((4050 / creditsPerMinute) * 100) / 100, // 22.5분
      usageTime: "약 22분 30초",
      extraMinutes: 5, // 추가 분 정보
      features: [
        "3,000 + 1,050 보너스 크레딧",
        "약 22분 30초 상담 가능",
        "분당 ₩1,800 (180크레딧)",
        "5% 보너스 + 5분 추가 혜택",
        "분 단위 자동 차감",
        "사용기한 없음",
      ],
    },
    {
      id: 2,
      type: "credit",
      name: "스탠다드 충전",
      description: "가장 인기있는 추천 패키지 + 10분 추가",
      price: 50000,
      credits: 5000,
      bonusCredits: 2300, // 500 (10% 보너스) + 1800 (10분 추가)
      totalCredits: 7300,
      payPerMinute: 1800,
      usageMinutes: Math.floor((7300 / creditsPerMinute) * 100) / 100, // 40.56분
      usageTime: "약 40분 33초",
      isRecommended: true,
      extraMinutes: 10, // 추가 분 정보
      features: [
        "5,000 + 2,300 보너스 크레딧",
        "약 40분 33초 상담 가능",
        "분당 ₩1,800 (180크레딧)",
        "10% 보너스 + 10분 추가 혜택",
        "분 단위 자동 차감",
        "우선 고객지원",
      ],
    },
    {
      id: 3,
      type: "credit",
      name: "프리미엄 충전",
      description: "대용량 충전으로 최대 혜택 + 20분 추가",
      price: 100000,
      credits: 10000,
      bonusCredits: 5100, // 1500 (15% 보너스) + 3600 (20분 추가)
      totalCredits: 15100,
      payPerMinute: 1800,
      usageMinutes: Math.floor((15100 / creditsPerMinute) * 100) / 100, // 83.89분
      usageTime: "약 1시간 23분",
      extraMinutes: 20, // 추가 분 정보
      features: [
        "10,000 + 5,100 보너스 크레딧",
        "약 1시간 23분 상담 가능",
        "분당 ₩1,800 (180크레딧)",
        "15% 보너스 + 20분 추가 혜택",
        "분 단위 자동 차감",
        "VIP 고객지원",
        "전문가 우선 매칭",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">
                  크레딧 충전
                </h1>
                <p className="text-gray-600 mt-2">
                  상담에 필요한 크레딧을 충전하세요. 충전량이 많을수록 더 많은
                  보너스 혜택을 받을 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-8">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              💡 <strong>사용 시간 기준:</strong> 평균 분당 ₩1,800 (상담사별로
              요금이 다를 수 있습니다)
            </p>
          </div>
        </div>

        {/* 크레딧 잔액 */}
        <div className="mb-8">
          <CreditBalance credits={user.credits} />
        </div>

        {/* 패키지 카드들 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            크레딧 충전 패키지
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {packs.map((pack) => (
              <PackCard key={pack.id} pack={pack} />
            ))}
          </div>
        </div>

        {/* 패키지 비교 테이블 */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              크레딧 충전 비교
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              각 충전 옵션의 혜택, 보너스, 사용 가능 시간을 비교해보세요.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    패키지
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    가격
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    기본 크레딧
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    보너스
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    총 크레딧
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    사용 가능 시간
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    분당 요금
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {packs.map((pack) => (
                  <tr key={pack.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {pack.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {pack.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ₩{pack.price.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {pack.credits} 크레딧
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {pack.bonusCredits > 0 ? (
                          <span className="text-green-600 font-medium">
                            +{pack.bonusCredits}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {pack.totalCredits} 크레딧
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-blue-600">
                        {pack.usageTime}
                      </div>
                      <div className="text-xs text-gray-500">
                        (평균 ₩1,800/분 기준)
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ₩{pack.payPerMinute.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        (180크레딧/분)
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditPackages;
