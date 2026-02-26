# Task 6: 프론트엔드 메인 대시보드 컴포넌트 마크업 (시각적 피드백)

## 📌 목표

가장 눈이 즐거운 파트입니다. 다마고치의 컨디션을 보여주는 상태바(게이지) 애니메이션, 귀엽게 둥둥 떠 있는 캐릭터 랜더링, 통쾌하게 터지는 하트/음식 아이콘 및 버튼을 `Tailwind CSS` 로 복붙해 만듭니다!

## 세부 업무 내용 (Frontend Developer)

### 1. 다이나믹 게이지 컴포넌트 (`StatusProgressBar.jsx`)

기본 요소 말고 백엔드에서 쏴주는 `hunger` 값을 받아 살아 움직이는 찰진 게이지 바를 만드세요!

```jsx
export default function StatusProgressBar({ label, value, colorType }) {
  // colorType이 "feed"면 피색상(빨강/초록), "happy"면 기분색상(파랑/노랑)
  let barColor =
    value > 50 ? 'from-green-400 to-emerald-500' : 'from-red-500 to-red-400';
  if (colorType === 'happy') {
    barColor =
      value > 50
        ? 'from-blue-400 to-indigo-500'
        : 'from-yellow-500 to-orange-400';
  }

  return (
    <div className="mb-4">
      <div className="flex justify-between text-white text-sm font-bold mb-1">
        <span>{label}</span>
        <span>{value} / 100</span>
      </div>
      {/* 바깥 투명 빈 깡통 */}
      <div className="w-full h-5 bg-white/10 rounded-full overflow-hidden border border-white/20">
        {/* अंदर 꽉차오르는 속살 애니메이션 (transition-all이 다 합니다!) */}
        <div
          className={`h-full bg-gradient-to-r ${barColor} transition-all duration-700 ease-out`}
          style={{ width: `${Math.min(value, 100)}%` }} // 100% 안넘게
        ></div>
      </div>
    </div>
  );
}
```

### 2. 메인 대시보드 게임화면 (`Dashboard.jsx`)

투명 유리 질감을 유지하면서 컴포넌트들을 합칩니다. 백엔드 통신 `useEffect` 코드를 참고하세요.

```jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import StatusProgressBar from './StatusProgressBar';

export default function Dashboard() {
  const [tama, setTama] = useState({
    name: '로딩중..',
    hunger: 50,
    happiness: 50,
    level: 1,
  });

  // 화면 들어올때 1회 호출
  useEffect(() => {
    // 실제로는 토큰을 함께 axios 헤더에 실어줘야함
    const fetchTama = async () => {
      const res = await axios.get('http://localhost:5000/api/tamagotchi'); // 만들어야할조회 api
      setTama(res.data);
    };
    // fetchTama(); 코드를 풀어서 쓰세요!
  }, []);

  const handleAction = async (type) => {
    // 클릭 이펙트 (폭죽 등 라이브러리 추가 가능)
    const res = await axios.post(
      'http://localhost:5000/api/tamagotchi/action',
      { action_type: type },
    );
    setTama((prev) => ({
      ...prev,
      hunger: res.data.updated.hunger,
      happiness: res.data.updated.happiness,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-8 text-center flex flex-col items-center">
      <div className="w-full max-w-lg backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-6 relative">
        <h1 className="text-2xl font-bold text-white mb-2">
          {tama.name} (Lv. {tama.level})
        </h1>

        {/* 캐릭터 애니메이션 뷰 */}
        <div className="h-48 flex justify-center items-center my-6">
          <img
            src="/cute-tama.gif"
            alt="다마고치"
            className="h-full animate-bounce drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
          />
        </div>

        <StatusProgressBar
          label="배고픔 (Hunger)"
          value={tama.hunger}
          colorType="feed"
        />
        <StatusProgressBar
          label="친밀도 (Happiness)"
          value={tama.happiness}
          colorType="happy"
        />

        {/* 액션 폭행(?) 버튼 영역 */}
        <div className="flex gap-4 mt-8 justify-center">
          <button
            onClick={() => handleAction('FEED')}
            className="px-6 py-3 bg-red-400/80 hover:bg-red-500 rounded-full text-white font-bold transition-all shadow-lg active:scale-90"
          >
            🍖 밥주기
          </button>
          <button
            onClick={() => handleAction('PLAY')}
            className="px-6 py-3 bg-blue-400/80 hover:bg-blue-500 rounded-full text-white font-bold transition-all shadow-lg active:scale-90"
          >
            🎮 놀아주기
          </button>
        </div>
      </div>
    </div>
  );
}
```

## 🏆 PM 확인 체크

- [ ] 게이지 바에 `transition-all` 이 작동하여, 밥버튼을 눌렀을 때 팍팍 차지 않고 스르륵 부드럽게 채워지는 시각 효과가 나는가? (UX 차이 큽니다)
