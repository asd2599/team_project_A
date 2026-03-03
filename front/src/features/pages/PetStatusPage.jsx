import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiMoon, FiSun, FiAward, FiHeart } from "react-icons/fi";

const PetStatusPage = ({ petData }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentExp, setCurrentExp] = useState(petData?.exp);
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

  const progress = Math.min(Math.max((currentExp / maxExp) * 100, 0), 100);

  return (
    <div className="flex justify-center items-center min-h-screen bg-white dark:bg-[#0b0f1a] transition-colors duration-300 p-8 font-sans">
      {/* 테마 전환 버튼 */}
      <button
        type="button"
        onClick={toggleTheme}
        className="absolute top-8 right-8 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:scale-110 transition-all z-50"
      >
        {isDarkMode ? <FiSun className="text-sm" /> : <FiMoon className="text-sm" />}
      </button>

      {/* 전체 컨테이너: 가로 배치를 위해 flex 사용 */}
      <div className="flex flex-col md:flex-row gap-12 items-start max-w-[800px] w-full bg-white dark:bg-[#0b0f1a]">
        
        {/* [블럭 1: 좌측] 펫 렌더링 + 경험치 & 성향 */}
        <div className="w-full md:w-[340px] flex-shrink-0">
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

          <div className="text-center mb-10 px-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight italic">{petData?.name}</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 font-medium">Lv.{petData?.level}</p>
          </div>

          {/* 경험치 바 & 성향 섹션 */}
          <div className="px-1">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-end px-1">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest flex items-center gap-1.5">
                  <FiAward className="text-xs" /> EXP
                </span>
                <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">{Math.floor(progress)}%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gray-900 dark:bg-gray-100 transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(0,0,0,0.1)]" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
            </div>

            <div className="flex justify-between items-center py-3.5 px-5 bg-gray-50/50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 rounded-[1.25rem]">
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest flex items-center gap-1.5">
                <FiHeart className="text-xs" /> 현재 성향
              </span>
              <span className="text-[12px] font-bold text-gray-900 dark:text-gray-100">{petData?.tendency}</span>
            </div>
          </div>
        </div>

        {/* [블럭 2: 우측] 펫 스탯 텍스트 출력 */}
        <div className="w-full flex-1 md:pt-6">
          <div className="space-y-10">
            {/* 생존 스탯 */}
            <div>
              <h3 className="text-[10px] font-bold text-gray-300 dark:text-gray-700 uppercase tracking-[0.2em] mb-4 border-b border-gray-50 dark:border-gray-900 pb-2">Survival</h3>
              <div className="space-y-2">
                {[
                  { label: "체력", value: `${petData?.healthHp} / 100` },
                  { label: "배고픔", value: `${petData?.hunger} / 100` },
                  { label: "청결도", value: `${petData?.cleanliness} / 100` },
                  { label: "스트레스", value: `${petData?.stress} / 100` }
                ].map((stat, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1">
                    <span className="text-[13px] text-gray-500 dark:text-gray-400 font-medium">{stat.label}</span>
                    <span className="text-[13px] font-bold text-gray-900 dark:text-gray-200">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 감정 및 지능 스탯 */}
            <div>
              <h3 className="text-[10px] font-bold text-gray-300 dark:text-gray-700 uppercase tracking-[0.2em] mb-4 border-b border-gray-50 dark:border-gray-900 pb-2">Mind & Intelligence</h3>
              <div className="space-y-2">
                {[
                  { label: "지식", value: `${petData?.knowledge} / 100` },
                  { label: "애정", value: `${petData?.affection} / 100` },
                  { label: "공감력", value: `${petData?.empathy} / 100` },
                  { label: "논리력", value: `${petData?.logic} / 100` },
                  { label: "이타심", value: `${petData?.altruism} / 100` }
                ].map((stat, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1">
                    <span className="text-[13px] text-gray-500 dark:text-gray-400 font-medium">{stat.label}</span>
                    <span className="text-[13px] font-bold text-gray-900 dark:text-gray-200">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetStatusPage;