import { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  MonitorOff,
  Phone,
  Paperclip,
  Users,
  MessageCircle,
  Clock,
  User,
  Send,
  Maximize2,
  Volume2,
  X,
} from "lucide-react";

const VideoConsultation = () => {
  // 사용자 개별 컨트롤 상태
  const [userControls, setUserControls] = useState({
    isVideoOn: true,
    isAudioOn: true,
    isScreenSharing: false,
    isRecording: false,
  });

  // 전문가 개별 컨트롤 상태
  const [expertControls, setExpertControls] = useState({
    isVideoOn: true,
    isAudioOn: true,
    isScreenSharing: false,
    isRecording: false,
  });

  const [sessionTime, setSessionTime] = useState(0);
  const [chatMessages, setChatMessages] = useState([]);
  const [showVideoGrid, setShowVideoGrid] = useState(true);
  const [newChatMessage, setNewChatMessage] = useState("");

  // 채팅 스크롤 참조
  const chatMessagesEndRef = useRef(null);

  // 상담 시작 관련 상태
  const [isConsultationStarted, setIsConsultationStarted] = useState(false);
  const [expertJoined, setExpertJoined] = useState(false);
  const [userJoined, setUserJoined] = useState(false);
  const [showConsultationStartModal, setShowConsultationStartModal] =
    useState(false);
  const [expertConfirmed, setExpertConfirmed] = useState(false);
  const [userConfirmed, setUserConfirmed] = useState(false);

  // 미디어 권한 관련 상태
  const [mediaPermissionGranted, setMediaPermissionGranted] = useState(false);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const [permissionError, setPermissionError] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [screenShareStream, setScreenShareStream] = useState(null);
  const [showMediaUploadModal, setShowMediaUploadModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    // 컴포넌트 로딩 시 즉시 미디어 권한 요청
    requestMediaPermissions();

    // 데모용으로 3초 후 사용자 입장, 1초 후 전문가 입장으로 설정
    setTimeout(() => setUserJoined(true), 1000);
    setTimeout(() => setExpertJoined(true), 3000);
  }, []);

  // 상담이 시작되면 타이머 시작
  useEffect(() => {
    let timer;
    if (isConsultationStarted) {
      timer = setInterval(() => {
        setSessionTime((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isConsultationStarted]);

  // 사용자 입장 시 시스템 메시지 추가
  useEffect(() => {
    if (userJoined) {
      const joinMessage = {
        id: Date.now() + Math.random(),
        message: "김철수님이 입장하였습니다.",
        timestamp: new Date(),
        type: "system",
        systemType: "join",
      };
      setChatMessages((prev) => [...prev, joinMessage]);
    }
  }, [userJoined]);

  // 전문가 입장 시 시스템 메시지 추가
  useEffect(() => {
    if (expertJoined) {
      const joinMessage = {
        id: Date.now() + Math.random(),
        message: "이민수 전문가님이 입장하였습니다.",
        timestamp: new Date(),
        type: "system",
        systemType: "join",
      };
      setChatMessages((prev) => [...prev, joinMessage]);
    }
  }, [expertJoined]);

  // 전문가와 사용자 모두 입장 완료시 상담 시작 확인 메시지 추가
  useEffect(() => {
    if (
      expertJoined &&
      userJoined &&
      !showConsultationStartModal &&
      !isConsultationStarted
    ) {
      const startConfirmMessage = {
        id: Date.now() + Math.random(),
        message: "상담을 시작하시겠습니까?",
        timestamp: new Date(),
        type: "system",
        systemType: "startConfirm",
      };
      setChatMessages((prev) => [...prev, startConfirmMessage]);
      setShowConsultationStartModal(true);
    }
  }, [
    expertJoined,
    userJoined,
    showConsultationStartModal,
    isConsultationStarted,
  ]);

  // 전문가와 사용자 모두 확인시 상담 시작
  useEffect(() => {
    if (expertConfirmed && userConfirmed && !isConsultationStarted) {
      setIsConsultationStarted(true);
      setShowConsultationStartModal(false);

      // 상담 시작 메시지 추가
      const startMessage = {
        id: Date.now() + Math.random(),
        message: "상담이 시작되었습니다. 시간이 측정됩니다.",
        timestamp: new Date(),
        type: "system",
        systemType: "start",
      };
      setChatMessages((prev) => [...prev, startMessage]);
    }
  }, [expertConfirmed, userConfirmed, isConsultationStarted]);

  // 채팅 메시지가 업데이트될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    if (chatMessagesEndRef.current) {
      chatMessagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [chatMessages]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleEndCall = () => {
    if (confirm("상담을 종료하시겠습니까?")) {
      // 상담 종료 시스템 메시지 추가
      const endMessage = {
        id: Date.now() + Math.random(),
        message: "상담이 종료되었습니다.",
        timestamp: new Date(),
        type: "system",
        systemType: "end",
      };
      setChatMessages((prev) => [...prev, endMessage]);

      // 상담 상태 초기화
      setIsConsultationStarted(false);
      setExpertJoined(false);
      setUserJoined(false);
      setShowConsultationStartModal(false);
      setExpertConfirmed(false);
      setUserConfirmed(false);
      setSessionTime(0);

      // 개별 컨트롤 상태 초기화
      setUserControls({
        isVideoOn: true,
        isAudioOn: true,
        isScreenSharing: false,
        isRecording: false,
      });
      setExpertControls({
        isVideoOn: true,
        isAudioOn: true,
        isScreenSharing: false,
        isRecording: false,
      });

      // 3초 후 새로운 세션 시작 (데모용)
      setTimeout(() => {
        setUserJoined(true);
      }, 3000);
      setTimeout(() => {
        setExpertJoined(true);

        // 데모용으로 전문가 상태를 랜덤하게 변경
        setTimeout(() => {
          setExpertControls((prev) => ({
            ...prev,
            isVideoOn: Math.random() > 0.5,
            isAudioOn: Math.random() > 0.3,
            isScreenSharing: Math.random() > 0.8,
            isRecording: Math.random() > 0.7,
          }));
        }, 2000);
      }, 5000);
    }
  };

  const handleUserConfirm = () => {
    setUserConfirmed(true);

    // 사용자 확인 메시지 추가
    const userConfirmMessage = {
      id: Date.now() + Math.random(),
      message: "김철수님이 상담 시작을 확인했습니다.",
      timestamp: new Date(),
      type: "system",
      systemType: "confirm",
    };
    setChatMessages((prev) => [...prev, userConfirmMessage]);

    // 데모용으로 사용자가 확인하면 2초 후 전문가도 자동 확인
    setTimeout(() => {
      setExpertConfirmed(true);

      // 전문가 확인 메시지 추가
      const expertConfirmMessage = {
        id: Date.now() + Math.random() + 1,
        message: "이민수 전문가님이 상담 시작을 확인했습니다.",
        timestamp: new Date(),
        type: "system",
        systemType: "confirm",
      };
      setChatMessages((prev) => [...prev, expertConfirmMessage]);
    }, 2000);
  };

  const requestMediaPermissions = async () => {
    setIsRequestingPermission(true);
    setPermissionError("");

    try {
      // 먼저 권한 상태 확인
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("MediaDevices API not supported");
      }

      console.log("미디어 권한 요청 시작...");

      // 마이크와 카메라 권한 요청
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      console.log("미디어 권한 허용됨:", stream);

      // 권한이 허용되면 스트림을 정리 (실제 사용은 나중에)
      stream.getTracks().forEach((track) => {
        console.log(`${track.kind} track stopped:`, track.label);
        track.stop();
      });

      setMediaPermissionGranted(true);
      setIsRequestingPermission(false);
      setShowSuccessMessage(true);

      console.log("미디어 권한 설정 완료");

      // 2초 후 성공 메시지 숨기기
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 2000);
    } catch (error) {
      console.error("미디어 권한 요청 실패:", error);
      setIsRequestingPermission(false);

      if (
        error.name === "NotAllowedError" ||
        error.name === "PermissionDeniedError"
      ) {
        setPermissionError(
          "마이크와 카메라 권한이 거부되었습니다. 브라우저 주소창 옆의 카메라/마이크 아이콘을 클릭하여 권한을 허용해주세요."
        );
      } else if (
        error.name === "NotFoundError" ||
        error.name === "DevicesNotFoundError"
      ) {
        setPermissionError(
          "마이크 또는 카메라를 찾을 수 없습니다. 장치가 연결되어 있는지 확인해주세요."
        );
      } else if (
        error.name === "NotReadableError" ||
        error.name === "TrackStartError"
      ) {
        setPermissionError(
          "미디어 장치가 다른 애플리케이션에서 사용 중입니다. 다른 앱을 종료하고 다시 시도해주세요."
        );
      } else if (
        error.name === "OverconstrainedError" ||
        error.name === "ConstraintNotSatisfiedError"
      ) {
        setPermissionError(
          "요청한 미디어 설정을 지원하지 않습니다. 다시 시도해주세요."
        );
      } else if (error.message === "MediaDevices API not supported") {
        setPermissionError(
          "이 브라우저에서는 카메라와 마이크를 지원하지 않습니다. 최신 브라우저를 사용해주세요."
        );
      } else {
        setPermissionError(
          `미디어 장치에 접근할 수 없습니다. (오류: ${
            error.name || error.message
          }) 브라우저를 새로고침하고 다시 시도해주세요.`
        );
      }
    }
  };

  const handleSendChatMessage = () => {
    if (!newChatMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: "김철수",
      message: newChatMessage,
      timestamp: new Date(),
      isExpert: false,
      type: "chat",
    };

    setChatMessages((prev) => [...prev, newMessage]);
    setNewChatMessage("");
  };

  const handleScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });
      if (stream) {
        setScreenShareStream(stream);
        setUserControls((prev) => ({ ...prev, isScreenSharing: true }));
        stream.getVideoTracks()[0].onended = () => {
          setScreenShareStream(null);
          setUserControls((prev) => ({ ...prev, isScreenSharing: false }));
        };
      }
    } catch (error) {
      console.error("화면 공유 실패:", error);
      alert("화면 공유를 시작할 수 없습니다.");
    }
  };

  const stopScreenShare = () => {
    if (screenShareStream) {
      screenShareStream.getTracks().forEach((track) => track.stop());
      setScreenShareStream(null);
    }
    setUserControls((prev) => ({ ...prev, isScreenSharing: false }));
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      uploadedBy: "김철수",
      timestamp: new Date(),
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);

    // 채팅 메시지에 파일 업로드 메시지 추가
    newFiles.forEach((file) => {
      const fileMessage = {
        id: Date.now() + Math.random(),
        sender: "김철수",
        message: `파일을 업로드했습니다: ${file.name}`,
        timestamp: new Date(),
        isExpert: false,
        type: "file",
        file: file,
      };
      setChatMessages((prev) => [...prev, fileMessage]);
    });

    setShowMediaUploadModal(false);
  };

  const handleDownloadFile = (file) => {
    const link = document.createElement("a");
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRemoveFile = (fileId) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
    setChatMessages((prev) =>
      prev.filter((msg) => !(msg.type === "file" && msg.file?.id === fileId))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 미디어 권한 요청 모달 */}
      {!mediaPermissionGranted && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                미디어 권한 요청
              </h2>
              <p className="text-gray-600 mb-6">
                화상 상담을 위해 마이크와 카메라 사용 권한이 필요합니다.
              </p>

              {showSuccessMessage && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-4">
                  <p className="text-sm text-green-600 flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    마이크와 카메라 권한이 허용되었습니다!
                  </p>
                </div>
              )}

              {permissionError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                  <p className="text-sm text-red-600">{permissionError}</p>
                  <button
                    onClick={() => {
                      setPermissionError("");
                      requestMediaPermissions();
                    }}
                    className="mt-2 text-xs text-red-700 hover:text-red-800 underline"
                  >
                    다시 시도
                  </button>
                </div>
              )}

              <button
                onClick={requestMediaPermissions}
                disabled={isRequestingPermission}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  isRequestingPermission
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isRequestingPermission ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>권한 요청 중...</span>
                  </div>
                ) : (
                  "마이크 및 카메라 권한 허용"
                )}
              </button>

              <div className="text-xs text-gray-500 text-center mt-3">
                브라우저에서 권한 요청이 나타나면 '허용'을 선택해주세요
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 파일 업로드 모달 */}
      {showMediaUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Paperclip className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                파일 업로드
              </h2>
              <p className="text-gray-600 mb-6">
                이미지나 파일을 선택하여 업로드하세요.
              </p>

              <div className="space-y-4">
                <label className="block w-full">
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx,.txt,.xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="w-full py-8 px-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="text-center">
                      <Paperclip className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        파일을 선택하거나 여기로 드래그하세요
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        이미지, PDF, 문서 파일 지원
                      </p>
                    </div>
                  </div>
                </label>
              </div>

              <button
                onClick={() => setShowMediaUploadModal(false)}
                className="mt-4 w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 헤드라인 섹션 */}
      <div className="bg-gray-50 py-12 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">화상 상담</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            전문가와 실시간 화상 상담을 통해 더욱 효과적인 컨설팅을 경험하세요
          </p>
        </div>
      </div>

      {/* 상단 헤더 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-bold text-gray-900">상담 세션</h2>
          <div className="flex items-center space-x-2 bg-green-50 border border-green-200 text-green-700 px-3 py-1 rounded-full text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-medium">연결됨</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1 rounded-lg">
            <Clock className="h-4 w-4" />
            <span className="font-medium">
              {isConsultationStarted ? formatTime(sessionTime) : "준비 중"}
            </span>
          </div>

          {/* 상담 종료 버튼 */}
          {isConsultationStarted && (
            <button
              onClick={handleEndCall}
              className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center space-x-2"
              title="상담 종료"
            >
              <Phone className="h-4 w-4 transform rotate-[135deg]" />
              <span>상담 종료</span>
            </button>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {(userControls.isRecording || expertControls.isRecording) && (
            <div className="flex items-center space-x-2 bg-red-50 border border-red-200 text-red-700 px-3 py-1 rounded-lg">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">
                {userControls.isRecording && expertControls.isRecording
                  ? "녹화 중 (양쪽)"
                  : userControls.isRecording
                  ? "김철수님 녹화 중"
                  : "이민수 전문가님 녹화 중"}
              </span>
            </div>
          )}

          <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1 rounded-lg">
            <Users className="h-4 w-4" />
            <span className="font-medium">2명 참여</span>
          </div>

          <button
            onClick={() => setShowVideoGrid(!showVideoGrid)}
            className={`p-2 rounded-lg border transition-colors relative ${
              showVideoGrid
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
            title="비디오 화면 표시/숨김"
          >
            <Video className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 flex bg-gray-50 relative min-h-0">
        {/* 메인 채팅 영역 */}
        <div className="flex-1 bg-white flex flex-col min-h-0">
          {/* 채팅 메시지 영역 */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 min-h-0 max-h-[calc(100vh-300px)]">
            {chatMessages.map((message) => (
              <div key={message.id}>
                {message.type === "system" ? (
                  <div className="flex justify-center mb-4">
                    <div className="bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 max-w-md">
                      <div className="text-center">
                        <div className="text-sm text-gray-600 mb-2">
                          {message.message}
                        </div>

                        {message.systemType === "startConfirm" &&
                          !userConfirmed && (
                            <button
                              onClick={handleUserConfirm}
                              className="mt-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors font-medium"
                            >
                              상담 시작 확인
                            </button>
                          )}

                        {message.systemType === "startConfirm" &&
                          userConfirmed &&
                          !expertConfirmed && (
                            <div className="mt-2 text-xs text-gray-500">
                              전문가 확인 대기 중...
                            </div>
                          )}

                        <div className="text-xs text-gray-400 mt-2">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : message.type === "file" ? (
                  <div className="flex justify-start">
                    <div
                      className={`max-w-md px-4 py-3 rounded-lg shadow-sm ${
                        message.isExpert
                          ? "bg-gradient-to-br from-blue-50 to-blue-100 text-gray-800 border border-blue-200"
                          : "bg-gradient-to-br from-green-50 to-emerald-100 text-gray-800 border border-green-200"
                      }`}
                    >
                      <div className="text-xs opacity-70 mb-1 font-medium text-left">
                        {message.sender}
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Paperclip className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {message.file.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {(message.file.size / 1024 / 1024).toFixed(2)} MB
                          </div>
                        </div>
                        <button
                          onClick={() => handleDownloadFile(message.file)}
                          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          title="다운로드"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </button>
                        {!message.isExpert && (
                          <button
                            onClick={() => handleRemoveFile(message.file.id)}
                            className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            title="삭제"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="text-xs opacity-60 mt-2 text-left">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-start">
                    <div
                      className={`max-w-md px-4 py-3 rounded-lg shadow-sm ${
                        message.isExpert
                          ? "bg-gradient-to-br from-blue-50 to-blue-100 text-gray-800 border border-blue-200"
                          : "bg-gradient-to-br from-green-50 to-emerald-100 text-gray-800 border border-green-200"
                      }`}
                    >
                      <div className="text-xs opacity-70 mb-1 font-medium text-left">
                        {message.sender}
                      </div>
                      <div className="text-sm leading-relaxed text-left">
                        {message.message}
                      </div>
                      <div className="text-xs opacity-60 mt-2 text-left">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {/* 스크롤 참조점 */}
            <div ref={chatMessagesEndRef} />
          </div>

          {/* 메시지 입력 영역 */}
          <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
            <div className="flex space-x-3">
              <input
                type="text"
                value={newChatMessage}
                onChange={(e) => setNewChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendChatMessage()}
                placeholder="메시지를 입력하세요..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              <button
                onClick={handleSendChatMessage}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 우측 상단 비디오 그리드 */}
        {showVideoGrid && (
          <div className="absolute top-4 right-4 w-80 space-y-3 z-10">
            {/* 전문가 비디오 */}
            <div className="relative bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200">
              <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center">
                {expertControls.isVideoOn ? (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-2 mx-auto shadow-lg">
                      <Video className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-gray-900 text-sm font-semibold">
                      이민수 전문가
                    </div>
                    <div className="text-blue-600 text-xs">비디오 활성화</div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mb-2 shadow-lg">
                      <User className="w-8 h-8 text-gray-600" />
                    </div>
                    <div className="text-gray-900 text-sm font-semibold">
                      이민수 전문가
                    </div>
                    <div className="text-gray-500 text-xs">비디오 꺼짐</div>
                  </div>
                )}
              </div>

              {/* 전문가 상태 표시 */}
              <div className="absolute bottom-3 right-3">
                <div className="flex items-center space-x-2">
                  <div
                    className={`p-2 rounded-full shadow-lg ${
                      expertControls.isAudioOn
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {expertControls.isAudioOn ? (
                      <Mic className="w-4 h-4" />
                    ) : (
                      <MicOff className="w-4 h-4" />
                    )}
                  </div>
                  <div
                    className={`p-2 rounded-full shadow-lg ${
                      expertControls.isVideoOn
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {expertControls.isVideoOn ? (
                      <Video className="w-4 h-4" />
                    ) : (
                      <VideoOff className="w-4 h-4" />
                    )}
                  </div>
                  {expertControls.isScreenSharing && (
                    <div className="p-2 rounded-full shadow-lg bg-blue-100 text-blue-600">
                      <Monitor className="w-4 h-4" />
                    </div>
                  )}
                  {expertControls.isRecording && (
                    <div className="p-2 rounded-full shadow-lg bg-red-100 text-red-600">
                      <div className="w-4 h-4 bg-red-600 rounded-full" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 사용자 비디오 (같은 크기) */}
            <div className="relative bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200">
              <div className="w-full h-48 bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col items-center justify-center">
                {userControls.isVideoOn ? (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-2 shadow-lg">
                      <Video className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-gray-900 text-sm font-semibold">
                      김철수 (나)
                    </div>
                    <div className="text-green-600 text-xs">비디오 활성화</div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mb-2 shadow-lg">
                      <User className="w-8 h-8 text-gray-600" />
                    </div>
                    <div className="text-gray-900 text-sm font-semibold">
                      김철수 (나)
                    </div>
                    <div className="text-gray-500 text-xs">비디오 꺼짐</div>
                  </div>
                )}
              </div>

              {/* 사용자 상태 표시 */}
              <div className="absolute bottom-3 right-3">
                <div className="flex items-center space-x-2">
                  <div
                    className={`p-2 rounded-full shadow-lg ${
                      userControls.isAudioOn
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {userControls.isAudioOn ? (
                      <Mic className="w-4 h-4" />
                    ) : (
                      <MicOff className="w-4 h-4" />
                    )}
                  </div>
                  <div
                    className={`p-2 rounded-full shadow-lg ${
                      userControls.isVideoOn
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {userControls.isVideoOn ? (
                      <Video className="w-4 h-4" />
                    ) : (
                      <VideoOff className="w-4 h-4" />
                    )}
                  </div>
                  {userControls.isScreenSharing && (
                    <div className="p-2 rounded-full shadow-lg bg-blue-100 text-blue-600">
                      <Monitor className="w-4 h-4" />
                    </div>
                  )}
                  {userControls.isRecording && (
                    <div className="p-2 rounded-full shadow-lg bg-red-100 text-red-600">
                      <div className="w-4 h-4 bg-red-600 rounded-full" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 화면 공유 비디오창 */}
            {userControls.isScreenSharing && (
              <div className="relative bg-white rounded-lg overflow-hidden shadow-lg border-2 border-blue-300">
                <div className="w-full h-32 bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-2 shadow-lg">
                      <Monitor className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-gray-900 text-sm font-semibold">
                      화면 공유
                    </div>
                    <div className="text-blue-600 text-xs">공유 중</div>
                  </div>
                </div>

                {/* 화면 공유 상태 표시 */}
                <div className="absolute top-2 left-2">
                  <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                    공유 중
                  </div>
                </div>

                {/* 화면 공유 중지 버튼 */}
                <button
                  onClick={stopScreenShare}
                  className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  title="화면 공유 중지"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}

        {/* 화면 공유 표시 */}
        {(userControls.isScreenSharing || expertControls.isScreenSharing) && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow-lg z-20">
            <Monitor className="w-4 h-4" />
            <span className="text-sm font-medium">
              {userControls.isScreenSharing && expertControls.isScreenSharing
                ? "화면 공유 중 (양쪽)"
                : userControls.isScreenSharing
                ? "김철수님 화면 공유 중"
                : "이민수 전문가님 화면 공유 중"}
            </span>
          </div>
        )}
      </div>

      {/* 하단 컨트롤 바 */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-center shadow-sm">
        <div className="flex items-center space-x-3">
          {/* 마이크 버튼 */}
          <button
            onClick={() =>
              setUserControls((prev) => ({
                ...prev,
                isAudioOn: !prev.isAudioOn,
              }))
            }
            className={`p-4 rounded-full border transition-colors ${
              userControls.isAudioOn
                ? "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
            }`}
            title={userControls.isAudioOn ? "마이크 끄기" : "마이크 켜기"}
          >
            {userControls.isAudioOn ? (
              <Mic className="h-6 w-6" />
            ) : (
              <MicOff className="h-6 w-6" />
            )}
          </button>

          {/* 비디오 버튼 */}
          <button
            onClick={() =>
              setUserControls((prev) => ({
                ...prev,
                isVideoOn: !prev.isVideoOn,
              }))
            }
            className={`p-4 rounded-full border transition-colors ${
              userControls.isVideoOn
                ? "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
            }`}
            title={userControls.isVideoOn ? "비디오 끄기" : "비디오 켜기"}
          >
            {userControls.isVideoOn ? (
              <Video className="h-6 w-6" />
            ) : (
              <VideoOff className="h-6 w-6" />
            )}
          </button>

          {/* 화면 공유 버튼 */}
          <button
            onClick={() => {
              if (userControls.isScreenSharing) {
                stopScreenShare();
              } else {
                handleScreenShare();
              }
            }}
            className={`p-4 rounded-full border transition-colors ${
              userControls.isScreenSharing
                ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
            }`}
            title={
              userControls.isScreenSharing ? "화면 공유 중지" : "화면 공유 시작"
            }
          >
            {userControls.isScreenSharing ? (
              <MonitorOff className="h-6 w-6" />
            ) : (
              <Monitor className="h-6 w-6" />
            )}
          </button>

          {/* 녹화 버튼 */}
          <button
            onClick={() =>
              setUserControls((prev) => ({
                ...prev,
                isRecording: !prev.isRecording,
              }))
            }
            className={`p-4 rounded-full border transition-colors ${
              userControls.isRecording
                ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
            }`}
            title={userControls.isRecording ? "녹화 중지" : "녹화 시작"}
          >
            <div
              className={`w-6 h-6 rounded-full ${
                userControls.isRecording
                  ? "bg-red-600"
                  : "border-2 border-current"
              }`}
            />
          </button>

          {/* 미디어 추가 버튼 */}
          <button
            onClick={() => setShowMediaUploadModal(true)}
            className="p-4 bg-gray-50 text-gray-700 border border-gray-200 rounded-full hover:bg-gray-100 transition-colors"
            title="파일 업로드"
          >
            <Paperclip className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoConsultation;
