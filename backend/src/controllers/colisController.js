const Colis = require('../models/Colis');

// Get all colis
const getColis = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const query = req.user.role === 'admin' ? {} : { createdBy: req.user._id };
    
    const colis = await Colis.find(query)
      .populate('createdBy', 'nom prenom email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Colis.countDocuments(query);

    res.json({
      colis,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des colis',
      error: error.message 
    });
  }
};

// Get single colis
const getColisById = async (req, res) => {
  try {
    const colis = await Colis.findById(req.params.id)
      .populate('createdBy', 'nom prenom email');

    if (!colis) {
      return res.status(404).json({ message: 'Colis non trouvé' });
    }

    // Check if user owns the colis or is admin
    if (req.user.role !== 'admin' && colis.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    res.json(colis);
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de la récupération du colis',
      error: error.message 
    });
  }
};

// Get colis by tracking number
const getColisByTracking = async (req, res) => {
  try {
    const colis = await Colis.findOne({ numeroSuivi: req.params.trackingNumber })
      .populate('createdBy', 'nom prenom email');

    if (!colis) {
      return res.status(404).json({ message: 'Colis non trouvé avec ce numéro de suivi' });
    }

    res.json(colis);
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de la recherche du colis',
      error: error.message 
    });
  }
};

// Create new colis
const createColis = async (req, res) => {
  try {
    const colisData = {
      ...req.body,
      createdBy: req.user._id
    };

    const colis = new Colis(colisData);
    await colis.save();

    const populatedColis = await Colis.findById(colis._id)
      .populate('createdBy', 'nom prenom email');

    res.status(201).json({
      message: 'Colis créé avec succès',
      colis: populatedColis
    });
  } catch (error) {
    console.error('Erreur création colis:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Erreur de validation',
        error: validationErrors.join(', ')
      });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Un colis avec ce numéro de suivi existe déjà',
        error: 'Numéro de suivi en double'
      });
    }
    
    res.status(400).json({ 
      message: 'Erreur lors de la création du colis',
      error: error.message 
    });
  }
};

// Update colis
const updateColis = async (req, res) => {
  try {
    const colis = await Colis.findById(req.params.id);

    if (!colis) {
      return res.status(404).json({ message: 'Colis non trouvé' });
    }

    // Check if user owns the colis or is admin
    if (req.user.role !== 'admin' && colis.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const updatedColis = await Colis.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'nom prenom email');

    res.json({
      message: 'Colis mis à jour avec succès',
      colis: updatedColis
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Erreur lors de la mise à jour du colis',
      error: error.message 
    });
  }
};

// Delete colis
const deleteColis = async (req, res) => {
  try {
    const colis = await Colis.findById(req.params.id);

    if (!colis) {
      return res.status(404).json({ message: 'Colis non trouvé' });
    }

    // Check if user owns the colis or is admin
    if (req.user.role !== 'admin' && colis.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    await Colis.findByIdAndDelete(req.params.id);

    res.json({ message: 'Colis supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de la suppression du colis',
      error: error.message 
    });
  }
};

module.exports = {
  getColis,
  getColisById,
  getColisByTracking,
  createColis,
  updateColis,
  deleteColis
};
