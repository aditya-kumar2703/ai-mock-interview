const express = require('express');
const { body } = require('express-validator');
const { registerUser, authUser } = require('../controllers/authController');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

router.post(
  '/register',
  [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  validate,
  registerUser
);

router.post(
  '/login',
  [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists(),
  ],
  validate,
  authUser
);

module.exports = router;
