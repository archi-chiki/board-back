const express = require("express");
const usersListController = require("../controllers/users.list.controller");
const usersListRouter = express.Router();

usersListRouter.get("/", usersListController.listUsers);

module.exports = usersListRouter;
