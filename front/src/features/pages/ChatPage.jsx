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
    affection: { label: "애정", icon: FiHeart, color: "text-pink-500" },
    knowledge: { label: "지식", icon: FiBookOpen, color: "text-blue-500" },
    empathy: { label: "공감", icon: FiUsers, color: "text-emerald-500" },
    logic: { label: "논리", icon: FiTarget, color: "text-indigo-500" },
    altruism: { label: "이타", icon: FiGlobe, color: "text-orange-500" },
    extroversion: { label: "외향", icon: FiSmile, color: "text-yellow-500" },
    openness: { label: "개방", icon: FiCompass, color: "text-teal-500" },
    directness: { label: "직설", icon: FiMessageCircle, color: "text-red-500" },
    curiosity: { label: "호기심", icon: FiSearch, color: "text-blue-400" },
    humor: { label: "유머", icon: FiZap, color: "text-yellow-400" },
  };

  return (
    <div className="flex h-screen bg-white dark:bg-[#0b0f1a] transition-colors duration-500 font-sans overflow-hidden">
      <aside className="w-20 lg:w-64 border-r border-gray-50 dark:border-gray-900 flex flex-col justify-between bg-white dark:bg-[#0b0f1a] z-40 flex-shrink-0">
        <div className="p-8 lg:p-10">
          <h2 className="hidden lg:block text-xs font-black text-gray-900 dark:text-white mb-10 tracking-[0.3em] text-center italic uppercase">Dashboard</h2>
          <nav className="flex flex-col gap-2">
            {[
              { icon: FiSmile, label: "내 펫 상태", path: "/main" },
              { icon: FiAward, label: "명예의 전당", path: "/ranking" },
              { icon: FiMessageCircle, label: "대화하기", path: "/chat", active: true },
              { icon: FiBox, label: "DD 모듈", path: "/dd" },
              { icon: FiCloud, label: "MS 모듈", path: "/ms" },
              { icon: FiMonitor, label: "SH 모듈", path: "/sh" },
            ].map((item) => (
              <button key={item.label} onClick={() => navigate(item.path)} className={`flex items-center gap-4 p-3 lg:px-5 lg:py-3.5 rounded-2xl transition-all ${item.active ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-xl" : "text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900"}`}>
                <item.icon className="text-lg" /><span className="hidden lg:block text-[13px] font-bold">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="p-10 border-t border-gray-50 dark:border-gray-900">
          <button onClick={handleLogout} className="flex items-center gap-2 text-[12px] font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest group"><FiLogOut className="text-lg" /><span className="hidden lg:block">Sign Out</span></button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col md:flex-row items-stretch p-4 lg:p-6 gap-6 bg-[#fcfcfc] dark:bg-[#0b0f1a] h-full overflow-hidden relative">
        <button onClick={toggleTheme} className="absolute top-4 right-4 p-2.5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-500 z-50 shadow-sm transition-all">{isDarkMode ? <FiSun className="text-xs" /> : <FiMoon className="text-xs" />}</button>

        {/* ✅ 스탯 영역: 넓이 확장 (w-[380px]) */}
        <div className="w-full md:w-[380px] flex flex-col justify-between flex-shrink-0 h-full py-2">
          <div className="flex flex-col items-center">
            <div className="w-full aspect-square max-w-[160px] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] shadow-sm flex items-center justify-center mb-4 relative overflow-hidden group">
              {petData && <img src={petData.getImagePath()} className="w-28 h-28 object-contain z-10 transition-transform group-hover:scale-110" alt="" />}
            </div>
            <div className="text-center mb-4">
              <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tighter italic leading-none">{petData?.name}</h2>
              <p className="text-[10px] text-indigo-500 font-bold mt-2 uppercase tracking-widest">{petData?.tendency}</p>
            </div>

            <div className="w-full bg-white/50 dark:bg-gray-900/30 p-5 rounded-[2rem] border border-gray-50 dark:border-gray-800 shadow-sm custom-scrollbar overflow-y-auto max-h-[calc(100vh-350px)]">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div className="col-span-2 border-b border-gray-100 dark:border-gray-800 pb-1 mb-1"><h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">Character Stats</h4></div>
                {Object.entries(statConfig).map(([key, config]) => (
                  <div key={key} className="flex items-center justify-between group">
                    <div className="flex items-center gap-2">
                      <config.icon className={`text-[14px] ${config.color}`} />
                      <span className="text-[13px] font-bold text-gray-500 dark:text-gray-400">{config.label}</span>
                    </div>
                    <span className="text-[13px] font-black text-gray-900 dark:text-white font-mono tracking-tighter">{petData?.[key]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button onClick={handleAnalyzeTendency} disabled={analysisLoading} className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2">
            {analysisLoading ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <FiActivity />} AI 성향 분석 및 확립
          </button>
        </div>

        {/* ✅ 채팅창 영역: 크기 축소 (flex-1) */}
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800 rounded-[3rem] shadow-sm overflow-hidden relative h-full">
          <div className="px-8 py-5 border-b border-gray-50 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 flex justify-between items-center flex-shrink-0">
            <span className="text-[10px] font-black text-gray-300 dark:text-gray-700 uppercase tracking-[0.4em]">Live Interaction Terminal</span>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar scroll-smooth">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}>
                <div className={`max-w-[85%] flex items-start gap-4 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 border ${msg.sender === "user" ? "bg-gray-900 border-gray-800 shadow-md" : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-sm"}`}>
                    {msg.sender === "user" ? <FiUser className="text-white text-xs" /> : <FiSmile className="text-gray-400 text-xs" />}
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className={`p-5 rounded-[1.8rem] text-[13px] leading-relaxed shadow-sm ${msg.sender === "user" ? "bg-gray-900 text-white rounded-tr-none" : msg.isSystem ? "bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 border border-amber-100 font-bold" : "bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-50 dark:border-gray-700 rounded-tl-none"}`}>
                      {msg.text}
                    </div>
                    {msg.sender === "pet" && msg.analysis && (
                      <div className="flex flex-wrap gap-2 px-1">
                        {Object.entries(msg.analysis).map(([key, val]) => {
                          if (!val || val === 0) return null;
                          return (
                            <span key={key} className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${val > 0 ? "bg-emerald-50/50 border-emerald-100 text-emerald-600" : "bg-rose-50/50 border-rose-100 text-rose-600"}`}>
                              {(statConfig[key]?.label || key)} {val > 0 ? `+${val}` : val}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && <div className="text-[11px] text-gray-300 ml-12 italic animate-pulse">펫이 생각하는 중...</div>}
            <div ref={chatEndRef} />
          </div>

          <div className="p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-50 dark:border-gray-800 flex-shrink-0">
            <form onSubmit={handleSendMessage} className="relative flex items-center max-w-2xl mx-auto w-full group">
              <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} disabled={isTyping} placeholder="대화를 입력하세요..." className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-[13px] px-7 py-4.5 rounded-[1.8rem] focus:outline-none focus:ring-1 focus:ring-gray-400 transition-all shadow-inner" />
              <button type="submit" disabled={isTyping || !inputValue.trim()} className="absolute right-2.5 p-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-[1.4rem] hover:scale-105 active:scale-95 transition-all shadow-lg"><FiSend className="text-sm" /></button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;