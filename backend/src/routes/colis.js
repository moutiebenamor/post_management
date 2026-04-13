const express = require('express');
const {
  getColis,
  getColisById,
  getColisByTracking,
  createColis,
  updateColis,
  deleteColis
} = require('../controllers/colisController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(auth);

// @route   GET /api/colis
// @desc    Get all colis (with pagination)
// @access  Private
router.get('/', getColis);

// @route   GET /api/colis/track/:trackingNumber
// @desc    Get colis by tracking number
// @access  Private
router.get('/track/:trackingNumber', getColisByTracking);

// @route   GET /api/colis/:id
// @desc    Get single colis
// @access  Private
router.get('/:id', getColisById);

// @route   POST /api/colis
// @desc    Create new colis
// @access  Private
router.post('/', createColis);

// @route   PUT /api/colis/:id
// @desc    Update colis
// @access  Private
router.put('/:id', updateColis);

// @route   DELETE /api/colis/:id
// @desc    Delete colis
// @access  Private
router.delete('/:id', deleteColis);

module.exports = router;
