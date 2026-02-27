import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiLogOut,
  FiBox,
  FiCloud,
  FiMonitor,
  FiSmile,
  FiAward,
  FiMessageCircle,
  FiSend,
} from "react-icons/fi";
import Pet from "../pets/pet";

const ChatPage = () => {
  const navigate = useNavigate();
  const [petData, setPetData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 채팅 관련 상태
  const [messages, setMessages] = useState([
    { sender: "pet", text: "안녕! 나랑 대화하자멍 (또는 냥)!" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollContainerRef = useRef(null);

  // 펫 정보 불러오기
  useEffect(() => {
    const fetchPetData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/");
          return;
        }

        const response = await axios.get("http://localhost:8000/api/pets/my", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.pet) {
          const loadedPet = new Pet(response.data.pet);
          setPetData(loadedPet);
        } else {
          navigate("/create-pet");
        }
      } catch (error) {
        console.error("펫 정보를 불러오는 중 에러 발생:", error);
        alert("세션이 만료되었거나 펫 정보를 가져올 수 없습니다.");
        localStorage.removeItem("token");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchPetData();
  }, [navigate]);

  // 스크롤 자동 내리기
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isTyping]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue;
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setInputValue("");
    setIsTyping(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8000/api/pets/chat",
        { message: userMessage },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // 봇(펫) 응답 추가
      setMessages((prev) => [
        ...prev,
        { sender: "pet", text: response.data.reply },
      ]);

      // 혹시 경험치/레벨업 정보가 오면 펫 데이터 갱신
      if (response.data.pet) {
        setPetData(new Pet(response.data.pet));
      }
    } catch (error) {
      console.error("채팅 전송 중 에러:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "pet",
          text: "앗... 무언가 오류가 생겨서 대답을 못하겠어. 미안해 💧",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50 text-slate-500">
        <p className="text-xl font-bold animate-pulse">
          펫 정보를 불러오는 중...
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-80 h-80 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 pointer-events-none"></div>

      {/* 왼쪽 네비게이션 사이드바 */}
      <aside className="w-64 bg-white/80 backdrop-blur-md border-r border-indigo-50 flex-col justify-between shadow-xl z-10 hidden md:flex">
        <div className="p-8">
          <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-cyan-500 mb-8">
            DASHBOARD
          </h2>
          <nav className="flex flex-col gap-4">
            <button
              onClick={() => navigate("/main")}
              className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl hover:bg-orange-50 text-slate-700 hover:text-orange-600 transition-colors font-medium"
            >
              <FiSmile className="text-xl" /> 내 펫 상태 (Main)
            </button>
            <button
              onClick={() => navigate("/ranking")}
              className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 transition-colors font-medium"
            >
              <FiAward className="text-xl" /> 명예의 전당 (랭킹)
            </button>
            <button
              onClick={() => navigate("/chat")}
              className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-colors font-bold shadow-sm"
            >
              <FiMessageCircle className="text-xl" /> 대화하기 (Chat)
            </button>
            <button
              onClick={() => navigate("/dd")}
              className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors font-medium"
            >
              <FiBox className="text-xl" /> DD 모듈
            </button>
            <button
              onClick={() => navigate("/ms")}
              className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl hover:bg-cyan-50 text-slate-700 hover:text-cyan-600 transition-colors font-medium"
            >
              <FiCloud className="text-xl" /> MS 모듈
            </button>
            <button
              onClick={() => navigate("/sh")}
              className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl hover:bg-purple-50 text-slate-700 hover:text-purple-600 transition-colors font-medium"
            >
              <FiMonitor className="text-xl" /> SH 모듈
            </button>
          </nav>
        </div>
        <div className="p-8 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors font-medium"
          >
            <FiLogOut /> 로그아웃
          </button>
        </div>
      </aside>

      {/* 중앙 메인 콘텐츠 (채팅 영역) */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 z-10 min-h-0 overflow-hidden">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-4xl h-full border border-white/50 flex flex-col md:flex-row overflow-hidden">
          {/* 좌측 펫 상태 프로필 */}
          <div className="w-full md:w-1/3 bg-slate-50/50 border-r border-slate-100 flex flex-col items-center p-8">
            <h3 className="text-xl font-bold text-slate-700 mb-6">내 펫</h3>
            <div className="w-40 h-40 bg-white rounded-full flex justify-center items-center mb-4 relative border-4 border-indigo-100 shadow-md">
              {petData && (
                <img
                  src={petData.getImagePath()}
                  alt={petData.name}
                  className="w-28 h-28 object-contain hover:scale-105 transition-transform duration-300"
                />
              )}
            </div>
            <h2 className="text-2xl font-extrabold text-slate-800 mb-1">
              {petData?.name}
            </h2>
            <p className="text-indigo-500 font-semibold text-sm mb-4">
              성향: {petData?.tendency.toUpperCase()}
            </p>

            {/* 펫 현재 스탯 간략히 보여주기  */}
            <div className="w-full bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-sm">
              <div className="flex justify-between mb-2">
                <span className="text-slate-500 font-medium">레벨</span>
                <span className="text-slate-700 font-bold">
                  Lv.{petData?.level}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-500 font-medium">경험치 (EXP)</span>
                <span className="text-slate-700 font-bold">
                  {petData?.exp} / {petData?.getMaxExp()}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-500 font-medium">애정도</span>
                <span className="text-pink-500 font-bold">
                  {petData?.affection} ❤️
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">지식</span>
                <span className="text-blue-500 font-bold">
                  {petData?.knowledge} 🧠
                </span>
              </div>
            </div>
          </div>

          {/* 우측 채팅 영역 */}
          <div className="flex-1 flex flex-col bg-white h-full overflow-hidden">
            {/* 채팅 헤더 (고정) */}
            <div className="p-5 border-b border-slate-100 bg-white/50 backdrop-blur-md shrink-0">
              <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                <FiMessageCircle className="text-indigo-500" />
                {petData?.name}와(과) 대화중...
              </h2>
            </div>

            {/* 메시지 리스트 (스크롤되는 영역) */}
            <div
              ref={scrollContainerRef}
              className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 bg-slate-50/30 min-h-0"
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] px-5 py-3 rounded-2xl shadow-sm border ${msg.sender === "user"
                      ? "bg-indigo-500 text-white rounded-tr-sm border-indigo-600"
                      : "bg-white text-slate-700 rounded-tl-sm border-slate-200"
                      }`}
                  >
                    <p className="text-[15px] leading-relaxed wrap-break-word">
                      {msg.text}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white text-slate-500 px-5 py-3 rounded-2xl rounded-tl-sm border border-slate-200 shadow-sm flex gap-1 items-center">
                    <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></span>
                    <span
                      className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></span>
                    <span
                      className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></span>
                  </div>
                </div>
              )}
            </div>

            {/* 채팅 입력 폼 (하단 고정) */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 bg-white border-t border-slate-100 flex gap-2 shrink-0"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={`${petData?.name}에게 하고 싶은 말을 적어보세요...`}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={isTyping || !inputValue.trim()}
                className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 text-white px-5 rounded-xl transition-colors shadow-md flex justify-center items-center"
              >
                <FiSend className="text-xl" />
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
