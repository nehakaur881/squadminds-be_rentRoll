const express = require("express");
const router = express.Router();
const cleaningControler = require("../controllers/cleaner.controller");


router.post("/cleaningdata" , cleaningControler.cleaningdata);
router.get("/getcleaningdata" , cleaningControler.getCleaningdata)
router.get("/getcleanerData", cleaningControler.getcleanerData)
router.put("/updateCleaningData/:cleaningId", cleaningControler.updateCleaningData)
router.delete("/deletecleaning/cleaningid/:cleaning_id" , cleaningControler.deleteCleaningData)
module.exports = router;
