import { useState } from "react";
import {
  Plus,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";
import PostCard from "../components/community/PostCard";
import CreatePostModal from "../components/community/CreatePostModal";
import ConsultationRequestModal from "../components/community/ConsultationRequestModal";
import ExpertContactModal from "../components/community/ExpertContactModal";
import CategorySidebar from "../components/community/CategorySidebar";
import SearchAndFilter from "../components/community/SearchAndFilter";

const Community = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showConsultationRequest, setShowConsultationRequest] = useState(false);
  const [showExpertContact, setShowExpertContact] = useState(false);
  const [selectedConsultationPost, setSelectedConsultationPost] =
    useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 임시 데이터
  const posts = [
    {
      id: 1,
      author: "김상담",
      authorAvatar: "김",
      title: "첫 상담 후기 - 정말 도움이 되었어요!",
      content:
        "처음 상담을 받았는데 전문가님이 정말 친절하고 전문적이셨습니다. 제가 고민하던 부분에 대해 명확한 답변을 받을 수 있었어요...",
      category: "후기",
      likes: 24,
      comments: 8,
      createdAt: "2시간 전",
      tags: ["상담후기", "심리상담", "추천"],
    },
    {
      id: 2,
      author: "이고민",
      authorAvatar: "이",
      title: "직장 내 갈등 해결 방법이 궁금해요",
      content:
        "최근에 직장에서 동료와의 갈등이 생겼는데, 어떻게 해결하는 것이 좋을까요? 비슷한 경험이 있으신 분들의 조언을 구합니다.",
      category: "질문",
      likes: 12,
      comments: 15,
      createdAt: "5시간 전",
      tags: ["직장갈등", "인간관계", "조언구함"],
    },
    {
      id: 3,
      author: "박전문",
      authorAvatar: "박",
      title: "스트레스 관리를 위한 5가지 실용적인 방법",
      content:
        "현대인들이 겪는 스트레스를 효과적으로 관리할 수 있는 실용적인 방법들을 소개합니다. 1. 규칙적인 운동하기...",
      category: "팁",
      likes: 45,
      comments: 12,
      createdAt: "1일 전",
      tags: ["스트레스관리", "건강", "라이프스타일"],
      isExpert: true,
    },
    {
      id: 4,
      author: "정고민",
      authorAvatar: "정",
      title: "[상담요청] 직장 스트레스로 인한 불안감 해결 도움 요청",
      content:
        "최근 업무 스트레스가 심해져서 불안감이 계속 생기고 있습니다. 밤에 잠도 잘 안 오고, 집중력도 떨어지고 있어요. 전문가분의 도움을 받고 싶습니다.",
      category: "상담요청",
      likes: 3,
      comments: 2,
      createdAt: "30분 전",
      tags: ["스트레스", "불안감", "직장생활", "상담요청"],
      isConsultationRequest: true,
      urgency: "보통",
      preferredMethod: "화상상담",
    },
    {
      id: 5,
      author: "김도움",
      authorAvatar: "김",
      title: "[상담요청] 대인관계 개선을 위한 전문가 상담 희망",
      content:
        "사회생활을 하면서 대인관계에서 자꾸 어려움을 겪고 있습니다. 사람들과 대화할 때 긴장되고, 관계를 유지하는 것도 힘들어요. 전문적인 조언을 구하고 싶습니다.",
      category: "상담요청",
      likes: 7,
      comments: 5,
      createdAt: "2시간 전",
      tags: ["대인관계", "사회성", "커뮤니케이션", "상담요청"],
      isConsultationRequest: true,
      urgency: "높음",
      preferredMethod: "대면상담",
    },
  ];

  // 카테고리별 게시글 필터링 함수
  const getFilteredPosts = () => {
    let filtered = posts;

    // 카테고리 필터링
    if (activeTab !== "all") {
      const categoryMap = {
        consultation: "상담요청",
        review: "후기",
        question: "질문",
        tip: "팁",
      };

      filtered = filtered.filter(
        (post) => post.category === categoryMap[activeTab]
      );
    }

    // 검색 필터링
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query) ||
          post.author.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // 정렬
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.likes - a.likes;
        case "comments":
          return b.comments - a.comments;
        case "latest":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return filtered;
  };

  const allFilteredPosts = getFilteredPosts();

  // 페이지네이션 로직
  const totalPages = Math.ceil(allFilteredPosts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const filteredPosts = allFilteredPosts.slice(startIndex, endIndex);

  // 검색이나 필터가 변경될 때 첫 페이지로 이동
  const resetToFirstPage = () => {
    setCurrentPage(1);
  };

  // 카테고리별 게시글 수 동적 계산
  const getCategoryCount = (categoryId) => {
    if (categoryId === "all") {
      return posts.length;
    }

    const categoryMap = {
      consultation: "상담요청",
      review: "후기",
      question: "질문",
      tip: "팁",
    };

    return posts.filter((post) => post.category === categoryMap[categoryId])
      .length;
  };

  const categories = [
    { id: "all", name: "전체", count: getCategoryCount("all") },
    {
      id: "consultation",
      name: "상담요청",
      count: getCategoryCount("consultation"),
    },
    { id: "review", name: "후기", count: getCategoryCount("review") },
    { id: "question", name: "질문", count: getCategoryCount("question") },
    { id: "tip", name: "팁", count: getCategoryCount("tip") },
  ];

  const popularTags = [
    "상담후기",
    "스트레스관리",
    "인간관계",
    "직장갈등",
    "심리상담",
  ];

  const handleCreatePost = () => {
    setShowCreatePost(true);
  };

  const handleConsultationRequest = () => {
    setShowConsultationRequest(true);
  };

  const handlePostSubmit = (postData) => {
    console.log("새 게시글:", postData);
    // 실제로는 API 호출로 게시글을 저장
  };

  const handleConsultationSubmit = (requestData) => {
    console.log("상담 요청:", requestData);
    // 실제로는 API 호출로 상담 요청을 저장
  };

  const handleExpertContact = (postId, post) => {
    setSelectedConsultationPost(post);
    setShowExpertContact(true);
  };

  const handleExpertProposal = (proposalData) => {
    console.log("전문가 제안:", proposalData);
    // 실제로는 API 호출로 전문가 제안을 저장
  };

  const handleLike = (postId) => {
    console.log("좋아요:", postId);
    // 좋아요 처리 로직
  };

  const handleComment = (postId) => {
    console.log("댓글:", postId);
    // 댓글 처리 로직
  };

  const handleShare = (postId) => {
    console.log("공유:", postId);
    // 공유 처리 로직
  };

  const handleTagClick = (tag) => {
    setSearchQuery(`#${tag}`);
    resetToFirstPage();
  };

  // 검색어 변경 핸들러
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    resetToFirstPage();
  };

  // 정렬 변경 핸들러
  const handleSortChange = (sort) => {
    setSortBy(sort);
    resetToFirstPage();
  };

  // 카테고리 변경 핸들러
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    resetToFirstPage();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* 헤더 */}
          <div className="mb-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900">커뮤니티</h1>
                  <p className="text-gray-600 mt-2">
                    전문가와 사용자들이 함께 만드는 지식 공유 공간
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0 ml-6">
                <div className="flex gap-3">
                  <button
                    onClick={handleConsultationRequest}
                    className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    <MessageSquare className="h-5 w-5" />
                    상담요청
                  </button>
                  <button
                    onClick={handleCreatePost}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                    글쓰기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* 사이드바 */}
          <CategorySidebar
            categories={categories}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            popularTags={popularTags}
            onTagClick={handleTagClick}
          />

          {/* 메인 콘텐츠 */}
          <div className="flex-1">
            {/* 검색 및 필터 */}
            <SearchAndFilter
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              sortBy={sortBy}
              onSortChange={handleSortChange}
              onFilterClick={() => console.log("필터 클릭")}
            />

            {/* 포스트 목록 */}
            <div className="space-y-4">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLike={handleLike}
                    onComment={handleComment}
                    onShare={handleShare}
                    onExpertContact={handleExpertContact}
                  />
                ))
              ) : (
                <div className="text-left py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <MessageSquare className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2 text-left">
                    {searchQuery.trim()
                      ? "검색 결과가 없습니다"
                      : "게시글이 없습니다"}
                  </h3>
                  <p className="text-gray-500 mb-4 text-left">
                    {searchQuery.trim()
                      ? `"${searchQuery}"에 대한 검색 결과를 찾을 수 없습니다.`
                      : `${
                          categories.find((cat) => cat.id === activeTab)?.name
                        } 카테고리에 게시글이 없습니다.`}
                  </p>
                  {!searchQuery.trim() && (
                    <button
                      onClick={
                        activeTab === "consultation"
                          ? handleConsultationRequest
                          : handleCreatePost
                      }
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors ${
                        activeTab === "consultation"
                          ? "bg-orange-600 hover:bg-orange-700"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      <Plus className="h-4 w-4" />
                      {activeTab === "consultation"
                        ? "상담 요청하기"
                        : "첫 번째 글 작성하기"}
                    </button>
                  )}
                  {searchQuery.trim() && (
                    <div className="flex gap-2 justify-start">
                      <button
                        onClick={() => setSearchQuery("")}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        검색 초기화
                      </button>
                      <button
                        onClick={handleCreatePost}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        새 글 작성하기
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 페이지네이션 */}
            {allFilteredPosts.length > 0 && totalPages > 1 && (
              <div className="flex items-center justify-center mt-8 gap-2">
                {/* 이전 페이지 버튼 */}
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" />
                  이전
                </button>

                {/* 페이지 번호들 */}
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNum) => {
                      // 현재 페이지 주변 페이지만 표시 (최대 5개)
                      const shouldShow =
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= currentPage - 1 &&
                          pageNum <= currentPage + 1);

                      if (!shouldShow) {
                        // 생략 표시 (...)
                        if (pageNum === 2 && currentPage > 4) {
                          return (
                            <span
                              key={pageNum}
                              className="px-3 py-2 text-gray-400"
                            >
                              ...
                            </span>
                          );
                        }
                        if (
                          pageNum === totalPages - 1 &&
                          currentPage < totalPages - 3
                        ) {
                          return (
                            <span
                              key={pageNum}
                              className="px-3 py-2 text-gray-400"
                            >
                              ...
                            </span>
                          );
                        }
                        return null;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-2 rounded-lg transition-colors ${
                            currentPage === pageNum
                              ? "bg-blue-600 text-white"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}
                </div>

                {/* 다음 페이지 버튼 */}
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                    currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  다음
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* 페이지 정보 */}
            {allFilteredPosts.length > 0 && (
              <div className="text-center mt-4 text-sm text-gray-500">
                총 {allFilteredPosts.length}개의 게시글 중 {startIndex + 1}-
                {Math.min(endIndex, allFilteredPosts.length)}번째 표시
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 글쓰기 모달 */}
      <CreatePostModal
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onSubmit={handlePostSubmit}
      />

      {/* 상담요청 모달 */}
      <ConsultationRequestModal
        isOpen={showConsultationRequest}
        onClose={() => setShowConsultationRequest(false)}
        onSubmit={handleConsultationSubmit}
      />

      {/* 전문가 컨택 모달 */}
      <ExpertContactModal
        isOpen={showExpertContact}
        onClose={() => setShowExpertContact(false)}
        consultationPost={selectedConsultationPost}
        onSubmit={handleExpertProposal}
      />
    </div>
  );
};

export default Community;
