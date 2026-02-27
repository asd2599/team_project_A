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
} from "react-icons/fi";
import Pet from "../pets/pet";
import PetStatusPage from "./PetStatusPage";

const MainPage = () => {
  const navigate = useNavigate();
  const [petData, setPetData] = useState(null);
  const [loading, setLoading] = useState(true);

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
          // 펫이 없으면 강제로 생성페이지 이동
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
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
              className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-600 transition-colors font-bold shadow-sm"
            >
              <FiSmile className="text-xl" /> 내 펫 상태 (Main)
            </button>
            <button
              onClick={() => navigate("/dd")}
              className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 transition-colors font-medium"
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

      {/* 중앙 메인 콘텐츠 (펫 정보 렌더링) */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 z-10 overflow-y-auto">
        <PetStatusPage petData={petData} />
      </main>
    </div>
  );
};

export default MainPage;
