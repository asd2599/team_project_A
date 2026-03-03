# Task 1: 아키텍처 및 파이썬 분산 백엔드(FastAPI) 셋업 가이드

## 📌 목표 (Goal)

AI 다마고치의 복잡한 감정 분석 과정과 데이터 저장을 최적화하기 위해, 로그인 및 기초 상태 관리는 Node.js로 유지하되(옵션), 무거운 LLM 모듈과 Vector Search는 Python 기반의 FastAPI로 분리 구축합니다. 이는 프로젝트를 Microservices Architecture(MSA) 형태로 고도화하는 과정입니다.

## 📝 세부 업무 내용 (Detailed Workflow)

### 1-1. Python(FastAPI) 개발 환경 및 디렉토리 구조 셋업

가상환경(`uv` / `venv`)을 활용해 파이썬 패키지를 격리하고 FastAPI 프레임워크를 세팅합니다.

- `pip install fastapi uvicorn pydantic python-dotenv asyncpg sqlalchemy`
- **구조 제안**:
  ```text
  /back-ml
  ├── main.py              # 엔트리포인트 (uvicorn)
  ├── /api
  │   └── /routers         # 엔드포인트 정의 (analyze_router.py)
  ├── /core
  │   └── config.py        # Pydantic BaseSettings 환경변수 세팅
  ├── /services
  │   └── llm_service.py   # OpenAI API / KoBERT 추론 로직
  └── /database
      └── db.py            # Asyncpg 또는 SQLModel 연결 객체
  ```

### 1-2. 데이터 파이프라인 (RDBMS + DB 연결)

단순한 일회성 대화가 아닌 **누적 상태**를 위해 PostgreSQL를 백엔드에 연동합니다.

- FastAPI에서 비동기 DB 드라이버(asyncpg)를 사용하여 `damagotchis` 테이블(경험치, 렙 등), `logs` 테이블(매턴 발화 로그)에 INSERT 트리거를 작성합니다.
- 예: AI 처리 완료 후, 파이썬 서버 내부 트랜잭션으로 `UPDATE damagotchis SET logic_exp = logic_exp + 5 WHERE id = ?;` 를 실행.

### 1-3. 과거 기억 스토리지 (Vector DB) 준비 (선택사항)

OpenAI의 텍스트 제한(Context Window)을 극복하고, "어제 주인이 했던 말"을 기억하게 하려면 과거 대화 내용의 Vector Embedding이 필요합니다.

- Pinecone, ChromaDB, Milvus 중 하나를 선택해 무료 인스턴스를 생성.
- 사용자의 모든 입력 텍스트를 `text-embedding-3-small` 모델 등으로 변환하여 `user_id`, `timestamp` 메타데이터와 함께 적재하는 코드를 `/services/vector_service.py` 에 작성.

### 1-4. AI API 통신 규격 (Swagger) 확정

프론트엔드와 공유될 API Schema를 정의합니다.

- `POST /api/v1/chat`
  - **Request (Client -> API):**
    ```json
    {
      "user_id": 1,
      "text": "오늘 팀장님한테 엄청 깨졌어...",
      "audio_blob": null
    }
    ```
  - **Response (API -> Client):**
    ```json
    {
      "reply": "많이 속상했겠다. 내가 따뜻한 커피라도 내어주고 싶네.",
      "sentiment": "SADNESS",
      "delta_exp": { "empathy": 5, "logic": 0, "charm": 2 },
      "new_status": { "level": 2, "state": "NORMAL" }
    }
    ```

### 1-5. 에러 핸들링 & 엣지 케이스 (Edge Cases)

- **DB Connection Timeout**: 커넥션 풀(Pool) 고갈 방지를 위해 SQLAlchemy에서 적절한 `pool_size` 설정.
- **Rate Limit**: 비용 문제 방지를 위해 FastAPI의 `slowapi` 미들웨어를 도입하여 "1분당 최대 10번" 호출만 가능하도록 방어.
