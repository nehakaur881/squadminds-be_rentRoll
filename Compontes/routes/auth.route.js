const express = require("express");
const authController = require("../controllers/auth.controller");
const multer = require("../middelware/multer.middelware")
const userValidtor = require("../middelware/userValiditor.middleware");
const InputFieldValidate = require("../middelware/inputFieldValiditor.middleware")
const router = express.Router();
const path = require("path")



// user router 

router.post("/submit" , userValidtor.validateEmail, InputFieldValidate , authController.registerUser);
router.post("/login" , authController.loginUser );
router.post("/forgotPassword" , authController.forgotPassword);
router.patch("/resetPassword/:token" , authController.resetPassword);
router.patch("/logout" , authController.logoutUser);
router.patch("/changepassword/:id" , authController.changePassword)
router.patch("/updateProfile/:id" , multer.uploadSingleFile ,  authController.updateProfile)
router.get("/getregisteruser" ,  authController.getregisterUser)
router.get('/uploads', express.static('uploads'));



// multer router midelware
module.exports = router;
