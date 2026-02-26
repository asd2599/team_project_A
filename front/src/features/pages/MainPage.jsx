import React from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiBox, FiCpu, FiCloud } from "react-icons/fi";

const MainPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-80 h-80 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-4xl z-10 border border-white/50">
        <div className="flex justify-between items-center mb-12 border-b pb-6">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">
              대시보드
            </h1>
            <p className="text-slate-500 mt-2 text-lg">
              환영합니다! 이용하실 서비스를 선택해 주세요.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors font-medium"
          >
            <FiLogOut /> 로그아웃
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            onClick={() => navigate("/dd")}
            className="group cursor-pointer bg-white border border-indigo-100 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="bg-indigo-100 p-5 rounded-full mb-6 text-indigo-600 group-hover:scale-110 transition-transform duration-300">
              <FiBox className="text-4xl" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">DD 모듈</h3>
            <p className="text-slate-500">
              DD 기능 관리 및 설정을 진행할 수 있는 페이지입니다.
            </p>
          </div>

          <div
            onClick={() => navigate("/hb")}
            className="group cursor-pointer bg-white border border-emerald-100 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="bg-emerald-100 p-5 rounded-full mb-6 text-emerald-600 group-hover:scale-110 transition-transform duration-300">
              <FiCpu className="text-4xl" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">HB 모듈</h3>
            <p className="text-slate-500">
              HB 프로세스 제어 및 모니터링을 담당합니다.
            </p>
          </div>

          <div
            onClick={() => navigate("/ms")}
            className="group cursor-pointer bg-white border border-cyan-100 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="bg-cyan-100 p-5 rounded-full mb-6 text-cyan-600 group-hover:scale-110 transition-transform duration-300">
              <FiCloud className="text-4xl" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">MS 모듈</h3>
            <p className="text-slate-500">
              클라우드 동기화 및 MS 관련 작업을 수행합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
