const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const boardPostsModel = require("../../models/board.model");
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
  const postId = req.params.id;
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
  const { subject, content, authorId } = req.body;

  try {
    const newPost = await prisma.post.create({
      data: {
        subject,
        authorId: parseInt(authorId),
        content,
      },
    });
    console.log(newPost);
    res.status(200).send({ Status: "게시글 작성 성공" });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
}

/* 게시글 수정 페이지 호출 */
async function getEditPage(req, res) {
  const postId = req.params.id;
  const postContent = await boardPostsModel.getOnePost(postId);

  res.render("pages/edit", { postContent });
}

/* 수정된 게시글 데이터 DB로 전송 */
function updateEditedData(req, res) {
  const postId = req.params.id;
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
  const postId = req.params.id;
  const deletePostReturn = await boardPostsModel.deletePost(postId);

  if (deletePostReturn == "Succeed") {
    res.status(200).send({ Status: "게시글 삭제 성공!" });
  } else {
    res.json({ Status: "Delete Failed" });
  }
}

module.exports = {
  sendAllPosts,
  sendOnePost,
  writePost,
  getEditPage,
  updateEditedData,
  getCreate,
  deletePost,
};
