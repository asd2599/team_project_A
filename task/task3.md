# Task 3: 프론트엔드 로그인 화면 및 소셜 연동 UI (React)

## 📌 목표

사용자가 앱에 도착했을 때 가장 처음 만나는 로그인 화면을 "글래스모피즘" 예쁜 스타일로 마크업하고, 구글/카카오 소셜 버튼과 로컬 로그인 API를 Tailwind + Zustand와 연동시킵니다.

## 세부 업무 내용 (Frontend Developer)

### 1. 상태관리(Zustand) 상점 열기 (`store/useAuthStore.js`)

복잡한 리덕스(Redux) 다 덜어내고, 복붙용 코드를 씁니다!

```javascript
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null, // { nickname: "로비" }
  token: localStorage.getItem('token') || null, // 브라우저 창고에서 꺼냄

  // 로그인 성공 시!
  loginSuccess: (token, nickname) => {
    localStorage.setItem('token', token); // 브라우저에 신분증 저장
    set({ token, user: { nickname } });
  },

  // 로그아웃 (토큰 찢어버리기)
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null });
  },
}));
```

### 2. 글래스 로그인 화면 그리기 (`Login.jsx`)

Tailwind를 이용해 둥글고 예쁜 유리 카드를 만드세요!

```jsx
import { useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loginSuccess } = useAuthStore();
  const navigate = useNavigate();

  const handleLocalLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      loginSuccess(res.data.accessToken, res.data.nickname);
      alert('로그인 환영합니다!');
      navigate('/dashboard'); // 게임화면으로 이동!
    } catch (error) {
      alert(error.response?.data?.error || '로그인 실패..');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black flex items-center justify-center">
      {/* 글래스모피즘 박스 껍데기 */}
      <div className="backdrop-blur-md bg-white/10 border border-white/20 p-8 rounded-3xl shadow-2xl w-96">
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          AI 타마고치
        </h1>

        <form onSubmit={handleLocalLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="이메일"
            className="p-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="비밀번호"
            className="p-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="mt-4 p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-bold hover:scale-105 transition-transform"
          >
            로그인
          </button>
        </form>

        <div className="mt-6 border-t border-white/20 pt-4 flex flex-col gap-2">
          {/* 카카오/구글 로그인 버튼 위치만 예쁘게 잡아주기 */}
          <button className="p-3 bg-yellow-400 rounded-xl text-black font-bold hover:brightness-110">
            카카오톡으로 시작하기
          </button>
          <button className="p-3 bg-white rounded-xl text-gray-700 font-bold hover:brightness-110">
            Google로 시작하기
          </button>
        </div>
      </div>
    </div>
  );
}
```

## 🏆 PM 확인 체크

- [ ] 백엔드 서버를 켠 상태에서 이메일을 입력하고 넘어갔을 때 `localStorage`에 `token`이 저장이 되었는가?
- [ ] 브라우저 창 크기를 줄였을 때 폼 테두리가 예쁘게 반응형으로 떨어지는가?
