const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Add password comparison method
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password); // Compare hashed password
};

const User = mongoose.model('User', userSchema);
module.exports = User;
