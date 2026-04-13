const User = require('../models/User');
const Colis = require('../models/Colis');

// Get admin dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalColis,
      totalRevenue,
      recentColis,
      usersByMonth,
      colisByStatus,
      revenueByMonth
    ] = await Promise.all([
      // Total users count
      User.countDocuments(),
      
      // Total colis count
      Colis.countDocuments(),
      
      // Total revenue
      Colis.aggregate([
        { $group: { _id: null, total: { $sum: '$prix' } } }
      ]),
      
      // Recent colis (last 10)
      Colis.find()
        .populate('createdBy', 'nom prenom email')
        .sort({ createdAt: -1 })
        .limit(10),
      
      // Users created by month (last 12 months)
      User.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(new Date().setMonth(new Date().getMonth() - 12))
            }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]),
      
      // Colis by status
      Colis.aggregate([
        {
          $group: {
            _id: '$statut',
            count: { $sum: 1 }
          }
        }
      ]),
      
      // Revenue by month (last 12 months)
      Colis.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(new Date().setMonth(new Date().getMonth() - 12))
            }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            revenue: { $sum: '$prix' },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ])
    ]);

    const stats = {
      overview: {
        totalUsers,
        totalColis,
        totalRevenue: totalRevenue[0]?.total || 0,
        averageOrderValue: totalColis > 0 ? (totalRevenue[0]?.total || 0) / totalColis : 0
      },
      recentColis,
      charts: {
        usersByMonth,
        colisByStatus,
        revenueByMonth
      }
    };

    res.json(stats);
  } catch (error) {
    console.error('Erreur récupération stats admin:', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
};

// Get all users with pagination and filtering
const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const role = req.query.role || '';

    // Build query
    const query = {};
    if (search) {
      query.$or = [
        { nom: { $regex: search, $options: 'i' } },
        { prenom: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) {
      query.role = role;
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(query)
    ]);

    res.json({
      users,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        total,
        limit
      }
    });
  } catch (error) {
    console.error('Erreur récupération utilisateurs:', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des utilisateurs',
      error: error.message
    });
  }
};

// Update user role
const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        message: 'Rôle invalide. Doit être "user" ou "admin"'
      });
    }

    // Prevent admin from removing their own admin role
    if (userId === req.user._id.toString() && role !== 'admin') {
      return res.status(400).json({
        message: 'Vous ne pouvez pas modifier votre propre rôle administrateur'
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      message: `Rôle utilisateur mis à jour vers ${role}`,
      user
    });
  } catch (error) {
    console.error('Erreur mise à jour rôle:', error);
    res.status(500).json({
      message: 'Erreur lors de la mise à jour du rôle',
      error: error.message
    });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Prevent admin from deleting themselves
    if (userId === req.user._id.toString()) {
      return res.status(400).json({
        message: 'Vous ne pouvez pas supprimer votre propre compte'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: 'Utilisateur non trouvé'
      });
    }

    // Check if user has colis
    const userColisCount = await Colis.countDocuments({ createdBy: userId });
    if (userColisCount > 0) {
      return res.status(400).json({
        message: `Impossible de supprimer l'utilisateur. Il a ${userColisCount} colis associés.`,
        suggestion: 'Transférez ou supprimez d\'abord les colis de cet utilisateur'
      });
    }

    await User.findByIdAndDelete(userId);

    res.json({
      message: 'Utilisateur supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur suppression utilisateur:', error);
    res.status(500).json({
      message: 'Erreur lors de la suppression de l\'utilisateur',
      error: error.message
    });
  }
};

// Get system information
const getSystemInfo = async (req, res) => {
  try {
    const [dbStats, recentActivity] = await Promise.all([
      // Database statistics
      Promise.all([
        User.estimatedDocumentCount(),
        Colis.estimatedDocumentCount()
      ]),
      
      // Recent activity (last 20 actions)
      Colis.find()
        .populate('createdBy', 'nom prenom')
        .sort({ createdAt: -1 })
        .limit(20)
        .select('numeroSuivi statut createdBy createdAt updatedAt')
    ]);

    const systemInfo = {
      database: {
        totalUsers: dbStats[0],
        totalColis: dbStats[1],
        collections: ['users', 'colis']
      },
      recentActivity: recentActivity.map(colis => ({
        id: colis._id,
        type: 'colis',
        action: colis.createdAt.getTime() === colis.updatedAt.getTime() ? 'created' : 'updated',
        description: `Colis ${colis.numeroSuivi} - ${colis.statut}`,
        user: colis.createdBy ? `${colis.createdBy.prenom} ${colis.createdBy.nom}` : 'Système',
        timestamp: colis.updatedAt
      })),
      server: {
        nodeVersion: process.version,
        environment: process.env.NODE_ENV || 'development',
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage()
      }
    };

    res.json(systemInfo);
  } catch (error) {
    console.error('Erreur récupération info système:', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des informations système',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  updateUserRole,
  deleteUser,
  getSystemInfo
};
