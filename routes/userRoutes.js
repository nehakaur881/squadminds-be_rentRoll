const express = require('express');
const router = express.Router();
const { forgotPassword, resetPassword, login, admin, roomData , getRoomData } = require('../controllers/User');
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


module.exports = router;