require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

const verifyAdmin = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find admin user
    const admin = await User.findOne({ email: 'admin@poste.com' });
    
    if (!admin) {
      console.log('❌ No admin user found with email: admin@poste.com');
      console.log('💡 Run "node create-admin.js" to create an admin user');
      process.exit(1);
    }

    console.log('✅ Admin user verified!');
    console.log('');
    console.log('👤 USER DETAILS:');
    console.log(`Name: ${admin.prenom} ${admin.nom}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Role: ${admin.role}`);
    console.log(`Created: ${admin.createdAt.toLocaleString()}`);
    console.log('');
    console.log('🎯 LOGIN CREDENTIALS:');
    console.log('📧 Email: admin@poste.com');
    console.log('🔑 Password: admin123456');
    console.log('');
    console.log('🚀 Ready to login to the admin dashboard!');

  } catch (error) {
    console.error('❌ Error verifying admin user:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

verifyAdmin();
