const { PrismaClient } = require("@prisma/client");
const boardPostsModel = require("../../models/board.model");
const path = require("path");
const fs = require("fs");
const prisma = new PrismaClient();
require("dotenv").config({ path: "../../.env" });

/* 게시글 목록 조회 */
async function sendAllPosts(req, res) {
  const page = parseInt(req.query.page);

  if (Object.keys(req.query).length === 0) {
    return res.status(400).send({ Error: "페이지 값이 비어있음" });
  } else {
    try {
      const postData = await boardPostsModel.getAllPosts(page);

      console.log(postData);
      return res.json(postData);
    } catch (e) {
      console.error("Error....!:", e);
    }
  }
}

/* 게시글 내용 조회 */
async function sendOnePost(req, res) {
  const postId = req.params.postId;
  const postContent = await boardPostsModel.getOnePost(postId);
  console.log(postContent);

  res.json(postContent);
}

/* 글작성 페이지 호출 */
function getCreate(req, res) {
  res.render("pages/write");
}

/* 게시글 작성 */
async function writePost(req, res) {
  try {
    // 클라이언트에서 전송된 데이터
    const { subject, content, authorId = 1 } = req.body;
    const files = req.files;

    // 업로드된 파일 저장 경로
    const uploadDir = path.join(__dirname, "../uploads");

    // 디렉토리가 없으면 생성
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 게시글 데이터베이스에 저장
    const post = await prisma.post.create({
      data: {
        subject,
        content,
        authorId,
      },
    });

    // 파일 저장 로직
    const savedFiles = [];
    for (const file of files) {
      const uniqueFilename = `${Date.now()}-${file.originalname}`; // 고유한 파일 이름 생성
      const filePath = path.join(uploadDir, uniqueFilename);

      // 파일 저장
      fs.writeFileSync(filePath, file.buffer);

      // 저장된 파일 정보 기록
      const savedFile = await prisma.file.create({
        data: {
          fileName: uniqueFilename,
          filePath,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          postId: post.id, // 게시글과 연결
        },
      });

      savedFiles.push(savedFile);
    }

    console.log("폼 데이터:", { subject, content });
    console.log("저장된 파일:", savedFiles);

    // 응답 반환
    res.status(200).json({
      message: "게시글과 파일이 성공적으로 업로드되었습니다!",
      data: {
        post,
        files: savedFiles,
      },
    });
  } catch (error) {
    console.error("파일 저장 중 오류 발생:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
}

/* 첨부파일 다운로드 */
async function getAttachFiles(req, res) {
  // 서버에서 UUID 지정하게끔 바꾸셈
  const fileName = req.params.fileName;
  console.log(fileName);
  const filePath = path.join(__dirname, "../uploads", fileName);

  // 이거 걷어내야됨 휴먼;
  res.download(filePath, fileName, (err) => {
    if (err) {
      console.log("Error:", err);
      res.status(500).send({ Status: "파일 다운로드 실패" });
    }
  });
}

/* 게시글 수정 페이지 호출 */
async function getEditPage(req, res) {
  const postId = req.params.postId;
  const postContent = await boardPostsModel.getOnePost(postId);

  res.render("pages/edit", { postContent });
}

/* 수정된 게시글 데이터 DB로 전송 */
function updateEditedData(req, res) {
  const postId = req.params.postId;
  const editedSubject = req.body.subject;
  const editedContent = req.body.content;
  const editedTime = req.body.createdAt;
  const authorName = req.body.name;

  boardPostsModel.updateEditedData(postId, editedSubject, editedContent);
  console.log(
    "+++++++++++",
    postId,
    editedSubject,
    editedContent,
    editedTime,
    authorName,
    "+++++++++++"
  );

  res.status(200).json({
    id: postId,
    author: {
      name: authorName,
    },
    createdAt: editedTime,
    subject: editedSubject,
    content: editedContent,
    message: "Post updated successfully",
  });
}

/* 게시글 삭제 */
async function deletePost(req, res) {
  const postId = req.params.postId;
  const deletePostReturn = await boardPostsModel.deletePost(postId);

  if (deletePostReturn == "Succeed") {
    res.status(200).send({ postId: postId, status: "Succeeded post delete" });
  } else {
    res.json({ Status: "Delete Failed" });
  }
}

/* 댓글 작성 */
async function createComment(req, res) {
  const postId = req.params.postId;
  const { content, authorId = 2 } = req.body;
  const commentData = await boardPostsModel.createComment(
    postId,
    authorId,
    content
  );

  // 검증용
  console.log(commentData);

  res.status(200).send(commentData);
}

/* 댓글 조회 */
async function selectComment(req, res) {
  const postId = req.params.postId;
  const commentData = await boardPostsModel.selectComment(postId);

  // 검증용
  console.log(commentData);

  res.json(commentData);
}

/* 댓글 수정 */
async function updateComment(req, res) {
  const { commentId, content } = req.body;
  const updatedComment = await boardPostsModel.updateComment(
    commentId,
    content
  );

  // 검증용
  console.log(updatedComment);

  res.status(200).send(updatedComment);
}

/* 댓글 삭제 */
async function deleteComment(req, res) {
  const commentId = req.params.commentId;
  const deleteRes = await boardPostsModel.deleteComment(commentId);

  res.json(deleteRes);
}

module.exports = {
  sendAllPosts,
  sendOnePost,
  writePost,
  getEditPage,
  getAttachFiles,
  updateEditedData,
  getCreate,
  deletePost,
  createComment,
  selectComment,
  updateComment,
  deleteComment,
};
