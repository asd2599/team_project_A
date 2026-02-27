import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // ✅ 로그인 시도 시 기존 토큰 완전 삭제
      localStorage.removeItem("token");

      const response = await axios.post("http://localhost:8000/login", {
        email,
        password,
      });
      const data = response.data;
      if (data.token) {
        localStorage.setItem("token", data.token);

        // 펫 검증: users 테이블의 pet_id 가 0 이면 펫 없음, 그 외에는 펫 존재
        if (data.petId === 0 || !data.petId) {
          navigate("/create-pet");
        } else {
          navigate("/main");
        }
      }
    } catch (error) {
      alert(error.response?.data?.message || "로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      {/* 폼 전체 너비를 줄여서 더 콤팩트하게 변경 (max-w-[340px]) */}
      <div className="w-full max-w-[340px] px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gray-50 mb-4 border border-gray-100">
            <FiLogIn className="text-gray-900 text-xl" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">환영합니다!</h2>
          <p className="text-xs text-gray-400 mt-1.5">서비스 이용을 위해 로그인해 주세요</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <FiMail className="text-gray-400 text-xs" />
            </div>
            <input
              type="email"
              placeholder="이메일 주소"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-[13px] bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-900 focus:bg-white transition-all placeholder:text-gray-300"
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <FiLock className="text-gray-400 text-xs" />
            </div>
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-[13px] bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-900 focus:bg-white transition-all placeholder:text-gray-300"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-3 bg-gray-900 text-white text-[13px] font-semibold py-2.5 rounded-xl hover:bg-black transition-all active:scale-[0.98] shadow-sm"
          >
            로그인
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/signup")}
            className="text-[12px] text-gray-400 hover:text-gray-900 transition-colors"
          >
            아직 계정이 없으신가요? <span className="underline underline-offset-4 ml-1">회원가입</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;