const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/* 게시글 목록 데이터 */
async function getAllPosts() {
  try {
    const postData = await prisma.post.findMany({
      select: {
        id: true,
        subject: true,
        createdAt: true,
        content: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    return postData;
  } catch (error) {
    console.error("Error fetching posts:", error);
  } finally {
    await prisma.$disconnect();
  }
}

/* 단일 게시글 내용 조회 */
async function getOnePost(postId) {
  try {
    const postData = await prisma.post.findMany({
      where: {
        id: parseInt(postId),
      },
      select: {
        id: true,
        subject: true,
        createdAt: true,
        content: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });
    return postData;
  } catch (error) {
    console.error("Error fetching posts:", error);
  } finally {
    await prisma.$disconnect();
  }
}

/* 단일 게시글 내용 조회 */
async function updateEditedData(postId, editedData) {
  console.log(editedData);

  try {
    await prisma.post.updateMany({
      where: {
        id: parseInt(postId),
      },
      data: {
        subject: editedData.subject,
        content: editedData.content,
      },
    });
    return "Success"; // 데이터 뭐를 줘야하는거임..?
  } catch (error) {
    console.log("Error in updatePost:", error.message);
  }
}

async function deletePost(postId) {
  await prisma.post.delete({
    where: {
      id: parseInt(postId),
    },
  });
  return "Succeed";
}

module.exports = {
  getAllPosts,
  getOnePost,
  updateEditedData,
  deletePost,
};
