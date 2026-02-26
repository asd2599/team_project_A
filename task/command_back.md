# 백엔드 & AI 모듈 설치 가이드 (V5. command_back.md)

초보자 팀원분들이 헤매지 않도록, 백엔드는 Node.js(데이터 검증)와 Python(AI 뇌 기능) 두 가지 분리된 폴더로 구축합니다.

---

## [1. Node.js 백엔드 폴더]

### 초기 프로젝트 생성

```bash
# 터미널에서 빈 폴더를 하나 만듭니다
mkdir backend
cd backend
npm init -y
```

### 필수 라이브러리 일괄 설치 명령어

이 명령어를 그대로 복사해서 터미널에 퍼부어주세요.

```bash
# [1] 서버 코어 모듈 및 DB
npm install express cors dotenv pg

# [2] 다중 소셜/일반 로그인 및 보안용 패키지
npm install bcrypt jsonwebtoken

# [3] 다마고치 시간 스케줄러 & 파이썬 게이트웨이용
npm install node-cron axios
```

### 개발용 추가 툴 설치 (초보자 필수: 서버 자동 재시작)

개발 중에 코드 한 줄 수정할 때마다 `node app.js` 를 껐다 켜면 화가 납니다. 이것을 쓰세요.

```bash
npm install -D nodemon
```

_(설치 후 `package.json` 파일의 `"scripts"` 쪽에 `"dev": "nodemon index.js"` 를 적어두세요!)_

### 💡 추천 라이브러리 상세 설명

1. **`express`**: 백엔드 서버를 찍어내는 가장 쉬운 붕어빵 틀 (프레임워크)
2. **`cors`**: 프론트는 5173, 파이썬은 8000. 포트 번호가 달라 발생하는 "니네 둘 주소 달라서 통신 막았어" 에러를 한방에 뚫어주는 구원자.
3. **`pg`**: Node가 PostgreSQL 데이터베이스에 `SELECT`, `UPDATE` 쿼리를 날릴 수 있게 돕는 운전기사.
4. **`node-cron`**: 스케줄러 기능. 밤낮 가리지 않고 정해진 시간(예: 매시간 정각)에 전체 다마고치의 배고픔(`hunger`)을 깎아내립니다.
5. **`bcrypt`**: 백엔드 DB가 구글에 털려도, 유저의 비밀번호를 볼 수 없게 해시(!)로 빻아버리는 암호화 라이브러리.
6. **`axios` (백엔드용)**: Node.js가 프론트의 말을 파이썬에게 대신 전달해줄 때(Gateway 역할) 필요합니다.

### 서버 구동 명령어

```bash
npm run dev
```

---

## [2. Python AI 모듈 폴더]

### 초기 프로젝트 생성

```bash
# 루트 경로로 나와서, Python 서버용 폴더를 따로 팝니다.
mkdir ai_module
cd ai_module
```

### 권장 라이브러리 일괄 설치 명령어

```bash
pip install fastapi uvicorn openai pydantic
```

### 💡 API 모듈 핵심 설명

1. **`fastapi`**: 이름처럼 엄청나게 빠른 파이썬 서버 엔진. (학습 문서도 예쁘게 자동으로 그려줍니다)
2. **`uvicorn`**: FastAPI가 파이썬 엔진 위에서 돌아갈 수 있도록 빙글빙글 모터를 돌려줍니다.
3. **`openai`**: LLM(최고의 지능)과 소통하게 하는 도구. (`.env` 파일에 발급받은 키를 넣으세요!)

### 서버 구동 명령어

```bash
# 코드 작성이 main.py 라면 아래와 같이 터미널에 칩니다.
uvicorn main:app --reload --port 8000
```
