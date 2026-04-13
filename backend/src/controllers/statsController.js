const Colis = require('../models/Colis');

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.role === 'admin' ? null : req.user._id;
    const query = userId ? { createdBy: userId } : {};

    // Total colis
    const totalColis = await Colis.countDocuments(query);

    // Colis by status
    const colisByStatus = await Colis.aggregate([
      ...(userId ? [{ $match: { createdBy: userId } }] : []),
      {
        $group: {
          _id: '$statut',
          count: { $sum: 1 }
        }
      }
    ]);

    // Colis by priority
    const colisByPriority = await Colis.aggregate([
      ...(userId ? [{ $match: { createdBy: userId } }] : []),
      {
        $group: {
          _id: '$priorite',
          count: { $sum: 1 }
        }
      }
    ]);

    // Monthly statistics (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyStats = await Colis.aggregate([
      ...(userId ? [{ $match: { createdBy: userId } }] : []),
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          totalRevenue: { $sum: '$prix' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Recent colis (last 5)
    const recentColis = await Colis.find(query)
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('createdBy', 'nom prenom');

    // Total revenue
    const revenueResult = await Colis.aggregate([
      ...(userId ? [{ $match: { createdBy: userId } }] : []),
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$prix' },
          averagePrice: { $avg: '$prix' }
        }
      }
    ]);

    const revenue = revenueResult[0] || { totalRevenue: 0, averagePrice: 0 };

    res.json({
      totalColis,
      colisByStatus: colisByStatus.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      colisByPriority: colisByPriority.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      monthlyStats,
      recentColis,
      totalRevenue: revenue.totalRevenue,
      averagePrice: revenue.averagePrice
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message 
    });
  }
};

// Get revenue statistics
const getRevenueStats = async (req, res) => {
  try {
    const userId = req.user.role === 'admin' ? null : req.user._id;
    const query = userId ? { createdBy: userId } : {};

    // Daily revenue for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyRevenue = await Colis.aggregate([
      ...(userId ? [{ $match: { createdBy: userId } }] : []),
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          revenue: { $sum: '$prix' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    res.json({ dailyRevenue });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des statistiques de revenus',
      error: error.message 
    });
  }
};

// Get delivery performance stats
const getDeliveryStats = async (req, res) => {
  try {
    const userId = req.user.role === 'admin' ? null : req.user._id;
    const query = userId ? { createdBy: userId } : {};

    // On-time delivery rate
    const deliveryPerformance = await Colis.aggregate([
      ...(userId ? [{ $match: { createdBy: userId } }] : []),
      {
        $match: {
          statut: 'livre',
          dateLivraisonReelle: { $exists: true }
        }
      },
      {
        $project: {
          onTime: {
            $cond: [
              { $lte: ['$dateLivraisonReelle', '$dateLivraisonPrevue'] },
              1,
              0
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          totalDelivered: { $sum: 1 },
          onTimeDeliveries: { $sum: '$onTime' }
        }
      }
    ]);

    const performance = deliveryPerformance[0] || { totalDelivered: 0, onTimeDeliveries: 0 };
    const onTimeRate = performance.totalDelivered > 0 
      ? (performance.onTimeDeliveries / performance.totalDelivered) * 100 
      : 0;

    res.json({
      totalDelivered: performance.totalDelivered,
      onTimeDeliveries: performance.onTimeDeliveries,
      onTimeRate: Math.round(onTimeRate * 100) / 100
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des statistiques de livraison',
      error: error.message 
    });
  }
};

module.exports = {
  getDashboardStats,
  getRevenueStats,
  getDeliveryStats
};
