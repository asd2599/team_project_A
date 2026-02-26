# Task 2: 백엔드 다중 로그인 & 라우터 구축 (Node.js/Express)

## 📌 목표

단순한 이메일 가입뿐만 아니라 구글, 카카오, 네이버 로그인 처리가 가능한 통합 인증 시스템을 구축하여 클라이언트(React)에게 `JWT Token`(출입증)을 발급합니다. 초보자가 헤매지 않도록 코드를 직접 가이드합니다.

## 세부 업무 내용 (Backend Developer)

### 1. 인증 라우터(`routes/auth.js`) 기초 세팅

로컬, 구글, 카카오로 통하는 핏줄을 만듭니다.

```javascript
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db'); // 작성하신 pg Pool

// [1] 일반 이메일 회원가입 API
router.post('/register', async (req, res) => {
  try {
    const { email, password, nickname } = req.body;
    // 1. 비밀번호 암호화 (초보자 필수: plain text 저장 절대 금지!)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. DB 유저 생성
    const userResult = await pool.query(
      `INSERT INTO users (email, password, provider, nickname) VALUES ($1, $2, 'local', $3) RETURNING id`,
      [email, hashedPassword, nickname],
    );
    const userId = userResult.rows[0].id;

    // 3. 다마고치도 축하용으로 자동 분양(생성)!
    await pool.query(
      `INSERT INTO damagotchis (user_id, name) VALUES ($1, $2)`,
      [userId, `${nickname}의 알상태`],
    );

    res.status(201).json({ message: '가입 및 알 부화 완료!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '이메일이 중복인지 확인하세요!' });
  }
});
```

### 2. 일반 로그인 로직 (JWT 발급)

```javascript
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const result = await pool.query(
    `SELECT * FROM users WHERE email = $1 AND provider = 'local'`,
    [email],
  );

  if (result.rows.length === 0)
    return res.status(401).json({ error: '없는 유저입니다.' });

  const user = result.rows[0];
  const isMatch = await bcrypt.compare(password, user.password); // 비번 검증
  if (!isMatch) return res.status(401).json({ error: '비밀번호 틀림!' });

  // JWT 신분증 발급 (1일 유지)
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
  res.json({ accessToken: token, nickname: user.nickname });
});
```

### 3. 소셜 로그인 (Google / Kakao / Naver) 가이드

초보자는 복잡한 `Passport.js` 보다는 프론트엔드에서 인증한 토큰 등을 받아 백엔드에서 유저 생성만 해주는 방식을 권장합니다.

- 프론트(React)에서 구글/카카오 로그인 버튼을 누름 -> 구글에서 프로필(`email`, `provider_id`)을 줌 -> 이 값을 백엔드 API `/auth/social` 에 보냄!

```javascript
// [3] 소셜 통합 가입/로그인 (React가 구글,카카오 프로필을 넘겨주면)
router.post('/social', async (req, res) => {
  const { email, provider, provider_id, nickname } = req.body;

  // 1. 이미 구글로 가입한 사람인지 체크
  let result = await pool.query(`SELECT * FROM users WHERE provider_id = $1`, [
    provider_id,
  ]);

  if (result.rows.length === 0) {
    // 2. 처음 온 사람이면 자동 회원가입 + 다마고치 생성!
    result = await pool.query(
      `INSERT INTO users (email, provider, provider_id, nickname) VALUES ($1, $2, $3, $4) RETURNING *`,
      [email, provider, provider_id, nickname],
    );
    await pool.query(
      `INSERT INTO damagotchis (user_id, name) VALUES ($1, $2)`,
      [result.rows[0].id, `${nickname}의 캐릭터`],
    );
  }

  const user = result.rows[0];
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
  res.json({ accessToken: token, nickname: user.nickname });
});
```

## 🏆 PM 확인 체크

- [ ] 포스트맨(Postman)이나 Thunder Client로 로컬 가입 테스트 1명이상 성공했는가?
- [ ] "비밀번호" 또는 "이메일 중복"에러 500 터질 때 서버콘솔이 죽지 않도록 `catch` 처리가 잘 되어있는가?
