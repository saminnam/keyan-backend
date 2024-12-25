const mongoose = require('mongoose');

// Define the schema for contact form submissions
const ContactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, default: 'unread' },  // Default status is 'unread'
}, { timestamps: true });

module.exports = mongoose.model('Contact', ContactSchema);
