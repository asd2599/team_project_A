# Task 5: 핵심 게임 규칙(Actions), 로그 쌓기 및 AI 중계 Gateway API (Node.js)

## 📌 목표

Node.js는 다마고치 세계의 **물리법칙**과 **뇌의 신경망**을 담당합니다. 밥을 줄 때 게이지가 오르며('action'), 내가 언제 밥을 줬는지 로그에 기록(`logs`)하고, 그 모든 기록을 모아 파이썬 서버로 연결해줍니다(`Gateway`). 매우 상세한 구조입니다!

## 세부 업무 내용 (Backend Developer)

### 1. 다마고치 액션 로직 (`routes/tamagotchi.js`)

밥을 주거나 놀아줬을 때, 수치는 올리면서 절대로 100을 넘지 못하게 수학으로 제어(`Math.min`)합니다.

```javascript
const express = require('express');
const router = express.Router();
const pool = require('../db');
const axios = require('axios'); // 파이썬 통신용
// (여기에 꼭 JWT 토큰 미들웨어를 붙일것: const auth = require('../middleware/auth'))

// [1] 액션(밥, 놀기) 라우터
router.post('/action', async (req, res) => {
  // req.user.id는 JWT 토큰 인증 미들웨어에서 추출된 내 실제 id
  const userId = 1; // 테스트용 하드코딩 (실제론 req.user.id)
  const { action_type } = req.body; // 'FEED' or 'PLAY'

  try {
    // 내 다마고치 찾기
    const tamaResult = await pool.query(
      `SELECT id, hunger, happiness FROM damagotchis WHERE user_id = $1`,
      [userId],
    );
    const tama = tamaResult.rows[0];

    // 상태 계산 로직
    let newHunger = tama.hunger;
    let newHappy = tama.happiness;
    let newExp = tama.exp || 0;

    if (action_type === 'FEED') {
      newHunger = Math.min(newHunger + 20, 100); // 밥 100번 눌러도 최대 100
      newExp += 5; // 밥 주면 경험치 획득!
    } else if (action_type === 'PLAY') {
      newHappy = Math.min(newHappy + 20, 100);
      newExp += 10;
    }

    // DB 1: 수치 업데이트
    await pool.query(
      `UPDATE damagotchis SET hunger=$1, happiness=$2, exp=$3 WHERE id=$4`,
      [newHunger, newHappy, newExp, tama.id],
    );

    // DB 2: 습관 기억을 위한 로그인서트(INSERT LOG)
    // PostgreSQL의 EXTRACT 함수로 현재 액션을 취한 '시간대'를 함께 넣습니다.
    await pool.query(
      `INSERT INTO logs (damagotchi_id, action_type, action_hour) VALUES ($1, $2, EXTRACT(HOUR FROM NOW()))`,
      [tama.id, action_type],
    );

    res.json({
      message: '액션 성공',
      updated: { hunger: newHunger, happiness: newHappy, exp: newExp },
    });
  } catch (e) {
    res.status(500).json({ error: 'DB 에러' });
  }
});
```

### 2. Python Gateway 라우터 (습관 분석 엑기스 전달)

프론트엔드가 채팅을 치면, 로그 통계를 내 파이썬에게 던지는 "뇌관"입니다.

```javascript
// [2] 챗봇 통신 파이프라인
router.post('/chat', async (req, res) => {
  const userId = 1; // 내 JWT 인증 ID
  const { user_text } = req.body;

  // 1. 다마고치 현재 상태 찾기
  const tamaRes = await pool.query(
    `SELECT id, hunger, happiness FROM damagotchis WHERE user_id=$1`,
    [userId],
  );
  const tama = tamaRes.rows[0];

  // 2. [가장 중요] 밥먹은 가장 흔한 시간대(Habit) 뽑아내기 쿼리! (GROUP BY)
  // 초보자분들 복붙하세요!: "이 다마고치가 FEED(밥)를 제일 많이 받은 시간대 1개 찾기"
  const logRes = await pool.query(
    `
        SELECT action_hour, COUNT(*) as cnt 
        FROM logs 
        WHERE damagotchi_id = $1 AND action_type = 'FEED'
        GROUP BY action_hour 
        ORDER BY cnt DESC LIMIT 1
    `,
    [tama.id],
  );

  let memoryStr = '주인과의 추억이 아직 없습니다.';
  if (logRes.rows.length > 0) {
    memoryStr = `주인은 주로 ${logRes.rows[0].action_hour}시 쯤 나에게 밥을 챙겨준다.`;
  }

  // 3. 드디어 Python 8000번 서버(AI)로 전송!
  try {
    const aiResponse = await axios.post('http://localhost:8000/api/ai/chat', {
      user_text: user_text,
      hunger: tama.hunger,
      happiness: tama.happiness,
      memories: memoryStr,
    });

    // 결과 리턴
    res.json({ ai_reply: aiResponse.data.reply });
  } catch (err) {
    res.status(500).json({ error: '파이썬 서버가 자고 있습니다.' });
  }
});
```

## 🏆 PM 확인 체크

- [ ] 밥주기, 놀아주기 액션을 번갈아 수행했을 때 `logs` 테이블에 줄줄이 쌓이는지 점검.
- [ ] 채팅 요청 시 Node가 죽지 않고 Python으로 우회 통신(Gateway) 잘 다녀오는지 점검!
