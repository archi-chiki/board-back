const express = require("express");
const usersController = require("../controllers/users.controller");
const usersRouter = express.Router();

// 사용자 추가
usersRouter.post("/", usersController.userCreate);

// 사용자 리스트 조회
usersRouter.get("/list", usersController.listUsers);

// 사용자 삭제
usersRouter.delete("/:id", usersController.userDelete);

module.exports = usersRouter;
