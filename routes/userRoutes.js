const express = require('express');
const router = express.Router();
const { sendotp, resetPassword, login, admin } = require('../controllers/User');



router.post('/admin', admin);
router.post('/login', login);
router.post('/sendotp', sendotp);
router.post('/reset-password', resetPassword);

module.exports = router;