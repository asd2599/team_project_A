import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiMoon, FiSun, FiAward, FiHeart, FiCoffee, FiHeart as FiHeartFill, FiMessageCircle } from "react-icons/fi";

const PetStatusPage = ({ petData }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentExp, setCurrentExp] = useState(petData?.exp);
  const [progress, setProgress] = useState(0); 
  const maxExp = 100;
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const isDark = savedTheme === "dark" || 
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    
    if (isDark) {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const targetProgress = Math.min(Math.max((currentExp / maxExp) * 100, 0), 100);
      setProgress(targetProgress); 
    }, 100);
    return () => clearTimeout(timer);
  }, [currentExp]);

  const toggleTheme = () => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white dark:bg-[#0b0f1a] transition-colors duration-300 p-8 font-sans">
      <button
        type="button"
        onClick={toggleTheme}
        className="absolute top-8 right-8 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:scale-110 transition-all z-50"
      >
        {isDarkMode ? <FiSun className="text-sm" /> : <FiMoon className="text-sm" />}
      </button>

      {/* 컨테이너: items-stretch로 높이 동기화 */}
      <div className="flex flex-col md:flex-row gap-16 items-stretch max-w-[850px] w-full">
        
        {/* [블럭 1: 좌측] - 기준이 되는 블록 */}
        <div className="w-full md:w-[280px] flex flex-col justify-between flex-shrink-0">
          <div>
            {/* 펫 렌더링 영역 */}
            <div className="aspect-square w-full bg-gray-50 dark:bg-gray-900/50 rounded-[3rem] border border-gray-100 dark:border-gray-800 mb-8 flex items-center justify-center shadow-sm relative overflow-hidden">
            {petData && (
              <img
                src={petData.getImagePath()}
                alt={petData.name}
                className="w-48 h-48 object-contain hover:scale-110 transition-transform duration-300 drop-shadow-xl"
              />
            )}
          </div>

            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight italic">{petData.name}</h2>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 font-medium uppercase tracking-[0.2em]">Lv.{petData?.level}</p>
            </div>
          </div>

          {/* 하단 경험치 & 성향 (이 위치가 우측의 끝점 기준이 됨) */}
          <div className="px-1 pt-8">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-end px-1">
                <span className="text-[9px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest flex items-center gap-1.5">
                  <FiAward className="text-xs" /> EXP
                </span>
                <span className="text-[10px] font-semibold text-gray-700 dark:text-gray-300">{Math.floor(progress)}%</span>
              </div>
              <div className="w-full h-1 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gray-900 dark:bg-gray-100 transition-all duration-1000 ease-out" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
            </div>

            <div className="flex justify-between items-center py-3 px-4 bg-gray-50/50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 rounded-2xl transition-colors">
              <span className="text-[9px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest flex items-center gap-1.5">
                <FiHeart className="text-xs" /> 현재 성향
              </span>
              <span className="text-[11px] font-bold text-gray-900 dark:text-gray-100">{petData?.tendency}</span>
            </div>

            {/* 상호작용 메뉴 (성향 아래 가로 한 줄 배치) */}
            <div className="grid grid-cols-4 gap-2 mt-2">
              <button className="flex flex-col items-center py-2.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all active:scale-95 group">
                <FiCoffee className="text-[14px] text-gray-400 group-hover:text-indigo-500 mb-1" />
                <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100">먹기</span>
              </button>
              <button className="flex flex-col items-center py-2.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all active:scale-95 group">
                <FiHeartFill className="text-[14px] text-gray-400 group-hover:text-rose-500 mb-1" />
                <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100">교감</span>
              </button>
              {/* 대화 버튼: 클릭 시 /chat 페이지로 이동 */}
              <button 
                onClick={() => navigate("/chat")}
                className="flex flex-col items-center py-2.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all active:scale-95 group"
              >
                <FiMessageCircle className="text-[14px] text-gray-400 group-hover:text-cyan-500 mb-1" />
                <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100">대화</span>
              </button>
              {/* 랭킹 버튼: 클릭 시 /ranking 페이지로 이동 */}
              <button 
                onClick={() => navigate("/ranking")}
                className="flex flex-col items-center py-2.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all active:scale-95 group"
              >
                <FiAward className="text-[14px] text-gray-400 group-hover:text-amber-500 mb-1" />
                <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100">랭킹</span>
              </button>
            </div>

          </div>
        </div>

        {/* [블럭 2: 우측] - 좌측 높이에 맞춘 상세 스탯 */}
        <div className="w-full flex-1 flex flex-col justify-between py-1">
          {/* 생존 섹션 */}
          <div>
            <h3 className="text-[9px] font-bold text-gray-300 dark:text-gray-700 uppercase tracking-[0.2em] mb-3 border-b border-gray-50 dark:border-gray-900 pb-2 font-mono">Survival</h3>
            <div className="space-y-1">
              {[
                  { label: "체력", value: `${petData?.healthHp} / 100` },
                  { label: "배고픔", value: `${petData?.hunger} / 100` },
                  { label: "청결도", value: `${petData?.cleanliness} / 100` },
                  { label: "스트레스", value: `${petData?.stress} / 100` }
              ].map((stat, idx) => (
                <div key={idx} className="flex justify-between items-center py-1">
                  <span className="text-[12px] text-gray-500 dark:text-gray-400 font-medium">{stat.label}</span>
                  <span className="text-[12px] font-bold text-gray-900 dark:text-gray-200">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 감정 및 지능 섹션 - 좌측 끝 라인에 맞추기 위해 여백 최적화 */}
          <div className="mt-auto">
            <h3 className="text-[9px] font-bold text-gray-300 dark:text-gray-700 uppercase tracking-[0.2em] mb-3 border-b border-gray-50 dark:border-gray-900 pb-2 font-mono">Mind & Intelligence</h3>
            <div className="space-y-1">
              {[
                  { label: "지식", value: `${petData?.knowledge} / 100` },
                  { label: "애정", value: `${petData?.affection} / 100` },
                  { label: "공감력", value: `${petData?.empathy} / 100` },
                  { label: "논리력", value: `${petData?.logic} / 100` },
                  { label: "이타심", value: `${petData?.altruism} / 100` }
              ].map((stat, idx) => (
                <div key={idx} className="flex justify-between items-center py-1">
                  <span className="text-[12px] text-gray-500 dark:text-gray-400 font-medium">{stat.label}</span>
                  <span className="text-[12px] font-bold text-gray-900 dark:text-gray-200">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetStatusPage;