const Sweet = require('../models/Sweet');

// Create a sweet
exports.createSweet = async (req, res) => {
  try {
    const sweet = new Sweet(req.body);
    await sweet.save();
    res.status(201).json(sweet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all sweets
exports.getAllSweets = async (req, res) => {
  try {
    const sweets = await Sweet.find();
    res.json(sweets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update sweet
exports.updateSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(sweet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete sweet
exports.deleteSweet = async (req, res) => {
  try {
    await Sweet.findByIdAndDelete(req.params.id);
    res.json({ message: 'Sweet deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Search sweets
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

// Purchase a sweet (any logged-in user)
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
