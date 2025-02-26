const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function listUsers(req, res) {
  const users = await prisma.user.findMany();
  res.status(200).json(users);
}

module.exports = {
  listUsers,
};
