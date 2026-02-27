const express = require("express");
const router = express.Router();
const petController = require("../controllers/petController");
const { authenticateToken } = require("../middlewares/authMiddleware");

// 펫 정보 조회
router.get("/api/pets/my", authenticateToken, petController.getMyPet);

// 랭킹 조회 (전체 펫 대상 상위 10명)
router.get("/api/pets/ranking", authenticateToken, petController.getRanking);

// 펫 생성
router.post("/api/pets", authenticateToken, petController.createPet);

module.exports = router;
