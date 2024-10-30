const express = require("express");
const router = express.Router();
const expensiveController = require("../controllers/expensive.controller");



router.get("/expense" , expensiveController.expenseList);


module.exports = router;
