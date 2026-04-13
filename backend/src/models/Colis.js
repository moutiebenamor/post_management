const mongoose = require('mongoose');

const colisSchema = new mongoose.Schema({
  numeroSuivi: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  expediteur: {
    nom: {
      type: String,
      required: [true, 'Le nom de l\'expéditeur est requis'],
      trim: true
    },
    adresse: {
      type: String,
      required: [true, 'L\'adresse de l\'expéditeur est requise'],
      trim: true
    },
    telephone: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    }
  },
  destinataire: {
    nom: {
      type: String,
      required: [true, 'Le nom du destinataire est requis'],
      trim: true
    },
    adresse: {
      type: String,
      required: [true, 'L\'adresse du destinataire est requise'],
      trim: true
    },
    telephone: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    }
  },
  description: {
    type: String,
    required: [true, 'La description du colis est requise'],
    trim: true
  },
  poids: {
    type: Number,
    required: [true, 'Le poids est requis'],
    min: [0, 'Le poids doit être positif']
  },
  dimensions: {
    longueur: {
      type: Number,
      required: true,
      min: 0
    },
    largeur: {
      type: Number,
      required: true,
      min: 0
    },
    hauteur: {
      type: Number,
      required: true,
      min: 0
    }
  },
  statut: {
    type: String,
    enum: ['en_attente', 'en_transit', 'en_distribution', 'livre', 'retourne'],
    default: 'en_attente'
  },
  priorite: {
    type: String,
    enum: ['normale', 'express', 'urgente'],
    default: 'normale'
  },
  prix: {
    type: Number,
    required: [true, 'Le prix est requis'],
    min: [0, 'Le prix doit être positif']
  },
  dateExpedition: {
    type: Date,
    default: Date.now
  },
  dateLivraisonPrevue: {
    type: Date,
    required: true
  },
  dateLivraisonReelle: {
    type: Date
  },
  historique: [{
    statut: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    lieu: {
      type: String,
      required: true
    },
    commentaire: {
      type: String
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Generate tracking number before saving
colisSchema.pre('save', function(next) {
  if (!this.numeroSuivi) {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    this.numeroSuivi = `COL${timestamp.slice(-6)}${random}`;
  }
  next();
});

// Add to history when status changes
colisSchema.pre('save', function(next) {
  if (this.isModified('statut') && !this.isNew) {
    this.historique.push({
      statut: this.statut,
      lieu: 'Centre de tri',
      commentaire: `Statut changé vers: ${this.statut}`
    });
  }
  next();
});

module.exports = mongoose.model('Colis', colisSchema);
