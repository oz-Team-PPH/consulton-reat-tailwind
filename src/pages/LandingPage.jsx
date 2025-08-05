import { useState } from "react";

const LandingPage = ({ onEnterService }) => {
  const [isToggleOn, setIsToggleOn] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleToggleClick = () => {
    if (!isToggleOn) {
      setIsToggleOn(true);
      setIsTransitioning(true);

      // 2초 후 서비스로 이동
      setTimeout(() => {
        onEnterService();
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-gray-50">
      {/* 중앙 로고 */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          {/* Consult On 브랜딩 */}
          <div className="flex items-center justify-center gap-8 mb-8">
            <h1
              className={`text-8xl font-bold tracking-tight transition-colors duration-500 ${
                isToggleOn ? "text-blue-600" : "text-gray-500"
              }`}
            >
              Consult
            </h1>
            {/* 토글 버튼 */}
            <div
              onClick={handleToggleClick}
              className={`relative inline-flex shrink-0 rounded-full border-2 border-transparent h-16 w-28 focus:outline-none cursor-pointer transition-all duration-500 ${
                isToggleOn ? "bg-blue-600" : "bg-gray-400"
              }`}
              style={{ marginTop: "15px" }}
            >
              {/* ON/OFF 텍스트 */}
              <span
                className={`absolute top-0 bottom-0 flex items-center font-black text-white text-sm z-20 transition-all duration-500 ${
                  isToggleOn ? "left-5" : "right-5"
                }`}
                style={{
                  textShadow:
                    "0 1px 0 rgba(255,255,255,0.3), 0 -1px 0 rgba(0,0,0,0.7)",
                }}
              >
                {isToggleOn ? "ON" : "OFF"}
              </span>
              {/* 토글 슬라이더 */}
              <span
                className={`pointer-events-none inline-block transform rounded-full bg-white shadow ring-0 h-12 w-12 relative z-10 transition-transform duration-500 ${
                  isToggleOn ? "translate-x-14" : "translate-x-1"
                }`}
                style={{ marginTop: "5px" }}
              />
            </div>
          </div>

          <p className="text-lg text-gray-500 mb-8">
            {isTransitioning
              ? "곧 서비스로 이동합니다..."
              : "전문가와의 상담을 시작하려면 토글을 클릭하세요"}
          </p>
        </div>
      </div>

      {/* 하단 저작권 */}
      <footer className="py-8 text-center">
        <p className="text-sm text-gray-400">
          © 2024 Consult. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
