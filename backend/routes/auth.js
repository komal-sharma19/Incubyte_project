/**
 * @file auth.js
 * @description Defines the authentication routes for the Sweet Shop Management System.
 * Routes include user registration and login. Each route delegates logic to the corresponding controller.
 */

const express = require('express');
const { register, login } = require('../controllers/authController');

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 * @body    { username: String, email: String, password: String }
 * @returns { token: String, user: Object } - JWT token and user information
 */
router.post('/register', register);

/**
 * @route   POST /api/auth/login
 * @desc    Login an existing user
 * @access  Public
 * @body    { email: String, password: String }
 * @returns { token: String, user: Object } - JWT token and user information
 */
router.post('/login', login);

module.exports = router;
