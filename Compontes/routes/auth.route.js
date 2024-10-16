const express = require("express");
const authController = require("../controllers/auth.controller");
const InputFieldValidate = require("../middelware/inputFieldValiditor.middleware")
const {signupValidationRules , loginVAlidationRules } = require("../middelware/inputFieldValiditor.middleware")
const router = express.Router();



// user router 
router.post("/submit" ,   authController.registerUser);
router.patch("/login" ,   authController.loginUser );
router.post("/forgotPassword" , authController.forgotPassword);
router.patch("/resetPassword/:token" , authController.resetPassword);
router.patch("/logout" , authController.logoutUser)


module.exports = router;