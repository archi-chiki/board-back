const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

// 사용자 추가
async function userCreate(req, res) {
  const { name, email, user_id, user_password } = req.body;
  const hashedPassword = await bcrypt.hash(user_password, 10);

  try {
    const createUser = await prisma.user.create({
      data: { name, email, user_id, user_password: hashedPassword },
    });
    res.json(createUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// 사용자 조회
async function listUsers(req, res) {
  const users = await prisma.user.findMany();
  res.status(200).json(users);
}

// 사용자 삭제
async function userDelete(req, res) {
  const { id } = req.params;
  try {
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  userCreate,
  listUsers,
  userDelete,
};
