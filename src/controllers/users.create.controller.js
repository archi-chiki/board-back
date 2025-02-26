const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function userCreate(req, res) {
  const { name, email } = req.body;

  try {
    const createUser = await prisma.user.create({
      data: { name, email },
    });
    res.json(createUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  userCreate,
};
