const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');
const {
  getDashboardStats,
  getUsers,
  updateUserRole,
  deleteUser,
  getSystemInfo
} = require('../controllers/adminController');

// All admin routes require admin authentication
router.use(adminAuth);

// Dashboard statistics
router.get('/dashboard/stats', getDashboardStats);

// User management
router.get('/users', getUsers);
router.put('/users/:userId/role', updateUserRole);
router.delete('/users/:userId', deleteUser);

// System information
router.get('/system/info', getSystemInfo);

module.exports = router;
