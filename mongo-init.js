// MongoDB initialization script
db = db.getSiblingDB('poste_db');

// Create collections
db.createCollection('users');
db.createCollection('colis');

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.colis.createIndex({ numeroSuivi: 1 }, { unique: true });
db.colis.createIndex({ createdBy: 1 });
db.colis.createIndex({ statut: 1 });
db.colis.createIndex({ createdAt: -1 });

// Create admin user (optional)
db.users.insertOne({
  nom: "Admin",
  prenom: "System",
  email: "admin@poste.com",
  password: "$2a$10$rZGbPzCXyQ4zYjZXKJxzAOZxJxJxJxJxJxJxJxJxJxJxJxJxJxJx", // Password: admin123
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
});

print('Database initialized successfully!');

