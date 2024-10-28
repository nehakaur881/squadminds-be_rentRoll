const { body, validationResult } = require("express-validator");

const  validateEmail = () => {
  return body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Check your email")
    .normalizeEmail();
};

const validatePassword = () => {
  return body("password")
    .trim()
    .notEmpty()
    .withMessage("Password must be required")
    .isLength({ min: 8 })
    .withMessage("Password must contain Eight Character")
    .matches(/[A-Z]/)
    .withMessage("Password must contain Uppercase Alphabet")
    .matches(/[a-z]/)
    .withMessage("Password Must Contain lowercase Alphabet")
    .matches(/[0-9]/)
    .withMessage("Password must contain Number")
    .matches(/[!~`@#$%^&*()_+=-{[{}|"':;?/>.<,]/)
    .withMessage("Password Must Contain Special Symbol");
};

const signupValidationRules = () => {
  return [
    body("firstname")
      .trim()
      .notEmpty()
      .withMessage("firstname must required")
      .isLength({ max: 30, min: 2 })
      .withMessage("firstname should be between 2 to 30 char"),

    body("lastname")
      .trim()
      .notEmpty()
      .withMessage("Last name is required")
      .isLength({ max: 50 })
      .withMessage("Last name must be at most 50 characters"),
    validateEmail(),
    validatePassword(),
  ];
};

const loginVAlidationRules = () => {
  return [validateEmail(), validatePassword()];
};

module.exports = { validateEmail , signupValidationRules, loginVAlidationRules };
