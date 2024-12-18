const express = require("express")
const propertyController  = require("../controllers/property.controller");
const router = express.Router();
const multer = require("../middelware/multer.middelware")
const path = require("path")
// property router
router.post("/addproperties", multer.uploadPDFFile, propertyController.addProperties);
router.get("/getproperties", propertyController.getProperties);
router.put("/updateproperties/:id", multer.uploadPDFFile, propertyController.updateProperties);
router.delete("/deleteproperties/:id", propertyController.deleteProperties);

// room data

router.post("/roomdata/:propertyid" ,  multer.uploadPDFFile,  propertyController.roomData);
router.get("/getRoomdata" , propertyController.getRoomData);
router.put("updateProperties/" , multer.uploadPDFFile, propertyController.updateRoom);
router.delete("/deleteRoom/:roomid" ,  propertyController.deleteRoom);

module.exports = router;