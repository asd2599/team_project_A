# Task 2: 음성/텍스트 분석 (STT/TTS) 모듈 통합 개발 전략

## 📌 목표 (Goal)

2030세대의 핵심 문제인 "텍스트 포비아"를 정면 돌파하기 위해 단순 타이핑 방식 외에도 마이크(언어적/비언어적) 음성 수집 시스템을 도입합니다. 이 과정에서 브라우저 기반 Web API와 백엔드 서버 간의 안전한 오디오 스트리밍을 구현합니다.

## 📝 세부 업무 내용 (Detailed Workflow)

### 2-1. 프론트엔드 React 오디오 인터페이스 설계

- **기술 스택**: 순수 HTML5 `MediaRecorder API` 혹은 `react-use`의 `useAudio` 등 훅 사용.
- **구현 방식**:
  - 버튼 UI: `onMouseDown`(녹음 시작)과 `onMouseUp`(녹음 종료 및 전송) 이벤트를 활용해 푸시-투-톡(Push-To-Talk) 스타일 구현.
  - 마이크 권한 요청 (`navigator.mediaDevices.getUserMedia({ audio: true })`) 로직 및 권한 거부 시 모달 대안 UI 제공.
  - 생성된 `Blob` 데이터를 FormData 형태로 Node.js나 FastAPI 서버(`multipart/form-data`)로 `POST`.

### 2-2. STT (Speech To Text) 변환 로직 (백엔드)

- 녹음된 오디오(.webm, .mp3, .ogg 파편화 대응)를 서버 측에서 수신하여 FFmpeg를 활용해 16kHz WAV 등의 표준 포맷으로 컨버팅.
- OpenAI의 Whisper API 또는 Naver Clova Speech, ETRI STT API를 호출.
- **예외 처리 (Edge Cases)**:
  - 녹음이 무음(Silent)일 경우의 오류 패스 로직 (`transcript == ""`) 처리.
  - STT 변환 실패(Network Error, RateLimit 등) 시 사용자에게 텍스트 입력을 권유하는 Toast 메시지 응답.

### 2-3. 다마고치의 감정 기반 TTS (Text To Speech) 송출

- 다마고치가 하는 답변(GPT-4o 응답 등)을 화면 텍스트 타이핑 효과(Typewriter Animation)와 함께 실제 소리로 변환.
- **감정 분기 적용**: Task 3의 "다마고치의 감정 판별 결과"를 기반으로 TTS 보이스 엔진 파라미터를 동적 변경.
  - 예시: 기쁨/흥분(Arousal High) 시 피치(Pitch) 상승, 속도 증가 (`rate="1.1", pitch="1.5"`). 슬픔/우울 시 톤 낮춤.
- AWS Polly, Google Cloud Text-to-Speech, 또는 감정표현이 풍부한 ElevenLabs 등 벤더 선택 및 연동.
- **프론트엔드 플레이 재생**: 백엔드가 만들어낸 오디오 파일 스트림(또는 Base64 오디오 데이터)을 React의 `new Audio("data:audio/mp3;base64,...").play()`로 자동 재생하되, 브라우저의 AutoPlay 정책을 고려하여 최초 사용자 인터랙션(클릭)을 반드시 요구해야 함.

### 2-4. 타임아웃 및 성능 방어 전선

- 오디오 파일 용량이 커질수록(예: 30초 이상의 발화) STT 왕복 속도가 길어집니다. 따라서 클라이언트 단에서 녹음 시간을 최대 15초(또는 10초)로 컷오프(Cut-off) 하는 `setTimeout`을 두어야 합니다.
- 서버 요청 대기 중일 때 다마고치의 "귀를 기울이는 중..." 이라는 귀여운 대기(Loading) 애니메이션 Lottie 도입 필수.
