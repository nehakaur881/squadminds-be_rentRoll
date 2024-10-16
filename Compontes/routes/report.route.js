const express = require("express");
const monthlyreport = require("../controllers/monthlyReport.controller")
const router = express.Router()

router.post("/reportgenerator/property/:propertyid/room/:roomid" , monthlyreport.monthlyreportGenerator)

module.exports = router;    