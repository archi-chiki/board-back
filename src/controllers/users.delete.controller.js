const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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
  userDelete,
};
