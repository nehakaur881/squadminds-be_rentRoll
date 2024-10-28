const express = require("express");
const router = express.Router();
const cleaningControler = require("../controllers/cleaner.controller")


router.post("/cleaningdata/:reserveroom_id" , cleaningControler.cleaningdata);
router.get("/getcleaningdata" , cleaningControler.getCleaningdata)

module.exports = router;