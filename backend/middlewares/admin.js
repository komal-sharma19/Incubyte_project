/**
 * @file admin.js
 * @description Middleware to restrict access to admin users only.
 *              Checks the authenticated user's role and denies access if not admin.
 */

/**
 * @function admin
 * @description Middleware function to allow only users with role 'admin'.
 *              Should be used after authentication middleware (req.user must exist).
 * @param {Object} req - Express request object (expects req.user from auth middleware)
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 * @returns {void|Object} Calls next() if user is admin, otherwise sends 403 response
 */
const admin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }
  next();
};

module.exports = admin;
