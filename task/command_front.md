# 프론트엔드 설치 가이드 및 시스템 스택 (V5. command_front.md)

초보자 다마고치 팀 프로젝트를 위해, 현재 대한민국 IT 업계에서 제일 유행하는 가장 트렌디하고 쉬운 도구들로 엄선했습니다.

## 1. 초기 프로젝트 생성 (Vite 사용)

무겁고 느린 CRA(Create React App)는 버리세요! 빠르고 가벼운 **Vite**를 씁니다.

```bash
# 터미널에서 프론트엔드 폴더(예: frontend)를 만들고 싶은 위치로 이동 후:
npm create vite@latest frontend -- --template react
cd frontend
npm install
```

## 2. 필수 라이브러리 일괄 설치 명령어 (통합본)

`frontend` 폴더 안으로 이동(`cd frontend`)한 상태에서 아래 명령어를 한 줄씩 복사/붙여넣기 하세요.

```bash
# [1] 코어 라이브러리 (라우팅, 서버통신, 전역상태)
npm install react-router-dom axios zustand

# [2] 다이나믹 UI/UX 피드백을 위한 도구
npm install react-toastify lucide-react

# [3] 새로운 기능: 소셜 로그인 연동 (구글/카카오) SDK 모듈
npm install @react-oauth/google react-kakao-login
```

### 💡 추천 라이브러리 상세 설명

1. **`react-router-dom`**: 로그인 화면(url: `/login`)이나 대시보드 화면(`/dashboard`)으로 페이지를 부드럽게 넘겨주는 길잡이입니다.
2. **`axios`**: 백엔드(Node.js 5000포트)에게 밥주기/로그인 등의 데이터를 택배로 보낼 때 사용합니다. `fetch`보다 초보자가 에러 핸들링(`catch`)하기 훨씬 좋습니다.
3. **`zustand` (강력 추천)**: "나 로그인 했어!" 라는 인증 정보를 브라우저 전체에 기억시키는 저장소. Redux를 쓰면 코드가 50줄이지만, 이건 5줄이면 됩니다.
4. **`react-toastify`**: 서버가 죽거나 실패했을 때, `alert()` 같은 못생긴 창 말고 우측에서 매끄럽게 슬라이딩으로 들어오는 예쁜 알림창입니다.
5. **`@react-oauth/google`**: 구글 측에서 인정하는 React 전용 무료 로그인 연동 라이브러리입니다. (카카오 로그인의 경우 카카오 개발자 센터에서 발급받은 js키로 구현합니다.)

## 3. UI/UX 디자인 보조 도구 (Tailwind CSS)

"글래스모피즘(유리 질감)"을 일반 CSS 파일에 치면 코드가 피라미드처럼 길어집니다. **Tailwind CSS**를 쓰면 태그 이름에 한 줄만 적어도 끝납니다.

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

_(Tailwind 공식 문서를 참조하여 `tailwind.config.js` 안에 `content: ["./src/\*\*/_.{js,jsx,ts,tsx}"]` 문구 추가를 잊지마세요!)\*

## 4. 로컬 서버 실행 명령어

```bash
# 이 명령어를 치면 localhost:5173 등의 주소로 나의 리액트 화면이 켜집니다!
npm run dev
```
