const express = require("express");
const usersCreateController = require("../controllers/users.create.controller");
const usersCreateRouter = express.Router();

usersCreateRouter.post("/", usersCreateController.userCreate);

module.exports = usersCreateRouter;
