# Task 1: 기획, 아키텍처 및 상세 DB 설계 (PM/팀 공통)

## 📌 목표

팀원들이 이 문서만 봐도 "아, 테이블은 이렇게 만들면 되고 프론트는 이런 기능이 있구나"라고 확신할 수 있는 초강력 기획안과 뼈대(DB)를 설정합니다. 팀 병목현상을 막기 위해 데이터베이스 스키마(SQL)를 100% 확정 짓고 넘어갑니다.

## 🎯 눈길을 끄는 킬러 기능 (User Experience)

초보자 포트폴리오는 '기능의 양'보다 '디테일'입니다.

1. **다중 로그인 지원**: 로컬 이메일 가입뿐 아니라 구글, 카카오, 네이버 소셜 로그인(OAuth)을 지원하여 1초 만에 유저가 유입되도록 합니다.
2. **AI 습관 거울**: 다마고치가 주인의 밥 주는 시간, 말 거는 어투를 기억해 "주인님 또 11시에 치킨먹는구나?", "어제 늦게 잤지!" 등 소름 돋게 맞춤형으로 팩트 폭행/위로를 합니다.
3. **진화 시스템 (다이내믹 UI)**: 경험치가 차거나 특정 스탯(친밀도)에 따라 다마고치 이미지가 달라집니다(예: 알 -> 병아리 -> 타락한 닭).

---

## 💾 [초보자 복붙용] PostgreSQL 완벽 테이블 스키마

백엔드 담당자는 pgAdmin(또는 DBeaver)를 켜고 아래 SQL을 복사해서 **순서대로** 실행하세요!

### 1-1. `users` (유저 정보 - 소셜 로그인 대응)

비밀번호가 없는 카카오 로그인 등을 위해 `password`는 `NULL`을 허용해야 합니다!

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE,                  -- 이메일 (구글, 로컬용)
    password VARCHAR(255),                      -- 로컬 비밀번호 (소셜 로그인은 NULL)
    provider VARCHAR(50) DEFAULT 'local',       -- 가입경로: 'local', 'google', 'kakao', 'naver'
    provider_id VARCHAR(255),                   -- 카카오 고유ID 등 (소셜용)
    nickname VARCHAR(50) NOT NULL,              -- 닉네임 (소셜에서 받아오거나 유저가 입력)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 1-2. `damagotchis` (다마고치 상태)

```sql
CREATE TABLE damagotchis (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,                  -- "내다마"
    level INT DEFAULT 1,                        -- 진화 단계
    hunger INT DEFAULT 50,                      -- 배고픔 (0=죽음, 100=배부름)
    happiness INT DEFAULT 50,                   -- 친밀도 (0=우울, 100=행복)
    exp INT DEFAULT 0,                          -- 경험치 (100 도달 시 level + 1)
    status VARCHAR(50) DEFAULT 'NORMAL',        -- 현재 상태 ('NORMAL', 'SLEEP', 'SICK')
    last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 1-3. `logs` (주인의 습관 추적용 통계 테이블)

파이썬 AI가 주인을 분석하기 위해 '시간대별' 액션이 중요합니다.

```sql
CREATE TABLE logs (
    id SERIAL PRIMARY KEY,
    damagotchi_id INT NOT NULL REFERENCES damagotchis(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL,           -- 'FEED', 'PLAY', 'CHAT'
    action_hour INT NOT NULL,                   -- 요약 통계를 위해 시간(0~23)만 따로 저장!!!
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 1-4. `gpt_memories` (AI 요약 노트 - 뇌)

로그가 너무 쌓이면 무거우니 하루에 한 번 백엔드가 요약해서 저장하는 텍스트!

```sql
CREATE TABLE gpt_memories (
    id SERIAL PRIMARY KEY,
    damagotchi_id INT NOT NULL REFERENCES damagotchis(id) ON DELETE CASCADE,
    memory_text TEXT NOT NULL,                  -- 예: "주인은 주로 밤 11시에만 놀아주는 올빼미족이다."
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 🏆 PM 확인 체크

- [ ] 팀원 전원의 컴퓨터 서버/로컬 컴퓨터 DB에 위 4개의 테이블이 동일하게 만들어졌는가?
- [ ] 프론트엔드는 테이블에 어떤 키워드(예: `action_type`)가 있는지 확인했는가?
