import { useState, useEffect } from "react";
import { Bell, Mail, MessageSquare, Calendar, Smartphone } from "lucide-react";
import NotificationToggle from "../components/settings/NotificationToggle";
import CalendarIntegration from "../components/settings/CalendarIntegration";

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    email: {
      newConsultation: true,
      consultationReminder: true,
      expertResponse: true,
      summaryReady: true,
      weeklyReport: false,
      promotions: false,
    },
    push: {
      newConsultation: true,
      consultationReminder: true,
      expertResponse: true,
      summaryReady: true,
      weeklyReport: false,
    },
    sms: {
      consultationReminder: true,
      urgentUpdates: true,
    },
    inApp: {
      all: true,
      sound: true,
      vibration: true,
    },
    quietHours: {
      enabled: false,
      start: "22:00",
      end: "08:00",
    },
    frequency: {
      emailDigest: "daily", // daily, weekly, never
      pushSummary: "immediate", // immediate, hourly, daily
    },
  });

  const [saveStatus, setSaveStatus] = useState("idle"); // idle, saving, saved, error

  const notificationTypes = {
    email: {
      title: "이메일 알림",
      description: "중요한 업데이트를 이메일로 받아보세요",
      icon: Mail,
      options: [
        {
          key: "newConsultation",
          label: "새로운 상담 요청",
          description: "전문가가 새로운 상담을 시작할 때",
        },
        {
          key: "consultationReminder",
          label: "상담 일정 알림",
          description: "예정된 상담 30분 전",
        },
        {
          key: "expertResponse",
          label: "전문가 응답",
          description: "전문가가 메시지에 답변할 때",
        },
        {
          key: "summaryReady",
          label: "상담 요약 완료",
          description: "상담 요약 및 녹화본이 준비되었을 때",
        },
        {
          key: "weeklyReport",
          label: "주간 리포트",
          description: "주간 상담 활동 요약",
        },
        {
          key: "promotions",
          label: "프로모션 및 혜택",
          description: "특별 할인 및 새로운 서비스 소식",
        },
      ],
    },
    push: {
      title: "푸시 알림",
      description: "실시간으로 중요한 알림을 받아보세요",
      icon: Smartphone,
      options: [
        { key: "newConsultation", label: "새로운 상담 요청" },
        { key: "consultationReminder", label: "상담 일정 알림" },
        { key: "expertResponse", label: "전문가 응답" },
        { key: "summaryReady", label: "상담 요약 완료" },
        { key: "weeklyReport", label: "주간 리포트" },
      ],
    },
    sms: {
      title: "SMS 알림",
      description: "긴급한 알림을 문자로 받아보세요",
      icon: MessageSquare,
      options: [
        {
          key: "consultationReminder",
          label: "상담 일정 알림",
          description: "예정된 상담 1시간 전",
        },
        {
          key: "urgentUpdates",
          label: "긴급 업데이트",
          description: "시스템 점검 등 중요한 공지사항",
        },
      ],
    },
  };

  const handleSettingChange = (category, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const handleSaveSettings = async () => {
    setSaveStatus("saving");

    try {
      // API 호출 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSaveStatus("saved");

      setTimeout(() => {
        setSaveStatus("idle");
      }, 2000);
    } catch (error) {
      setSaveStatus("error");
      setTimeout(() => {
        setSaveStatus("idle");
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">알림 설정</h1>
                <p className="text-gray-600 mt-2">
                  원하는 알림 방식을 설정하여 중요한 정보를 놓치지 마세요.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* 알림 종류별 설정 */}
          {Object.entries(notificationTypes).map(([category, config]) => (
            <div
              key={category}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center space-x-3 mb-6">
                <config.icon className="h-6 w-6 text-blue-600" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {config.title}
                  </h2>
                  <p className="text-sm text-gray-600">{config.description}</p>
                </div>
              </div>

              <div className="space-y-4">
                {config.options.map((option) => (
                  <NotificationToggle
                    key={option.key}
                    label={option.label}
                    description={option.description}
                    checked={settings[category][option.key]}
                    onChange={(checked) =>
                      handleSettingChange(category, option.key, checked)
                    }
                  />
                ))}
              </div>
            </div>
          ))}

          {/* 인앱 알림 설정 */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3 mb-6">
              <Bell className="h-6 w-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  인앱 알림
                </h2>
                <p className="text-sm text-gray-600">앱 사용 중 알림 설정</p>
              </div>
            </div>

            <div className="space-y-4">
              <NotificationToggle
                label="모든 인앱 알림"
                description="앱 사용 중 모든 알림 표시"
                checked={settings.inApp.all}
                onChange={(checked) =>
                  handleSettingChange("inApp", "all", checked)
                }
              />

              {settings.inApp.all && (
                <>
                  <NotificationToggle
                    label="알림 소리"
                    description="알림이 도착할 때 소리 재생"
                    checked={settings.inApp.sound}
                    onChange={(checked) =>
                      handleSettingChange("inApp", "sound", checked)
                    }
                  />

                  <NotificationToggle
                    label="진동"
                    description="모바일에서 진동으로 알림"
                    checked={settings.inApp.vibration}
                    onChange={(checked) =>
                      handleSettingChange("inApp", "vibration", checked)
                    }
                  />
                </>
              )}
            </div>
          </div>

          {/* 방해 금지 시간 */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3 mb-6">
              <Calendar className="h-6 w-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  방해 금지 시간
                </h2>
                <p className="text-sm text-gray-600">
                  특정 시간대에는 알림을 받지 않습니다
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <NotificationToggle
                label="방해 금지 시간 사용"
                description="설정한 시간대에는 푸시 알림을 보내지 않습니다"
                checked={settings.quietHours.enabled}
                onChange={(checked) =>
                  handleSettingChange("quietHours", "enabled", checked)
                }
              />

              {settings.quietHours.enabled && (
                <div className="grid grid-cols-2 gap-4 ml-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      시작 시간
                    </label>
                    <input
                      type="time"
                      value={settings.quietHours.start}
                      onChange={(e) =>
                        handleSettingChange(
                          "quietHours",
                          "start",
                          e.target.value
                        )
                      }
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      종료 시간
                    </label>
                    <input
                      type="time"
                      value={settings.quietHours.end}
                      onChange={(e) =>
                        handleSettingChange("quietHours", "end", e.target.value)
                      }
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 알림 빈도 설정 */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              알림 빈도
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이메일 요약 빈도
                </label>
                <select
                  value={settings.frequency.emailDigest}
                  onChange={(e) =>
                    handleSettingChange(
                      "frequency",
                      "emailDigest",
                      e.target.value
                    )
                  }
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="immediate">즉시</option>
                  <option value="daily">일일</option>
                  <option value="weekly">주간</option>
                  <option value="never">받지 않음</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  푸시 알림 요약
                </label>
                <select
                  value={settings.frequency.pushSummary}
                  onChange={(e) =>
                    handleSettingChange(
                      "frequency",
                      "pushSummary",
                      e.target.value
                    )
                  }
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="immediate">즉시</option>
                  <option value="hourly">시간별</option>
                  <option value="daily">일일</option>
                </select>
              </div>
            </div>
          </div>

          {/* 캘린더 연동 */}
          <CalendarIntegration />

          {/* 저장 버튼 */}
          <div className="flex justify-end">
            <button
              onClick={handleSaveSettings}
              disabled={saveStatus === "saving"}
              className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                saveStatus === "saving"
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : saveStatus === "saved"
                  ? "bg-green-600 text-white"
                  : saveStatus === "error"
                  ? "bg-red-600 text-white"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {saveStatus === "saving" && "저장 중..."}
              {saveStatus === "saved" && "저장 완료!"}
              {saveStatus === "error" && "저장 실패"}
              {saveStatus === "idle" && "설정 저장"}
            </button>
          </div>

          {/* 상태 메시지 */}
          {saveStatus === "saved" && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    알림 설정이 성공적으로 저장되었습니다.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
