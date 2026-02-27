import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiLogOut,
  FiBox,
  FiCpu,
  FiCloud,
  FiMonitor,
  FiSmile,
  FiAward,
} from "react-icons/fi";

const RankingPage = () => {
  const navigate = useNavigate();
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/");
          return;
        }

        const response = await axios.get(
          "http://localhost:8000/api/pets/ranking",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (response.data.ranking) {
          setRanking(response.data.ranking);
        }
      } catch (error) {
        console.error("랭킹 정보를 불러오는 중 에러 발생:", error);
        alert("랭킹 정보를 가져올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // ----------------------------------------------------------------------
  // 상위 3명과 나머지 분리 (최대 100위까지 표시)
  // ----------------------------------------------------------------------
  const top3 = ranking.slice(0, 3);
  const others = ranking.slice(3, 100);

  // 시상대 프로필 렌더링 함수
  const renderPodiumProfile = (pet, rank) => {
    const isFirst = rank === 1;
    const isSecond = rank === 2;

    let borderColor = 'border-yellow-300 shadow-yellow-500/50';
    if (isSecond) borderColor = 'border-slate-300 shadow-slate-500/50';
    if (rank === 3) borderColor = 'border-orange-300 shadow-orange-500/50';

    return (
      <div className="flex flex-col items-center mb-3">
        <div className={`relative flex justify-center items-center bg-white rounded-full border-4 shadow-xl overflow-hidden ${borderColor} ${isFirst ? 'w-24 h-24 mb-3' : 'w-20 h-20 mb-2'}`}>
          <img
            src={`/images/shapes/${pet.color}_body_circle.png`}
            alt={pet.name}
            className="w-3/4 h-3/4 object-contain"
          />
        </div>
        <span className={`font-bold text-white drop-shadow-md truncate max-w-[120px] ${isFirst ? 'text-2xl' : 'text-xl'}`}>
          {pet.name}
        </span>
        <span className="text-xs font-semibold text-white/90 bg-black/30 px-3 py-1 rounded-full mt-2 backdrop-blur-sm">
          Lv. {pet.level}
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-indigo-600 to-cyan-500 text-white">
        <p className="text-2xl font-bold animate-pulse">
          랭킹 정보를 불러오는 중...
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden relative">
      {/* Background decoration (기존 블러 효과 일부 유지 및 테마에 맞춤) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-800 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-80 h-80 bg-cyan-700 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 pointer-events-none"></div>

      {/* 왼쪽 네비게이션 사이드바 (MainPage와 동일) */}
      <aside className="w-64 bg-white/90 backdrop-blur-xl border-r border-indigo-100 flex-col justify-between shadow-2xl z-20 hidden md:flex">
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
              className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-colors font-bold shadow-sm"
            >
              <FiAward className="text-xl" /> 명예의 전당 (랭킹)
            </button>
            <button
              onClick={() => navigate("/dd")}
              className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors font-medium"
            >
              <FiBox className="text-xl" /> DD 모듈
            </button>
            <button
              onClick={() => navigate("/hb")}
              className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl hover:bg-emerald-50 text-slate-700 hover:text-emerald-600 transition-colors font-medium"
            >
              <FiCpu className="text-xl" /> HB 모듈
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

      {/* 중앙 리스트 콘텐츠 (랭킹 정보 렌더링) */}
      <main className="flex-1 flex flex-col items-center p-6 md:p-10 z-10 overflow-y-auto bg-linear-to-br from-indigo-600 to-cyan-500 overflow-x-hidden custom-scrollbar">
        <div className="w-full max-w-5xl flex flex-col gap-10 mt-2">

          <div className="text-center mb-2">
            <h1 className="text-5xl font-extrabold text-white drop-shadow-md mb-4 tracking-tight">
              🏆 명예의 전당
            </h1>
            <p className="text-indigo-100 font-medium text-lg">
              가장 훌륭하게 성장한 상위 100마리의 펫들입니다!
            </p>
          </div>

          {ranking.length === 0 ? (
            <div className="text-center text-white/90 bg-black/20 p-12 rounded-3xl backdrop-blur-md border border-white/10 shadow-xl">
              <p className="text-2xl font-bold mb-3">아직 등록된 펫이 없습니다.</p>
              <p>첫 번째 펫의 주인이 되어 상위권에 도전해보세요!</p>
            </div>
          ) : (
            <>
              {/* 시상대 (Top 3) */}
              {top3.length > 0 && (
                <div className="flex justify-center items-end gap-2 md:gap-6 mb-8 mt-4">
                  {/* 2위 */}
                  {top3[1] && (
                    <div className="flex flex-col items-center z-10 w-28 md:w-40 transition-transform hover:scale-105 duration-300">
                      {renderPodiumProfile(top3[1], 2)}
                      <div className="w-full h-32 md:h-40 bg-slate-200/90 rounded-t-2xl flex justify-center items-start pt-4 text-5xl font-black text-slate-400 shadow-2xl border-t-4 border-slate-300 backdrop-blur-md">
                        2
                      </div>
                    </div>
                  )}
                  {/* 1위 */}
                  {top3[0] && (
                    <div className="flex flex-col items-center z-20 w-32 md:w-48 transition-transform hover:scale-105 duration-300">
                      {renderPodiumProfile(top3[0], 1)}
                      <div className="w-full h-44 md:h-56 bg-yellow-400/95 rounded-t-2xl flex justify-center items-start pt-4 text-7xl font-black text-yellow-600 shadow-2xl border-t-4 border-yellow-300 backdrop-blur-md">
                        1
                      </div>
                    </div>
                  )}
                  {/* 3위 */}
                  {top3[2] && (
                    <div className="flex flex-col items-center z-10 w-28 md:w-40 transition-transform hover:scale-105 duration-300">
                      {renderPodiumProfile(top3[2], 3)}
                      <div className="w-full h-24 md:h-32 bg-orange-400/90 rounded-t-2xl flex justify-center items-start pt-4 text-4xl font-black text-orange-600 shadow-2xl border-t-4 border-orange-300 backdrop-blur-md">
                        3
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 4위 ~ 100위 리스트 */}
              {others.length > 0 && (
                <div className="bg-black/10 backdrop-blur-md rounded-3xl p-4 md:p-6 border border-white/10 shadow-2xl">
                  <div className="flex flex-col gap-3">
                    {others.map((pet, index) => {
                      const currentRank = index + 4;
                      return (
                        <div
                          key={pet.id}
                          className="flex items-center justify-between p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/5 backdrop-blur-sm transition-all duration-300 shadow-sm group hover:scale-[1.01]"
                        >
                          <div className="flex items-center gap-4 md:gap-6">
                            {/* 순위 */}
                            <div className="w-10 md:w-12 text-center text-3xl font-black text-white/50 group-hover:text-white/90 italic transition-colors">
                              {currentRank}
                            </div>

                            {/* 펫 이미지 */}
                            <div className="w-14 h-14 bg-white/90 rounded-full flex justify-center items-center border-2 border-white/50 shadow-inner overflow-hidden">
                              <img
                                src={`/images/shapes/${pet.color}_body_circle.png`}
                                alt={pet.name}
                                className="w-10 h-10 object-contain"
                              />
                            </div>

                            {/* 펫 이름 및 사용자 */}
                            <div className="flex flex-col">
                              <span className="text-xl font-bold text-white truncate max-w-[150px] md:max-w-[250px]">
                                {pet.name}
                              </span>
                              <span className="text-sm text-indigo-100 font-medium truncate max-w-[150px] md:max-w-[250px]">
                                소유자: {pet.user_id}
                              </span>
                            </div>
                          </div>

                          {/* 레벨 및 경험치 */}
                          <div className="flex flex-col items-end min-w-[90px] md:min-w-[100px]">
                            <span className="text-lg font-bold text-white bg-white/20 px-3 md:px-4 py-1.5 rounded-xl shadow-inner">
                              Lv. {pet.level}
                            </span>
                            <span className="text-xs font-semibold mt-1.5 text-indigo-100 opacity-80">
                              EXP {pet.exp}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default RankingPage;
