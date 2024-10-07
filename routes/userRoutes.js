const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken')
const { forgotPassword,
    resetPassword,
    login,
    admin,
    addProperties,getProperties } = require('../controllers/User');



router.post('/admin', admin);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/addproperties', addProperties);
router.get('/getproperties', getProperties);

router.get('/protected', authenticateToken, (req, res) => {
    res.status(200).json({ message: "You accessed a protected route" });
});

module.exports = router;