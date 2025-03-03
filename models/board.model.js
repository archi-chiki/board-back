const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/* 게시글 목록 데이터 */
async function getAllPosts(page) {
  const offset = (page - 1) * 10;
  try {
    const [posts, totalCount] = await prisma.$transaction([
      prisma.post.findMany({
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
        take: 10, // 가져올 데이터 개수
        skip: offset,
      }),
      prisma.post.count(),
    ]);

    // 총 페이지 수 계산
    const totalPages = Math.ceil(totalCount / 10);

    // 다음 페이지를 위한 endCursor 계산
    const endCursor = posts.length > 0 ? posts[posts.length - 1].id : null;

    return {
      posts,
      pageInfo: {
        totalCount, // 전체 데이터 개수
        totalPages, // 총 페이지 수
        // hasNextPage: posts.length === 10, // 다음 페이지 여부
        endCursor, // 다음 요청에서 사용할 커서
      },
    };
  } catch (error) {
    console.error("Error fetching paginated posts:", error);
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

/* 단일 게시글 수정 */
async function updateEditedData(postId, editedSubject, editedContent) {
  console.log(postId, editedSubject, editedContent);

  try {
    await prisma.post.updateMany({
      where: {
        id: parseInt(postId),
      },
      data: {
        subject: editedSubject,
        content: editedContent,
      },
    });
    return "Success"; // 데이터 뭐를 줘야하는거임..?
  } catch (error) {
    console.log("Error in updatePost:", error.message);
  }
}

/* 단일 게시글 삭제 */
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
