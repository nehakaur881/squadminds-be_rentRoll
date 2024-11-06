const express = require("express");
const router = express.Router();
const multer = require("../middelware/multer.middelware")
const expensiveController = require("../controllers/expensive.controller");

router.get("/expense" , expensiveController.expenseList);
router.post("/addexpense/:room_id" , multer.uploadSingleFile , expensiveController.addExpenseList )

module.exports = router;
