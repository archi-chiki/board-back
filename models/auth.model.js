const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/* 로그인 사용자 조회 */
async function verifyUser(recv_id) {
  const id = recv_id;

  const result = await prisma.user.findFirst({
    where: { user_id: id },
  });

  return result;
}

module.exports = {
  verifyUser,
};
