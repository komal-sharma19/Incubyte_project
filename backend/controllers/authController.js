/**
 * @file authController.js
 * @description Handles user authentication logic for the Sweet Shop Management System.
 * Includes register and login functionality with password hashing and JWT token generation.
 */

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

/**
 * @function register
 * @description Handles user registration. Checks if email exists, hashes the password,
 *              creates a new user, and returns a JWT token in an HTTP-only cookie along with user info.
 * @param {Object} req - Express request object
 * @param {Object} req.body - Should contain email, password
 * @param {Object} res - Express response object
 */
exports.register = async (req, res) => {
  const { email, password } = req.body

  try {
    const existingUser = await User.findOne({ email })
    if (existingUser)
      return res.status(400).json({ message: 'Email already exists' })

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
      email,
      password: hashedPassword,
    })

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    })

    // Set JWT in HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 3600000, // 1 hour
    })

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        email,
        role: user.role,
      },
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

/**
 * @function login
 * @description Handles user login. Validates credentials and returns JWT in an HTTP-only cookie along with user info.
 * @param {Object} req - Express request object
 * @param {Object} req.body - Should contain email and password
 * @param {Object} res - Express response object
 */
exports.login = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: 'Invalid credentials' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    })

    // Set JWT in HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 3600000, // 1 hour
    })

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        email,
        role: user.role,
      },
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

exports.logout = (req, res) => {
  res.clearCookie('token'); 
  res.json({ message: 'Logged out successfully' });
};