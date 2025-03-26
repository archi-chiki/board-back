const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const PORT = process.env.PORT || 9000;
const boardRouter = require("./src/routes/board.router");
const usersRouter = require("./src/routes/users.router");
const authRouter = require("./src/routes/auth.router");

// CORS 설정
app.use(
  cors({
    origin: "*",
  }),
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));
app.use(express.static("public"));

// 인증 관련 기능
app.use("/auth", authRouter);

// 사용자 관련 기능
app.use("/users", usersRouter);

// 게시판 관련 기능
app.use("/board", boardRouter);

async function startServer() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully!");

    // 서버 시작
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error.message);
    process.exit(1);
  }
}

// 데이터베이스 연결 확인 및 서버 시작
startServer();
