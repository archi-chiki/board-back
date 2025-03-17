const express = require("express");
const multer = require("multer");
const boardController = require("../controllers/board.controller");
const boardRouter = express.Router();
const upload = multer();

// 게시글 리스트 호출
boardRouter.get("/", boardController.sendAllPosts);

// 글쓰기 호출
boardRouter.get("/write", boardController.getCreate);

// 댓글 데이터 조회
boardRouter.get("/:postId/comments", boardController.selectComment);

// 댓글 데이터 전송
boardRouter.post("/:postId/comments", boardController.createComment);

// 댓글 삭제
boardRouter.delete("/comments/:commentId", boardController.deleteComment);

// 댓글 수정
boardRouter.put("/comments/:commentId", boardController.updateComment);

// 게시글 상세페이지 호출
boardRouter.get("/:postId", boardController.sendOnePost);

// 첨부파일 다운로드
boardRouter.get("/download/:fileName", boardController.getAttachFiles);

// 게시글 수정페이지 호출
boardRouter.get("/edit/:postId", boardController.getEditPage);

// 수정 완료된 게시글 데이터 전송
boardRouter.post("/edit/:postId", boardController.updateEditedData);

// 게시글 데이터 전송
boardRouter.post("/write", upload.array("files"), boardController.writePost);

// 게시글 삭제
boardRouter.delete("/delete/:postId", boardController.deletePost);

module.exports = boardRouter;
