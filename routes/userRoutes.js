const express = require("express");
const router = express.Router();
const {
  forgotPassword,
  resetPassword,
  login,
  admin,
  logoutUser,
  addProperties,
  getProperties,
  deleteProperties,
  updateProperties,
  roomData,
  getRoomData,
  updateRoom,
  deleteRoom,
} = require("../controllers/User");
const authenticateToken = require("../middlewares/authenticateToken");

router.post("/admin", admin);
router.post("/login", login);
router.post("/forgotPassword", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/logout", logoutUser);
router.post("/addproperties", addProperties);
router.get("/getproperties", getProperties);
router.get("/protected", authenticateToken, (req, res) => {
  res.status(200).json({ message: "You accessed a protected route" });
});
router.delete("/deleteproperties/:id", deleteProperties);
router.put("/updateproperties/:id", updateProperties);
router.post("/roomdata/:propertyid", roomData);
router.get("/getRoomData", getRoomData);
router.put("/updateRoomData/:propertyid/room/:roomid" , updateRoom)
router.delete("/deleteRoom/:id", deleteRoom)
module.exports = router;
