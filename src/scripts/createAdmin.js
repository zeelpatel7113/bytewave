const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  isAdmin: Boolean,
});

const User = mongoose.model('User', userSchema);

async function createAdmin() {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is not defined in .env file');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB successfully');
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ isAdmin: true });
    if (existingAdmin) {
      console.log('Admin already exists');
      process.exit(0);
    }

    const adminEmail = 'admin@bytewave.com';
    const adminPassword = 'admin123456';
    const hashedPassword = await bcryptjs.hash(adminPassword, 10);

    const admin = new User({
      email: adminEmail,
      password: hashedPassword,
      name: 'Admin User',
      isAdmin: true,
    });

    await admin.save();
    
    console.log('Admin user created successfully');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    if (mongoose.connection) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

createAdmin();