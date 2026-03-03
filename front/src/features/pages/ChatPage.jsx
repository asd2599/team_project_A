import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiLogOut, FiBox, FiCloud, FiMonitor, FiSmile, FiAward, FiMessageCircle, FiSend, FiMoon, FiSun, FiUser, FiActivity,
  FiHeart, FiZap, FiDroplet, FiCoffee, FiBookOpen, FiCompass, FiUsers, FiTarget, FiHash, FiGlobe, FiEye, FiSearch, FiZapOff
} from "react-icons/fi";
import Pet from "../pets/pet";

const ChatPage = () => {
  const navigate = useNavigate();
  const [petData, setPetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [messages, setMessages] = useState([{ sender: "pet", text: "안녕! 나랑 대화하자멍 (또는 냥)!" }]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // AI 성향 분석 상태
  const [analysisLoading, setAnalysisLoading] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const isDark = savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (isDark) { document.documentElement.classList.add("dark"); setIsDarkMode(true); }

    const fetchPetData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { navigate("/"); return; }
        const response = await axios.get("http://localhost:8000/api/pets/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.pet) { setPetData(new Pet(response.data.pet)); }
        else { navigate("/create-pet"); }
      } catch (error) {
        localStorage.removeItem("token"); navigate("/");
      } finally { setLoading(false); }
    };
    fetchPetData();
  }, [navigate]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    setIsDarkMode(isDark);
  };

  const handleLogout = () => { localStorage.removeItem("token"); navigate("/"); };

  const handleAnalyzeTendency = async () => {
    try {
      setAnalysisLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:8000/api/pets/analyze-tendency", {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.pet) {
        setPetData(new Pet(response.data.pet));
        setMessages(prev => [...prev, {
          sender: "pet", isSystem: true,
          text: `(시스템) AI 성향 분석 완료!\n현재 성향: ${response.data.pet.tendency}\n이유: ${response.data.reason}`,
        }]);
      }
    } catch (error) { alert("AI 성향 분석 중 오류가 발생했습니다."); }
    finally { setAnalysisLoading(false); }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const userMessage = inputValue;
    setMessages(prev => [...prev, { sender: "user", text: userMessage }]);
    setInputValue("");
    setIsTyping(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:8000/api/pets/chat", { message: userMessage }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(prev => [...prev, { sender: "pet", text: response.data.reply, analysis: response.data.analysis }]);
      if (response.data.pet) setPetData(new Pet(response.data.pet));
    } catch (error) {
      setMessages(prev => [...prev, { sender: "pet", text: "앗... 오류가 생겨서 대답을 못하겠어. 💧" }]);
    } finally { setIsTyping(false); }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-white dark:bg-[#0b0f1a]">
      <div className="w-8 h-8 border-2 border-gray-100 border-t-gray-900 dark:border-t-white rounded-full animate-spin" />
    </div>
  );

  const statConfig = {
    healthHp: { label: "체력", icon: FiHeart, color: "text-rose-500" },
    hunger: { label: "배고픔", icon: FiCoffee, color: "text-amber-600" },
    cleanliness: { label: "청결", icon: FiDroplet, color: "text-cyan-500" },
    stress: { label: "스트레스", icon: FiZapOff, color: "text-purple-500" },
    affection: { label: "애정도", icon: FiHeart, color: "text-pink-500" },
    knowledge: { label: "지식", icon: FiBookOpen, color: "text-blue-500" },
    empathy: { label: "공감", icon: FiUsers, color: "text-emerald-500" },
    logic: { label: "논리력", icon: FiTarget, color: "text-indigo-500" },
    altruism: { label: "이타심", icon: FiGlobe, color: "text-orange-500" },
    extroversion: { label: "외향성", icon: FiSmile, color: "text-yellow-500" },
    openness: { label: "개방성", icon: FiCompass, color: "text-teal-500" },
    directness: { label: "직설성", icon: FiMessageCircle, color: "text-red-500" },
    curiosity: { label: "호기심", icon: FiSearch, color: "text-blue-400" },
    humor: { label: "유머", icon: FiZap, color: "text-yellow-400" },
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-white dark:bg-[#0b0f1a] transition-colors duration-500 font-sans overflow-hidden">

      {/* 테마 버튼 */}
      <button onClick={toggleTheme} className="fixed top-4 right-4 lg:top-6 lg:right-6 p-2.5 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-100 dark:border-gray-800 text-gray-500 z-[60] shadow-sm active:scale-90 transition-all">
        {isDarkMode ? <FiSun className="text-xs" /> : <FiMoon className="text-xs" />}
      </button>

      {/* 사이드바 */}
      <aside className="fixed bottom-0 w-full h-16 lg:relative lg:w-64 lg:h-full border-t lg:border-t-0 lg:border-r border-gray-100 dark:border-gray-900 bg-white/90 dark:bg-[#0b0f1a]/90 backdrop-blur-xl z-50 flex lg:flex-col justify-between items-center lg:items-stretch">
        <div className="flex lg:flex-col items-center justify-around w-full lg:p-10">
          <h2 className="hidden lg:block text-xs font-black text-gray-900 dark:text-white mb-10 tracking-[0.3em] text-center uppercase">Dashboard</h2>
          <nav className="flex lg:flex-col gap-1 lg:gap-3 w-full px-2 lg:px-0">
            {[
              { icon: FiSmile, label: "내 펫 상태", path: "/main" },
              { icon: FiAward, label: "명예의 전당", path: "/ranking" },
              { icon: FiMessageCircle, label: "대화하기", path: "/chat", active: true },
              { icon: FiBox, label: "DD 모듈", path: "/dd" },
              { icon: FiCloud, label: "MS 모듈", path: "/ms" },
              { icon: FiMonitor, label: "SH 모듈", path: "/sh" },
            ].map((item) => (
              <button key={item.label} onClick={() => navigate(item.path)} className={`flex flex-col lg:flex-row items-center gap-1 lg:gap-4 p-2 lg:px-5 lg:py-3.5 rounded-xl lg:rounded-2xl transition-all flex-1 lg:flex-none ${item.active ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-xl" : "text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900"}`}>
                <item.icon className="text-xl lg:text-lg" />
                <span className="text-[9px] lg:text-[13px] font-bold">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        {/* 로그아웃 버튼 */}
        <div className="p-10 border-t border-gray-50 dark:border-gray-900">
          <button onClick={() => { localStorage.removeItem("token"); navigate("/"); }} className="flex items-center justify-center lg:justify-center gap-3 w-full text-[12px] font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest group">
            <FiLogOut /> Sign Out
          </button>
        </div>
      </aside>

      {/* 중앙 메인 콘텐츠 (채팅 영역) */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 z-10">
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

            <div className="text-center mb-4">
              <h2 className="text-lg lg:text-2xl font-black text-gray-900 dark:text-white tracking-tighter italic leading-none">{petData?.name}</h2>
              <p className="text-[9px] lg:text-[10px] text-indigo-500 font-bold mt-1.5 uppercase tracking-widest">{petData?.tendency}</p>
            </div>

            {/* 스탯 카드 리스트 영역 (스크롤 가능) */}
            <div className="w-full flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-4 lg:max-h-[calc(100vh-320px)]">
              {[
                { title: "Character Stats", stats: ["healthHp", "hunger", "cleanliness", "stress"] },
                { title: "Mind & Social", stats: ["affection", "knowledge", "empathy", "logic", "altruism", "extroversion", "openness", "directness", "curiosity", "humor"] }
              ].map((section, sIdx) => (
                <div key={sIdx} className="space-y-3">
                  <div className="border-b border-gray-100 dark:border-gray-800 pb-1.5 mb-2 px-1">
                    <h4 className="text-[9px] lg:text-[10px] font-black text-gray-300 dark:text-gray-700 uppercase tracking-[0.3em] italic">{section.title}</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-2 lg:gap-3">
                    {section.stats.map((key) => {
                      const config = statConfig[key];
                      if (!config) return null;
                      return (
                        <div key={key} className="flex items-center gap-2 lg:gap-3.5 p-2 lg:p-3.5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100/50 dark:border-gray-800 shadow-[0_4px_12px_rgba(0,0,0,0.02)] transition-all hover:scale-[1.03] hover:shadow-lg group">
                          <div className={`w-7 h-7 lg:w-8 lg:h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                            <config.icon className={`text-[13px] lg:text-[15px] ${config.color}`} />
                          </div>
                          <div className="flex-1 flex flex-col">
                            <span className="text-[11px] lg:text-[13px] font-bold text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors leading-tight">{config.label}</span>
                            <span className="text-[12px] lg:text-[14px] font-black text-gray-900 dark:text-white font-mono tracking-tighter">{petData?.[key]}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 우측 채팅 영역 */}
          <div className="flex-1 flex flex-col bg-white">
            {/* 채팅 헤더 */}
            <div className="p-5 border-b border-slate-100 bg-white/50 backdrop-blur-md">
              <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                <FiMessageCircle className="text-indigo-500" />
                {petData?.name}와(과) 대화중...
              </h2>
            </div>

            {/* 메시지 리스트 */}
            <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 bg-slate-50/30">
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
                    <p className="text-[15px] leading-relaxed wrap-break-word whitespace-pre-line">
                      {msg.text}
                  </div>
                  {msg.sender === "pet" && msg.analysis && (
                    <div className="flex flex-wrap gap-1 lg:gap-2 px-1">
                      {Object.entries(msg.analysis).map(([key, val]) => {
                        if (!val || val === 0) return null;
                        return (
                          <span key={key} className={`text-[8px] lg:text-[10px] font-black px-2 py-0.5 lg:px-2.5 lg:py-1 rounded-full border ${val > 0 ? "bg-emerald-50/50 border-emerald-100 text-emerald-600" : "bg-rose-50/50 border-rose-100 text-rose-600"}`}>
                            {(statConfig[key]?.label || key)} {val > 0 ? `+${val}` : val}
                          </span>
                        );
                      })}
                    </div>
                  )}
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
            <div ref={chatEndRef} />
          </div>

          {/* 채팅 입력 폼 */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 bg-white border-t border-slate-100 flex gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`${petData?.name}에게 하고 싶은 말을 적어보세요...`}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={isTyping || !inputValue.trim()}
              className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 text-white p-3 rounded-xl transition-colors shadow-md flex justify-center items-center"
            >
              <FiSend className="text-xl" />
            </button>
          </form>
        </div>
    </div>
      </main >
    </div >
  );
};

export default ChatPage;