const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authModel = require("../../models/auth.model");

// 로그인 처리 컨트롤러
async function userAuthHandler(req, res) {
  const { id, password } = req.body;
  // User 스키마 개박살나서 한 번 정리해야함..ㅠ(user_id를 findUnique로 검색할 수 있도록 변경해야함)
  try {
    const user = await authModel.verifyUser(id);

    if (!user) {
      console.log("유저 조회 결과임:", user);
      return res.status(400).json({ error: "유저를 찾을 수 없습니다." });
    }

    const isMatch = await bcrypt.compare(password, user.user_password);
    if (!isMatch) {
      console.log("패스워드 대조 결과임: ", isMatch);
      return res.status(401).json({ error: "패스워드가 잘못됨 휴먼" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "2m" });
    return res.status(200).json({ token: token });
  } catch (error) {
    return res.status(500).json({ error: "서버에러임", detail: error.message });
  }
}

// 토큰 유효성 검사 컨트롤러
function tokenVerifyHandler(req, res) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "토큰이 존재하지 않음" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ message: "토큰이 유효함", token: decoded });
  } catch (error) {
    return res.status(403).json({ error: "유효하지 않은 토큰임" });
  }
}

module.exports = { userAuthHandler, tokenVerifyHandler };
