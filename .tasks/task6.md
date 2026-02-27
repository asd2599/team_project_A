# Task 6: 풀스택(React + FastAPI) 극한의 예외 테스트 및 실서버 배포(CI/CD)

## 📌 목표 (Goal)

분산된 프론트엔드와 백엔드를 로컬 호스트(`127.0.0.1`)가 아닌 외부 서비스에 퍼블릭 도메인으로 올리고, 그 과정에서 발생 가능한 CORS(교차 출처 문제), 환경 변수 보호 등의 엣지 케이스를 모두 해결합니다.

## 📝 세부 업무 내용 (Detailed Workflow)

### 6-1. 어택 테스트 (방어용 예외 처리 및 로터리)

배포 시 제일 위험한 "요금 폭탄" 및 "무한루프 핑퐁" 버그를 차단해야 합니다.

- **채팅 스무딩 로직 방어 (Frontend)**:
  - 사용자가 엔터를 계속 누름 -> 상태 `isSubmitting=true` 로 버튼 비활성화 시킴.
  - 텍스트가 빈 칸이거나 " "(스페이스)만 존재하는 건 `if (!text.trim()) return` 처리.
- **백엔드 무한루프 방어**:
  - 만약 ChatGPT API가 마비되어 타임아웃 10초를 넘길 경우 서버가 정지하지 않게 `try-except asyncio.TimeoutError` 작성 후 -> 다마고치가 "앗! 머리가 아파요(잠시 후 시도해주세요)" 응답.
- **다마고치 굶어죽음 DB -100 버그 (Backend)**:
  - 스케줄러가 허기를 깎아서 `hunger` 가 음수로 떨어질 때마다 `Math.max(0, hunger - 5)` 나 DB Check Constraint 를 걸어서 음수가 안 되게 방어.

### 6-2. CI/CD 및 배포 인프라 구축 (Vercel + Render + DB)

**도커 및 클라우드 서비스 연동 로드맵**

1. **GitHub 연동**: `/front` 폴더 내의 변경점과 `/back`, `/back-ml` 폴더 분리.
2. **Frontend 배포**: 코드를 Vercel(또는 Netlify, AWS S3)로 Import (빌드 커맨드: `npm run build`). 생성된 URL을 기록.
3. **Backend(FastAPI) 배포**: Render.com(또는 AWS EC2)의 Web Service에 Dockerfile(또는 Build Command: `uvicorn main:app --host 0.0.0.0 --port 10000`)을 기반으로 배포.
   - **[주의점]**: Render는 무료 티어일 때 Sleep 모드 도달 후 기상 시 50초가 걸리므로 프론트 기동 시 백엔드 깨우기 "ping" 날리기.
4. **CORS 세팅 (Cross-Origin Resource Sharing)**: FastAPI 백엔드의 `middlewares` 에 새로 발급받은 Vercel 프론트 도메인을 무조건 등록해야 `fetch failed` 가 발생하지 않음.

### 6-3. README.md (포트폴리오화 3원칙) 작성 가이드

면접관과 강사가 1초 만에 프로젝트 구조를 파악하게 하는 "가장 강력한 문서(README)" 작업.

- **1순위 (시각적 자극)**: 썸네일로 다마고치 플레이 영상 화면, 혹은 주요 감정 변화가 적용되는 GIF 파일 첨부.
- **2순위 (시스템 아키텍처 다이어그램 & ERD)**: (React -> FastAPI -> GPT/DB 구조) Mermaid 혹은 Draw.io 파일 삽입.
- **3순위 (Troubleshooting / 엣지케이스 극복기)**:
  > (작성 예시) "Troubleshooting 1: 다마고치의 AI 무한 통신 비용(요금) 초과 사태를 어떻게 막았나?"
  > "React 단의 `isLoading` 상태 관리만을 넘어, 백엔드 서버에서 `slowapi` 로 1분당 IP 액티브 콜 10회 제한(Rate limit)을 걸고 Redis(또는 메모리 캐시)로 중복 전송 방식을 캐치하여 서버 비용을 월 기준 80%를 아꼈습니다."
