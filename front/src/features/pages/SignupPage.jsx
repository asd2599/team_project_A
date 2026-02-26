import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiMail, FiLock, FiUserPlus } from "react-icons/fi";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    try {
      const response = await axios.post("http://localhost:8000/signup", {
        email,
        password,
        confirmPassword,
      });
      alert(response.data.message || "회원가입이 완료되었습니다.");
      navigate("/");
    } catch (error) {
      alert(
        error.response?.data?.message || "회원가입 중 오류가 발생했습니다.",
      );
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="bg-white/80 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-[400px] border border-white/20">
        <div className="flex justify-center mb-6">
          <div className="bg-indigo-500 p-4 rounded-full shadow-lg shadow-indigo-200">
            <FiUserPlus className="text-white text-3xl" />
          </div>
        </div>
        <h2 className="text-3xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-cyan-500">
          계정 만들기
        </h2>
        <form onSubmit={handleSignup} className="flex flex-col gap-5">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail className="text-gray-400" />
            </div>
            <input
              type="email"
              placeholder="이메일 주소"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              required
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="text-gray-400" />
            </div>
            <input
              type="password"
              placeholder="비밀번호 (6자 이상)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              required
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="text-gray-400" />
            </div>
            <input
              type="password"
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full mt-2 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:scale-[1.02] transition-all active:scale-95"
          >
            가입하기
          </button>
        </form>
        <div className="mt-8 text-center text-gray-500">
          이미 계정이 있으신가요?{" "}
          <button
            onClick={() => navigate("/")}
            className="text-indigo-600 font-semibold hover:underline ml-1"
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
