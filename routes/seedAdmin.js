// seedAdmin.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/users');  // Adjust the path if necessary

const JWT_SECRET = 'random_string_' + Math.random().toString(36).substr(2, 9); // Secret for JWT generation

async function seedAdminUser() {
    try {
        // Check if the admin user already exists
        const existingUser = await User.findOne({ email: 'admin@keyantech.com' });
        if (existingUser) {
            console.log('Admin user already exists!');
            return;
        }

        // Create a new admin user with a hashed password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('keyantech@123', salt);

        const newAdminUser = new User({
            username: 'keyanadmin',
            email: 'admin@keyantech.com',
            password: hashedPassword  // Store the hashed password
        });

        await newAdminUser.save();
        console.log('Admin user created successfully!');
    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        mongoose.connection.close();
    }
}

// Connect to MongoDB and seed the admin user
mongoose.connect('mongodb://localhost:27017/keyantechdata', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        seedAdminUser();
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
    });
