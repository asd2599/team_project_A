const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// 펫 정보 조회
router.get('/api/pets/my', authenticateToken, petController.getMyPet);

// 펫 생성
router.post('/api/pets', authenticateToken, petController.createPet);
// 펫 상태 업데이트 (액션 수행)
router.post('/api/pets/action', authenticateToken, petController.performAction);

module.exports = router;
