/**
 * @file sweetRoutes.js
 * @description Defines all routes for managing sweets in the Sweet Shop Management System.
 *              Includes CRUD operations, search, purchase, and restock functionality.
 */

const express = require('express');
const router = express.Router();
const sweetController = require('../controllers/sweetsController');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

/**
 * @route   POST /api/sweets
 * @desc    Create a new sweet
 * @access  Admin only
 */
router.post('/', auth, admin, sweetController.createSweet);

/**
 * @route   GET /api/sweets
 * @desc    Retrieve all sweets
 * @access  Any logged-in user
 */
router.get('/', auth, sweetController.getAllSweets);

/**
 * @route   PUT /api/sweets/:id
 * @desc    Update sweet details by ID
 * @access  Admin only
 */
router.put('/:id', auth, admin, sweetController.updateSweet);

/**
 * @route   DELETE /api/sweets/:id
 * @desc    Delete sweet by ID
 * @access  Admin only
 */
router.delete('/:id', auth, admin, sweetController.deleteSweet);

/**
 * @route   GET /api/sweets/search
 * @desc    Search sweets by name, category, or price range
 * @access  Any logged-in user
 */
router.get('/search', auth, sweetController.searchSweets);

/**
 * @route   POST /api/sweets/:id/purchase
 * @desc    Purchase a sweet (decrease quantity by 1)
 * @access  Any logged-in user
 */
router.post('/:id/purchase', auth, sweetController.purchaseSweet);

/**
 * @route   POST /api/sweets/:id/restock
 * @desc    Restock a sweet (increase quantity)
 * @access  Admin only
 */
router.post('/:id/restock', auth, admin, sweetController.restockSweet);

module.exports = router;
