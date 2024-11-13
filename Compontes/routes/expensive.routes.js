const express = require("express");
const router = express.Router();
const expensiveController = require("../controllers/expensive.controller");

router.get("/expense" , expensiveController.expenseList);
router.post("/addexpense/:room_id" , expensiveController.addExpenseList )
router.get("/getexpenseList", expensiveController.getExpenseList)
module.exports = router;
