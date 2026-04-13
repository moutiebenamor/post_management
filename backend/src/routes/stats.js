const express = require('express');
const {
  getDashboardStats,
  getRevenueStats,
  getDeliveryStats
} = require('../controllers/statsController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(auth);

// @route   GET /api/stats/dashboard
// @desc    Get dashboard statistics
// @access  Private
router.get('/dashboard', getDashboardStats);

// @route   GET /api/stats/revenue
// @desc    Get revenue statistics
// @access  Private
router.get('/revenue', getRevenueStats);

// @route   GET /api/stats/delivery
// @desc    Get delivery performance statistics
// @access  Private
router.get('/delivery', getDeliveryStats);

module.exports = router;
