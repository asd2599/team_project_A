# Task 7: AI 채팅창(말풍선) UI & 대동맥 파이프라인 (통합 플로우)

## 📌 목표

대시보드 하단이나 옆면에 예쁜 카카오톡 스타일 채팅을 달고, 내가 친 텍스트 문장이 프론트엔드 -> Node.js 단 서버 -> 파이썬 AI -> 프론트엔드로 다시 화면에 출력되는 **프로젝트의 화룡점정 파이프라인**을 개통합니다.

## 세부 업무 내용 (Full Stack / Frontend)

### 1. 채팅 UI 컴포넌트 마크업 (`ChatBox.jsx`)

초보자 실수: 내 말과 다마고치의 말을 화면 양쪽(좌/우)으로 정렬하지 못해 전부 가운데에 섞에 뜨는 불상사를 막기 위해 삼항연산자 배열을 이용합니다.

```jsx
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

export default function ChatBox() {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    { role: 'tama', text: '안녕! 나한테 말 걸어봐!' },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // 스크롤 자동 바닥내림 트릭
  const scrollRef = useRef();
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // 1. 내 말풍선 그리기
    setMessages((prev) => [...prev, { role: 'user', text: inputText }]);
    setIsLoading(true);
    const tempText = inputText;
    setInputText('');

    try {
      // 2. Node로 전송! (Node는 Python으로 전송 대기중)
      const res = await axios.post('http://localhost:5000/api/chat', {
        user_text: tempText,
      });
      // 3. 응답 도착 시 다마고치 말풍선 그리기
      setMessages((prev) => [
        ...prev,
        { role: 'tama', text: res.data.ai_reply },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'tama', text: '서버가 졸고 있어서 말을 알아듣지 못했어...' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 w-full max-w-lg bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-4 h-80 flex flex-col">
      {/* 톡방 뷰로 스크롤 허용 */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 p-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {/* 꼬리와 색깔을 양쪽에 다르게 적용! */}
            <div
              className={`px-4 py-2 max-w-[70%] rounded-2xl text-sm ${
                m.role === 'user'
                  ? 'bg-purple-600 text-white rounded-br-none'
                  : 'bg-white/20 text-white rounded-bl-none border border-white/20'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {/* 로딩 애니메이션 */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="px-4 py-2 bg-white/20 rounded-2xl rounded-bl-none text-xs text-white/70 animate-pulse">
              로비가 생각 중이에요...
            </div>
          </div>
        )}
        <div ref={scrollRef}></div>
      </div>

      {/* 글 입력창 폼 */}
      <form onSubmit={handleSend} className="mt-3 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="다마고치에게 팩폭 당할 한마디를 적어보세요..."
          className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-purple-500 hover:bg-purple-400 px-4 py-2 rounded-xl text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          전송
        </button>
      </form>
    </div>
  );
}
```

## 🏆 PM 확인 체크

- [ ] 버튼 연타 방지: `isLoading` 상태일 때 사용자가 이메일 전송 엔터를 와다다다 치지 않도록 `disabled` 락업이 걸려있는가?
- [ ] 채팅창 글이 엄청 많아졌을 때, 새로운 채팅을 치면 자동으로 맨 아래로 스크롤(스크롤 뷰잉 애니메이션)이 동작하는가?
