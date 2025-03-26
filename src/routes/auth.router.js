const express = require("express");
const authController = require("../controllers/auth.controller");
const authRouter = express.Router();

// 사용자 로그인
authRouter.post("/", authController.userAuthHandler);

module.exports = authRouter;
