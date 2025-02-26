const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const boardPostsModel = require("../../models/board.model");
require("dotenv").config({ path: "../../.env" });

/* 게시글 목록 조회 */
async function sendAllPosts(req, res) {
  try {
    const postData = await boardPostsModel.getAllPosts();
    console.log(postData);

    res.json(postData);
  } catch (e) {
    console.error("Error....!:", e);
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

    res.redirect("/board");
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
  const editedData = req.body;

  boardPostsModel.updateEditedData(postId, editedData);

  res.redirect(`/board/${postId}`);
}

/* 게시글 삭제 */
async function deletePost(req, res) {
  const postId = req.params.id;
  const deletePostReturn = await boardPostsModel.deletePost(postId);

  if (deletePostReturn == "Succeed") {
    res.redirect("/board");
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
