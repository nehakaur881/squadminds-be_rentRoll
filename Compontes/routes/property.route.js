const express = require("express")
const propertyController  = require("../controllers/property.controller");
const router = express.Router();

// property router
router.post("/addproperties", propertyController.addProperties);
router.get("/getproperties", propertyController.getProperties);
router.put("/updateproperties/:id", propertyController.updateProperties);
router.delete("/deleteproperties/:id", propertyController.deleteProperties);
// room data
router.post("/roomdata/:propertyid" , propertyController.roomData);
router.get("/getRoomdata" , propertyController.getRoomData);
router.patch("/updateRoomData/:propertyid/room/:roomid" , propertyController.updateRoom);
router.delete("/deleteRoom/:roomid" ,  propertyController.deleteRoom);

module.exports = router;