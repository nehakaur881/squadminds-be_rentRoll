const express = require('express');
const router = express.Router();
const { forgotPassword, resetPassword, login, admin } = require('../controllers/User');
const authenticateToken = require('../middlewares/authenticateToken')



router.post('/admin', admin);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/protected', authenticateToken, (req, res) => {
    res.status(200).json({ message: "You accessed a protected route" });
});

module.exports = router;