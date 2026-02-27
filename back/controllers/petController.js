const { pool } = require('../database/database');
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key',
});

// 로그인한 유저의 펫 정보 조회
const getMyPet = async (req, res) => {
  try {
    const userId = req.user.id; // 인증 미들웨어에서 넘어온 유저 정보 가정

    const query = 'SELECT * FROM pets WHERE user_id = $1';
    const result = await pool.query(query, [userId]);

    if (result.rows.length === 0) {
      return res.status(200).json({
        pet: null,
        message: '펫이 존재하지 않습니다. 생성페이지로 이동하세요.',
      });
    }

    return res
      .status(200)
      .json({ pet: result.rows[0], message: '펫 조회 성공' });
  } catch (error) {
    console.error('getMyPet error:', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 펫 초기 생성
const createPet = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, color } = req.body;

    if (!name || !color) {
      return res
        .status(400)
        .json({ message: '이름과 색상은 필수 입력값입니다.' });
    }

    // 펫 보유 중복 체크
    const checkQuery = 'SELECT id FROM pets WHERE user_id = $1';
    const checkResult = await pool.query(checkQuery, [userId]);
    if (checkResult.rows.length > 0) {
      return res.status(400).json({ message: '이미 펫을 보유하고 있습니다.' });
    }

    const insertQuery = `
      INSERT INTO pets (
        user_id, name, color, level, exp, hunger, cleanliness, health_hp, stress, 
        knowledge, affection, altruism, logic, empathy, tendency
      ) VALUES (
        $1, $2, $3, 1, 0, 100, 100, 100, 0,
        0, 0, 0, 0, 0, 'neutral'
      ) RETURNING *;
    `;

    const insertResult = await pool.query(insertQuery, [userId, name, color]);
    const newPet = insertResult.rows[0];

    // ✅ 생성된 펫의 ID를 users 테이블에 갱신
    await pool.query('UPDATE users SET pet_id = $1 WHERE id = $2', [
      newPet.id,
      userId,
    ]);

    return res.status(201).json({ pet: newPet, message: '펫 생성 완료' });
  } catch (error) {
    console.error('createPet error:', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 상태별 상한/하한값 유지 함수 (예: 0~100 사이)
const clamp = (val, min = 0, max = 100) => Math.max(min, Math.min(max, val));

// 액션 데이터 (프론트와 동일한 구조)
const ACTIONS_DATA = {
  1001: {
    category: 'Eating',
    name: 'Eating',
    increaseStatus: 'health_hp',
    increaseValue: 5,
    decreaseStatus: 'hunger',
    decreaseValue: -20,
    exp: 10,
  },
  1002: {
    category: 'Cleaning',
    name: 'Cleaning',
    increaseStatus: 'cleanliness',
    increaseValue: 30,
    decreaseStatus: 'stress',
    decreaseValue: -5,
    exp: 5,
  },
  1003: {
    category: 'Sleep',
    name: 'Sleep 1',
    increaseStatus: 'health_hp',
    increaseValue: 40,
    decreaseStatus: 'stress',
    decreaseValue: -30,
    exp: 5,
  },
  1004: {
    category: 'Sleep',
    name: 'Sleep 2',
    increaseStatus: 'health_hp',
    increaseValue: 40,
    decreaseStatus: 'hunger',
    decreaseValue: 20,
    exp: 5,
  },
  1005: {
    category: 'Playing',
    name: 'Playing 1',
    increaseStatus: 'affection',
    increaseValue: 10,
    decreaseStatus: 'hunger',
    decreaseValue: 10,
    exp: 15,
  },
  1006: {
    category: 'Playing',
    name: 'Playing 2',
    increaseStatus: 'hunger',
    increaseValue: 10,
    decreaseStatus: 'stress',
    decreaseValue: -15,
    exp: 20,
  },
  1007: {
    category: 'Volunteer',
    name: 'Volunteer 1',
    increaseStatus: 'altruism',
    increaseValue: 10,
    decreaseStatus: 'health_hp',
    decreaseValue: -5,
    exp: 25,
  },
  1008: {
    category: 'Volunteer',
    name: 'Volunteer 2',
    increaseStatus: 'empathy',
    increaseValue: 5,
    decreaseStatus: 'health_hp',
    decreaseValue: -10,
    exp: 25,
  },
  1009: {
    category: 'Chat',
    name: 'Chat 1',
    increaseStatus: 'empathy',
    increaseValue: 5,
    exp: 10,
  },
  1010: {
    category: 'Chat',
    name: 'Chat 2',
    increaseStatus: 'affection',
    increaseValue: 5,
    exp: 10,
  },
  1011: {
    category: 'Chat',
    name: 'Chat 3',
    increaseStatus: 'knowledge',
    increaseValue: 5,
    exp: 10,
  },
  1012: {
    category: 'Playing',
    name: 'Playing 3',
    increaseStatus: 'logic',
    increaseValue: 10,
    decreaseStatus: 'stress',
    decreaseValue: -5,
    exp: 15,
  },
};

// 액션 실행
const performAction = async (req, res) => {
  try {
    const userId = req.user.id;
    const { actionKey } = req.body;

    const action = ACTIONS_DATA[actionKey];
    if (!action) {
      return res.status(400).json({ message: '유효하지 않은 액션입니다.' });
    }

    // 현재 펫 상태 조회
    const getQuery = 'SELECT * FROM pets WHERE user_id = $1';
    const getResult = await pool.query(getQuery, [userId]);

    if (getResult.rows.length === 0) {
      return res.status(404).json({ message: '펫을 찾을 수 없습니다.' });
    }

    const pet = getResult.rows[0];

    // 스탯 업데이트
    if (action.increaseStatus) {
      pet[action.increaseStatus] = clamp(
        Number(pet[action.increaseStatus]) + Number(action.increaseValue),
      );
    }
    if (action.decreaseStatus) {
      pet[action.decreaseStatus] = clamp(
        Number(pet[action.decreaseStatus]) + Number(action.decreaseValue),
      );
    }

    // 경험치 및 레벨업 처리 로직 (간단 구현)
    pet.exp += action.exp;
    const expNeeded = pet.level * 100; // 예시로 레벨당 100의 경험치 필요라고 가정
    if (pet.exp >= expNeeded) {
      pet.level += 1;
      pet.exp -= expNeeded; // 잔여 경험치 이월
    }

    // 업데이트 쿼리
    const updateQuery = `
      UPDATE pets
      SET 
        exp = $1,
        level = $2,
        health_hp = $3,
        hunger = $4,
        cleanliness = $5,
        stress = $6,
        affection = $7,
        altruism = $8,
        empathy = $9,
        knowledge = $10,
        logic = $11
      WHERE user_id = $12
      RETURNING *;
    `;

    const values = [
      Number(pet.exp) || 0,
      Number(pet.level) || 1,
      Number(pet.health_hp) || 0,
      Number(pet.hunger) || 0,
      Number(pet.cleanliness) || 0,
      Number(pet.stress) || 0,
      Number(pet.affection) || 0,
      Number(pet.altruism) || 0,
      Number(pet.empathy) || 0,
      Number(pet.knowledge) || 0,
      Number(pet.logic) || 0,
      userId,
    ];

    const updateResult = await pool.query(updateQuery, values);

    return res
      .status(200)
      .json({ pet: updateResult.rows[0], message: '액션 수행 성공' });
  } catch (error) {
    console.error('performAction error:', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 상위 10개 펫 랭킹 조회
const getRanking = async (req, res) => {
  try {
    const query = `
      SELECT id, name, color, level, exp, user_id
      FROM pets
      ORDER BY level DESC, exp DESC
      LIMIT 10
    `;
    const result = await pool.query(query);

    return res.status(200).json({
      ranking: result.rows,
      message: '랭킹 조회 성공',
    });
  } catch (error) {
    console.error('getRanking error:', error);
    return res
      .status(500)
      .json({ message: '랭킹을 불러오는 중 오류가 발생했습니다.' });
  }
};

// 펫과 채팅 & 경험치 보상
const chatWithPet = async (req, res) => {
  try {
    const userId = req.user.id;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: '메시지를 입력해주세요.' });
    }

    // 1. 유저 펫 정보 로드
    const petQuery = 'SELECT * FROM pets WHERE user_id = $1';
    const petResult = await pool.query(petQuery, [userId]);

    if (petResult.rows.length === 0) {
      return res.status(404).json({ message: '펫을 먼저 생성해주세요.' });
    }
    const pet = petResult.rows[0];

    // 2. OpenAI API 호출
    let reply = '';
    if (
      !process.env.OPENAI_API_KEY ||
      process.env.OPENAI_API_KEY === 'your_openai_api_key_here'
    ) {
      reply = `(API 키가 없어 임시 모드로 대답할게!) 바우와우~ "${message}"라고 했어? 재미있다 멍!`;
    } else {
      const systemPrompt = `
        너는 이제 사용자의 소중한 인공지능 반려동물이야.
        이름은 '${pet.name}'이고, 성향은 '${pet.tendency}'야. (neutral, active, calm 등 다양해)
        사용자의 메시지에 대해 짧고 귀엽게 대답해줘. 이모지도 적극적으로 사용해.
        주인의 말을 잘 듣는 펫처럼 "멍", "냥" 같은 말투를 조금씩 섞어 써 줘.
        길이는 1~2문장으로 아주 짧게 대답해.
      `;

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        max_tokens: 150,
        temperature: 0.8,
      });
      reply = completion.choices[0].message.content;
    }

    // 3. 대화 시 경험치/애정도 소폭 상승 및 DB 갱신
    const updateQuery = `
      UPDATE pets
      SET 
        exp = exp + 10,
        affection = affection + 2,
        knowledge = knowledge + 1
      WHERE id = $1
      RETURNING *
    `;
    const updateResult = await pool.query(updateQuery, [pet.id]);
    const updatedPet = updateResult.rows[0];

    // 레벨업 로직 (예: 요구경험치는 100 * level 로 단순화)
    const requiredExp = updatedPet.level * 100;
    if (updatedPet.exp >= requiredExp) {
      const levelUpQuery = `
        UPDATE pets
        SET
          level = level + 1,
          exp = exp - $2,
          health_hp = 100
        WHERE id = $1
        RETURNING *
      `;
      const levelUpResult = await pool.query(levelUpQuery, [
        pet.id,
        requiredExp,
      ]);
      return res.status(200).json({ reply, pet: levelUpResult.rows[0] });
    }

    return res.status(200).json({ reply, pet: updatedPet });
  } catch (error) {
    console.error('chatWithPet error:', error);
    return res.status(500).json({ message: '대화 중 오류가 발생했습니다.' });
  }
};

module.exports = {
  getMyPet,
  createPet,
  performAction,
  getRanking,
  chatWithPet,
};
