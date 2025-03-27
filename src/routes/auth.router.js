const express = require("express");
const authController = require("../controllers/auth.controller");
const authRouter = express.Router();

// 사용자 로그인
authRouter.post("/", authController.userAuthHandler);

// 토큰 유효성 검사
authRouter.get("/", authController.tokenVerifyHandler);

module.exports = authRouter;
