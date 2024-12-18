const express = require("express");
const router = express.Router();
const expensiveController = require("../controllers/expensive.controller");
const multer = require("../middelware/multer.middelware")
const path = require("path")

router.get("/expense" , expensiveController.expenseList);
router.post("/addexpense/property_id/:property_id" , multer.uploadInvoice , expensiveController.addExpenseList )
router.get("/getexpenseList", expensiveController.getExpenseList)
router.put("/update-expense-data/expense-id/:expense_id" , multer.uploadInvoice ,  expensiveController.updateExpenseList)

module.exports = router;
