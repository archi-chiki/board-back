const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function userAuthHandler(req, res) {
  const { id, password } = req.body;

  // User 스키마 개박살나서 한 번 정리해야함..ㅠ(user_id를 findUnique로 검색할 수 있도록 변경해야함)
  try {
    const user = await prisma.user.findFirst({
      where: { user_id: id },
    });

    if (!user) {
      return res.status(200).json({ error: "유저를 찾을 수 없습니다." });
    }

    if (user.user_password !== password) {
      return res.status(401).json({ error: "패스워드가 잘못됨 휴먼" });
    }

    return res.status(200).json({ message: "success" });
  } catch (error) {
    return res.status(500).json({ error: "서버에러임", detail: error.message });
  }
}

module.exports = { userAuthHandler };
