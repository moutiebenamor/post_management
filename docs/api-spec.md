# API Specification - Poste Project

## Base URL
```
http://localhost:5000/api
```

## Authentification

Toutes les routes protégées nécessitent un token JWT dans l'en-tête :
```
Authorization: Bearer <token>
```

## Endpoints

### 🔐 Authentification

#### POST /auth/register
Créer un nouveau compte utilisateur.

**Body:**
```json
{
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "jean.dupont@email.com",
  "password": "motdepasse123",
  "telephone": "0123456789",
  "adresse": "123 Rue de la Paix, 75001 Paris"
}
```

**Response (201):**
```json
{
  "message": "Utilisateur créé avec succès",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f1234567890abcdef12345",
    "nom": "Dupont",
    "prenom": "Jean",
    "email": "jean.dupont@email.com",
    "role": "user"
  }
}
```

#### POST /auth/login
Connexion utilisateur.

**Body:**
```json
{
  "email": "jean.dupont@email.com",
  "password": "motdepasse123"
}
```

**Response (200):**
```json
{
  "message": "Connexion réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f1234567890abcdef12345",
    "nom": "Dupont",
    "prenom": "Jean",
    "email": "jean.dupont@email.com",
    "role": "user"
  }
}
```

#### GET /auth/me
Récupérer les informations de l'utilisateur connecté.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "user": {
    "id": "64f1234567890abcdef12345",
    "nom": "Dupont",
    "prenom": "Jean",
    "email": "jean.dupont@email.com",
    "role": "user",
    "telephone": "0123456789",
    "adresse": "123 Rue de la Paix, 75001 Paris"
  }
}
```

### 📦 Gestion des Colis

#### GET /colis
Récupérer la liste des colis (avec pagination).

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (optionnel) : Numéro de page (défaut: 1)
- `limit` (optionnel) : Nombre d'éléments par page (défaut: 10)

**Response (200):**
```json
{
  "colis": [
    {
      "_id": "64f1234567890abcdef12345",
      "numeroSuivi": "COL123456ABCD",
      "expediteur": {
        "nom": "Entreprise ABC",
        "adresse": "456 Avenue du Commerce, 69000 Lyon",
        "telephone": "0987654321",
        "email": "contact@abc.com"
      },
      "destinataire": {
        "nom": "Marie Martin",
        "adresse": "789 Boulevard Central, 13000 Marseille",
        "telephone": "0654321987",
        "email": "marie.martin@email.com"
      },
      "description": "Produits électroniques",
      "poids": 2.5,
      "dimensions": {
        "longueur": 30,
        "largeur": 20,
        "hauteur": 15
      },
      "statut": "en_transit",
      "priorite": "express",
      "prix": 25.50,
      "dateExpedition": "2024-01-15T10:30:00.000Z",
      "dateLivraisonPrevue": "2024-01-17T18:00:00.000Z",
      "createdBy": "64f1234567890abcdef12345",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T14:20:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pages": 5,
    "total": 47
  }
}
```

#### GET /colis/:id
Récupérer un colis par son ID.

**Headers:** `Authorization: Bearer <token>`

**Response (200):** Objet colis complet avec historique

#### GET /colis/track/:trackingNumber
Rechercher un colis par son numéro de suivi.

**Headers:** `Authorization: Bearer <token>`

**Response (200):** Objet colis complet

#### POST /colis
Créer un nouveau colis.

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "expediteur": {
    "nom": "Entreprise ABC",
    "adresse": "456 Avenue du Commerce, 69000 Lyon",
    "telephone": "0987654321",
    "email": "contact@abc.com"
  },
  "destinataire": {
    "nom": "Marie Martin",
    "adresse": "789 Boulevard Central, 13000 Marseille",
    "telephone": "0654321987",
    "email": "marie.martin@email.com"
  },
  "description": "Produits électroniques",
  "poids": 2.5,
  "dimensions": {
    "longueur": 30,
    "largeur": 20,
    "hauteur": 15
  },
  "priorite": "express",
  "prix": 25.50,
  "dateLivraisonPrevue": "2024-01-17T18:00:00.000Z"
}
```

**Response (201):**
```json
{
  "message": "Colis créé avec succès",
  "colis": {
    // Objet colis complet avec numeroSuivi généré
  }
}
```

#### PUT /colis/:id
Mettre à jour un colis.

**Headers:** `Authorization: Bearer <token>`

**Body:** Mêmes champs que POST, tous optionnels

**Response (200):**
```json
{
  "message": "Colis mis à jour avec succès",
  "colis": {
    // Objet colis mis à jour
  }
}
```

#### DELETE /colis/:id
Supprimer un colis.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "message": "Colis supprimé avec succès"
}
```

### 📊 Statistiques

#### GET /stats/dashboard
Récupérer les statistiques du dashboard.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "totalColis": 47,
  "colisByStatus": {
    "en_attente": 8,
    "en_transit": 15,
    "en_distribution": 5,
    "livre": 18,
    "retourne": 1
  },
  "colisByPriority": {
    "normale": 25,
    "express": 18,
    "urgente": 4
  },
  "monthlyStats": [
    {
      "_id": { "year": 2024, "month": 1 },
      "count": 12,
      "totalRevenue": 345.50
    }
  ],
  "recentColis": [
    // 5 derniers colis créés
  ],
  "totalRevenue": 1250.75,
  "averagePrice": 26.61
}
```

#### GET /stats/revenue
Récupérer les statistiques de revenus.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "dailyRevenue": [
    {
      "_id": { "year": 2024, "month": 1, "day": 15 },
      "revenue": 125.50,
      "count": 5
    }
  ]
}
```

#### GET /stats/delivery
Récupérer les statistiques de livraison.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "totalDelivered": 18,
  "onTimeDeliveries": 16,
  "onTimeRate": 88.89
}
```

## Codes d'Erreur

### 400 - Bad Request
```json
{
  "message": "Données invalides",
  "error": "Le poids doit être positif"
}
```

### 401 - Unauthorized
```json
{
  "message": "Accès refusé. Token manquant."
}
```

### 403 - Forbidden
```json
{
  "message": "Accès refusé. Droits insuffisants."
}
```

### 404 - Not Found
```json
{
  "message": "Colis non trouvé"
}
```

### 500 - Internal Server Error
```json
{
  "message": "Erreur interne du serveur",
  "error": {}
}
```

## Modèles de Données

### User
```json
{
  "_id": "ObjectId",
  "nom": "String (required)",
  "prenom": "String (required)",
  "email": "String (required, unique)",
  "password": "String (required, hashed)",
  "role": "String (enum: ['user', 'admin'], default: 'user')",
  "telephone": "String (optional)",
  "adresse": "String (optional)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Colis
```json
{
  "_id": "ObjectId",
  "numeroSuivi": "String (unique, auto-generated)",
  "expediteur": {
    "nom": "String (required)",
    "adresse": "String (required)",
    "telephone": "String (optional)",
    "email": "String (optional)"
  },
  "destinataire": {
    "nom": "String (required)",
    "adresse": "String (required)",
    "telephone": "String (optional)",
    "email": "String (optional)"
  },
  "description": "String (required)",
  "poids": "Number (required, min: 0)",
  "dimensions": {
    "longueur": "Number (required, min: 0)",
    "largeur": "Number (required, min: 0)",
    "hauteur": "Number (required, min: 0)"
  },
  "statut": "String (enum: ['en_attente', 'en_transit', 'en_distribution', 'livre', 'retourne'], default: 'en_attente')",
  "priorite": "String (enum: ['normale', 'express', 'urgente'], default: 'normale')",
  "prix": "Number (required, min: 0)",
  "dateExpedition": "Date (default: now)",
  "dateLivraisonPrevue": "Date (required)",
  "dateLivraisonReelle": "Date (optional)",
  "historique": [{
    "statut": "String (required)",
    "date": "Date (default: now)",
    "lieu": "String (required)",
    "commentaire": "String (optional)"
  }],
  "createdBy": "ObjectId (ref: User, required)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```
