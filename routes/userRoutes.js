const express = require('express');
const router = express.Router();
const { forgotPassword, resetPassword, login, admin, roomData , getRoomData , updateRoom , deleteRoom} = require('../controllers/User');
const authenticateToken = require('../middlewares/authenticateToken')



router.post('/admin', admin);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/protected', authenticateToken, (req, res) => {
    res.status(200).json({ message: "You accessed a protected route" });
});

// property data router
router.post('/roomdata/:propertyid' ,  roomData)
router.get('/getRoomData' , getRoomData)
router.patch("/updateRoomData/:propertyid/room/:roomid" , updateRoom)
router.delete("/deleteRoom/:roomid" , deleteRoom)


module.exports = router;