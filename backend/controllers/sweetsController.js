const Sweet = require('../models/Sweet');

/**
 * @function createSweet
 * @description Creates a new sweet and saves it to the database.
 *              Accessible only by admin users.
 * @route POST /api/sweets
 * @access Admin
 * @param {Object} req - Express request object
 * @param {Object} req.body - Sweet details (name, category, price, quantity)
 * @param {Object} res - Express response object
 * @returns {Object} - Newly created sweet
 */
exports.createSweet = async (req, res) => {
  try {
    const sweet = new Sweet(req.body);
    await sweet.save();
    res.status(201).json(sweet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * @function getAllSweets
 * @description Fetches all sweets from the database.
 *              Accessible to any logged-in user.
 * @route GET /api/sweets
 * @access User/Admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Array} - List of sweets
 */
exports.getAllSweets = async (req, res) => {
  try {
    const sweets = await Sweet.find();
    res.json(sweets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @function updateSweet
 * @description Updates an existing sweet by ID.
 *              Accessible only by admin users.
 * @route PUT /api/sweets/:id
 * @access Admin
 * @param {Object} req - Express request object
 * @param {Object} req.params - Contains sweet ID
 * @param {Object} req.body - Sweet fields to update
 * @param {Object} res - Express response object
 * @returns {Object} - Updated sweet
 */
exports.updateSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(sweet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * @function deleteSweet
 * @description Deletes a sweet by ID.
 *              Accessible only by admin users.
 * @route DELETE /api/sweets/:id
 * @access Admin
 * @param {Object} req - Express request object
 * @param {Object} req.params - Contains sweet ID
 * @param {Object} res - Express response object
 * @returns {Object} - Confirmation message
 */
exports.deleteSweet = async (req, res) => {
  try {
    await Sweet.findByIdAndDelete(req.params.id);
    res.json({ message: 'Sweet deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * @function searchSweets
 * @description Searches sweets by filters like name, category, price range.
 *              Accessible to any logged-in user.
 * @route GET /api/sweets/search
 * @access User/Admin
 * @param {Object} req - Express request object
 * @param {Object} req.query - Search filters (name, category, minPrice, maxPrice)
 * @param {Object} res - Express response object
 * @returns {Array} - List of matching sweets
 */
exports.searchSweets = async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;

    const filter = {};

    if (name) filter.name = { $regex: name, $options: 'i' }; // case-insensitive partial match
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const sweets = await Sweet.find(filter);
    res.json(sweets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @function purchaseSweet
 * @description Handles purchase of a sweet. Decreases quantity by 1 if in stock.
 *              Accessible to any logged-in user.
 * @route POST /api/sweets/:id/purchase
 * @access User/Admin
 * @param {Object} req - Express request object
 * @param {Object} req.params - Contains sweet ID
 * @param {Object} res - Express response object
 * @returns {Object} - Confirmation message and updated sweet info
 */
exports.purchaseSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) return res.status(404).json({ error: 'Sweet not found' });

    if (sweet.quantity <= 0) {
      return res.status(400).json({ error: 'Sweet is out of stock' });
    }

    sweet.quantity -= 1; // decrease quantity by 1
    await sweet.save();

    res.json({
      message: 'Purchase successful',
      sweet: {
        id: sweet._id,
        name: sweet.name,
        remainingQuantity: sweet.quantity
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @function restockSweet
 * @description Restocks a sweet by increasing its quantity.
 *              Accessible only by admin users.
 * @route POST /api/sweets/:id/restock
 * @access Admin
 * @param {Object} req - Express request object
 * @param {Object} req.params - Contains sweet ID
 * @param {Object} req.body - { quantity: Number }
 * @param {Object} res - Express response object
 * @returns {Object} - Confirmation message and updated sweet info
 */
exports.restockSweet = async (req, res) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be greater than zero' });
    }

    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    sweet.quantity += quantity;
    await sweet.save();

    res.json({
      message: 'Sweet restocked successfully',
      id: sweet._id,
      name: sweet.name,
      newQuantity: sweet.quantity,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
