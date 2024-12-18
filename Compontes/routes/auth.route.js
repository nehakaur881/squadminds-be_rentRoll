const express = require("express");
const authController = require("../controllers/auth.controller");
const multer = require("../middelware/multer.middelware")
const router = express.Router();
const path = require("path");



// user router 

router.post("/submit" ,  authController.registerUser);
router.post("/login" , authController.login );
router.post("/forgotPassword" , authController.forgotPassword);
router.put("/reset-password/:token", authController.resetPassword);
router.post("/logout" , authController.logoutUser);
router.put("/changepassword" , authController.changePassword)
// router.put("/updateProfile" , multer.uploadSingleFile ,  authController.updateProfile)
router.put("/updateProfile/:id" , multer.uploadSingleFile ,  authController.updateProfile)
router.post("/getregisteruser" ,  authController.getregisterUser)
router.get('/uploads', express.static('uploads'));



// multer router midelware
module.exports = router;
