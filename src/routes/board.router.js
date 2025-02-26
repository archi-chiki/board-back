const express = require("express");
const boardController = require("../controllers/board.controller");
const boardRouter = express.Router();

// 게시글 리스트 호출
boardRouter.get("/", boardController.sendAllPosts);
// 글쓰기 호출
boardRouter.get("/write", boardController.getCreate);
// 게시글 상세페이지 호출
boardRouter.get("/:id", boardController.sendOnePost);
// 게시글 수정페이지 호출
boardRouter.get("/edit/:id", boardController.getEditPage);
// 수정 완료된 게시글 데이터 전송
boardRouter.post("/edit/:id", boardController.updateEditedData);
// 게시글 데이터 전송
boardRouter.post("/write", boardController.writePost);
// 게시글 삭제
boardRouter.delete("/delete/:id", boardController.deletePost);

module.exports = boardRouter;
