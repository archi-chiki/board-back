const express = require("express");
const usersDeleteController = require("../controllers/users.delete.controller");
const usersDeleteRouter = express.Router();

usersDeleteRouter.delete("/:id", usersDeleteController.userDelete);

module.exports = usersDeleteRouter;
