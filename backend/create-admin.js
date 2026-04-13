const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

const createAdmin = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@poste.com' });
    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists with email: admin@poste.com');
      console.log('📧 Email: admin@poste.com');
      console.log('🔑 Password: admin123456 (if not changed)');
      console.log('✅ You can now login with these credentials');
      process.exit(0);
    }

    // Create admin user
    const adminData = {
      nom: 'Administrateur',
      prenom: 'Système',
      email: 'admin@poste.com',
      password: 'admin123456', // This will be hashed by the pre-save hook
      role: 'admin',
      telephone: '+33123456789',
      adresse: 'Bureau Principal'
    };

    const admin = new User(adminData);
    await admin.save();

    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('🎯 LOGIN CREDENTIALS:');
    console.log('📧 Email: admin@poste.com');
    console.log('🔑 Password: admin123456');
    console.log('');
    console.log('📝 NEXT STEPS:');
    console.log('1. Start your frontend application');
    console.log('2. Go to http://localhost:3000/login');
    console.log('3. Login with the credentials above');
    console.log('4. Navigate to the Admin Dashboard');
    console.log('⚠️  IMPORTANT: Change the password after first login!');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

createAdmin();
