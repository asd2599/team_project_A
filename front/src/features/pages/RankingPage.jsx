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
  FiMessageCircle,
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

  const getRankStyle = (index) => {
    if (index === 0)
      return "bg-yellow-100 border-yellow-300 text-yellow-700 shadow-yellow-200";
    if (index === 1)
      return "bg-gray-100 border-gray-300 text-gray-700 shadow-gray-200";
    if (index === 2)
      return "bg-orange-100 border-orange-300 text-orange-700 shadow-orange-200";
    return "bg-white border-slate-100 text-slate-600 shadow-sm hover:shadow-md";
  };

  const getRankIcon = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `${index + 1}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50 text-slate-500">
        <p className="text-xl font-bold animate-pulse">
          랭킹 정보를 불러오는 중...
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-80 h-80 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 pointer-events-none"></div>

      {/* 왼쪽 네비게이션 사이드바 (MainPage와 동일) */}
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
              onClick={() => navigate("/chat")}
              className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl hover:bg-emerald-50 text-slate-700 hover:text-emerald-600 transition-colors font-medium"
            >
              <FiMessageCircle className="text-xl" /> 대화하기 (Chat)
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
      <main className="flex-1 flex flex-col items-center p-6 z-10 overflow-y-auto">
        <div className="w-full max-w-4xl flex flex-col gap-6 mt-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-yellow-500 to-orange-400 drop-shadow-sm mb-2">
              🏆 명예의 전당
            </h1>
            <p className="text-slate-500 font-medium">
              가장 훌륭하게 성장한 상위 10마리의 펫들입니다!
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {ranking.length === 0 ? (
              <div className="text-center text-slate-500 bg-white/60 p-10 rounded-2xl">
                아직 등록된 펫이 없습니다. 첫 번째 펫의 주인이 되어보세요!
              </div>
            ) : (
              ranking.map((pet, index) => (
                <div
                  key={pet.id}
                  className={`flex items-center justify-between p-4 rounded-2xl border backdrop-blur-sm transition-all duration-300 ${getRankStyle(index)}`}
                >
                  <div className="flex items-center gap-6">
                    {/* 순위 표시 */}
                    <div className="flex justify-center items-center w-12 h-12 text-3xl font-black">
                      {getRankIcon(index)}
                    </div>

                    {/* 펫 이미지 */}
                    <div className="w-16 h-16 bg-white my-1 rounded-full flex justify-center items-center border-2 border-slate-100 shadow-sm relative overflow-hidden">
                      <img
                        src={`/images/shapes/${pet.color}_body_circle.png`}
                        alt={pet.name}
                        className="w-12 h-12 object-contain"
                      />
                    </div>

                    {/* 펫 이름 및 정보 */}
                    <div className="flex flex-col">
                      <span className="text-xl font-bold truncate max-w-[200px]">
                        {pet.name}
                      </span>
                      <span className="text-sm opacity-80 font-medium">
                        소유자 ID: {pet.user_id}
                      </span>
                    </div>
                  </div>

                  {/* 레벨 및 경험치 */}
                  <div className="flex flex-col items-end min-w-[120px]">
                    <span className="text-lg font-black bg-white/50 px-3 py-1 rounded-lg">
                      Lv. {pet.level}
                    </span>
                    <span className="text-sm font-semibold mt-1 opacity-70">
                      EXP {pet.exp}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default RankingPage;
