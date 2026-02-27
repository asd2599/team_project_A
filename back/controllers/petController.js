const { pool } = require('../database/database');

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

module.exports = {
  getMyPet,
  createPet,
  performAction,
};
